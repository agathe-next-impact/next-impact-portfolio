# SEO/GEO : actions hors code (audit du 2026-09-28)

Ce qui ne se règle pas dans le dépôt.

## Vercel → Project next-impact → Settings → Domains

- `next-impact.digital` (apex) redirige vers `www.next-impact.digital` en **307**
  (code de redirection non renseigné, Vercel applique le temporaire). Passer le
  code à **308** (permanent). L'API disponible ne permet que d'ajouter un
  domaine, pas de modifier celui-ci : à faire dans le tableau de bord.
- `agat.dev` → `www.agat.dev` (307, Vercel), puis `www.agat.dev` →
  `www.next-impact.digital` (308, `next.config.mjs`, fait dans le code). Pour un
  seul saut, faire pointer directement `agat.dev` et `www.agat.dev` vers
  `www.next-impact.digital` en 308 dans Domains.

## Search Console et Bing Webmaster Tools

- Aucune balise de vérification dans le code (`verification` absent des
  métadonnées). Si la propriété n'est pas validée par DNS, fournir les jetons
  Google et Bing : ils s'ajoutent dans `app/[locale]/layout.tsx`
  (`metadata.verification`).
- Après déploiement : soumettre `/sitemap.xml` à nouveau, demander la
  suppression des URL `/en/…` (elles répondent désormais en 301) et vérifier
  l'indexation de `/scan` et `/espace-client`.
