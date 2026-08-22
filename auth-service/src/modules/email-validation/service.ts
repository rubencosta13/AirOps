import { createHash, randomBytes } from "node:crypto";
import { emailValidationRepository } from "./repository";
import { UnauthorizedError } from "@/shared/errors/app-error";
import db from "@/db";
import { authRepository } from "../auth/repository";

export const emailValidationService = {
  hashToken(token: string) {
    return createHash("sha256").update(token).digest("hex");
  },

  async create(userId: string) {
    const token = randomBytes(32).toString("hex");
    const tokenHash = this.hashToken(token);

    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await emailValidationRepository.create({
      userId,
      tokenHash,
      expiresAt,
    });

    return token;
  },

  async verify(token: string) {
    const tokenHash = this.hashToken(token);

    const verification =
      await emailValidationRepository.findTokenByHash(tokenHash);

    if (!verification)
      throw new UnauthorizedError("Invalid verification token");

    if (verification.usedAt)
      throw new UnauthorizedError("Verification token already used");

    if (verification.expiresAt < new Date())
      throw new UnauthorizedError("Verification Token is expired");

    const user = await db.transaction(async (tx) => {
      const user = await authRepository.markAsVerified(verification.userId, tx);

      await emailValidationRepository.markAsUsed(verification.id, tx);
      return user;
    });
    return user;
  },
};
