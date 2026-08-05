import { FastifyReply, FastifyRequest } from "fastify";
import { departuresService } from "./service";
import { CreateDepartureInput, EditDepartureInput, FindDepartureInput, IdParams } from "./schemas";

export const getDepartures = async (request: FastifyRequest<{Querystring: FindDepartureInput}>, reply: FastifyReply) => {
    if (request.query.planeReg) {
        return departuresService.findByPlane(request.query.planeReg);
    }
    return departuresService.getAll();

}

export const createDeparture = async (request: FastifyRequest<{Body: CreateDepartureInput}>, reply: FastifyReply) => { 
    const departure = await departuresService.create(request.body);
    return reply.code(201).send(departure);
}

export const editDeparture = async (request: FastifyRequest<{Body: EditDepartureInput, Params: IdParams}>, reply: FastifyReply) => { 
    const departure = await departuresService.edit(request.params.id, request.body);
    return departure
}

