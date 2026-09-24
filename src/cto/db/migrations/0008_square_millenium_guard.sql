ALTER TABLE "cto_clients" ADD COLUMN "notion_page_id" text;--> statement-breakpoint
CREATE UNIQUE INDEX "cto_client_notion_page" ON "cto_clients" USING btree ("notion_page_id");