import { FastifyInstance } from "fastify";
import {
  currentUser,
  forgotPassword,
  logout,
  refreshToken,
  resetPassword,
  signIn,
  signUp,
} from "./controller";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "./schema";

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
    "/refresh",
    {
      preHandler: [fastify.authenticated],
    },
    refreshToken,
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
    "/forgot-password",
    {
      schema: {
        body: forgotPasswordSchema,
      },
    },
    forgotPassword,
  );

  fastify.post(
    "/reset-password",
    {
      schema: {
        body: resetPasswordSchema,
      },
    },
    resetPassword,
  );

  fastify.post(
    "/logout",
    {
      preHandler: [fastify.authenticated],
    },
    logout,
  );
};
