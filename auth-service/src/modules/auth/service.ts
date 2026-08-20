import { Password } from "@/plugins/password";
import { SignInSchema, SignUpSchema } from "./schema";
import { authRepository } from "./repository";
import { ConflictError, UnauthorizedError } from "@/shared/errors/app-error";
import UserCreatedPublisher from "./events/user-created";
import { sessionService } from "../sessions/service";
import { tokenService } from "../tokens/service";
import { createHash } from "node:crypto";

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

  async createUser(data: SignUpSchema) {
    const existingUser = await authRepository.findUserByEmail(data.email);
    if (existingUser) throw new ConflictError("Error creating user");

    const passwordHelper = new Password();
    const password = await passwordHelper.hash(data.password);

    const user = await authRepository.createUser({
      ...data,
      password,
    });
    UserCreatedPublisher.publish(user);

    return user;
  },

  async logout(refreshToken: string) {
    if (!refreshToken) {
      return;
    }
    await sessionService.revoke(refreshToken);
  },
};
