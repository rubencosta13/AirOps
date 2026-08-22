import { Password } from "@/plugins/password";
import { SignInSchema, SignUpSchema } from "./schema";
import { authRepository } from "./repository";
import {
  BadRequestError,
  ConflictError,
  UnauthorizedError,
} from "@/shared/errors/app-error";
import UserCreatedPublisher from "./events/user-created";
import { sessionService } from "../sessions/service";
import { tokenService } from "../tokens/service";
import { emailService } from "@/email";
import { passwordResetTokenService } from "../password-reset/service";
import { emailValidationService } from "../email-validation/service";

export const authService = {
  async signin(data: SignInSchema) {
    const passwordHelper = new Password();
    const user = await authRepository.findUserByEmail(data.email);

    if (!user) throw new UnauthorizedError("Invalid Email / Password");

    const passwordsMatch = await passwordHelper.compare(
      user.password,
      data.password,
    );
    if (!passwordsMatch)
      throw new UnauthorizedError("Invalid Email / Password");

    if (!user.verified)
      throw new UnauthorizedError(
        "Please verify your account, using the email sent to you",
      );

    const session = await sessionService.create(user.id);
    const accessToken = await tokenService.createAccessToken({
      userId: user.id,
      email: user.email,
      sessionId: session.id,
    });

    return {
      accessToken,
      refreshToken: session.refreshToken,
    };
  },

  async getUserDetails(email: string) {
    const user = await authRepository.findUserByEmail(email);
    return user;
  },

  async createUser(data: SignUpSchema) {
    const existingUser = await authRepository.findUserByEmail(data.email);
    if (existingUser) throw new ConflictError("Error creating user");

    const passwordHelper = new Password();
    const password = await passwordHelper.hash(data.password);

    const user = await authRepository.createUser({
      ...data,
      password,
    });

    const verificationToken = await emailValidationService.create(user.id);
    await emailService.sendAccountRegister(user.email, user, verificationToken);

    return user;
  },

  async refresh(token: string) {
    const { session, refreshToken: newRefreshToken } =
      await sessionService.refresh(token);

    const user = await authRepository.findUserById(session.userId);
    if (!user) throw new UnauthorizedError("Not Allowed");

    const accessToken = await tokenService.createAccessToken({
      userId: user.id,
      email: user.email,
      sessionId: session.id,
    });

    return { accessToken, refreshToken: newRefreshToken };
  },

  async logout(refreshToken: string) {
    if (!refreshToken) {
      return;
    }
    await sessionService.revoke(refreshToken);
  },

  async forgotPassword(email: string) {
    const user = await authRepository.findUserByEmail(email);
    if (!user) return;

    await authRepository.invalidatePasswordResetTokens(user.id);

    const token = passwordResetTokenService.create();

    await authRepository.createPasswordResetToken({
      userId: user.id,
      tokenHash: passwordResetTokenService.hash(token),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 mins TTL
    });

    await emailService.sendForgotPassword(email, token);
  },

  async resetPassword(token: string, password: string) {
    const tokenHash = passwordResetTokenService.hash(token);

    const resetToken =
      await passwordResetTokenService.findValidPasswordResetToken(tokenHash);

    if (!resetToken)
      throw new BadRequestError("Invalid or Expired Password Reset Token");

    const passwordHelper = new Password();
    const passwordHash = await passwordHelper.hash(password);

    await authRepository.resetPassword(resetToken.userId, passwordHash);
    await passwordResetTokenService.consume(resetToken.id);
  },

  async verifyAccount(token: string) {
    const user = await emailValidationService.verify(token);
    UserCreatedPublisher.publish(user);
    return user;
  },
};
