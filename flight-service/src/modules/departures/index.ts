import { FastifyInstance } from "fastify";
import { createDeparture, getDepartures } from "./controller";
import { createDepartureSchema } from "./schemas";

const departures = async (fastify: FastifyInstance) => { 
    fastify.get('/', getDepartures);

    fastify.post('/', {
        schema: {
            body: createDepartureSchema
        }
    }, createDeparture);
}

export { departures }