import { FastifyInstance } from "fastify";
import { addTeamMember, createTeam, getTeam, listTeams } from "./controller";
import {
  addMemberToTeamIdSchema,
  addMemberToTeamSchema,
  createTeamSchema,
  idParamsSchema,
} from "./schema";

export const teams = async (fastify: FastifyInstance) => {
  fastify.get("/", listTeams);

  fastify.get(
    "/:id",
    {
      schema: {
        params: idParamsSchema,
      },
    },
    getTeam,
  );

  fastify.post(
    "/",
    {
      schema: {
        body: createTeamSchema,
      },
    },
    createTeam,
  );

  fastify.post(
    "/:id/members",
    {
      schema: {
        body: addMemberToTeamSchema,
        params: addMemberToTeamIdSchema,
      },
    },
    addTeamMember,
  );
};
