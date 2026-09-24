ALTER TABLE "cto_persons" ADD COLUMN "notion_page_id" text;--> statement-breakpoint
CREATE UNIQUE INDEX "cto_person_notion_page" ON "cto_persons" USING btree ("notion_page_id");