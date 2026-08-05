import { FastifyReply, FastifyRequest } from "fastify";
import { arrivalsService } from "./service";
import { CreateArrivalInput } from "./schemas";

export const getArrivals = async (_request: FastifyRequest<{Body: {}}>, reply: FastifyReply) => {
    const arrivals = await arrivalsService.getAll();
    return reply.code(200).send(arrivals);
}
 

export const createArrival = async (request: FastifyRequest<{
        Body: CreateArrivalInput;
    }>, reply: FastifyReply) => {
    const arrival = await arrivalsService.create(request.body);
    return reply.code(201).send(arrival);    
} 