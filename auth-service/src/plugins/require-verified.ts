import { UnauthorizedError } from "@/errors/app-error";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

export default fp(async (fastify: FastifyInstance) => {
  fastify.decorate(
    "requireVerified",
    async (request: FastifyRequest, _reply: FastifyReply) => {
      if (!request.user.verified) {
        throw new UnauthorizedError(
          "Please verify your account, using the email sent to you",
        );
      }
    },
  );
});
