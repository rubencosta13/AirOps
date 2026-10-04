import { AppError } from "@/shared/errors/app-error";
import { FastifyError, FastifyReply, FastifyRequest } from "fastify";

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

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "FST_ERR_VALIDATION"
  ) {
    const validationError = error as FastifyError;

    return reply.status(400).send({
      error: "VALIDATION_ERROR",
      message: "The request is invalid",
      fields: validationError.validation?.map((issue) => ({
        field: issue.instancePath.replace(/^\//, ""),
        message: issue.message,
      })),
    });
  }

  request.log.error(error);

  return reply.status(500).send({
    error: "INTERNAL_SERVER_ERROR",
    message: "Something went wrong",
  });
};
