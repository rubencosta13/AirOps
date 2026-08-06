import { FastifyInstance } from "fastify";
import {
  createDeparture,
  deleteDeparture,
  editDeparture,
  getDepartures,
} from "./controller";
import {
  createDepartureSchema,
  editDepartureSchema,
  findDepartureSchema,
  idParamsSchema,
} from "./schemas";
import { ZodTypeProvider } from "fastify-type-provider-zod";

const departures = async (fastify: FastifyInstance) => {
  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/",
    {
      schema: {
        querystring: findDepartureSchema,
      },
    },
    getDepartures,
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createDepartureSchema,
      },
    },
    createDeparture,
  );

  fastify.patch(
    "/:id",
    {
      schema: {
        body: editDepartureSchema,
        params: idParamsSchema,
      },
    },
    editDeparture,
  );

  fastify.delete(
    "/:id",
    {
      schema: {
        params: idParamsSchema,
      },
    },
    deleteDeparture,
  );
};

export { departures };
