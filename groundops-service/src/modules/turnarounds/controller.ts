import { FastifyReply, FastifyRequest } from "fastify";
import { FindTurnaroundInput, GetTurnAroundFlight } from "./schema";
import { turnaroundsService } from "./service";

export const listTurnarounds = async (
  request: FastifyRequest<{ Querystring: FindTurnaroundInput }>,
  _reply: FastifyReply,
) => {
  if (request.query.id) {
    const turnaround = await turnaroundsService.getTurnaround(request.query.id);
    return turnaround;
  }

  const turnarounds = await turnaroundsService.getAll();
  return turnarounds;
};

export const getTurnaroundsFlight = async (
  request: FastifyRequest<{ Params: GetTurnAroundFlight }>,
  reply: FastifyReply,
) => {
  const turnaround = await turnaroundsService.findByFlight(
    request.params.flightId,
  );
  return reply.status(200).send(turnaround);
};
