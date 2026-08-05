import { ConflictError } from "@/shared/errors/app-error";
import { arrivalsRepository } from "./repository";
import { CreateArrivalInput, EditArrivalInput } from "./schemas";

export const arrivalsService = { 
    async getAll() { 
        return arrivalsRepository.findAll();
    },

    async create(data: CreateArrivalInput) {
        const existingArrival = await arrivalsRepository.findActiveByPlaneReg(data.planeReg);

        if (existingArrival)
            throw new ConflictError(`Plane ${data.planeReg} already has an active arrival`)

        return arrivalsRepository.create(data)
    },

    async update(id: string, data: EditArrivalInput) { 
        const existingArrival = await arrivalsRepository.findById(id);
        if (!existingArrival) 
            throw new ConflictError(`Arrival not found`);
        return arrivalsRepository.update(id, data);
    },

    async delete(id: string) {
        const validArrival = await arrivalsRepository.findById(id);
        if (!validArrival) 
            throw new ConflictError(`Arrival not found`);
        return arrivalsRepository.delete(id);
    }
}