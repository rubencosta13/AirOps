import { FastifyInstance } from "fastify";
import { currentUser, logout, signIn, signUp } from "./controller";
import { signInSchema, signUpSchema } from "./schema";

export const auth = async (fastify: FastifyInstance) => {
  fastify.post(
    "/signin",
    {
      schema: {
        body: signInSchema,
      },
    },
    signIn,
  );

  fastify.get(
    "/me",
    {
      preHandler: [fastify.authenticated],
    },
    currentUser,
  );

  fastify.post(
    "/signup",
    {
      schema: {
        body: signUpSchema,
      },
    },
    signUp,
  );

  fastify.post(
    "/logout",
    {
      preHandler: [fastify.authenticated],
    },
    logout,
  );
};
