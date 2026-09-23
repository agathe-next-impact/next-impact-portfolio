CREATE TABLE "cto_admin_challenges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"challenge" text NOT NULL,
	"kind" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cto_admin_credentials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"credential_id" text NOT NULL,
	"public_key" text NOT NULL,
	"counter" integer DEFAULT 0 NOT NULL,
	"transports" text,
	"label" text NOT NULL,
	"aaguid" text,
	"last_used_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cto_admin_magic_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cto_admin_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"last_seen_at" timestamp DEFAULT now() NOT NULL,
	"user_agent" text,
	"revoked_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "cto_admin_challenge_expires" ON "cto_admin_challenges" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "cto_admin_credential_id" ON "cto_admin_credentials" USING btree ("credential_id");--> statement-breakpoint
CREATE UNIQUE INDEX "cto_admin_magic_link_hash" ON "cto_admin_magic_links" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "cto_admin_magic_link_created" ON "cto_admin_magic_links" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "cto_admin_session_hash" ON "cto_admin_sessions" USING btree ("token_hash");