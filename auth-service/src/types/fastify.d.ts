import type { FastifyRequest, FastifyReply } from "fastify";
import "@fastify/jwt";

declare module "fastify" {
  interface FastifyInstance {
    authenticated: (
      request: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<void>;
  }
}
