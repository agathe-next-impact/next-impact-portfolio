DROP INDEX "cto_person_notion_page";--> statement-breakpoint
CREATE UNIQUE INDEX "cto_person_notion_page" ON "cto_persons" USING btree ("notion_page_id","client_id");