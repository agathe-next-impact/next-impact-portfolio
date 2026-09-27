# Les alertes Sentinelle dans Notion

Depuis 2026-09 (ADR à ajouter dans `docs/decisions.md`), une alerte de veille
(CVE, fin de support) ne se rédige plus dans l'admin du site : elle se rédige,
se relit et se valide dans une page de la base Notion **« Sentinelle —
Alertes »**. Ce document décrit le schéma exact que le code lit et écrit, pour
créer cette base à la main.

## Pourquoi Notion et pas l'admin

La plupart des abonnés Sentinelle ne passent jamais par un accompagnement
CTO : ils s'abonnent seuls, depuis le scan public. Ils n'ont donc pas de fiche
dans la base Notion « Clients » de l'atelier CTO — c'est pour ça que cette base
est **dédiée à Sentinelle**, avec sa propre intégration, séparée de celle du
CTO, et que le rattachement à un client se fait par du texte simple (nom,
e-mail, site), pas par une relation Notion.

## Créer l'intégration et la base

1. **Créer une intégration** — notion.so/profile/integrations, type
   **interne**, nom « Sentinelle ». **Jamais** celle du CTO (`CTO_NOTION_TOKEN`) :
   les deux produits restent isolés, chacun avec son jeton — même principe que
   le SMTP propre à Sentinelle (`SENTINELLE_SMTP_*`, jamais `NODEMAILER_*`).
2. **Créer la base** « Sentinelle — Alertes », avec les colonnes ci-dessous.
3. **Partager la base** avec l'intégration (menu `•••` → *Connexions*) — sans
   ce geste, l'API répond 404 sur tout.
4. **Poser les deux variables** (`.env.local` puis Vercel) :
   `SENTINELLE_NOTION_SECRET` (le jeton de l'intégration) et
   `SENTINELLE_NOTION_DB_ALERTES` (l'identifiant dans l'URL de la base).

## Les colonnes

| Colonne | Type | Qui l'écrit | Rôle |
| --- | --- | --- | --- |
| `Nom` | Titre | matching (placeholder), rédaction | Ce que l'admin liste, l'objet de l'e-mail |
| `Client` | Texte | matching | Raison sociale ou nom — lecture seule pour un humain |
| `Site` | URL | matching | Le site surveillé |
| `Composant` | Texte | matching | Le composant concerné et sa version |
| `Verdict` | Select : `Rouge` `Orange` `Vert` `Info` | matching (proposé), **relecture humaine** | Gravité annoncée au client |
| `Statut` | Select : `Brouillon` `Validée` `Envoyée` `Ecartée` | matching (Brouillon), **relecture humaine** | Commande tout : voir plus bas |
| `Corps` | Texte enrichi | rédaction, **relecture humaine** | Le message |
| `Ce que ça change` | Texte enrichi | rédaction, **relecture humaine** | Ce que ça change pour ce client |
| `Action recommandée` | Texte enrichi | rédaction, **relecture humaine** | Doit commencer par un verbe |
| `Faisable seul` | Case à cocher | rédaction, **relecture humaine** | Le client peut-il agir sans prestataire ? |
| `Effort estimé` | Texte | rédaction, **relecture humaine** | « 15 min », « 0,5 j de prestation »… |
| `Source` | URL | matching | Le fait de veille d'origine, pour vérifier |
| `Sévérité` | Texte | matching | Telle que la source l'écrit (low/medium/high/critical) |
| `Envoyée le` | Date | la synchro, à l'envoi | Jamais à la main |
| `Clé` | Texte | matching | Rapprochement technique (`clientId:intelItemId`) — ne pas modifier |
| `Id Client` | Texte | matching | UUID Postgres du client — ne pas modifier, sert à l'envoi |

Les noms sont lus **exactement tels quels** (`src/sentinelle/notion/schema.ts`,
`PROPS`). Une colonne renommée ne fait pas planter la synchro — elle se met à
lire `null` pour cette colonne, silencieusement pour Notion, mais visiblement
dans les journaux de la fonction `sentinelle-alert-sync`.

Les options des deux select doivent porter **exactement** ces libellés
(accents et majuscules compris) : le code fait la correspondance par le texte,
pas par un identifiant Notion.

## Ce que dit `Statut`

C'est la seule colonne qui déclenche quelque chose — la règle 4 du produit
(« aucune alerte ne part sans validation humaine ») tient tout entière dans ce
select :

- **Brouillon** — le matching vient de créer la page, ou la rédaction n'a pas
  encore écrit le texte (`Corps` vide). Rien ne se passe.
- **Validée** — posé par un humain, après relecture. À la prochaine passe de
  `sentinelle-alert-sync` (toutes les demi-heures), l'e-mail part, sauf si :
  l'abonnement est résilié, l'adresse est injoignable, ou le contenu est
  incomplet (titre, corps ou action recommandée vides) — dans ces trois cas,
  la page reste Validée et la tentative est journalisée, à corriger à la main.
- **Envoyée** — écrit par la synchro, jamais par un humain. `Envoyée le` se
  remplit au même moment. Toute correction après ce point n'a plus d'effet :
  l'e-mail est déjà parti.
- **Ecartée** — posé par un humain : l'alerte ne partira pas. Pour vingt-neuf
  CVE sur le même paquet, Notion permet de sélectionner les lignes et de
  changer leur Statut d'un coup — pas besoin d'un geste dédié côté produit.

Remettre une alerte Envoyée ou Ecartée à Validée la refait retenter à la passe
suivante — il n'y a pas de statut « figé ».

## Ce que l'admin du site montre encore

`/admin/sentinelle` reste un tableau de bord en lecture seule, utile pour voir
d'un coup d'œil qui attend quoi ; chaque ligne renvoie vers sa page Notion
(« Ouvrir dans Notion → »). Il ne reste plus de formulaire de relecture ni de
bouton de validation ou d'envoi dans l'admin — tout se passe désormais dans
Notion.
