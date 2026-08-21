import { createHash, randomBytes } from "node:crypto";
import { passwordResetTokenRepository } from "./repository";

export const passwordResetTokenService = {
  create() {
    return randomBytes(32).toString("hex");
  },

  hash(token: string) {
    return createHash("sha256").update(token).digest("hex");
  },

  async findValidPasswordResetToken(hash: string) {
    return await passwordResetTokenRepository.findByToken(hash);
  },
  async consume(tokenId: string) {
    await passwordResetTokenRepository.markAsUsed(tokenId);
  },
};
