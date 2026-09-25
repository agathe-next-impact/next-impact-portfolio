ALTER TYPE "public"."cto_deliverable_kind" ADD VALUE 'prestation';--> statement-breakpoint
CREATE TABLE "cto_files" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"mime" text NOT NULL,
	"size" integer NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cto_site_reports" (
	"id" text PRIMARY KEY NOT NULL,
	"client_id" uuid NOT NULL,
	"name" text NOT NULL,
	"period_start" timestamp,
	"period_end" timestamp,
	"generated_at" timestamp,
	"file_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cto_site_snapshots" (
	"client_id" uuid PRIMARY KEY NOT NULL,
	"project_id" integer NOT NULL,
	"data" jsonb NOT NULL,
	"fetched_at" timestamp DEFAULT now() NOT NULL,
	"error" text,
	"error_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "cto_clients" ADD COLUMN "services" text[];--> statement-breakpoint
ALTER TABLE "cto_site_reports" ADD CONSTRAINT "cto_site_reports_client_id_cto_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."cto_clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cto_site_reports" ADD CONSTRAINT "cto_site_reports_file_id_cto_files_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."cto_files"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cto_site_snapshots" ADD CONSTRAINT "cto_site_snapshots_client_id_cto_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."cto_clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cto_site_report_client" ON "cto_site_reports" USING btree ("client_id","generated_at");