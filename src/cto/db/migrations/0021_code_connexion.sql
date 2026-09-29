ALTER TABLE "cto_admin_magic_links" ADD COLUMN "code_hash" text;--> statement-breakpoint
ALTER TABLE "cto_admin_magic_links" ADD COLUMN "code_attempts" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "cto_magic_links" ADD COLUMN "code_hash" text;--> statement-breakpoint
ALTER TABLE "cto_magic_links" ADD COLUMN "code_attempts" integer DEFAULT 0 NOT NULL;