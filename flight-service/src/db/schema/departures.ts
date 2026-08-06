import { sql } from "drizzle-orm";
import {
  boolean,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const departuresTable = pgTable("departures", {
  id: uuid().primaryKey().defaultRandom(),
  planeReg: varchar("plane_reg", { length: 12 }).notNull(),

  departureTimestamp: timestamp("departure_timestamp"),

  scheduledDeparture: timestamp("scheduled_timestamp"),

  flightNumber: varchar("flight_number", { length: 12 }),

  runway: varchar({ length: 12 }),
  gate: varchar({ length: 12 }),

  departed: boolean("departed").generatedAlwaysAs(
    () => sql`departure_timestamp IS NOT NULL`,
  ),

  deletedAt: timestamp("deleted_at"),
});
