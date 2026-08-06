import { publish } from "@/messaging/publisher";
import z from "zod";

const departureCreatedEventSchema = z.object({
  id: z.uuid(),
  planeReg: z.string(),
  flightNumber: z.string(),
  scheduledDeparture: z.date(),
});

export type DepartureCreatedEvent = z.infer<typeof departureCreatedEventSchema>;

export const departureCreatedEvent = async (
  departure: DepartureCreatedEvent,
) => {
  return publish("departure.created", {
    id: departure.id,
    planeReg: departure.planeReg,
    flightNumber: departure.flightNumber,
  });
};
