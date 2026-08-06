import { tasksRepository } from "./repository";

export const tasksService = { 
    async getAll() { 
        return tasksRepository.findAll();
    }
}