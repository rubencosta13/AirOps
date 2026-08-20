import db from "@/db";
import { sessionsTable } from "@/db/schema/sessions";
import { and, eq, isNull } from "drizzle-orm";

interface SessionData {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}

export const sessionRepository = {
  async create(values: SessionData) {
    const [session] = await db.insert(sessionsTable).values(values).returning();
    return session;
  },

  async findById(id: string) {
    const [session] = await db
      .select()
      .from(sessionsTable)
      .where(and(eq(sessionsTable.id, id), isNull(sessionsTable.revokedAt)));
    return session;
  },

  async findByTokenHash(hash: string) {
    const [session] = await db
      .select()
      .from(sessionsTable)
      .where(
        and(eq(sessionsTable.tokenHash, hash), isNull(sessionsTable.revokedAt)),
      );
    return session;
  },

  async updateToken(
    sessionId: string,
    oldTokenHash: string,
    newTokenHash: string,
  ) {
    const [session] = await db
      .update(sessionsTable)
      .set({ tokenHash: newTokenHash, updatedAt: new Date() })
      .where(
        and(
          eq(sessionsTable.id, sessionId),
          eq(sessionsTable.tokenHash, oldTokenHash),
          isNull(sessionsTable.revokedAt),
        ),
      )
      .returning();
    return session;
  },

  async revokeTokenByHash(token: string) {
    const [session] = await db
      .update(sessionsTable)
      .set({
        revokedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(sessionsTable.tokenHash, token),
          isNull(sessionsTable.revokedAt),
        ),
      )
      .returning();
    return session;
  },
};
