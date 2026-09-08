# Livrables CTO — l'atelier Notion et son raccordement

Où s'écrivent les livrables de l'offre « CTO externalisé », et par quel chemin
ils arrivent dans l'espace client (`app/(cto)/espace-direction`).

Périmètre : le modèle, le raccordement et la synchronisation, en place pour les
trois bases textuelles. Ce qui reste — la base Documents, le Cron, l'export de
restitution — est listé en § 5. Procédure d'accès :
`espace-client-mise-en-place.md`.

---

## 1. Le sens de circulation

Notion est l'atelier, pas la vitrine. La page `/espace-direction` lit **Postgres**
et n'appelle jamais l'API Notion pendant une requête client. Trois raisons, dans
l'ordre où elles comptent :

- **L'espace ne doit pas dépendre de Notion.** Une indisponibilité de leur côté,
  ou la limite de trois requêtes par seconde de leur API, ne doit pas se voir
  chez le client.
- **Un atelier contient des brouillons.** Rien ne s'affiche tant que la case
  `Publié` n'est pas cochée. La séparation entre écrire et publier n'existe que
  s'il y a deux endroits.
- **La restitution suppose la possession.** `CTO_TERMS` promet des livrables qui
  « se lisent sans moi » : ils doivent vivre dans la base du site, exportables,
  et non dans un espace tiers dont l'accès se coupe.

```
Notion (atelier)  →  npm run cto:sync  →  cto_deliverables  →  /espace-direction
```

**Un client n'est jamais invité dans Notion.** Les cinq bases contiennent les
lignes de tous les clients ; la seule surface qui leur est destinée est l'espace
en ligne, cloisonné par personne.

## 2. Les cinq bases

Elles vivent sous la page **PILOTAGE → Direction technique — clients**, dans le
teamspace NEXT IMPACT.

| Base | Ce qu'elle porte | Livrables couverts (`lib/cto-externalise.ts`) |
| --- | --- | --- |
| **Clients** | la charnière avec la base Postgres | — |
| **Décisions** | arbitrages rendus et options écartées | relevé de décisions, registre des évolutions |
| **Roadmap** | chantiers datés, budgétés, et opportunités | roadmap, revue d'opportunité |
| **Cartographie** | outils, fournisseurs, contrats, accès, échéances | cartographie du système, budget à trois ans |
| **Documents** | pièces opposables | revue de devis, plan de continuité, dossier de restitution |

Huit livrables, cinq bases : deux regroupements portent une décision.

**Décisions absorbe le registre des évolutions.** Un arbitrage rendu et une
proposition écartée ont la même forme — un objet, une date, un motif, une
alternative. La colonne `Nature` les distingue. Deux bases auraient dupliqué le
schéma pour dupliquer la saisie.

**Le budget à trois ans n'est pas une base, c'est une vue.** Il se déduit de
`Coût annuel` sur Cartographie (vue « Budget à trois ans », groupée par type).
Un budget ressaisi à côté de la carte diverge de la carte au premier
renouvellement de contrat.

### La charnière

Sur chaque fiche de **Clients**, la colonne **`ID espace`** porte l'UUID de
`cto_clients`, celui qu'imprime `npm run cto:invite`. C'est le seul point de
contact entre les deux mondes : la synchro suit la relation `Client` d'une
ligne, lit l'`ID espace` de la fiche, et sait dans quel espace la déposer. Une
fiche sans `ID espace` ne remonte rien, silencieusement.

`Palier` et `État` reprennent les valeurs techniques de `cto_clients`
(`referent` / `direction`, `actif` / `suspendu` / `restitution` / `clos`) : pas
de table de correspondance à écrire, et rien à retraduire en lisant. Ces deux
colonnes sont un **rappel**, pas une commande : l'état fait foi en base et se
change en SQL (§ 3.2 de `espace-client-mise-en-place.md`).

### Deux colonnes, deux questions

`Publié` décide de la **visibilité**, `Affichage` du **placement**. Les
confondre serait tentant et faux : une ligne peut mériter d'être consultable
sans mériter la page d'accueil.

`Publié` est le seul interrupteur de visibilité, sur les quatre bases de
contenu. Décochée, la ligne n'existe pas pour le client. Décochée **après**
publication, elle quitte l'espace à la synchro suivante — retirée, pas effacée :
l'historique versionné la conserve. C'est le geste de rétractation, et il ne
demande rien d'autre.

`Affichage` range ce qui est déjà publié :

| Valeur | Où la ligne apparaît |
| --- | --- |
| `À la une` | Sur l'accueil de l'espace, et dans la page de sa catégorie. |
| `Archive`, ou vide | Seulement dans la page de sa catégorie. |

**Opt-in strict** : sans valeur, une ligne reste en archive. Le défaut inverse
aurait fait de l'accueil un déversoir qu'il aurait fallu vider ligne à ligne à
mesure que l'accompagnement avance.

**Ranger n'est pas corriger.** Basculer une ligne de `À la une` vers `Archive`
n'écrit aucune version et ne fait apparaître aucun « corrigé le… » chez le
client : le placement vit dans sa propre table (`cto_deliverable_placements`),
mutable, à côté de l'historique append-only. C'est la raison d'être de cette
seconde table — rangée dans la première, la mise en avant aurait obligé à
choisir entre polluer l'historique à chaque rangement et ne jamais voir un
rangement remonter.

Chacune de ces bases porte une vue « En ligne chez le client » ou équivalente :
c'est la vérification à faire avant un comité, pour voir exactement ce que le
client voit.

## 3. Raccorder l'application

1. **Créer l'intégration** — notion.so/profile/integrations, type **interne**,
   capacité **lecture de contenu seule** : la synchro ne réécrit jamais dans
   Notion. Le jeton commence par `ntn_`.
2. **Partager la page mère** — sur « Direction technique — clients », menu `•••`
   → *Connexions* → l'intégration. Les cinq bases héritent du partage. Sans ce
   geste l'API répond 404 sur tout : chez Notion, le partage n'est jamais
   implicite.
3. **Poser les variables** — six, listées avec leurs valeurs au bas de la page
   Notion elle-même. Les identifiants de base ne sont pas des secrets, mais ils
   n'ont pas leur place dans le dépôt : ils vivent dans `.env.local` et dans
   Vercel, portée Production.

```bash
CTO_NOTION_TOKEN=ntn_…
CTO_NOTION_DB_CLIENTS=…
CTO_NOTION_DB_DECISIONS=…
CTO_NOTION_DB_ROADMAP=…
CTO_NOTION_DB_CARTOGRAPHIE=…
CTO_NOTION_DB_DOCUMENTS=…
```

**Épingler `Notion-Version: 2022-06-28`.** Depuis la version `2025-09-03`, une
base expose des *data sources* et l'interrogation passe par
`POST /v1/data_sources/{id}/query` au lieu de `POST /v1/databases/{id}/query`.
Les identifiants ci-dessus sont ceux des bases ; leurs équivalents data source
figurent sur la page Notion, pour le jour où la migration s'imposera. Elle ne
s'impose pas ici : une base, une source.

## 4. Faire tourner la synchro

```bash
npm run cto:sync -- --a-blanc   # lit tout, n'écrit rien, imprime le rapport
npm run cto:sync                # applique
npm run cto:sync -- --forcer    # autorise un retrait de masse (voir plus bas)
```

**Commencer par `--a-blanc`.** `.env.local` pointe sur la base de production
(avertissement du § 1.2 de `espace-client-mise-en-place.md`) : un rapport se
relit, une écriture non. Le balayage à blanc fait exactement le même travail de
lecture et compte ce qu'il aurait écrit.

Le rapport donne, par base, ce qui a été créé, mis à jour, restauré, laissé
inchangé et retiré — puis la liste des points à regarder. Les trois qui
reviendront :

| Ce que dit le rapport | Ce qui s'est passé |
| --- | --- |
| « n'a pas d'ID espace » | Une fiche Clients sans UUID. Ses lignes ne remontent nulle part. |
| « publiée sans client » | Une ligne cochée `Publié` dont la relation *Client* est vide. |
| « l'atelier ne rend aucune ligne publiée » | Le garde-fou de retrait de masse s'est déclenché. |

Ce dernier mérite une explication. Si une base ne rend plus rien alors que
l'espace en affiche plusieurs, la cause la plus probable est une colonne
renommée ou une case décochée par accident, pas une dépublication générale. La
synchro n'exécute donc aucun retrait dans ce cas et le dit. Après vérification,
`--forcer` lève la retenue.

**Un balayage est idempotent.** Relancer la commande sur un atelier inchangé
n'écrit rien : chaque livrable porte l'empreinte de son contenu, et une version
n'est ajoutée que si l'empreinte a bougé. C'est ce qui permet au Cron quotidien
de tourner sans faire enfler l'historique.

**Le Cron fait le même travail, tout seul.** `/api/cto/cron` appelle
`syncFromNotion()` chaque nuit à 4 h UTC, en même temps que le ménage des accès
(§ 4 de `espace-client-mise-en-place.md`). La commande reste utile pour publier
tout de suite après un comité, sans attendre la nuit.

### Ce que le client voit changer

Cocher `Publié` fait apparaître le livrable au balayage suivant. Le corriger
écrit une version de plus, et l'espace affiche alors « corrigé le … » à côté de
sa date : une correction silencieuse vaudrait moins qu'une correction datée.
Décocher `Publié` le retire de l'espace sans effacer son histoire.

## 5. Ce qu'il reste à coder

1. **La base Documents.** Le type `document` existe dans le schéma et la
   correspondance des colonnes est écrite ; seule la base manque à
   `SYNCED_KINDS` (`src/cto/notion/config.ts`), le temps de traiter les fichiers
   joints. Les URL que l'API Notion renvoie pour un fichier **expirent au bout
   d'une heure** : stocker le lien ne produirait que des liens morts. Il faut
   rapatrier le fichier (Vercel Blob) et servir le sien.
2. **L'export de restitution.** `history()` (`src/cto/deliverables/store.ts`)
   rend déjà l'historique complet d'un livrable, version par version. C'est la
   matière de l'export ; il reste à en faire un PDF ou une archive.

## Fichiers

| Rôle | Fichier |
| --- | --- |
| Table append-only et ses raisons | `src/cto/db/schema.ts` (fin de fichier) |
| Lecture, écriture, empreinte, historique | `src/cto/deliverables/store.ts` |
| Forme d'un livrable, indépendante de Notion | `src/cto/deliverables/types.ts` |
| Appels HTTP et pagination Notion | `src/cto/notion/api.ts` |
| Noms des colonnes de l'atelier | `src/cto/notion/map.ts` |
| Balayage, garde-fous, rapport | `src/cto/notion/sync.ts` |
| Placement (table mutable) | `src/cto/db/schema.ts` — `cto_deliverable_placements` |
| Pages de catégorie | `app/(cto)/espace-direction/livrables/[categorie]/` |
| Commande | `scripts/cto-sync.ts` |
| Balayage quotidien | `app/api/cto/cron/route.ts` |
| Affichage | `app/(cto)/espace-direction/livrables.tsx` |
