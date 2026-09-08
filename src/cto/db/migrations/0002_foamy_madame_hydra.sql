CREATE TABLE "cto_deliverable_placements" (
	"notion_page_id" text PRIMARY KEY NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
