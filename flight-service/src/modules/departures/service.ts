import { ConflictError } from "@/shared/errors/app-error";
import { departuresRepository } from "./repository";
import {
  CreateDepartureInput,
  EditDepartureInput,
  FindDepartureInput,
  IdParams,
} from "./schemas";
import { departureCreatedEvent } from "./events/departure-created";

export const departuresService = {
  async getAll() {
    return departuresRepository.findAll();
  },

  async create(data: CreateDepartureInput) {
    const activeDeparture = await departuresRepository.findActiveByPlaneReg(
      data.planeReg,
    );

    if (activeDeparture) {
      throw new ConflictError(
        `Plane ${data.planeReg} already has an active departure`,
      );
    }
    const departure = await departuresRepository.create(data);
    await departureCreatedEvent(departure);
    return departure;
  },

  async findByFlightNumber(number: FindDepartureInput["flightNumber"]) {
    const departure = await departuresRepository.findByFlightNumber(number);
    return departure;
  },

  async findByPlane(data: FindDepartureInput["planeReg"]) {
    const departure = await departuresRepository.findByPlane(data);
    return departure;
  },

  async edit(id: IdParams["id"], data: EditDepartureInput) {
    const validDeparture = await departuresRepository.findById(id);
    if (!validDeparture) throw new ConflictError("Departure not found");

    const editedDeparture = await departuresRepository.update(id, data);
    return editedDeparture;
  },

  async delete(id: IdParams["id"]) {
    const validDeparture = await departuresRepository.findById(id);
    if (!validDeparture) throw new ConflictError("Invalid Departure");
    const deletedDeparture = await departuresRepository.delete(id);
    return deletedDeparture;
  },
};
