DROP INDEX "cto_person_email";--> statement-breakpoint
CREATE INDEX "cto_person_email" ON "cto_persons" USING btree (lower("email"));