import { subscribe } from "@/messaging/subscribe";
import { teamsService } from "@/modules/teams/service";

interface UserCreatedEvent {
  id: string;
  name: string;
  email: string;
}

export class UserCreatedListener {
  async createSubscription(
    exchange: string,
    queue: string,
    routingKey: string,
  ) {
    await subscribe(exchange, queue, routingKey, this.handler.bind(this));
  }

  async handler(event: UserCreatedEvent) {
    await teamsService.createTeamMember(event);
  }
}
