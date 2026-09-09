CREATE TYPE "public"."cto_letter_scope" AS ENUM('generale', 'sectorielle', 'personnalisee');--> statement-breakpoint
CREATE TABLE "cto_letters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"notion_page_id" text NOT NULL,
	"scope" "cto_letter_scope" NOT NULL,
	"sector" text,
	"client_id" uuid,
	"title" text NOT NULL,
	"period" timestamp,
	"chapo" text,
	"body" jsonb NOT NULL,
	"digest" text NOT NULL,
	"withdrawn_at" timestamp,
	"synced_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cto_clients" ADD COLUMN "sector" text;--> statement-breakpoint
ALTER TABLE "cto_letters" ADD CONSTRAINT "cto_letters_client_id_cto_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."cto_clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "cto_letter_page" ON "cto_letters" USING btree ("notion_page_id");--> statement-breakpoint
CREATE INDEX "cto_letter_period" ON "cto_letters" USING btree ("period");