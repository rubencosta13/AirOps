import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const tasksTable = pgTable('tasks', {
    id: uuid().primaryKey().defaultRandom(),
    turnaround_id: uuid().primaryKey().defaultRandom(),
    type: varchar({ length: 12}), // change this later
    status: varchar({ length: 12 }), // chaneh this
    assigned_team_id: uuid(),
    started_at: timestamp(),
    completed_at: timestamp(),
    created_at:  timestamp(),
    updated_at:  timestamp(),
})  