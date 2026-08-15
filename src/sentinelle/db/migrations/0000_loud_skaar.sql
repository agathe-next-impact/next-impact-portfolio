CREATE TYPE "public"."alert_status" AS ENUM('draft', 'validated', 'sent', 'dismissed', 'resolved');--> statement-breakpoint
CREATE TYPE "public"."intel_kind" AS ENUM('vulnerability', 'release', 'eol', 'changelog', 'page_diff');--> statement-breakpoint
CREATE TYPE "public"."plan" AS ENUM('surveillance', 'conseil');--> statement-breakpoint
CREATE TYPE "public"."stack_item_source" AS ENUM('scanned', 'declared');--> statement-breakpoint
CREATE TYPE "public"."stack_item_type" AS ENUM('wp_core', 'wp_plugin', 'wp_theme', 'php', 'hosting', 'frontend', 'saas', 'competitor_url');--> statement-breakpoint
CREATE TYPE "public"."verdict" AS ENUM('green', 'orange', 'red', 'info');--> statement-breakpoint
CREATE TABLE "alerts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"stack_item_id" uuid NOT NULL,
	"intel_item_id" uuid NOT NULL,
	"status" "alert_status" DEFAULT 'draft' NOT NULL,
	"verdict" "verdict",
	"generated_text" text,
	"final_text" text,
	"recommended_action" text,
	"sent_at" timestamp,
	"resolved_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"company" text,
	"site_url" text NOT NULL,
	"sector" text,
	"notes" text,
	"plan" "plan" DEFAULT 'surveillance' NOT NULL,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "clients_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "digests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"period" text NOT NULL,
	"status" "alert_status" DEFAULT 'draft' NOT NULL,
	"blocks" jsonb NOT NULL,
	"final_html" text,
	"sent_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "intel_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"kind" "intel_kind" NOT NULL,
	"source" text NOT NULL,
	"external_id" text NOT NULL,
	"target_slug" text NOT NULL,
	"target_type" "stack_item_type" NOT NULL,
	"affected_range" text,
	"fixed_in" text,
	"severity" text,
	"title" text NOT NULL,
	"raw" jsonb NOT NULL,
	"published_at" timestamp,
	"collected_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "scans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL,
	"result" jsonb,
	"lead_email" text,
	"ip_hash" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stack_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"type" "stack_item_type" NOT NULL,
	"slug" text NOT NULL,
	"label" text NOT NULL,
	"version" text,
	"source" "stack_item_source" NOT NULL,
	"meta" jsonb,
	"watch_enabled" boolean DEFAULT true NOT NULL,
	"last_checked_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_stack_item_id_stack_items_id_fk" FOREIGN KEY ("stack_item_id") REFERENCES "public"."stack_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_intel_item_id_intel_items_id_fk" FOREIGN KEY ("intel_item_id") REFERENCES "public"."intel_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "digests" ADD CONSTRAINT "digests_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stack_items" ADD CONSTRAINT "stack_items_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "alert_client_intel" ON "alerts" USING btree ("client_id","intel_item_id");--> statement-breakpoint
CREATE INDEX "alert_status_created_at" ON "alerts" USING btree ("status","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "digest_client_period" ON "digests" USING btree ("client_id","period");--> statement-breakpoint
CREATE UNIQUE INDEX "intel_source_external" ON "intel_items" USING btree ("source","external_id");--> statement-breakpoint
CREATE INDEX "intel_target" ON "intel_items" USING btree ("target_slug","target_type");--> statement-breakpoint
CREATE INDEX "scans_ip_hash_created_at" ON "scans" USING btree ("ip_hash","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "stack_client_slug_type" ON "stack_items" USING btree ("client_id","slug","type");--> statement-breakpoint
CREATE INDEX "stack_slug_type" ON "stack_items" USING btree ("slug","type");