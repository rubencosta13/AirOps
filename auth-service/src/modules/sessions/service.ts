import { createHash, randomBytes } from "node:crypto";
import { sessionRepository } from "./repository";
import { UnauthorizedError } from "@/shared/errors/app-error";

const REFRESH_TOKEN_TTL = 30 * 24 * 60 * 60 * 1000;

export const sessionService = {
  async create(userId: string) {
    const refreshToken = randomBytes(64).toString("hex");

    const tokenHash = createHash("sha256").update(refreshToken).digest("hex");

    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL);

    const session = await sessionRepository.create({
      userId: userId,
      tokenHash,
      expiresAt,
    });

    return { ...session, refreshToken };
  },

  async refresh(refreshToken: string) {
    const oldToken = createHash("sha256").update(refreshToken).digest("hex");

    const session = await sessionRepository.findByTokenHash(oldToken);

    if (!session) throw new UnauthorizedError("Invalid Token");

    if (session.revokedAt) throw new UnauthorizedError("Session Revoked");

    if (session.expiresAt < new Date())
      throw new UnauthorizedError("Session is expired");

    const newRefreshToken = randomBytes(64).toString("hex");
    const newTokenHash = createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");

    const updatedSession = await sessionRepository.updateToken(
      session.id,
      oldToken,
      newTokenHash,
    );
    if (!updatedSession)
      throw new UnauthorizedError("Refresh Token already used");
    return {
      session,
      refreshToken: newRefreshToken,
    };
  },

  async revoke(token: string) {
    const tokenHash = createHash("sha256").update(token).digest("hex");

    await sessionRepository.revokeTokenByHash(tokenHash);
  },
};
