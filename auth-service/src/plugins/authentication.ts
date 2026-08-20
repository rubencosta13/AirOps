import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

export default fp(async (fastify: FastifyInstance) => {
  fastify.decorate(
    "authenticated",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const token = request.session.jwt;

      if (!token) return reply.code(401).send("Unauthenticated");
      try {
        await fastify.jwt.verify(token);
      } catch (err) {
        return reply.status(401).send("Unauthenticated");
      }
    },
  );
});
