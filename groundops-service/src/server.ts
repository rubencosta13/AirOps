import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { fastifyErrorHandler } from "./plugins/error-handler";
import { tasks } from "./modules/tasks";
import { turnaround } from "./modules/turnarounds";
import { teams } from "./modules/teams";

const fastify = Fastify({
  logger: true,
});

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

fastify.register(tasks, { prefix: "/api/tasks" });
fastify.register(turnaround, { prefix: "/api/turnarounds" });
fastify.register(teams, { prefix: "/api/teams" });

fastify.setErrorHandler(fastifyErrorHandler);

export { fastify as server };
