import { FastifyReply, FastifyRequest } from "fastify";
import { tasksService } from "./service";
import { IdParams } from "../turnarounds/schema";

export const listTasks = async () => {
  return await tasksService.getAll();
};

export const startTask = async (
  request: FastifyRequest<{ Params: IdParams }>,
  reply: FastifyReply,
) => {
  const startTask = await tasksService.startTask(request.params.id);
  return reply.status(200).send(startTask);
};
