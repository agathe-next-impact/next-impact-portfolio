ALTER TYPE "public"."cto_access_event" ADD VALUE 'suggestion_cliquee';--> statement-breakpoint
ALTER TYPE "public"."cto_access_event" ADD VALUE 'suggestion_masquee';--> statement-breakpoint
ALTER TABLE "cto_clients" ADD COLUMN "contract_start" timestamp;--> statement-breakpoint
ALTER TABLE "cto_clients" ADD COLUMN "suivi_formule" text;--> statement-breakpoint
ALTER TABLE "cto_clients" ADD COLUMN "suivi_inclus_jusquau" timestamp;--> statement-breakpoint
ALTER TABLE "cto_clients" ADD COLUMN "suggestions_coupees" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "cto_clients" ADD COLUMN "services_ouverts" jsonb DEFAULT '{}'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "cto_persons" ADD COLUMN "suggestions_masquees" jsonb DEFAULT '{}'::jsonb NOT NULL;