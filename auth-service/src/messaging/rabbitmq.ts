import amqp, { Channel } from "amqplib";

let connection;
let channel: Channel;

export const connectRabbitMQ = async () => {
  connection = await amqp.connect(process.env.RABBITMQ_URL!, {});
  channel = await connection.createChannel();

  await channel.assertExchange("auth.events", "topic", {
    durable: true,
  });
};

export const getChannel = async () => {
  if (!channel) throw new Error("RabbitMQ not initialized");

  return channel;
};
