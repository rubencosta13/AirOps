import db from "@/db";
import { passwordResetTokenTable } from "@/db/schema/password-reset";
import { and, eq, gt, isNull } from "drizzle-orm";

export const passwordResetTokenRepository = {
  async findByToken(hash: string) {
    const [token] = await db
      .select()
      .from(passwordResetTokenTable)
      .where(
        and(
          eq(passwordResetTokenTable.tokenHash, hash),
          isNull(passwordResetTokenTable.usedAt),
          gt(passwordResetTokenTable.expiresAt, new Date()),
        ),
      );
    return token;
  },

  async markAsUsed(id: string) {
    await db
      .update(passwordResetTokenTable)
      .set({
        usedAt: new Date(),
      })
      .where(
        and(
          eq(passwordResetTokenTable.id, id),
          isNull(passwordResetTokenTable.usedAt),
        ),
      );
  },
};
