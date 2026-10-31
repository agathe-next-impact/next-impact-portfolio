DROP INDEX "alert_client_intel";--> statement-breakpoint
ALTER TABLE "alerts" ADD COLUMN "site_url" text DEFAULT '' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "alert_client_intel_site" ON "alerts" USING btree ("client_id","intel_item_id","site_url");