import { ConflictError } from "@/shared/errors/app-error";
import { tasksService } from "../tasks/service";
import { TurnaroundStatus } from "./enums";
import { turnaroundsRepository } from "./repository";
import { CreateTurnaroundData } from "./schema";

export const turnaroundsService = {
  async startTurnaround(arrival: CreateTurnaroundData) {
    const existing = await turnaroundsRepository.findActiveByPlane(
      arrival.planeReg,
    );
    if (existing) {
      throw new ConflictError(
        `An active turnaround already exists for plane ${arrival.planeReg}`,
      );
    }

    const turnaround = await turnaroundsRepository.create({
      planeReg: arrival.planeReg,
      arrivalId: arrival.id!,
      status: TurnaroundStatus.IN_PROGRESS,
    });

    await tasksService.createDefaultTasks(turnaround.id);
    return turnaround;
  },

  async getTurnaround(id: string) {
    const turnaround = await turnaroundsRepository.getById(id);
    return turnaround;
  },

  async getAll() {
    const turnarounds = await turnaroundsRepository.findAll();
    return turnarounds;
  },

  async findByFlight(flightId: string) {
    const turnaround = await turnaroundsRepository.getByFlight(flightId);
    return turnaround;
  },
};
