import z from "zod";

export const createDepartureSchema = z.object({
  flightNumber: z.string(),
  planeReg: z.string(),
  scheduledDeparture: z.coerce.date(),
  runway: z.string(),
  gate: z.string(),
});
export type CreateDepartureInput = z.infer<typeof createDepartureSchema>;

export const findDepartureSchema = z.object({
  planeReg: z.string().optional(),
  flightNumber: z.string().optional(),
});

export type FindDepartureInput = z.infer<typeof findDepartureSchema>;

export const idParamsSchema = z.object({
  id: z.string().uuid(),
});
export type IdParams = z.infer<typeof idParamsSchema>;

export const editDepartureSchema = createDepartureSchema.partial();
export type EditDepartureInput = z.infer<typeof editDepartureSchema>;
