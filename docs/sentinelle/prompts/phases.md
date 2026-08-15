# Prompts de mise en œuvre — à exécuter dans Claude Code, dans l'ordre

Usage : ouvrir le repo du site dans Claude Code (le CLAUDE.md et specs/ du pack
copiés à la racine), puis coller le prompt de la phase en cours. Ne lancer une
phase que lorsque la définition de fini de la précédente est vérifiée.

---

## Phase 1 — Fondations

Lis CLAUDE.md, specs/architecture.md et specs/data-model.md avant d'écrire quoi
que ce soit.

Mets en place les fondations Sentinelle dans ce repo, sans toucher au site
existant :
1. Installe et configure : drizzle-orm, drizzle-kit, @neondatabase/serverless,
   zod, inngest. Crée drizzle.config.ts et .env.example (DATABASE_URL,
   ANTHROPIC_API_KEY, RESEND_API_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET,
   WPSCAN_API_KEY, ADMIN_PASSWORD).
2. Implémente src/sentinelle/db/schema.ts strictement conforme à
   specs/data-model.md, ainsi que db/client.ts. Génère la migration initiale.
3. Crée l'arborescence complète de src/sentinelle/ (modules vides avec index.ts
   et types partagés dans src/sentinelle/types.ts).
4. Crée la route app/api/sentinelle/inngest/route.ts et inngest/client.ts avec
   une fonction de healthcheck.
5. Implémente matching/versions.ts (comparaison tolérante + parsing de plages
   "< 6.7", ">= 2.0 < 2.4") avec tests vitest exhaustifs, y compris les cas
   non-semver des plugins WordPress ("6.6.20", "2.8.4.1", "1.0-beta").

Définition de fini : migration appliquée sur Neon, `npm run test` vert,
healthcheck Inngest répond, le site existant build et s'affiche à l'identique.

---

## Phase 2 — Scanner public

Lis specs/scanner.md.

1. Implémente src/sentinelle/scanner/ conformément à la spec : detectors
   wordpress.ts, hosting.ts, frontend.ts, fingerprints.ts, index.ts exposant
   scanSite(url): Promise<ScanResult>. Respecte strictement la liste blanche
   d'endpoints et la limite de requêtes. Tests vitest des parseurs sur des
   fixtures HTML (crée 3 fixtures : WP typique, WP durci, site Next.js).
2. Fonction Inngest scan-async (event "scan.requested") : exécute scanSite,
   croise avec intel_items, écrit scans.result.
3. Routes : POST /api/sentinelle/scan (zod, rate limit par IP, crée le scan,
   émet l'event, renvoie scanId) et GET /api/sentinelle/scan/[id].
4. Pages app/(sentinelle)/scan : formulaire URL, état "analyse en cours"
   (polling 1,5 s), résumé des composants détectés avec niveau de confiance,
   capture email pour le rapport détaillé (écrit scans.leadEmail), rapport
   complet avec les limites honnêtes prévues par la spec et CTA vers
   l'abonnement (lien placeholder pour l'instant). Réutilise le design system
   existant du site, mode sombre inclus.

Définition de fini : un scan de bout en bout fonctionne en local sur 2 vrais
sites WordPress, le rapport s'affiche, l'email est capturé en base.

---

## Phase 3 — Collecteurs, matching, rédaction

1. Implémente collectors/wpscan.ts (API WPScan ; si WPSCAN_API_KEY absent,
   fallback Wordfence Intelligence), collectors/releases.ts (api.wordpress.org
   core + plugins présents dans au moins un stack_item actif),
   collectors/endoflife.ts. Tous idempotents via l'index (source, external_id).
2. Fonction Inngest collect-daily (cron 06:00 Europe/Paris) : exécute les
   collecteurs en steps séparés (retry indépendant), puis le matching.
3. Implémente matching/index.ts : requête de référence de la spec data-model,
   filtre de plage via versions.ts, création des alerts en draft. Tests vitest
   sur scénarios : version dans la plage, hors plage, version null, doublon.
4. Implémente redaction/ : chargement de prompts/verdict-system-prompt.md,
   appel API Anthropic (model configurable via env, défaut claude-sonnet-4-6),
   contexte = alerte + intel + stack_item + fiche client (secteur, notes),
   validation zod stricte du JSON de sortie (guard.ts), écriture de
   generatedText + verdict sur l'alerte. En cas de sortie invalide : un retry,
   puis statut draft avec generatedText null (l'admin rédigera).

Définition de fini : en seedant un client fictif avec 3 stack_items dont un
vulnérable connu, collect-daily produit une alerte draft rédigée et validée
par le guard.

---

## Phase 4 — Admin de validation et envoi

1. Page app/(sentinelle)/admin/sentinelle : protection simple (ADMIN_PASSWORD,
   cookie httpOnly). Liste des alertes draft groupées par client, aperçu du
   rendu email, actions : valider et envoyer / éditer finalText et verdict /
   rejeter (dismissed). Vue secondaire : alertes sent avec bouton "marquer
   résolue" (alimente le suivi des recos passées).
2. Implémente emails/AlertEmail.tsx en React Email : structure exacte —
   verdict visuel (pastille + libellé), titre, body, "ce que ça change pour
   vous", action recommandée avec mention DIY ou fourchette, pied fixe
   ("répondez à ce mail", lien espace client placeholder). Sobre, lisible
   client mail, cohérent avec l'identité du site.
3. emails/send.ts : wrapper Resend (from configurable via env, reply-to
   agathe@), envoi → statut sent + sentAt.
4. Fonction Inngest build-digests (cron mensuel, 1er du mois 07:00) : pour
   chaque client actif, assemble digests.blocks — health (stack_items +
   dernières versions connues), delta (alertes du mois + recos passées non
   résolues), radar (intel kind=eol à horizon 6 mois). Blocs watch/reco :
   génération LLM uniquement si plan=conseil, sinon absents. Vue admin
   digests : relecture, édition, envoi via DigestEmail.tsx.

Définition de fini : cycle complet réel sur un client test — alerte draft →
validation → email reçu en boîte ; digest draft → relecture → email reçu.

---

## Phase 5 — Stripe et onboarding

1. billing/stripe.ts : deux prix récurrents (env : STRIPE_PRICE_SURVEILLANCE,
   STRIPE_PRICE_CONSEIL), création de session Checkout depuis le rapport de
   scan (scanId en metadata), webhook /api/sentinelle/stripe/webhook :
   checkout.session.completed → création du client + stack_items depuis
   scans.result (source scanned) ; customer.subscription.deleted → active=false.
   Vérification de signature obligatoire.
2. Onboarding post-paiement : page de complétion de fiche (plugins back-office
   non détectés, SaaS, hébergeur exact, secteur, notes) → stack_items source
   declared. Email de bienvenue automatique (React Email) récapitulant la
   fiche et le fonctionnement.
3. Espace client minimal app/(sentinelle)/espace : magic link par email
   (token signé, 15 min), liste des alertes reçues et de la fiche de stack,
   lien vers le customer portal Stripe pour gérer l'abonnement.
4. Branche le CTA du rapport de scan sur le Checkout réel.

Définition de fini : parcours complet en mode test Stripe — scan → rapport →
paiement → fiche créée → onboarding → alerte reçue. Le produit encaisse.
