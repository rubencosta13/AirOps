import "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      sub: string;
      email: string;
      sid: string;
    };

    user: {
      sub: string;
      email: string;
      sid: string;
    };
  }
}
