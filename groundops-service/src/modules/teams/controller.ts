import { FastifyReply, FastifyRequest } from "fastify";
import { teamsService } from "./service";
import {
  AddMemberToTeam,
  AddMemberToTeamId,
  CreateTeamSchema,
  IdParams,
} from "../teams/schema";

export const listTeams = async () => {
  return await teamsService.getAll();
};

export const getTeam = async (
  request: FastifyRequest<{ Params: IdParams }>,
  reply: FastifyReply,
) => {
  const team = await teamsService.getTeam(request.params.id);
  return reply.status(200).send(team);
};

export const createTeam = async (
  request: FastifyRequest<{ Body: CreateTeamSchema }>,
  reply: FastifyReply,
) => {
  const team = await teamsService.createTeam(request.body);
  return reply.status(200).send(team);
};

export const addTeamMember = async (
  request: FastifyRequest<{
    Body: AddMemberToTeam;
    Params: AddMemberToTeamId;
  }>,
  reply: FastifyReply,
) => {

};
