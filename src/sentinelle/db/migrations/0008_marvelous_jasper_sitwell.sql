ALTER TABLE "scans" ADD COLUMN "audit_email" text;--> statement-breakpoint
ALTER TABLE "scans" ADD COLUMN "audit_sent_at" timestamp;