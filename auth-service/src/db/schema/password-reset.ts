import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { usersTable } from "./users";

export const passwordResetTokenTable = pgTable("password_reset_tokens", {
  id: uuid("id").notNull().defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, {
      onDelete: "cascade",
    }),

  tokenHash: text("token_hash").notNull().unique(),

  expiresAt: timestamp("expires_at", {
    withTimezone: true,
  }).notNull(),

  usedAt: timestamp("used_at", { withTimezone: true }),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});
