import { FastifyReply, FastifyRequest } from "fastify";
import { departuresService } from "./service";
import { CreateDepartureInput, FindDepartureByPlaneInput } from "./schemas";

export const getDepartures = async (_request: FastifyRequest, reply: FastifyReply) => {
    const departures = await departuresService.getAll();
    return reply.code(200).send(departures);
}

export const createDeparture = async (request: FastifyRequest<{Body: CreateDepartureInput}>, reply: FastifyReply) => { 
    const departure = await departuresService.create(request.body);
    return reply.code(201).send(departure);
}

export const getPlaneDepartures = async (request: FastifyRequest<{Body: FindDepartureByPlaneInput}>, reply: FastifyReply) => { 
    const departures = await departuresService.findByPlane(request.body);
    return reply.code(200).send(departures);
}