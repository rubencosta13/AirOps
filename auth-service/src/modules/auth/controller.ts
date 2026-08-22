import { FastifyReply, FastifyRequest } from "fastify";
import {
  ForgotPasswordSchema,
  ResetPasswordSchema,
  SignInSchema,
  SignUpSchema,
  VerifyAccountSchema,
} from "./schema";
import { authService } from "./service";

export const signIn = async (
  request: FastifyRequest<{ Body: SignInSchema }>,
  reply: FastifyReply,
) => {
  const tokenDetails = await authService.signin(request.body);
  const { refreshToken, accessToken } = tokenDetails;

  reply.setCookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });

  return reply.status(200).send({ accessToken });
};

export const signUp = async (
  request: FastifyRequest<{ Body: SignUpSchema }>,
  reply: FastifyReply,
) => {
  const jwt = await authService.createUser(request.body);
  return reply.code(200).send(jwt);
};

export const currentUser = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const userDetails = await request.jwtDecode();
  const { name, email, id } = await authService.getUserDetails(
    userDetails.email,
  );
  return reply.status(200).send({ name, email, id });
};

export const logout = async (request: FastifyRequest, reply: FastifyReply) => {
  await authService.logout(request.cookies.refresh_token);

  reply.clearCookie("refresh_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
  return reply.status(204).send();
};

export const refreshToken = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const refreshToken = request.cookies.refresh_token;
  if (!refreshToken) return reply.code(401).send("Missing refresh token");

  const tokens = await authService.refresh(refreshToken);

  reply.setCookie("refresh_token", tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 30 * 24 * 60 * 60,
  });

  return reply.send({
    accessToken: tokens.accessToken,
  });
};

export const forgotPassword = async (
  request: FastifyRequest<{ Body: ForgotPasswordSchema }>,
  reply: FastifyReply,
) => {
  await authService.forgotPassword(request.body.email);
  return reply
    .status(200)
    .send(
      "If an account exists with that email, you will receive a password reset link.",
    );
};

export const resetPassword = async (
  request: FastifyRequest<{ Body: ResetPasswordSchema }>,
  reply: FastifyReply,
) => {
  const { token, password } = request.body;
  await authService.resetPassword(token, password);
  return reply.status(200).send("OK");
};

export const verifyAccount = async (
  request: FastifyRequest<{ Body: VerifyAccountSchema }>,
  reply: FastifyReply,
) => {
  const { token } = request.body;
  await authService.verifyAccount(token);
  return reply.code(204).send();
};
