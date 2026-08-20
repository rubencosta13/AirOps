import { ConflictError } from "@/shared/errors/app-error";
import { teamsRepository } from "./repository";
import { CreateTeamSchema } from "./schema";

export const teamsService = {
  async getAll() {
    return teamsRepository.getAll();
  },

  async getTeam(id: string) {
    return teamsRepository.getTeamById(id);
  },

  async createTeam(data: CreateTeamSchema) {
    return teamsRepository.createTeam(data);
  },

  async createTeamMember(data: any) {
    const teamMemberExists = await teamsRepository.findTeamMember(data.email);
    if (teamMemberExists) {
      throw new ConflictError("Member already exists");
    }

    return teamsRepository.createTeamMember(data);
  },
};
