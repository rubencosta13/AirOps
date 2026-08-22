import db from "@/db";
import { usersTable } from "@/db/schema/users";
import { and, EmptyRelations, eq, isNull } from "drizzle-orm";
import { SignUpSchema } from "./schema";
import { passwordResetTokenTable } from "@/db/schema/password-reset";
import { PgAsyncTransaction } from "drizzle-orm/pg-core";
import { NodePgQueryResultHKT } from "drizzle-orm/node-postgres";

interface CreatePasswordResetToken {
  userId: string;
  tokenHash: string;
  expiresAt: Date;
}

export const authRepository = {
  async findUser(email: string, password: string) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(
        and(
          eq(usersTable.email, email),
          eq(usersTable.password, password),
          isNull(usersTable.deletedAt),
        ),
      );
    return user;
  },

  async resetPassword(userId: string, passwordHash: string) {
    await db
      .update(usersTable)
      .set({
        password: passwordHash,
      })
      .where(and(eq(usersTable.id, userId), isNull(usersTable.deletedAt)));
  },

  async findUserById(id: string) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.id, id), isNull(usersTable.deletedAt)));
    return user;
  },

  async findUserByEmail(email: string) {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.email, email), isNull(usersTable.deletedAt)));
    return user;
  },

  async createUser(data: SignUpSchema) {
    const [user] = await db.insert(usersTable).values(data).returning();
    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  },

  async invalidatePasswordResetTokens(userId: string) {
    await db
      .update(passwordResetTokenTable)
      .set({
        usedAt: new Date(),
      })
      .where(
        and(
          eq(passwordResetTokenTable.userId, userId),
          isNull(passwordResetTokenTable.usedAt),
        ),
      );
  },

  async createPasswordResetToken(data: CreatePasswordResetToken) {
    const [token] = await db
      .insert(passwordResetTokenTable)
      .values(data)
      .returning();
    return token;
  },

  async markAsVerified(
    userId: string,
    tx: PgAsyncTransaction<NodePgQueryResultHKT, EmptyRelations>,
  ) {
    const [user] = await tx
      .update(usersTable)
      .set({
        verified: true,
        verifiedAt: new Date(),
      })
      .where(
        and(
          isNull(usersTable.verifiedAt),
          eq(usersTable.verified, false),
          isNull(usersTable.deletedAt),
          eq(usersTable.id, userId),
        ),
      )
      .returning();
    return user;
  },
};
