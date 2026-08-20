import { subscribe } from "@/messaging/subscribe";
import { CreateTurnaroundData } from "@/modules/turnarounds/schema";
import { turnaroundsService } from "@/modules/turnarounds/service";

export class PlaneArrivedListener {
  async createSubscription(
    exchange: string,
    queue: string,
    routingKey: string,
  ) {
    await subscribe(exchange, queue, routingKey, this.handler.bind(this));
  }

  async handler(event: CreateTurnaroundData) {
    await turnaroundsService.startTurnaround(event);
  }
}
