import { subscribe } from "@/messaging/subscribe";
import { CreateTurnaroundData } from "@/modules/turnarounds/schema";
import { turnaroundsService } from "@/modules/turnarounds/service";

export class PlaneArrivedListener {
    async createSubscription(queue: string,  routingKey: string) { 
        await subscribe(queue, routingKey, this.handler.bind(this))
        
    }

    async handler(event: CreateTurnaroundData) { 
        await turnaroundsService.startTurnaround(event)
    }
}