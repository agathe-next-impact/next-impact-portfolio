# Pack de mise en œuvre — Sentinelle (option A)

Pack agent pour construire Sentinelle avec Claude Code, adossé au site
next-impact.digital existant. Structure exactement calquée sur ton offre
"Pack de mise en œuvre IA" : specs + prompts + agent, prêt à produire.

## Contenu

```
CLAUDE.md                        # mémoire projet : règles, stack, conventions
specs/
  architecture.md                # vue d'ensemble, flux, arborescence cible
  data-model.md                  # schéma Drizzle complet commenté
  scanner.md                     # spec du scanner passif (et ses limites légales)
prompts/
  phases.md                      # les 5 prompts d'exécution, dans l'ordre
  verdict-system-prompt.md       # LIVRABLE PRODUIT : le prompt de la couche rédaction
```

## Mode d'emploi

1. Copie `CLAUDE.md`, `specs/` et `prompts/` à la racine du repo du site
   (si un CLAUDE.md existe déjà, fusionne — la section "Règles NON
   NÉGOCIABLES" doit rester intacte).
2. Prépare les comptes : Neon (base), Inngest, Stripe (prix récurrent en mode
   test), WPScan (clé API). Pour l'envoi d'e-mails, pas de compte à ouvrir :
   SMTP Google avec un mot de passe d'application (décision du 2026-08-15,
   voir plan §10 — Resend est abandonné).
3. Ouvre le repo dans Claude Code et exécute les prompts de `prompts/phases.md`
   phase par phase. Ne passe à la suivante qu'après avoir vérifié la
   "définition de fini" de la phase en cours — c'est toi qui valides, pas
   l'agent.
4. Entre chaque phase : commit, et vérifie que le site vitrine est inchangé
   (build + contrôle visuel).

## Rappels d'arbitrage (décisions déjà prises, ne pas rouvrir dans le code)

- Aucun envoi automatique sans validation humaine au MVP
- Le LLM rédige, il ne sait rien : toute donnée vient de la base
- Scan passif uniquement, liste blanche fermée
- Code Sentinelle isolé (`src/sentinelle/`, `app/(sentinelle)/`) pour
  extraction future en sous-domaine
- Cercles 2 et 3 : prévus dans le modèle (types saas / competitor_url),
  implémentés plus tard — ne pas coder leurs collecteurs maintenant

## Estimation

Phases 1-2 : ~1 semaine · Phase 3 : ~1 semaine · Phases 4-5 : ~1 semaine,
en solo avec Claude Code, incluant tests et recette. Coûts de fonctionnement
au lancement : < 50 €/mois (Neon et Inngest gratuits, envoi d'e-mails compris
dans le Google Workspace déjà payé, WPScan ~30 €).

## Après le build

- Documente le processus de construction : c'est l'étude de cas vivante du
  pack de mise en œuvre IA à 1 900 € (le produit prouve la méthode).
- Le prompt `verdict-system-prompt.md` est un actif à faire évoluer : chaque
  correction faite dans l'admin (generatedText vs finalText) indique quoi
  affiner.
