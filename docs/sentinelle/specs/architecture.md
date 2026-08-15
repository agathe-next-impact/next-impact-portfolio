# Architecture — Sentinelle (option A : extension du site existant)

## Vue d'ensemble

```
                    SITE VITRINE (inchangé, statique)
                              │
                              │ lien / formulaire URL
                              ▼
┌─────────────────────────────────────────────────────────────┐
│  app/(sentinelle)/            src/sentinelle/               │
│                                                             │
│  /scan ──────────────────▶  scanner/   (détection passive)  │
│  /api/sentinelle/scan        │                              │
│                              ▼                              │
│  /api/sentinelle/stripe   [ Neon Postgres / Drizzle ]       │
│  /admin/sentinelle           ▲          ▲                   │
│  /espace (client)            │          │                   │
│                          collectors/  matching/             │
│                          (Inngest     (SQL/TS               │
│                           crons)      déterministe)         │
│                              │          │                   │
│                              ▼          ▼                   │
│                          redaction/ ──▶ alerts (draft)      │
│                          (API Claude)      │                │
│                                            ▼                │
│                          admin validation ──▶ emails/       │
│                                              (React Email   │
│                                            + SMTP Google)   │
└─────────────────────────────────────────────────────────────┘
```

## Arborescence cible (dans le repo existant)

```
app/
  (site)/                      # existant — NE PAS TOUCHER
  (sentinelle)/
    scan/page.tsx              # page publique du scanner
    scan/[id]/page.tsx         # rapport de scan (après capture email)
    admin/sentinelle/page.tsx  # file de validation (protégée)
    admin/sentinelle/digests/page.tsx
    espace/page.tsx            # espace client magic-link (phase 5)
  api/
    sentinelle/
      scan/route.ts            # POST { url } → scanId (job async)
      scan/[id]/route.ts       # GET statut + résultat
      stripe/webhook/route.ts
      inngest/route.ts         # endpoint Inngest
src/
  sentinelle/
    db/
      schema.ts                # schéma Drizzle (voir data-model.md)
      client.ts                # connexion Neon
      migrations/
    scanner/
      index.ts                 # scanSite(url) → ScanResult
      detectors/               # wordpress.ts, hosting.ts, frontend.ts
      fingerprints.ts          # signatures de détection (données, pas code)
    collectors/
      index.ts
      wpscan.ts                # CVE via API WPScan/Wordfence Intelligence
      releases.ts              # versions core + plugins (api.wordpress.org)
      endoflife.ts             # endoflife.date
    matching/
      index.ts                 # matchIntelToStacks() → alerts draft
      versions.ts              # comparaison semver / plages affectées
    redaction/
      index.ts                 # generateAlertText(), generateDigestBlocks()
      prompts.ts               # charge verdict-system-prompt
      guard.ts                 # validation zod de la sortie LLM
    emails/
      AlertEmail.tsx           # gabarit React Email
      DigestEmail.tsx
      config.ts                # lecture des SENTINELLE_SMTP_* (pure, testée)
      send.ts                  # transport SMTP Google + sendSentinelleMail()
    billing/
      stripe.ts                # checkout, portal, webhook handlers
    inngest/
      client.ts
      functions/               # crons : collect-daily, build-digests, scan-async
inngest.config.ts
drizzle.config.ts
.env.example
```

## Flux principaux

### Flux 1 — Scan public (acquisition)
1. Visiteur poste une URL sur `/scan`
2. `POST /api/sentinelle/scan` crée un enregistrement `scans` (statut pending)
   et déclenche l'event Inngest `scan.requested` → réponse immédiate avec scanId
3. La fonction Inngest exécute `scanSite(url)` (fetch HTML, endpoints publics,
   headers), croise avec `intel_items` connus, stocke le résultat
4. Le front poll `GET /api/sentinelle/scan/[id]` et affiche le résumé
5. Rapport détaillé : email requis → enregistrement `leads` → affichage complet
   + CTA abonnement (Stripe Checkout, fiche pré-remplie depuis le scan)

### Flux 2 — Veille quotidienne (le produit)
1. Cron Inngest quotidien : chaque collecteur insère dans `intel_items`
   (idempotent, clé d'unicité source+external_id)
2. `matchIntelToStacks()` : jointure intel × stack_items actifs → crée `alerts`
   en draft pour chaque client concerné (unicité client+intel)
3. Pour chaque draft : `generateAlertText()` appelle l'API Claude avec le
   contexte borné → texte + verdict proposés, validés par zod, stockés
4. L'admin liste les drafts ; validation humaine → statut validated
5. Envoi SMTP Google → statut sent, horodaté

### Flux 3 — Newsletter bimensuelle
1. Cron Inngest deux fois par mois (le 1er et le 15) : pour chaque client actif,
   assemblage des blocs 1/2/5 depuis la base (état du stack, delta depuis le
   numéro précédent, radar) — sans LLM
2. Blocs 3/4 (veille contextualisée, reco du numéro) : génération LLM en draft
3. Relecture/édition dans l'admin → envoi

   La relecture humaine reste obligatoire (règle 4) : à 24 numéros par an et par
   client, c'est elle qui borne le nombre de clients servables, pas la technique.

## Décisions verrouillées

- **Pas d'envoi automatique** au MVP (règle 4 du CLAUDE.md)
- **Polling simple** pour le scan (pas de websockets — inutile à ce stade)
- **Magic link** pour l'espace client (pas de mots de passe) — phase 5
- **Envoi par SMTP Google** (décision du 2026-08-15, remplace Resend et le
  sous-domaine dédié) : Gmail n'expédie que sous le compte authentifié ou un
  alias « Envoyer en tant que » vérifié, donc `veille@next-impact.digital` et
  non `sentinelle.next-impact.digital`. DKIM à activer dans la console
  Workspace. Transport et variables propres au produit — voir plan §10
- **Offre à palier unique — 19 €/mois** (décision du 2026-08-15, remplace la
  grille 29 €/79 € ci-dessous) : alertes sécurité/obsolescence au fil de l'eau
  + **newsletter bimensuelle**, deux envois par mois (le 1er et le 15), tous
  blocs compris. `clients.plan` ne porte plus qu'une valeur (`veille`) et ne
  filtre donc plus rien : ne pas écrire de branchement dessus tant qu'il n'y a
  qu'un palier.
  Conséquence sur le modèle : `digests.period` passe de `"2026-08"` à
  `"2026-08-1"` / `"2026-08-2"`, sans quoi l'index unique
  `(clientId, period)` rejetterait le second envoi du mois. Le calcul de cette
  clé vit dans `src/sentinelle/newsletter/period.ts`, testé.
  ~~Palier 29 € : alerts sécurité/obsolescence + digest court (blocs 1-2).
  Palier 79 € : + veille contextualisée + reco du mois (blocs 3-4).~~ Abandonné.
