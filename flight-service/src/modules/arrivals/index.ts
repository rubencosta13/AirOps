import type { FastifyInstance } from "fastify";
import {
  createArrivalSchema,
  idParamsSchema,
  editArrivalSchema,
} from "./schemas";
import {
  createArrival,
  deleteArrival,
  editArrival,
  getArrival,
  listArrivals,
  markArrived,
} from "./controller";
import { ZodTypeProvider } from "fastify-type-provider-zod";

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
const arrivals = async (fastify: FastifyInstance) => {
  fastify.get("/", listArrivals);
  fastify.get("/:id", getArrival);

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/",
    {
      schema: {
        body: createArrivalSchema,
      },
    },
    createArrival,
  );

  fastify.post(
    "/:id/arrive",
    {
      schema: {
        params: idParamsSchema,
      },
    },
    markArrived,
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        params: idParamsSchema,
        body: editArrivalSchema,
      },
    },
    editArrival,
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamsSchema,
      },
    },
    deleteArrival,
  );
};

export { arrivals };
