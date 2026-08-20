import z from "zod";

export const idParamsSchema = z.object({
  id: z.uuid().optional(),
});

export type IdParams = z.infer<typeof idParamsSchema>;

export const createTeamSchema = z.object({
  name: z.string().nonempty(),
});

export type CreateTeamSchema = z.infer<typeof createTeamSchema>;

export const addMemberToTeamSchema = z.object({
  employeeId: z.uuid().nonoptional(),
});
export const addMemberToTeamIdSchema = z.object({
  id: z.uuid().nonoptional(),
});

export type AddMemberToTeam = z.infer<typeof addMemberToTeamSchema>;
export type AddMemberToTeamId = z.infer<typeof addMemberToTeamIdSchema>;
