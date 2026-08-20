import { publish } from "@/messaging/publisher";
import z from "zod";

class UserCreatedPublisher {
  static readonly topic = "auth.created";

  static readonly schema = z.object({
    id: z.uuid(),
    name: z.string(),
    email: z.string(),
  });

  static async publish(data: UserCreatedEvent) {
    const event = this.schema.parse(data);
    return publish(this.topic, event);
  }
}

export type UserCreatedEvent = z.infer<typeof UserCreatedPublisher.schema>;

export default UserCreatedPublisher;
