import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { turnaroundsTable } from "./turnarounds";
import { TaskStatus } from "@/modules/tasks/enums";

export const tasksTable = pgTable("tasks", {
  id: uuid().primaryKey().defaultRandom(),
  turnaroundId: uuid()
    .notNull()
    .references(() => turnaroundsTable.id),

  type: varchar({ length: 30 }), // chaneh this
  status: varchar({ length: 50 })
    .$type<TaskStatus>()
    .default(TaskStatus.IN_PROGRESS), // change this later

  assigned_team_id: uuid(),
  started_at: timestamp(),
  completed_at: timestamp(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().$onUpdate(() => new Date()),
  deletedAt: timestamp(),
});
