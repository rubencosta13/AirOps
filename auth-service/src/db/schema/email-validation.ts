import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { usersTable } from "./users";
import { timestamp } from "drizzle-orm/cockroach-core";

export const emailValidationTable = pgTable("email_validation_table", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),

  tokenHash: varchar("token_hash", { length: 64 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
