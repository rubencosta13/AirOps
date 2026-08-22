import db from "@/db";
import { emailValidationTable } from "@/db/schema/email-validation";
import { and, EmptyRelations, eq, gt, isNull } from "drizzle-orm";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";
import { PgAsyncTransaction } from "drizzle-orm/pg-core";

export const emailValidationRepository = {
  async findTokenByHash(hash: string) {
    const [token] = await db
      .select()
      .from(emailValidationTable)
      .where(
        and(
          eq(emailValidationTable.tokenHash, hash),
          isNull(emailValidationTable.usedAt),
          gt(emailValidationTable.expiresAt, new Date()),
        ),
      );
    return token;
  },

  async markAsUsed(
    id: string,
    tx: PgAsyncTransaction<NodePgQueryResultHKT, EmptyRelations>,
  ) {
    await tx
      .update(emailValidationTable)
      .set({
        usedAt: new Date(),
      })
      .where(
        and(
          eq(emailValidationTable.id, id),
          isNull(emailValidationTable.usedAt),
        ),
      );
  },

  async create(data: { userId: string; tokenHash: string; expiresAt: Date }) {
    const [verification] = await db
      .insert(emailValidationTable)
      .values({
        userId: data.userId,
        tokenHash: data.tokenHash,
        expiresAt: data.expiresAt,
      })
      .returning();

    return verification;
  },
};
