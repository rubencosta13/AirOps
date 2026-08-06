import { ConflictError } from "@/shared/errors/app-error";
import { tasksService } from "../tasks/service";
import { TurnaroundStatus } from "./enums";
import { turnaroundsRepository } from "./repository";
import { CreateTurnaroundData } from "./schema";

export const turnaroundsService = {
    async startTurnaround(arrival: CreateTurnaroundData) {
        try {
        const existing = await turnaroundsRepository.findActiveByPlane(arrival.planeReg);
        console.log(existing)
        if (existing) {
            throw new ConflictError(
                `An active turnaround already exists for plane ${arrival.planeReg}`
            );
        }

        const turnaround = await turnaroundsRepository.create({
            planeReg: arrival.planeReg,
            arrivalId: arrival.id!,
            status: TurnaroundStatus.IN_PROGRESS,
        });

        
        await tasksService.createDefaultTasks(turnaround.id);
        console.log("DONE")
        return turnaround;
        } catch (err) {
    console.error(err);
    throw err;
}
    }
}