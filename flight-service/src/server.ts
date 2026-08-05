import Fastify from 'fastify'
import { arrivals } from './modules/arrivals';
import {
    serializerCompiler,
    validatorCompiler
} from "fastify-type-provider-zod";
import { AppError } from './shared/errors/app-error';


const fastify = Fastify({
    logger: true,

})


fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);


fastify.register(arrivals, {
    prefix: '/api/arrivals'
})


fastify.setErrorHandler((error, request, reply) => {

    if (error instanceof AppError) {
        return reply
            .status(error.statusCode)
            .send({
                error: error.code,
                message: error.message
            });
    }


    request.log.error(error);

    return reply
        .status(500)
        .send({
            error: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong"
        });
});

export { fastify as server }

