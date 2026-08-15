CREATE TABLE "magic_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "origin_scan_id" uuid;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "welcome_sent_at" timestamp;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "onboarded_at" timestamp;--> statement-breakpoint
ALTER TABLE "magic_links" ADD CONSTRAINT "magic_links_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "magic_link_token_hash" ON "magic_links" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "magic_link_client_created_at" ON "magic_links" USING btree ("client_id","created_at");--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_origin_scan_id_scans_id_fk" FOREIGN KEY ("origin_scan_id") REFERENCES "public"."scans"("id") ON DELETE set null ON UPDATE no action;