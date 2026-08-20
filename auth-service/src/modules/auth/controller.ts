import { FastifyReply, FastifyRequest } from "fastify";
import { SignInSchema, SignUpSchema } from "./schema";
import { authService } from "./service";

export const signIn = async (
  request: FastifyRequest<{ Body: SignInSchema }>,
  reply: FastifyReply,
) => {
  const authedUser = await authService.signin(request.body);
  if (!authedUser) return reply.status(400).send("Bad request");

  return reply.status(200).send(authedUser);
};

export const signUp = async (
  request: FastifyRequest<{ Body: SignUpSchema }>,
  reply: FastifyReply,
) => {
  const jwt = await authService.createUser(request.body);
  return reply.code(200).send(jwt);
};

export const logout = async (_request: FastifyRequest, reply: FastifyReply) => {
  return reply.status(200).send("done");
};
