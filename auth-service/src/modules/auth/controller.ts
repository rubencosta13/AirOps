import { FastifyReply, FastifyRequest } from "fastify";
import { SignInSchema, SignUpSchema } from "./schema";
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

  return reply.status(200).send(accessToken);
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
  return reply.status(200).send(userDetails);
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
