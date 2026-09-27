CREATE TYPE "public"."subscription_request_status" AS ENUM('pending', 'activated', 'dismissed');--> statement-breakpoint
CREATE TABLE "subscription_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"organisation" text NOT NULL,
	"site_url" text NOT NULL,
	"origin_scan_id" uuid,
	"status" "subscription_request_status" DEFAULT 'pending' NOT NULL,
	"client_id" uuid,
	"decided_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subscription_requests" ADD CONSTRAINT "subscription_requests_origin_scan_id_scans_id_fk" FOREIGN KEY ("origin_scan_id") REFERENCES "public"."scans"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_requests" ADD CONSTRAINT "subscription_requests_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "subscription_request_pending_email" ON "subscription_requests" USING btree ("email") WHERE "subscription_requests"."status" = 'pending';--> statement-breakpoint
CREATE INDEX "subscription_request_status_created_at" ON "subscription_requests" USING btree ("status","created_at");