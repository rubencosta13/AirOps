import db from "@/db";
import { tasksTable } from "@/db/schema/tasks";
import { TaskStatus } from "./enums";
import { and, eq, isNull } from "drizzle-orm";

export const tasksRepository = {
  async findAll() {
    const tasks = await db.select().from(tasksTable);
    return tasks;
  },

  async createMany(data: (typeof tasksTable.$inferInsert)[]) {
    return db.insert(tasksTable).values(data).returning();
  },

  async startTask(id: string) {
    return db
      .update(tasksTable)
      .set({
        status: TaskStatus.IN_PROGRESS,
      })
      .where(and(eq(tasksTable.id, id), isNull(tasksTable.deletedAt)));
  },
};
