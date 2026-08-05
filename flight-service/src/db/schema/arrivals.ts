import { sql } from 'drizzle-orm'
import { boolean, pgTable, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'

export const arrivalsTable = pgTable('arrivals', {
    id: uuid().primaryKey().defaultRandom(),

    planeReg: varchar('plane_reg', { length: 255 }).notNull(),

    arrivalTimestamp: timestamp('arrival_timestamp'),

    scheduledArrival: timestamp('scheduled_arrival'),

    flightNumber: varchar('flight_number', { length: 12 }),

    runway: varchar('runway', { length: 10 }),

    gate: varchar('gate', { length: 10 }),

    arrived: boolean('arrived')
        .generatedAlwaysAs(() => sql`arrival_timestamp IS NOT NULL`)
})