ALTER TABLE "cto_persons" ADD COLUMN "invited_at" timestamp;--> statement-breakpoint
-- Rattrapage : une personne qui a déjà reçu un lien, ouvert une session ou
-- enregistré une passkey a été accueillie. Sans cela, le premier « Prévenir »
-- lui enverrait une bienvenue à contretemps.
UPDATE "cto_persons" p SET "invited_at" = now()
WHERE EXISTS (SELECT 1 FROM "cto_magic_links" m WHERE m."person_id" = p."id")
   OR EXISTS (SELECT 1 FROM "cto_sessions" s WHERE s."person_id" = p."id")
   OR EXISTS (SELECT 1 FROM "cto_credentials" c WHERE c."person_id" = p."id");
