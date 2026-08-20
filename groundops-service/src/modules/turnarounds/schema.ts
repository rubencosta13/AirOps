import z from "zod";
import { TaskStatus } from "../tasks/enums";

export const createTurnaroundSchema = z.object({
  id: z.uuid().optional(),
  planeReg: z.string(),
  arrivalId: z.uuid(),
  status: z.enum(TaskStatus),
});

export type CreateTurnaroundData = z.infer<typeof createTurnaroundSchema>;

export const findTurnaroundSchema = z.object({
  id: z.uuid().optional(),
});

export type FindTurnaroundInput = z.infer<typeof findTurnaroundSchema>;

export const idParamsSchema = z.object({
  id: z.uuid().optional(),
});

export type IdParams = z.infer<typeof idParamsSchema>;

export const getTurnaroundFlightSchema = z.object({
  flightId: z.uuid(),
});
export type GetTurnAroundFlight = z.infer<typeof getTurnaroundFlightSchema>;
