import z from "zod";

export const createArrivalSchema  = z.object({
    flightNumber: z.string(),
    planeReg: z.string(),
    scheduledArrival: z.coerce.date(),
    runway: z.string(),
    gate: z.string()
})
export type CreateArrivalInput = z.infer<typeof createArrivalSchema>;