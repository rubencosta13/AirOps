import db from "@/db";
import { teamsTable } from "@/db/schema/teams";
import { and, eq, isNull } from "drizzle-orm";
import { CreateTeamSchema } from "./schema";
import { employees } from "@/db/schema/employees";

export const teamsRepository = {
  async getAll() {
    const teams = await db.select().from(teamsTable);
    return teams;
  },

  async getTeamById(id: string) {
    const team = await db
      .select()
      .from(teamsTable)
      .where(and(eq(teamsTable.id, id), isNull(teamsTable.deletedAt)));
    return team;
  },

  async createTeam(data: CreateTeamSchema) {
    const [team] = await db.insert(teamsTable).values(data).returning();
    return team;
  },

  async createTeamMember(data: any) {
    const [member] = await db.insert(employees).values(data).returning();
    return member;
  },

  async findTeamMember(email: string) {
    const [member] = await db
      .select()
      .from(employees)
      .where(and(eq(employees.email, email), isNull(employees.deletedAt)));
    return member;
  },
};
