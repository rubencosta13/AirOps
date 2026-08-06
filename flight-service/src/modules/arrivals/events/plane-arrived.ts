import { publish } from "@/messaging/publisher";
import z from "zod";

class ArrivalArrivedPublisher { 
  static readonly topic = "arrival.arrived";

  static readonly schema = z.object({
    id: z.uuid(),
    planeReg: z.string(),
    flightNumber: z.string(),
  });
  
  static async publish(data: ArrivalArrivedEvent) { 
    const event = this.schema.parse(data);

    return publish(this.topic, event);
  }
}

export type ArrivalArrivedEvent = z.infer<typeof ArrivalArrivedPublisher.schema>;
export default ArrivalArrivedPublisher

