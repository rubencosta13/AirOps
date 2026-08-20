import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { fastifyErrorHandler } from "./plugins/error-handler";
import { auth } from "./modules/auth";
import jwt from "@fastify/jwt";
import fastifySession from "@fastify/session";
import fastifyCookie from "@fastify/cookie";

const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyCookie);
fastify.register(fastifySession, {
  secret: "djpioawopdjawjopdawjopjopdajopdawjpjadopwjopdawjop",
});
fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

fastify.register(jwt, {
  secret: "djidawjjawdijidwajiawdjiojioawd",
});

fastify.register(auth, {
  prefix: "/api/auth",
});

fastify.setErrorHandler(fastifyErrorHandler);
export { fastify as server };
