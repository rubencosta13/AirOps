import { subscribe } from "@/messaging/subscribe";

export class PlaneArrivedListener {
    async createSubscription(queue: string,  routingKey: string) { 
        await subscribe(queue, routingKey, this.handler)
    }

    async handler(event: unknown) { 
        console.log('[Plane Arrived] event data: ', event);
    }
}