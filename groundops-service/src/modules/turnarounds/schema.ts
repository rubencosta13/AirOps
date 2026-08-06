import z from "zod";
import { TaskStatus } from "../tasks/enums";

export const createTurnaroundSchema = z.object({ 
    id: z.uuid().optional(),
    planeReg: z.string(),
    arrivalId: z.uuid(),
    status: z.enum(TaskStatus)
})

export type CreateTurnaroundData = z.infer<typeof createTurnaroundSchema>;
