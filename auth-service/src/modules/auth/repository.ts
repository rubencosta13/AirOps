import db from "@/db";
import { usersTable } from "@/db/schema/users";
import { and, eq, isNull } from "drizzle-orm";
import { SignUpSchema } from "./schema";

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
};
