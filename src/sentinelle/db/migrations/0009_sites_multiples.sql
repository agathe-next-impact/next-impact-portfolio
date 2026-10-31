DROP INDEX "stack_client_slug_type";--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "extra_sites" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "stack_items" ADD COLUMN "site_url" text DEFAULT '' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "stack_client_site_slug_type" ON "stack_items" USING btree ("client_id","site_url","slug","type");