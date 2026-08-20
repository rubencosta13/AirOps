import "@fastify/session";

declare module "@fastify/session" {
  interface FastifySessionObject {
    jwt?: string;
  }
}

export {};
