import "dotenv/config";

import { server } from "./server";
import { connectRabbitMQ } from "./messaging/rabbitmq";
import { setupListeners } from "./listeners";

const start = async () => {
  await connectRabbitMQ();
  await setupListeners();
  await server.listen({ port: 3001 });
};

start();
