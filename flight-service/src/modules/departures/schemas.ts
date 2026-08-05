import z from "zod";

export const createDepartureSchema = z.object({
    flightNumber: z.string(),
    planeReg: z.string(),
    scheduledDeparture: z.coerce.date(),
    runway: z.string(),
    gate: z.string()
})
export type CreateDepartureInput = z.infer<typeof createDepartureSchema>;

export const findDepartureByPlaneSchema = z.object({
    planeReg: z.string()
}); 

export type FindDepartureByPlaneInput = z.infer<typeof findDepartureByPlaneSchema>;
