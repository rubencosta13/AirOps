import "dotenv/config";

import { server } from "./server";
import { connectRabbitMQ } from "./messaging/rabbitmq";
import { setupListeners } from "./listeners";
console.log("authenticated →", typeof server.authenticated); // should be "function"
console.log("requireVerified →", typeof server.requireVerified); // should be "function"
const start = async () => {
  await connectRabbitMQ();
  // await setupListeners();
  await server.listen({ port: 3005 });
};

start();
