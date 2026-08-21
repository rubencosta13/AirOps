import amqp, { Channel } from "amqplib";

let connection;
let channel: Channel;

export const connectRabbitMQ = async () => {
  connection = await amqp.connect(process.env.RABBITMQ_URL!, {});
  channel = await connection.createChannel();

  await channel.assertExchange("auth.events", "topic", {
    durable: true,
  });

  connection.on("error", (err) => {
    console.error("RabbitMQ connection error:", err);
  });

  connection.on("close", () => {
    console.error("RabbitMQ connection closed");
  });

  channel.on("error", (err) => {
    console.error("RabbitMQ channel error:", err);
  });

  channel.on("close", () => {
    console.error("RabbitMQ channel closed");
  });
};

export const getChannel = async () => {
  if (!channel) throw new Error("RabbitMQ not initialized");

  return channel;
};
