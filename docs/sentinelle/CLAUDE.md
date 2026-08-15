# CLAUDE.md — Projet Sentinelle (Next Impact Digital)

## Ce qu'est ce projet

Sentinelle est un produit de veille automatisée par abonnement, adossé au site
vitrine existant next-impact.digital (Next.js App Router, statique, déployé sur
Vercel). Il surveille le stack web des clients (WordPress d'abord) et leur
envoie des alertes et un digest mensuel avec verdict (🟢/🟠/🔴).

Modèle : option A — extension du repo existant, backend adossé, le site vitrine
reste statique et performant.

## Règles d'architecture NON NÉGOCIABLES

1. **Le site vitrine reste intact.** Aucune modification des pages marketing
   existantes sans demande explicite. Les Core Web Vitals du site sont un
   argument commercial : aucune logique Sentinelle ne doit s'exécuter dans le
   rendu des pages publiques existantes.
2. **Isolation du code Sentinelle** pour permettre une extraction future en
   sous-domaine : tout le code produit vit dans `src/sentinelle/` (logique) et
   `app/(sentinelle)/` (routes). Aucun import depuis le code vitrine vers
   `src/sentinelle/`, jamais.
3. **Le LLM ne connaît rien, il reçoit tout.** La couche rédaction (API Claude)
   ne doit jamais pouvoir affirmer un fait absent de son contexte d'entrée.
   Le matching intel × stack est du code SQL/TypeScript déterministe, pas du LLM.
4. **Aucune alerte ne part sans validation humaine.** Statut obligatoire :
   draft → validated → sent. L'envoi automatique direct est interdit au MVP.
5. **Scan passif uniquement.** Le scanner ne lit que les éléments publics
   (HTML, headers, endpoints publics WP). Aucun test actif de vulnérabilité,
   aucun brute-force de chemins au-delà de la liste blanche définie dans les specs.
6. **Extensibilité 3 cercles.** Tout objet surveillé est un `stack_item` typé.
   Ajouter la veille SaaS (cercle 2) ou concurrentielle (cercle 3) = nouveaux
   types + nouveaux collecteurs, jamais de refonte du modèle.

## Stack imposée

- Next.js App Router (version du repo existant) + TypeScript strict
- Postgres via **Neon** + **Drizzle ORM** (pas de Prisma)
- Tâches de fond : **Inngest** (crons + steps + retries)
- Emails : **SMTP Google** (nodemailer, transport propre au produit) + gabarits
  **React Email** rendus en HTML (gabarits = composants versionnés).
  Écart assumé au pack, décidé le 2026-08-15 : Resend est abandonné, le compte
  Google qui sert déjà au site envoie aussi la veille. L'isolation, elle, ne
  bouge pas — `src/sentinelle/emails/` a ses propres variables
  (`SENTINELLE_SMTP_*`) et n'appelle jamais `lib/sendMail.ts`.
- Paiement : **Stripe** (Checkout + customer portal + webhooks)
- Validation runtime : **zod** sur toutes les entrées externes (API, webhooks, réponses LLM)
- Pas de nouvelle lib UI : réutiliser le design system du site existant

## Conventions

- Langue du code : anglais. Langue des contenus client : français.
- Un module = un dossier dans `src/sentinelle/` avec son index.ts exportant l'API publique du module.
- Toute fonction de collecteur est idempotente (relançable sans doublons — clé d'unicité en base).
- Secrets uniquement via variables d'environnement, jamais en dur. Fichier `.env.example` tenu à jour.
- Tests : vitest sur le matching (déterministe, critique) et les parseurs de scan. Le reste : pragmatique.
- Migrations Drizzle générées et commitées (`drizzle-kit generate`), jamais de push direct en prod.

## Ordre d'implémentation

Suivre les prompts numérotés dans `prompts/` dans l'ordre. Ne pas anticiper une
phase suivante. Chaque phase se termine par un livrable vérifiable (voir la
définition de fini en fin de chaque prompt).

- Phase 1 : fondations (DB, schéma, structure de dossiers)
- Phase 2 : scanner public + page de scan + capture email
- Phase 3 : collecteurs + matching + rédaction LLM
- Phase 4 : admin de validation + envoi (SMTP Google)
- Phase 5 : Stripe + onboarding + espace client minimal

## Fichiers de référence

- `specs/architecture.md` — vue d'ensemble, flux, arborescence cible
- `specs/data-model.md` — schéma Drizzle complet commenté
- `specs/scanner.md` — détection passive : quoi, comment, limites
- `prompts/verdict-system-prompt.md` — le prompt système de la couche rédaction
