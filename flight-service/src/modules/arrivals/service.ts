import { ConflictError } from "@/shared/errors/app-error";
import { arrivalsRepository } from "./repository";
import { CreateArrivalInput, EditArrivalInput, IdParams } from "./schemas";
import ArrivalArrivedPublisher from "./events/plane-arrived";

export const arrivalsService = {
  async getAll() {
    return arrivalsRepository.findAll();
  },

  async getArrival(id: IdParams["id"]) {
    const arrival = await arrivalsRepository.findById(id);
    return arrival;
  },

  async create(data: CreateArrivalInput) {
    const existingArrival = await arrivalsRepository.findActiveByPlaneReg(
      data.planeReg,
    );
    if (existingArrival)
      throw new ConflictError(
        `Plane ${data.planeReg} already has an active arrival`,
      );

    return arrivalsRepository.create(data);
  },

  async update(id: string, data: EditArrivalInput) {
    const existingArrival = await arrivalsRepository.findById(id);
    if (!existingArrival) throw new ConflictError(`Arrival not found`);
    return arrivalsRepository.update(id, data);
  },

  async delete(id: string) {
    const validArrival = await arrivalsRepository.findById(id);
    if (!validArrival) throw new ConflictError(`Arrival not found`);
    return arrivalsRepository.delete(id);
  },

  async arrive(id: IdParams["id"]) {
    const validArrival = await arrivalsRepository.findById(id);
    if (!validArrival) throw new ConflictError(`Arrival not found`);

    if (validArrival.arrived)
      throw new ConflictError("Plane has already arrived");

    const markAsArrived = await arrivalsRepository.arrive(id);

    ArrivalArrivedPublisher.publish(markAsArrived);
    return markAsArrived;
  },
};
