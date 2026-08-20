import { FastifyInstance } from "fastify";
import { findTurnaroundSchema, getTurnaroundFlightSchema } from "./schema";
import { getTurnaroundsFlight, listTurnarounds } from "./controller";

export const turnaround = async (fastify: FastifyInstance) => {
    fastify.get('/', { 
        schema: {
            params: findTurnaroundSchema
        }
    }, listTurnarounds)

    fastify.get('/flight/:flightId', {
        schema: { 
            params: getTurnaroundFlightSchema
        }
    }, getTurnaroundsFlight)
};
