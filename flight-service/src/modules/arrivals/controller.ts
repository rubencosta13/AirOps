import { FastifyReply, FastifyRequest } from "fastify";
import { arrivalsService } from "./service";
import { CreateArrivalInput, EditArrivalInput, IdParams } from "./schemas";

export const listArrivals = async (
  _request: FastifyRequest<{ Body: {} }>,
  reply: FastifyReply,
) => {
  const arrivals = await arrivalsService.getAll();
  return reply.code(200).send(arrivals);
};

export const getArrival = async (
  request: FastifyRequest<{ Params: IdParams }>,
  reply: FastifyReply,
) => {
  const arrival = await arrivalsService.getArrival(request.params.id);
  return reply.code(200).send(arrival);
};

export const createArrival = async (
  request: FastifyRequest<{
    Body: CreateArrivalInput;
  }>,
  reply: FastifyReply,
) => {
  const arrival = await arrivalsService.create(request.body);
  return reply.code(201).send(arrival);
};

export const editArrival = async (
  request: FastifyRequest<{ Params: IdParams; Body: EditArrivalInput }>,
  reply: FastifyReply,
) => {
  const arrival = await arrivalsService.update(request.params.id, request.body);
  return reply.code(200).send(arrival);
};

export const deleteArrival = async (
  request: FastifyRequest<{ Params: IdParams }>,
  reply: FastifyReply,
) => {
  const deletedArrival = await arrivalsService.delete(request.params.id);
  return reply.code(200).send(deletedArrival);
};

export const markArrived = async (
  request: FastifyRequest<{ Params: IdParams }>,
  reply: FastifyReply
) => {
  const markAsArrived = await arrivalsService.arrive(request.params.id);
  return reply.code(200).send(markAsArrived);
}