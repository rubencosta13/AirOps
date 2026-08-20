import {
  pgTable,
  timestamp,
  varchar,
  uuid,
  primaryKey,
} from "drizzle-orm/pg-core";
import { employees } from "./employees";
import { relations } from "drizzle-orm/_relations";

export const teamsTable = pgTable("teams", {
  id: uuid().primaryKey().defaultRandom(),

  name: varchar({ length: 50 }),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().$onUpdate(() => new Date()),
  deletedAt: timestamp(),
});

export const teamMembers = pgTable(
  "team_members",
  {
    teamId: uuid("team_id")
      .notNull()
      .references(() => teamsTable.id, { onDelete: "cascade" }),
    employeeId: uuid("employee_id")
      .notNull()
      .references(() => employees.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({
      columns: [table.teamId, table.employeeId],
    }),
  ],
);

export const teamsRelations = relations(teamsTable, ({ many }) => ({
  members: many(teamMembers),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teamsTable, {
    fields: [teamMembers.teamId],
    references: [teamsTable.id],
  }),

  employee: one(employees, {
    fields: [teamMembers.employeeId],
    references: [employees.id],
  }),
}));
