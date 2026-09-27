CREATE TABLE "cto_sync_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"at" timestamp DEFAULT now() NOT NULL,
	"source" text NOT NULL,
	"ok" boolean NOT NULL,
	"lines" jsonb NOT NULL,
	"warnings" jsonb NOT NULL,
	"alerts" jsonb NOT NULL,
	"error" text,
	"alerted_at" timestamp
);
--> statement-breakpoint
CREATE INDEX "cto_sync_run_at" ON "cto_sync_runs" USING btree ("at");