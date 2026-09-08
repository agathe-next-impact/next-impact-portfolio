CREATE TYPE "public"."cto_access_event" AS ENUM('connexion_lien', 'connexion_passkey', 'passkey_ajoutee', 'passkey_supprimee', 'session_fermee', 'session_revoquee', 'acces_refuse');--> statement-breakpoint
CREATE TYPE "public"."cto_client_status" AS ENUM('actif', 'suspendu', 'restitution', 'clos');--> statement-breakpoint
CREATE TABLE "cto_access_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"person_id" uuid,
	"client_id" uuid,
	"event" "cto_access_event" NOT NULL,
	"detail" text,
	"at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cto_challenges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"person_id" uuid,
	"challenge" text NOT NULL,
	"kind" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cto_clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company" text NOT NULL,
	"tier" text DEFAULT 'direction' NOT NULL,
	"status" "cto_client_status" DEFAULT 'actif' NOT NULL,
	"status_changed_at" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cto_credentials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"person_id" uuid NOT NULL,
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
CREATE TABLE "cto_magic_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"person_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"used_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cto_persons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"role" text,
	"revoked_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cto_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"person_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"last_seen_at" timestamp DEFAULT now() NOT NULL,
	"user_agent" text,
	"revoked_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "cto_access_log" ADD CONSTRAINT "cto_access_log_person_id_cto_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."cto_persons"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cto_access_log" ADD CONSTRAINT "cto_access_log_client_id_cto_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."cto_clients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cto_challenges" ADD CONSTRAINT "cto_challenges_person_id_cto_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."cto_persons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cto_credentials" ADD CONSTRAINT "cto_credentials_person_id_cto_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."cto_persons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cto_magic_links" ADD CONSTRAINT "cto_magic_links_person_id_cto_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."cto_persons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cto_persons" ADD CONSTRAINT "cto_persons_client_id_cto_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."cto_clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cto_sessions" ADD CONSTRAINT "cto_sessions_person_id_cto_persons_id_fk" FOREIGN KEY ("person_id") REFERENCES "public"."cto_persons"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cto_access_log_client_at" ON "cto_access_log" USING btree ("client_id","at");--> statement-breakpoint
CREATE INDEX "cto_access_log_person_at" ON "cto_access_log" USING btree ("person_id","at");--> statement-breakpoint
CREATE INDEX "cto_challenge_expires" ON "cto_challenges" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "cto_credential_id" ON "cto_credentials" USING btree ("credential_id");--> statement-breakpoint
CREATE INDEX "cto_credential_person" ON "cto_credentials" USING btree ("person_id");--> statement-breakpoint
CREATE UNIQUE INDEX "cto_magic_link_hash" ON "cto_magic_links" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "cto_magic_link_person_created" ON "cto_magic_links" USING btree ("person_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "cto_person_email" ON "cto_persons" USING btree ("email");--> statement-breakpoint
CREATE INDEX "cto_person_client" ON "cto_persons" USING btree ("client_id");--> statement-breakpoint
CREATE UNIQUE INDEX "cto_session_hash" ON "cto_sessions" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "cto_session_person" ON "cto_sessions" USING btree ("person_id");