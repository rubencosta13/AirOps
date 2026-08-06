import { AppError } from "@/shared/errors/app-error";
import { FastifyReply, FastifyRequest } from "fastify";

export const fastifyErrorHandler = (
  error: unknown,
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      error: error.code,
      message: error.message,
    });
  }

  request.log.error(error);

  return reply.status(500).send({
    error: "INTERNAL_SERVER_ERROR",
    message: "Something went wrong",
  });
};
