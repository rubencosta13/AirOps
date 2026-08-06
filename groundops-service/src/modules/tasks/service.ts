import { TaskType } from "./enums";
import { tasksRepository } from "./repository";


const DEFAULT_TURNAROUND_TASKS = [
    TaskType.BAGGAGE_UNLOAD,
    TaskType.CLEANING,
    TaskType.CATERING,
    TaskType.FUELING,
    TaskType.BOARDING,
];

export const tasksService = { 
    async getAll() { 
        return tasksRepository.findAll();
    },

    async createDefaultTasks(turnaroundId: string) {
        return tasksRepository.createMany(
            DEFAULT_TURNAROUND_TASKS.map(type => ({
                turnaroundId,
                type,
            }))
        );
    },
}