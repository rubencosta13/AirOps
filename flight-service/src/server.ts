import Fastify from 'fastify'
import { arrivals } from './modules/arrivals';
import {
    serializerCompiler,
    validatorCompiler
} from "fastify-type-provider-zod";
import { departures } from './modules/departures';
import { fastifyErrorHandler } from './plugins/error-handler';


const fastify = Fastify({
    logger: true,

})


fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);


fastify.register(arrivals, {
    prefix: '/api/arrivals'
})
fastify.register(departures, {
    prefix: '/api/departures'
})

fastify.setErrorHandler(fastifyErrorHandler);


export { fastify as server }

