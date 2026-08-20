import { server } from "@/server";

interface CreateAccessToken {
  userId: string;
  email: string;
  sessionId: string;
}

export const tokenService = {
  async createAccessToken(data: CreateAccessToken) {
    return server.jwt.sign({
      sub: data.userId,
      email: data.email,
      sid: data.sessionId,
    });
  },

  async verifyAccessToken(token: string) {
    return server.jwt.verify(token);
  },
};
