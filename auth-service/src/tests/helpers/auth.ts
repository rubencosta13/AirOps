import { server } from "@/server";

export async function getAuthToken(payload: {
  sub: string;
  sid: string;
  email: string;
}) {
  await server.ready();
  return server.jwt.sign(payload);
}
