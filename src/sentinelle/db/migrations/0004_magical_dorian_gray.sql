ALTER TABLE "alerts" ADD COLUMN "notion_page_id" text;--> statement-breakpoint
CREATE UNIQUE INDEX "alert_notion_page" ON "alerts" USING btree ("notion_page_id");