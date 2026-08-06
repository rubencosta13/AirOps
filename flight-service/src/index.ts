import "dotenv/config";

import { server } from "./server";
import { connectRabbitMQ } from "./messaging/rabbitmq";

const start = async () => {
  await connectRabbitMQ();
  await server.listen({ port: 3000 });
};

start();
