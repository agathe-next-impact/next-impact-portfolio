CREATE TYPE "public"."cto_deliverable_kind" AS ENUM('decision', 'roadmap', 'cartographie', 'document');--> statement-breakpoint
CREATE TABLE "cto_deliverables" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"notion_page_id" text NOT NULL,
	"kind" "cto_deliverable_kind" NOT NULL,
	"version" integer NOT NULL,
	"title" text NOT NULL,
	"payload" jsonb NOT NULL,
	"digest" text NOT NULL,
	"occurred_at" timestamp,
	"withdrawn_at" timestamp,
	"recorded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cto_deliverables" ADD CONSTRAINT "cto_deliverables_client_id_cto_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."cto_clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "cto_deliverable_version" ON "cto_deliverables" USING btree ("notion_page_id","version");--> statement-breakpoint
CREATE INDEX "cto_deliverable_client_kind" ON "cto_deliverables" USING btree ("client_id","kind");