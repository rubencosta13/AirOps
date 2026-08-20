import { TurnaroundStatus } from "@/modules/turnarounds/enums";
import { pgTable, uuid, varchar, timestamp, text } from "drizzle-orm/pg-core";

export const turnaroundsTable = pgTable("turnarounds", {
  id: uuid().defaultRandom().primaryKey(),

  arrivalId: uuid().notNull(),
  planeReg: varchar({ length: 30 }).notNull(),

  status: varchar({ length: 30 })
    .$type<TurnaroundStatus>()
    .default(TurnaroundStatus.IN_PROGRESS)
    .notNull(),
  startedAt: timestamp().defaultNow().notNull(),
  completedAt: timestamp(),
  notes: text(),

  createdBy: uuid(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().$onUpdate(() => new Date()),
  deletedAt: timestamp(),
});
