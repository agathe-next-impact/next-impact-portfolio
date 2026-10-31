ALTER TABLE "cto_sites" ADD COLUMN "suivi_formule" text;--> statement-breakpoint
ALTER TABLE "cto_sites" ADD COLUMN "sans_suivi" boolean DEFAULT false NOT NULL;