import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { fastifyErrorHandler } from "./plugins/error-handler";
import { tasks } from "./modules/tasks";

const fastify = Fastify({
  logger: true,
});

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

fastify.register(tasks, { prefix: '/api/tasks'});

fastify.setErrorHandler(fastifyErrorHandler);

export { fastify as server };
