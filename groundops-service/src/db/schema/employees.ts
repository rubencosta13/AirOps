import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { teamMembers } from "./teams";
import { relations } from "drizzle-orm/_relations";

export const employees = pgTable("employees", {
  id: uuid().defaultRandom().notNull().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).unique().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().$onUpdate(() => new Date()),
  deletedAt: timestamp(),
});

export const employeesRelations = relations(employees, ({ many }) => ({
  teams: many(teamMembers),
}));
