CREATE TABLE "email_validation_table" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" uuid NOT NULL,
	"token_hash" varchar(64) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "verified_account" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "verifiedAt" timestamp;--> statement-breakpoint
ALTER TABLE "email_validation_table" ADD CONSTRAINT "email_validation_table_user_id_users_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE;