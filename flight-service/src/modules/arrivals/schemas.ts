import z from "zod";

export const createArrivalSchema  = z.object({
    flightNumber: z.string(),
    planeReg: z.string(),
    scheduledArrival: z.coerce.date(),
    runway: z.string(),
    gate: z.string()
})
export type CreateArrivalInput = z.infer<typeof createArrivalSchema>;


export const idParamsSchema = z.object({
    id: z.string().uuid()
})
export type IdParams = z.infer<typeof idParamsSchema>;

export const editArrivalSchema = createArrivalSchema.partial();

export type EditArrivalInput = z.infer<typeof editArrivalSchema>;