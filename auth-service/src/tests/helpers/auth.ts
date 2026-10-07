import { server } from "@/server";

export async function getAuthToken(payload: {
  sub: string;
  sid: string;
  email: string;
}) {
  return server.jwt.sign(payload);
}
