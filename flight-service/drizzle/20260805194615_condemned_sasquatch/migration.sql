ALTER TABLE "arrivals" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "departures" ADD COLUMN "deleted_at" timestamp;