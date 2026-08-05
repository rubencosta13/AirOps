ALTER TABLE "arrivals" RENAME COLUMN "planeReg" TO "plane_reg";--> statement-breakpoint
ALTER TABLE "arrivals" RENAME COLUMN "arrivalTimestamp" TO "arrival_timestamp";--> statement-breakpoint
ALTER TABLE "arrivals" RENAME COLUMN "scheduledArrival" TO "scheduled_arrival";--> statement-breakpoint
ALTER TABLE "arrivals" RENAME COLUMN "flightNumber" TO "flight_number";--> statement-breakpoint
ALTER TABLE "departures" RENAME COLUMN "planeReg" TO "plane_reg";--> statement-breakpoint
ALTER TABLE "departures" RENAME COLUMN "departureTimestamp" TO "departure_timestamp";--> statement-breakpoint
ALTER TABLE "departures" RENAME COLUMN "scheduledTimestamp" TO "scheduled_timestamp";--> statement-breakpoint
ALTER TABLE "departures" RENAME COLUMN "flightNumber" TO "flight_number";--> statement-breakpoint
ALTER TABLE "arrivals" DROP COLUMN "arrived";--> statement-breakpoint
ALTER TABLE "arrivals" ADD COLUMN "arrived" boolean GENERATED ALWAYS AS (arrival_timestamp IS NOT NULL) STORED;--> statement-breakpoint
ALTER TABLE "departures" DROP COLUMN "departed";--> statement-breakpoint
ALTER TABLE "departures" ADD COLUMN "departed" boolean GENERATED ALWAYS AS (departure_timestamp IS NOT NULL) STORED;