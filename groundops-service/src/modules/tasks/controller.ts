import { tasksService } from "./service";

export const listTasks = async () => { 
    return await tasksService.getAll();
}