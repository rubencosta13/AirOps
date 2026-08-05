import type { FastifyInstance } from "fastify"
import { createArrivalSchema } from "./schemas";
import { createArrival, getArrivals } from "./controller";
import { ZodTypeProvider } from "fastify-type-provider-zod";


/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://fastify.dev/docs/latest/Reference/Plugins/#plugin-options
 */
const arrivals = async (fastify: FastifyInstance) => { 
    fastify.get('/', getArrivals)

    fastify.withTypeProvider<ZodTypeProvider>().post('/', {
        schema: {
            body:  createArrivalSchema

        }
    }, createArrival)
}

export { arrivals }

