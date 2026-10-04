import { authRepository } from "@/modules/auth/repository";
import { authService } from "@/modules/auth/service";
import { sessionRepository } from "@/modules/sessions/repository";
import { UnauthorizedError } from "@/shared/errors/app-error";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

export default fp(async (fastify: FastifyInstance) => {
  fastify.decorate(
    "authenticated",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify();
      } catch {
        return reply.status(401).send("Invalid or expired token");
      }

      const session = await sessionRepository.findById(request.user.sid);

      if (!session || session.revokedAt) {
        return reply.code(401).send("Session revoked");
      }

      const user = await authRepository.findUserById(session.userId);
      if (!user) throw new UnauthorizedError("Not Authorized");

      request.user = {
        ...request.user,
        ...user,
      };
    },
  );
});
