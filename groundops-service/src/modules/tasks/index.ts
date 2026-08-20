import { FastifyInstance } from "fastify";
import { listTasks, startTask } from "./controller";
import { idParamsSchema } from "../turnarounds/schema";

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
export const tasks = async (fastify: FastifyInstance) => {
  fastify.get("/", listTasks);

  fastify.patch(
    "/:id/start",
    {
      schema: {
        params: idParamsSchema,
      },
    },
    startTask,
  );
};
