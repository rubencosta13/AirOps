import { ConsumeMessage } from "amqplib";
import { getChannel } from "./rabbitmq";

export const subscribe = async (
  queue: string,
  routingKey: string,
  handler: (message: any) => Promise<void>,
) => {
  const channel = await getChannel();

  await channel.assertQueue(queue, {
    durable: true,
  });

  await channel.bindQueue(queue, "auth.events", routingKey);

  channel.consume(queue, async (msg: ConsumeMessage | null) => {
    if (!msg) return;

    try {
      const payload = JSON.parse(msg.content.toString());
      await handler(payload);

      channel.ack(msg);
    } catch (err) {
      channel.nack(msg, false, false);
    }
  });
};
