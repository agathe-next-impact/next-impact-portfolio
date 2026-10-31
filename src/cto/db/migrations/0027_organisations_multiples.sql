ALTER TABLE "cto_clients" ADD COLUMN "sectors" text[];--> statement-breakpoint
ALTER TABLE "cto_clients" ADD COLUMN "organisations" text[];--> statement-breakpoint
-- Un client existant n'a qu'une organisation : sa liste de packs est son pack actuel.
UPDATE "cto_clients" SET "sectors" = ARRAY["sector"] WHERE "sector" IS NOT NULL;
