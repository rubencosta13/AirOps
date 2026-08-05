import { ConflictError } from "@/shared/errors/app-error";
import { arrivalsRepository } from "./repository";
import { CreateArrivalInput } from "./schemas";

export const arrivalsService = { 
    async getAll() { 
        return arrivalsRepository.findAll();
    },

    async create(data: CreateArrivalInput) {
        const existingArrival = await arrivalsRepository.findActiveByPlaneReg(data.planeReg);

        if (existingArrival)
            throw new ConflictError(`Plane ${data.planeReg} already has an active arrival`)

        return arrivalsRepository.create(data)
    }
}