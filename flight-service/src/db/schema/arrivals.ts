import { sql } from 'drizzle-orm'
import { boolean, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const arrivalsTable = pgTable('arrivals', {
    id: uuid().primaryKey().defaultRandom(),
    planeReg: varchar({ length: 255 }).notNull(),
    arrivalTimestamp: timestamp('arrival_timestamp'),
    scheduledArrival: timestamp(),
    flightNumber: varchar({ length: 12 }),
    runway: varchar({ length: 10 }),
    gate: varchar({ length: 10 }),
    arrived: boolean('arrived').generatedAlwaysAs(() => sql`arrival_timestamp IS NOT NULL`)
})
