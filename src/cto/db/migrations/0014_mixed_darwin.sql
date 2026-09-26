CREATE TYPE "public"."cto_digest_status" AS ENUM('draft', 'validated', 'sent');--> statement-breakpoint
CREATE TYPE "public"."cto_letter_source" AS ENUM('atelier', 'signaux-faibles', 'sentinelle');--> statement-breakpoint
CREATE TABLE "cto_digests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"week" text NOT NULL,
	"status" "cto_digest_status" DEFAULT 'draft' NOT NULL,
	"content" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"validated_at" timestamp,
	"sent_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "cto_sentinelle_snapshots" (
	"client_id" uuid PRIMARY KEY NOT NULL,
	"data" jsonb NOT NULL,
	"fetched_at" timestamp DEFAULT now() NOT NULL,
	"error" text,
	"error_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "cto_clients" ADD COLUMN "sentinelle_client_id" text;--> statement-breakpoint
ALTER TABLE "cto_letters" ADD COLUMN "source" "cto_letter_source" DEFAULT 'atelier' NOT NULL;--> statement-breakpoint
ALTER TABLE "cto_letters" ADD COLUMN "label" text;--> statement-breakpoint
ALTER TABLE "cto_letters" ADD COLUMN "action" text;--> statement-breakpoint
ALTER TABLE "cto_digests" ADD CONSTRAINT "cto_digests_client_id_cto_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."cto_clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cto_sentinelle_snapshots" ADD CONSTRAINT "cto_sentinelle_snapshots_client_id_cto_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."cto_clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "cto_digest_client_week" ON "cto_digests" USING btree ("client_id","week");--> statement-breakpoint
CREATE INDEX "cto_digest_status" ON "cto_digests" USING btree ("status","week");