import "dotenv/config";

import { server } from "./server";
import { connectRabbitMQ } from "./messaging/rabbitmq";

const start = async () => {
  await connectRabbitMQ();
  await server.listen({
    port: Number(process.env.SERVER_PORT!),
    host: process.env.SERVER_HOST!,
  });
};

start();
