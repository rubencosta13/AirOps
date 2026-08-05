import { departuresRepository } from "./repository";
import { CreateDepartureInput, FindDepartureByPlaneInput } from "./schemas";

export const departuresService = {
    async getAll() { 
        return departuresRepository.findAll();
    },

    async create(data: CreateDepartureInput) { 
        const departure = departuresRepository.create(data)
        return departure
    },

    async findByPlane(data: FindDepartureByPlaneInput) { 
        const departure = departuresRepository.findByPlane(data);
        return departure;
    }
}