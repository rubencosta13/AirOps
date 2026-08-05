CREATE TABLE "arrivals" (
	"id" uuid PRIMARY KEY,
	"planeReg" varchar(255) NOT NULL,
	"arrival_timestamp" timestamp,
	"scheduledArrival" timestamp,
	"flightNumber" varchar(12),
	"runway" varchar(10),
	"gate" varchar(10),
	"arrived" boolean GENERATED ALWAYS AS (arrival_timestamp IS NOT NULL) STORED
);
