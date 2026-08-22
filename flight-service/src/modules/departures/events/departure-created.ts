import { publish } from "@/messaging/publisher";
import z from "zod";

class DepartureCreatedPublisher {
  static readonly topic = "departure.created";

  static readonly schema = z.object({
    id: z.uuid(),
    planeReg: z.string(),
    flightNumber: z.string(),
    scheduledDeparture: z.date(),
  });

  static async publish(data: unknown) {
    const event = this.schema.parse(data);

    return publish(this.topic, event);
  }
}

export type DepartureCreatedEvent = z.infer<
  typeof DepartureCreatedPublisher.schema
>;
export default DepartureCreatedPublisher;
