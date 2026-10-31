CREATE TABLE "cto_sites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"notion_page_id" text NOT NULL,
	"name" text NOT NULL,
	"url" text,
	"wp_umbrella_project_id" integer,
	"position" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"removed_at" timestamp
);
--> statement-breakpoint
-- Un relevé par projet WP Umbrella et non plus par accompagnement. La clé
-- primaire créée avec la table (0011) porte le nom par défaut de PostgreSQL.
ALTER TABLE "cto_site_snapshots" DROP CONSTRAINT "cto_site_snapshots_pkey";--> statement-breakpoint
ALTER TABLE "cto_site_snapshots" ADD CONSTRAINT "cto_site_snapshots_client_id_project_id_pk" PRIMARY KEY("client_id","project_id");--> statement-breakpoint
ALTER TABLE "cto_sites" ADD CONSTRAINT "cto_sites_client_id_cto_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."cto_clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "cto_site_page" ON "cto_sites" USING btree ("notion_page_id");--> statement-breakpoint
CREATE INDEX "cto_site_client" ON "cto_sites" USING btree ("client_id");