CREATE TABLE "departures" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"planeReg" varchar(12) NOT NULL,
	"departureTimestamp" timestamp,
	"scheduledTimestamp" timestamp,
	"flightNumber" varchar(12),
	"runway" varchar(12),
	"gate" varchar(12),
	"departed" boolean GENERATED ALWAYS AS (departureTimestamp IS NOT NULL) STORED
);
--> statement-breakpoint
ALTER TABLE "arrivals" RENAME COLUMN "arrival_timestamp" TO "arrivalTimestamp";--> statement-breakpoint
ALTER TABLE "arrivals" DROP COLUMN "arrived";--> statement-breakpoint
ALTER TABLE "arrivals" ADD COLUMN "arrived" boolean GENERATED ALWAYS AS (arrivalTimestamp IS NOT NULL) STORED;