import { getChannel } from "./rabbitmq";

export const publish = async (routingKey: string, payload: unknown) => {
  try {
    const channel = await getChannel();

    channel.publish(
      "flight.events",
      routingKey,
      Buffer.from(JSON.stringify(payload)),
      {
        persistent: true,
      },
    );
  } catch (err) {
    console.error(err);
  }
};
