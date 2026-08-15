# Scanner passif — spécification

## Principe et limites (juridique inclus)

Le scanner lit **uniquement des éléments publics** : le HTML servi, les
en-têtes HTTP, et une liste blanche fermée d'endpoints publics standard.
Interdits : test actif de vulnérabilité, énumération agressive, contournement
d'authentification, charge anormale (max ~8 requêtes par scan, User-Agent
identifiable "SentinelleBot (next-impact.digital)").
Le rapport affiché mentionne : "analyse fondée sur les éléments publics de
votre site".

## Détections (detectors/)

### wordpress.ts
Entrées analysées, dans l'ordre, arrêt dès que suffisant :
1. HTML de la home : `meta name="generator"`, chemins `/wp-content/themes/{slug}/`
   et `/wp-content/plugins/{slug}/` dans les assets, paramètres `?ver=X.Y.Z`
2. `GET /wp-json/` : présence (confirme WP), champ version si exposé
3. `GET /feed/` : `<generator>` avec version
4. Thème : slug depuis le chemin + tentative `style.css` du thème (Version:)

Sortie par composant : `{ type, slug, label, version|null, confidence: high|medium|low }`
- La version d'un plugin déduite d'un `?ver=` est `confidence: medium`
  (peut être la version du site, pas du plugin) — l'afficher comme "détectée"
  et la faire confirmer à l'onboarding.

### hosting.ts
- En-têtes : `server`, `x-powered-by`, headers spécifiques (o2switch, OVH,
  Cloudflare, Vercel, Netlify…) — table de signatures dans `fingerprints.ts`
- Résolution DNS/reverse si disponible en environnement d'exécution, sinon
  headers uniquement (rester compatible serverless)

### frontend.ts
- Next.js (`__NEXT_DATA__`, `/_next/`), React, autres frameworks — utile pour
  les prospects non-WordPress : le rapport dit alors "site non WordPress,
  surveillance via fiche déclarative" et oriente vers l'onboarding manuel.

## Limites à afficher honnêtement dans le rapport

- Seuls les plugins chargés côté public sont détectables (typiquement 50-70 %)
- La version exacte peut être masquée par des plugins de sécurité
- Le rapport le dit : "X composants détectés — votre stack complet sera
  affiné à l'activation de la surveillance"
  → la limite du scan devient l'argument de l'abonnement (fiche déclarative).

## Exécution

- Fonction Inngest `scan-async` (event `scan.requested`) : timeout confortable,
  retries, résultat écrit dans `scans.result`
- Front : POST → scanId → polling GET toutes les 1,5 s → affichage progressif
- Rate limiting sur la route POST (IP) : éviter l'abus du scanner public
- Croisement immédiat avec `intel_items` existants pour enrichir le rapport
  ("2 composants ont des mises à jour disponibles, 1 a une faille connue")
