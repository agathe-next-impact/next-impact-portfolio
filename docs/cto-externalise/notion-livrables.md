# Livrables CTO — l'atelier Notion et son raccordement

Où s'écrivent les livrables de l'offre « Expert technique externalisé »
(ex-« CTO externalisé », ADR-010 ; identifiants `cto` du code inchangés), et par quel chemin
ils arrivent dans l'espace client (`app/(cto)/espace-direction`).

Périmètre : le modèle, le raccordement et la synchronisation, en place pour la
base Clients (création, état, services des accompagnements), la base Personnes
(qui a accès, § 6), les bases de livrables — dont Documents avec leurs pièces
jointes, Prestations et Paiements (§ 7) —, les lettres de veille, les éditions du
pipeline « Veilles clients » (§ 8), les audits (§ 9) et les propositions (§ 10). Le Cron
quotidien est branché (§ 4 de `espace-client-mise-en-place.md`). Procédure
d'accès, suivi technique, dossier de restitution et digest hebdomadaire :
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
                                                  ↓
                                         npm run cto:notify  →  e-mail « il y a du nouveau »
```

La synchro écrit, la notification prévient : deux commandes, deux moments
(§ 4).

**Un client n'est jamais invité dans Notion.** Ces bases contiennent les
lignes de tous les clients ; la seule surface qui leur est destinée est l'espace
en ligne, cloisonné par personne.

## 2. Les bases de l'atelier

Elles vivent sous la page **PILOTAGE → Direction technique — clients**, dans le
teamspace NEXT IMPACT.

**La base Veille porte trois champs obligatoires**, et c'est ce qui la sépare
d'une revue de presse : `Ce qui change` (le fait, daté), `Source` (l'URL qui le
prouve) et `Ce que ça implique` (ce que le fait change pour CE client). Sans le
troisième, on facture un flux RSS ; sans le second, rien n'est défendable devant
un dirigeant qui décide dessus. `Nature` distingue la note mensuelle de l'alerte
à chaud, cette dernière étant réservée au palier Direction (`CTO_TIER_ROWS`).

| Base | Ce qu'elle porte | Livrables couverts (`lib/cto-externalise.ts`) |
| --- | --- | --- |
| **Clients** | un accompagnement par fiche : sa création, son état, son palier | — |
| **Décisions** | arbitrages rendus et options écartées | relevé de décisions, registre des évolutions |
| **Roadmap** | chantiers datés, budgétés, et opportunités | roadmap, revue d'opportunité |
| **Cartographie** | outils, fournisseurs, contrats, accès, échéances | cartographie du système, budget à trois ans |
| **Veille** | les signaux isolés, entre deux lettres | alerte à chaud |
| **Lettres** | les lettres de veille, corps compris | note mensuelle, veille dédiée |
| **Documents** | pièces opposables | revue de devis, plan de continuité, dossier de restitution |
| **Prestations** | missions commandées, tarif, avancement, livraison | — (§ 7) |
| **Paiements** | l'échéancier de chaque prestation | — (§ 7) |
| **Personnes** | qui a accès à quel espace | — (§ 6) |
| **Audits** | un audit remis par ligne, qui pointe sa page de mission | audit complet (§ 9) |
| **Propositions** | une proposition remise par ligne, qui pointe sa page | — (§ 10) |
| **Aperçus** | une maquette ou un site en développement par ligne, avec son accès | — (§ 11) |

Huit livrables pour sept bases de contenu : trois regroupements portent une décision. Clients et Personnes ne portent pas de livrable, elles décident qui voit quoi ; Paiements suit ses prestations.

**Décisions absorbe le registre des évolutions.** Un arbitrage rendu et une
proposition écartée ont la même forme — un objet, une date, un motif, une
alternative. La colonne `Nature` les distingue. Deux bases auraient dupliqué le
schéma pour dupliquer la saisie.

**Les lettres ne sont pas des livrables**, et c'est la troisième décision. Une
lettre se remplace au lieu de s'empiler — on ne corrige pas l'édition d'août en
février, on publie celle de février — et elle s'adresse à une *portée* plutôt
qu'à un client : la générale existe en un seul exemplaire pour tout le monde.
Elle a donc sa propre table, `cto_letters`, non append-only et sans rattachement
client à l'écriture. Voir § 5.

**Le budget à trois ans n'est pas une base, c'est une vue.** Il se déduit de
`Coût annuel` sur Cartographie (vue « Budget à trois ans », groupée par type).
Un budget ressaisi à côté de la carte diverge de la carte au premier
renouvellement de contrat.

### Deux charnières

L'atelier se raccorde à deux endroits, et il ne faut pas les confondre.

**Vers la base Postgres**, par la fiche *Clients* elle-même (ci-dessous) :
c'est ce qui décide *dans quel espace* une ligne atterrit.

**Vers la « Base des fiches organisation »**, par la relation `Organisation` :
c'est ce qui décide *qui est* ce client. La fiche organisation vit hors de
l'atelier (PILOTAGE → Veille personnalisée → Fiches organisation) et reste la
source de vérité de la raison sociale exacte et du **pack de rattachement**. À
chaque balayage, les deux sont recopiés dans `cto_clients` ; les ressaisir dans
la base Clients les ferait diverger, et c'est toujours la copie qu'on oublie de
mettre à jour.

Un accompagnement sans fiche organisation fonctionne : il reçoit la lettre
générale et la sienne, mais aucune sectorielle. La synchro le signale une fois
par balayage.

### La charnière vers l'espace

**Une fiche de *Clients* est un accompagnement.** Au balayage, toute fiche
qu'aucun accompagnement ne revendique encore en crée un dans `cto_clients`, et
le rapport imprime son UUID (« nouvel accompagnement créé »). Le lien entre
les deux est l'identifiant de la page Notion, conservé en base
(`notion_page_id`) et jamais réécrit dans Notion. La synchro suit ensuite la
relation `Client` de chaque ligne jusqu'à sa fiche, et sait dans quel espace la
déposer. Procédure complète d'ouverture : § 3.1 de
`espace-client-mise-en-place.md`.

Conséquence : une fiche créée pour essayer crée un vrai accompagnement — sauf
en **`préparation`**. Cette valeur d'`État`, propre à l'atelier et sans
équivalent en base, dit à la synchro d'attendre : ni accompagnement, ni
personnes, ni livrables tant qu'elle n'est pas passée à `actif`. Sur une fiche
déjà rattachée, elle est sans effet (le rapport le dit) : pour geler un
accompagnement existant, c'est `suspendu`.

**`À compléter`** (formule) liste ce qui manque à une fiche : `Palier`,
`Organisation`, une personne, et ce que chaque service coché exige (ID WP
Umbrella pour Suivi technique, site et contact pour Veille technique, ligne du
pipeline pour Veille personnalisée). La vue **Onboarding** montre les fiches en
préparation ou incomplètes. La synchro ne lit pas cette colonne.

**`ID espace` n'est plus qu'un raccord.** Cette colonne texte servait autrefois
à coller l'UUID imprimé par `npm run cto:invite`. Elle ne sert plus qu'à une
chose : si un accompagnement a été créé en CLI (`--entreprise`) avant sa fiche,
y coller son UUID fait que la synchro l'**adopte** au lieu d'en créer un
second. Sur une fiche déjà rattachée, elle est ignorée.

**`Services` compose l'espace.** Colonne à choix multiple : Direction
technique, Suivi technique, Actions en cours, Veille personnalisée,
Prestations en cours, Audit, Veille technique. Recopiée dans `cto_clients.services` (valeurs de code,
`SERVICE_CODES` dans `map.ts`), elle décide des entrées de la barre latérale
(`src/cto/espace/sections.ts`, une entrée peut dépendre de plusieurs
services). L'accueil, « À traiter », la veille générale et le contact sont
toujours visibles ; « Propositions » dès qu'une proposition est publiée. **Vide = affichage historique** : l'espace
montre alors toute section qui a du contenu, comme avant les services — c'est
ce qui permet d'ajouter la colonne sans que les accompagnements existants
perdent leurs sections. Un service coché mais encore vide s'affiche avec un
état « en préparation ». Un libellé inconnu est ignoré et signalé au rapport.

**`Veille — organisation`** relie la fiche à sa ligne du pipeline « Veilles
clients » : ses éditions au statut Envoyé deviennent des lettres
personnalisées (§ 8).

**`État`, `Palier` et `ID projet WP Umbrella` commandent.** À chaque balayage,
leurs valeurs sont recopiées dans `cto_clients` dès qu'elles diffèrent, et un
changement d'état est daté. Les deux premières reprennent les valeurs
techniques (`referent` / `direction` / `audit`, `actif` / `suspendu` / `restitution` /
`clos`) : pas de table de correspondance à écrire, et rien à retraduire en
lisant. Suspendre, restituer ou clore un accompagnement se fait donc ici
(§ 3.3 de `espace-client-mise-en-place.md`). Une colonne vide laisse la base
décider ; une colonne remplie écrase tout changement fait en SQL au balayage
suivant.

`ID projet WP Umbrella` est l'identifiant numérique du site chez WP Umbrella.
Il alimente la section Suivi technique : le Cron relève chaque nuit le site
correspondant (§ 6 de `espace-client-mise-en-place.md`). Il n'est jamais saisi
par le client ni lu dans une URL : l'espace le retrouve depuis la session de la
personne connectée.

**`Lien vers l'espace`** porte l'URL où le client se connecte
(`https://next-impact.digital/espace-direction`). Elle est **identique sur
toutes les fiches, volontairement** : l'espace n'a qu'une seule adresse pour
tous les accompagnements, l'identité se joue à la connexion (lien magique ou
passkey), jamais dans l'URL. Ce n'est donc ni une donnée par client ni une
synchro à écrire — juste un pense-bête pour ne pas avoir à la retaper depuis
Notion. À coller à la main sur toute nouvelle fiche.

### Le statut « Proposition » de la Roadmap

Un chantier que l'on **propose** au client, prêt à lancer sur son accord, prend
le statut **Proposition** (quelle que soit sa `Nature`). Il ouvre la roadmap de
l'espace (première colonne) et figure dans **Actions → À arbitrer**, étiqueté
« Chantier proposé » ; il n'entre ni dans les missions ni dans la frise tant
que la réponse n'est pas donnée. Accord obtenu : passer à « Décidé » ou « À
venir ». Refus : « Écarté ». À ne pas confondre avec une **proposition
commerciale** (base Propositions, groupe Contrats), qui engage un contrat.

### Deux colonnes, deux questions

`Publié` décide de la **visibilité**, `Affichage` du **placement**. Les
confondre serait tentant et faux : une ligne peut mériter d'être consultable
sans mériter la page d'accueil.

`Publié` est le seul interrupteur de visibilité, sur chaque base de
contenu (Paiements exceptée, § 7). Décochée, la ligne n'existe pas pour le client. Décochée **après**
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
   → *Connexions* → l'intégration. Toutes les bases de la page héritent du partage (pas « Audits et Roadmap »,
« Veilles clients » ni CRM → Propositions, à partager à part : § 8 à 10). Sans ce
   geste l'API répond 404 sur tout : chez Notion, le partage n'est jamais
   implicite.
3. **Poser les variables** — neuf obligatoires (le jeton et huit bases), plus
   cinq facultatives (Prestations, Paiements, Éditions de veille, Audits,
   Propositions), listées avec leurs
   valeurs sur la page Notion elle-même. Les identifiants de base ne sont pas des secrets, mais ils
   n'ont pas leur place dans le dépôt : ils vivent dans `.env.local` et dans
   Vercel, portée Production.

```bash
CTO_NOTION_TOKEN=ntn_…
CTO_NOTION_DB_CLIENTS=…
CTO_NOTION_DB_DECISIONS=…
CTO_NOTION_DB_ROADMAP=…
CTO_NOTION_DB_CARTOGRAPHIE=…
CTO_NOTION_DB_VEILLE=…
CTO_NOTION_DB_LETTRES=…
CTO_NOTION_DB_PERSONNES=…
CTO_NOTION_DB_DOCUMENTS=…
# Facultatives : vides, la base est ignorée avec une ligne au rapport.
CTO_NOTION_DB_PRESTATIONS=…
CTO_NOTION_DB_EDITIONS=…
CTO_NOTION_DB_AUDITS=…
CTO_NOTION_DB_PROPOSITIONS=…
CTO_NOTION_DB_PAIEMENTS=…
```

**Une base facultative n'arrête rien.** Toute base ajoutée après la mise en
production entre par `OPTIONAL_KINDS` (`config.ts`) : sa variable absente, elle
est sautée et le rapport le dit. La rendre obligatoire bloquerait la synchro
entière, livrables existants compris, jusqu'à ce que quelqu'un pense à poser
la variable sur Vercel.

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
inchangé et retiré — puis la liste des points à regarder. Ceux qui
reviendront :

| Ce que dit le rapport | Ce qui s'est passé |
| --- | --- |
| « nouvel accompagnement créé (uuid) » | Une nouvelle fiche Clients. L'UUID sert à inviter la première personne. |
| « publiée sans client » | Une ligne cochée `Publié` dont la relation *Client* est vide. |
| « rattachée à N clients » / « fiche client non résoluble » | Relation *Client* ambiguë ou cassée : la ligne est ignorée. |
| « synchro suspendue depuis l'admin » | La synchro de ce client est en pause (`/admin-cto`) : ses livrables ne bougent pas. |
| « l'atelier ne rend aucune ligne publiée » | Le garde-fou de retrait de masse s'est déclenché. |
| « nouvel accès créé » | Une nouvelle ligne dans Personnes (§ 6). |
| « a changé de client dans Notion : ignoré » | La relation `Client` d'une personne déjà créée a bougé : rien n'est appliqué, à trancher en SQL. |
| « colonne « X » absente (renommée en « Y » ?) » / « de type …, attendu … » | Le contrôle de schéma a écarté la base (ci-dessous). |
| « l'adresse … figure sur N lignes » | Doublon dans Personnes : une ligne est retenue, les autres ignorées (§ 6). |
| « désigne la fiche organisation de … » | Deux fiches Clients pour une organisation : la seconde est ignorée pour elle. |
| « a changé de client dans Notion : laissé chez son accompagnement actuel » | Relation `Client` modifiée sur un livrable publié : le Cron ne le déplace pas (ci-dessous). |

**Deux niveaux.** Le rapport marque « à traiter » (le `!` de la commande, le
cadre rouge de l'écran) ce qui touche un accès ou un rattachement : accès
révoqué ou fermé, ligne sans client ou à plusieurs clients, doublon, paiement
orphelin, base écartée. Le reste est à regarder. Seul le « à traiter » nouveau
vaut un e-mail, et seulement après le Cron (§ 4 de
`espace-client-mise-en-place.md`, journal des balayages).

**Le contrôle de schéma.** Avant de lire les lignes d'une base, la synchro
compare son schéma aux colonnes que le code lit (`src/cto/notion/schema.ts`).
Une colonne absente — presque toujours renommée — ou changée de type, et la
base n'est **ni écrite ni retirée** ce tour-ci : le rapport la nomme, et cite
la colonne qui l'a sans doute remplacée quand il n'y en a qu'une candidate.
Sans ce contrôle, renommer « Motif » réécrivait toutes les décisions avec un
motif vide, et le client lisait « corrigé le… » sur chacune. Pour la base
**Clients**, dont tout dépend, le balayage entier s'arrête avant d'avoir rien
écrit. Ajouter une colonne dans l'atelier ne demande rien ; en lire une
nouvelle dans `map.ts` demande de la déclarer dans `schema.ts` (un test le
rappelle). Exception : `Affichage` est facultative — sans elle tout part en
archive, et c'est le cas de la base Documents, qui ne l'a jamais eue.

**Un livrable ne change pas de client en pleine nuit.** Modifier la relation
`Client` d'une ligne déjà publiée la ferait passer d'un espace à l'autre ; par
erreur, c'est le contenu de A ouvert à B. Le Cron ne l'applique donc pas : la
ligne reste chez son accompagnement actuel et le point est « à traiter »
(un e-mail, la première nuit). Le déplacement se fait depuis un balayage lancé
à la main — `/admin-cto/pilotage` → Synchro Notion, ou `npm run cto:sync` —
dont le rapport le dit (« passe à un autre accompagnement »). Si le changement
était une erreur, rétablir la relation dans Notion suffit.

**Qui garde quoi quand deux fiches se disputent.** Une organisation ou une
ligne « Veille — organisation » ne se relie qu'à un accompagnement. En cas de
doublon, la fiche la plus ancienne la garde ; une fiche **close** passe après
toutes les autres, pour qu'un client revenu sous une nouvelle fiche reprenne son
organisation.

Le garde-fou de retrait de masse mérite une explication. Si une base ne rend plus rien alors que
l'espace en affiche plusieurs, la cause la plus probable est une colonne
renommée ou une case décochée par accident, pas une dépublication générale. La
synchro n'exécute donc aucun retrait dans ce cas et le dit. Après vérification,
`--forcer` lève la retenue.

À blanc, le rapport dit aussi ce qu'il **aurait** fait sur les fiches :
« nouvel accompagnement — rien créé », « serait rattachée à son accompagnement
existant », « serait mise à jour : état → … ».

**Un balayage est idempotent.** Relancer la commande sur un atelier inchangé
n'écrit rien : chaque livrable porte l'empreinte de son contenu, et une version
n'est ajoutée que si l'empreinte a bougé. C'est ce qui permet au Cron quotidien
de tourner sans faire enfler l'historique.

**Le Cron fait le même travail, tout seul.** `/api/cto/cron` appelle
`syncFromNotion()` chaque nuit à 4 h UTC, en même temps que le ménage des accès
(§ 4 de `espace-client-mise-en-place.md`). Pour publier tout de suite après un
comité : `/admin-cto/pilotage` → **Synchro Notion** (« À blanc », puis
« Synchroniser »), ou la commande. Le bouton n'expose pas `--forcer` : un
retrait de masse reste un geste de terminal.

**Mettre un client en pause.** Sur `/admin-cto`, « Mettre en pause » gèle ses
livrables : rien n'est créé, corrigé ni retiré chez lui tant que la pause dure.
Sa fiche continue d'être lue (`État`, `Palier`). Voir § 5 de
`espace-client-mise-en-place.md`.

### Ce que le client est prévenu

**La synchro ne prévient personne.** Ni la commande ni le Cron n'envoient
d'e-mail : synchroniser plusieurs fois pendant qu'on relit un livrable doit
rester invisible pour le client. La notification est une commande à part,
lancée quand le contenu est prêt à être vu :

```bash
npm run cto:notify -- --a-blanc   # dit qui serait notifié, n'envoie rien
npm run cto:notify                # envoie
```

Elle ne lit jamais Notion, seulement ce qui est déjà en base : pour chaque
accompagnement `actif`, ce qui a été publié ou corrigé depuis **sa** dernière
notification (`cto_clients.last_notified_at`). **Un** e-mail par personne
active, même si trois bases ont bougé. Il annonce des nombres et un lien,
jamais un titre : aucun contenu de l'espace ne voyage par courrier, sinon la
boîte du client devient une archive ni révocable, ni journalisée, ni effaçable.

Un accompagnement `suspendu` ou en `restitution` n'est pas notifié et sa date
n'avance pas : à la réactivation, il reçoit d'un coup ce qu'il a manqué.

### Ce que le client voit changer

Cocher `Publié` fait apparaître le livrable au balayage suivant. Le corriger
écrit une version de plus, et l'espace affiche alors « corrigé le … » à côté de
sa date : une correction silencieuse vaudrait moins qu'une correction datée.
Décocher `Publié` le retire de l'espace sans effacer son histoire.

À sa connexion suivante, un bandeau lui dit ce qui a bougé depuis la fois
précédente, et chaque ligne concernée porte « Nouveau » ou « Corrigé ». La
mention de correction est cliquable : elle ouvre l'historique du livrable,
version par version, champ par champ. C'est là que le choix append-only cesse
d'être une décision d'architecture pour devenir une preuve utilisable.

## 5. Les lettres de veille

Une ligne de la base **Lettres** est une lettre ; son **corps est le contenu de
la page**, écrit dans Notion comme n'importe quelle page. Les colonnes ne portent
que ce qui sert à la classer et à la distribuer.

### Qui reçoit quoi

| `Portée` | Destinataires | À remplir |
| --- | --- | --- |
| `Générale` | tous les accompagnements | rien d'autre |
| `Sectorielle` | les clients dont la fiche organisation porte ce `Pack` | `Pack` sur la lettre |
| `Personnalisée` | le client relié | `Client` |

Le `Pack` d'une lettre sectorielle reprend **exactement** les valeurs du
`Pack de rattachement` des fiches organisation (`pack-industrie-btp.md` et les
autres). Une seule liste, tenue à un seul endroit : traduire l'une en l'autre
aurait créé un troisième vocabulaire à maintenir.

**Ne jamais cocher les clients un par un sur une générale.** Elle n'a aucun
destinataire par construction : c'est la lecture qui décide qui la voit. Les
cocher reviendrait à recopier un texte de trente kilo-octets par client, et à
devoir repasser partout à la moindre correction — sans compter l'oubli garanti
au troisième mois.

### La fenêtre de six mois

Le client accède aux six derniers mois. La borne est appliquée **en base**, pas à
l'affichage : une lettre plus ancienne ne parvient à aucune page, donc aucune ne
peut la laisser fuir. Sortir de la fenêtre équivaut à une dépublication — la
lettre quitte l'espace, sa ligne reste, et elle reviendrait si la fenêtre
s'élargissait.

### Ce qui coûte cher

Lire une lettre, c'est descendre dans ses blocs : une requête par bloc porteur
d'enfants. La synchro lit donc les propriétés d'abord, écarte ce qui est hors
fenêtre, et ne descend que dans ce qui reste. L'empreinte du corps évite de
repayer ce prix à chaque balayage quotidien.

Le corps est stocké en **blocs typés**, ni HTML ni Markdown : du HTML obligerait
la page cliente à injecter une chaîne venue d'ailleurs, du Markdown ajouterait un
analyseur au rendu. Le vocabulaire est court — titres, paragraphes, listes,
citation, filet, code. Un bloc d'un autre type est ignoré plutôt que rendu de
travers ; les directives éditoriales n'utilisent ni tableau ni colonne.

## 6. La base Personnes — qui a accès

Une ligne de la base **Personnes** est un accès. Quatre colonnes : `Nom`,
`Email`, `Rôle` (texte libre), `Client` (relation, une seule). Une cinquième,
`Révoquée`, le coupe.

**Variable : `CTO_NOTION_DB_PERSONNES`**, à poser dans `.env.local` et sur
Vercel (portée Production). Sa valeur est l'identifiant de la base, affiché
avec les autres sur la page Notion « Direction technique — clients », section
« Base Personnes ». Elle est **obligatoire** : sans elle, `configurationIssue()`
bloque toute la synchro, livrables compris (la commande s'arrête sur
« Variables manquantes », le Cron répond `synchro: { ignoree }`).

**Remplace `npm run cto:invite` comme voie normale.** Ajouter une ligne crée
l'accès au balayage suivant, exactement comme une fiche *Clients* crée un
accompagnement (§ 2). La commande garde deux usages, et seulement deux :
envoyer le tout premier lien de connexion — la synchro n'envoie jamais
d'e-mail, § 4 — et créer un accès en local sans toucher l'atelier de
production.

**Une ligne, un accès ; une adresse peut en porter plusieurs** (décision du
2026-09-29, migration `0022_adresse_partagee`). Une personne se reconnaît par
sa page Notion. La même adresse peut figurer sur plusieurs lignes : un
consultant suivi chez deux clients (une ligne par client), ou une boîte
partagée par deux personnes d'une même entreprise. Chaque ligne est un accès
distinct, avec ses passkeys et ses sessions. Depuis l'écran de connexion,
l'adresse reçoit un seul e-mail avec un lien et un code par espace ; les
passkeys portent le nom de l'entreprise pour rester distinguables sur le
téléphone. Une personne ne se relie toujours qu'à UN client par ligne : pour
deux clients, deux lignes.

**L'adresse ne sert plus qu'à adopter, et jamais d'un client à l'autre.** Une
personne créée avant ce mécanisme (`cto:invite`, sans fiche Notion), ou dont la
ligne a disparu, est **adoptée** par une ligne portant la même adresse ET le
même client, au lieu d'être dupliquée. C'est le même geste que l'adoption des
accompagnements par `ID espace`. Un changement d'adresse dans Notion est
appliqué et signalé.

**`Révoquée` va dans les deux sens.** Cocher coupe l'accès au balayage
suivant : sessions fermées, passkeys refusées, comme la révocation manuelle
(§ 3.5 de `espace-client-mise-en-place.md`), dont elle est désormais une
seconde porte. Décocher restaure l'accès — symétrique, à la manière du retour
d'un accompagnement à `actif` après une suspension. ⚠️ Corollaire assumé :
un décochage accidentel dans Notion rouvre un accès aussi silencieusement
qu'un cochage le ferme.

**Changer la relation `Client` d'une personne déjà créée est ignoré, pas
appliqué.** C'est l'asymétrie du fichier (`src/cto/notion/persons.ts`) : la
révocation *rétrécit* l'accès, sûre par défaut ; réassigner une personne à un
autre client pourrait au contraire lui *ouvrir* les données d'une autre
entreprise d'un simple glisser-déposer de relation. Le rapport de synchro le
signale ; rien ne bouge tout seul. Un transfert reste un geste SQL délibéré.

**Supprimer une ligne coupe l'accès** (décision du 2026-09-27). Une personne
dont la ligne disparaît de *Personnes* (supprimée, mise à la corbeille) est
révoquée comme si la case était cochée, sessions comprises. Un accompagnement
dont la fiche disparaît de *Clients* est **clos** : accès fermé, livrables
retirés de l'espace. Restaurer la ligne ou la fiche depuis la corbeille Notion
rouvre au balayage suivant (même page ; pour une fiche, repasser « État » à
« actif »). Garde-fou : si une base ne rend plus **aucune** ligne alors que
plusieurs accès sont ouverts, rien n'est révoqué ni clos sans `--forcer` — une
base vide ressemble davantage à un partage retiré qu'à un ménage. Chaque
révocation ou fermeture figure au rapport de synchro ; lancer `--a-blanc`
d'abord pour la voir venir.

## 7. Documents, prestations et paiements

### Documents : la pièce est rapatriée

La base **Documents** est synchronisée comme les autres, avec une étape de
plus : la pièce de la colonne « Fichier » est **téléchargée pendant le
balayage** et rangée en base (`cto_files`), car le lien que rend l'API Notion
expire au bout d'une heure. Le livrable ne garde qu'une référence (nom, type,
taille, empreinte SHA-256) dans `payload.fichier`.

- **L'empreinte fait partie du livrable** : remplacer le PDF dans Notion, titre
  inchangé, écrit une version de plus, datée, visible du client.
- **Une seule pièce par document.** Plusieurs pièces sur une ligne : la
  première est publiée, le rapport le signale.
- **15 Mo au plus.** Au-delà, le document est publié sans sa pièce et le
  rapport le dit.
- **Pas d'hébergeur de fichiers.** Un stockage public (Vercel Blob) rendrait un
  audit lisible par quiconque obtient l'URL. En base, la pièce ne sort que par
  `/espace-direction/fichiers/<empreinte>`, qui vérifie la session ET
  l'appartenance à l'accompagnement (`fileBelongsTo`), et répond 404 sinon.
  Un document retiré retire sa pièce avec lui.

### Prestations : ce qui a été commandé

La base **Prestations** (sous « Direction technique — clients ») porte les
missions vendues : `Prestation`, `Client`, `Statut` (À venir / En cours /
Terminée / Suspendue), `Début`, `Échéance` (date de livraison, reprise dans le
calendrier), `Montant`, `Avancement` (0 à 1, vide = non suivi), `Devis` (lien),
`Détail`, `Publié`, `Affichage`. Même mécanique que les autres livrables
(append-only, corrections datées). Distincte de la Roadmap à dessein : un
chantier est ce que le système demande, une prestation est ce que le client a
commandé.

Le client lit ses prestations dans **Contrats → Missions en cours**, ouvert par le
service « Prestations en cours » de sa fiche (et par lui seul : jamais au
contenu, régime historique compris). C'est le même écran que
`/admin-cto/pilotage/prestations` (`espace-direction/prestations.tsx`) : tarifs,
avancement, devis, règlements et reste à régler ; l'administration y ajoute le
nom de l'accompagnement et le lien Notion. Les prestations restent hors des
notifications, de l'historique et du dossier de restitution.

### Paiements : l'échéancier d'une prestation

Une prestation peut se régler en plusieurs fois (acompte, situations, solde).
La base **Paiements** (même page) porte un règlement par ligne : `Paiement`
(le libellé, « Acompte 50 % »), `Prestation` (une seule), `Montant` (HT),
`Date` (d'encaissement si reçu, prévue sinon), `Statut` (Prévu / Reçu). La
colonne `Paiements`, côté Prestations, en est le miroir.

- Pas de case `Publié` : un règlement suit sa prestation. Il se lit avec
  elle, dans l'administration comme dans Contrats → Missions en cours du client :
  règlements, réglé, reste dû, et « Reste à régler » en tête.
- Encaisser un règlement = passer son statut à Reçu et dater. La prestation
  écrit alors une version de plus, comme pour toute correction.
- Base facultative (`CTO_NOTION_DB_PAIEMENTS`). Illisible un tour : les
  prestations ne sont ni écrites ni retirées ce tour-là, plutôt que d'effacer
  les échéanciers. Une prestation sans règlement saisi n'entre pas dans le
  reste à encaisser.

## 8. Les éditions du pipeline « Veilles clients »

La veille personnalisée d'un accompagnement est produite par le pipeline
« Veilles clients » (prompts A, A-bis, B et leurs trois validations
manuelles, inchangés). Ses éditions arrivent dans l'espace direction comme
**lettres personnalisées**, sans ressaisie :

1. Sur la fiche *Clients*, relier `Veille — organisation` à la ligne du
   pipeline (base « Organisations — pipeline et activation »).
2. Poser `CTO_NOTION_DB_EDITIONS` (identifiant de la base « Éditions de
   veille », noté sur la page Notion) et **partager aussi la page « Veilles
   clients » avec l'intégration** (menu `•••` → *Connexions*).

À chaque balayage, les éditions au statut **Envoyé** des organisations reliées
sont reprises dans la fenêtre de six mois : titre, date d'édition, corps de la
page. Brouillon et Relu restent dans l'atelier du pipeline. Elles passent dans
le même balayage que la base Lettres (sinon le retrait des lettres absentes les
effacerait à chaque passage), et si la base des éditions est illisible, **aucune
lettre personnalisée n'est retirée** ce tour-là : un retrait à tort se voit chez
le client, un retrait différé d'un jour ne se voit pas.

Un client CTO lit sa veille personnalisée **uniquement dans l'espace
direction** ; le portail signauxfaibles.io reste celui des clients veille seule.

## 9. Les audits

Un audit (prestation Audit + roadmap, kit d'audit WordPress) n'est pas écrit
dans une base de l'atelier : il vit dans sa **page de mission**, copie du modèle
« Audit technique WordPress » sous PILOTAGE → **Audits et Roadmap**, remplie par
`/publier-notion` puis relue à la main. L'espace en reçoit le **contenu entier**
(ADR-011), pas un résumé.

### Publier un audit

1. Sur la fiche *Clients* : cocher le service **Audit**. Pour un client audit
   seul, palier **audit** et état **actif** ; ajouter sa ou ses personnes dans
   *Personnes*.
2. Dans la base **Audits** (sous « Direction technique — clients »), une ligne :
   `Audit` (le titre affiché), `Client`, `Page de l'audit` (le lien de la
   page de mission, copié depuis Notion), `Date des mesures`, `Site`, et
   l'`Annexe` (l'archive des preuves du kit, 15 Mo au plus).
3. Relire la page de mission, puis cocher `Publié`. Synchroniser
   (`npm run cto:sync -- --a-blanc` d'abord), puis notifier.

Prérequis, une fois pour toutes : la page **« Audits et Roadmap »** partagée
avec l'intégration (menu `•••` → *Connexions*). Sans ce geste, la synchro
répond « page illisible » et ne publie rien.

### Ce que la synchro lit

- La page de mission donne la **synthèse** ; chaque sous-page donne une
  **partie**, dans l'ordre de la page, avec son émoji. Une sous-page de
  sous-page est ignorée et signalée.
- Colonnes, encadrés (callouts), listes, tableaux : tout est repris. Les
  colonnes sont mises à plat — elles n'existent pas sur un téléphone.
- Chaque **base inline** (SECURITE, Diagnostic, ROADMAP…) devient un tableau à
  l'endroit où elle se trouve, colonne titre d'abord, lignes dans leur ordre de
  création. Le code ne connaît aucun schéma : ajouter une base au modèle
  n'oblige à rien.
- Les **images** hébergées par Notion sont rapatriées en base (leur lien
  expire en une heure), comme l'annexe. Elles ne sortent que par la route des
  pièces jointes, qui vérifie la session et l'appartenance.

Coût : une centaine d'appels à l'API par audit, une trentaine de secondes, à
chaque balayage. L'empreinte évite d'écrire une version quand rien n'a bougé,
pas de relire.

### Ce que voit le client

La section **Audit** ouvre l'audit directement s'il est seul (la liste sinon) :
en-tête (site, date des mesures, annexe, versions), sommaire, synthèse, puis
chaque partie en entier. L'accueil le rappelle dans « Votre audit ». Corriger
la page après publication écrit une version de plus : l'historique dit quelles
parties ont changé (« Parties corrigées : Sécurité, Roadmap »), sans rejouer
des centaines de blocs.

### Des actions de l'audit à la roadmap

Les lignes de la base inline **ROADMAP** de l'audit passent dans la roadmap de
l'espace selon leur `Statut` :

| Statut dans l'audit | Dans la roadmap de l'espace |
| --- | --- |
| Proposé, Écarté | rien : une recommandation reste dans l'audit |
| Validé client | chantier « Décidé » |
| En cours | chantier « Ouvert » |
| Fait | chantier « Fait » |

« En cours » et « Fait » ne sont pas dans le modèle du kit : les ajouter aux
options de `Statut` de la base ROADMAP de la mission quand on suit ses actions
après la restitution. Phase, critère de réussite, prérequis et constats liés
passent dans le détail du chantier, avec le nom de l'audit.

**Garde-fou.** Si un audit n'a pas pu être lu en entier ce tour-ci (page non
partagée, base illisible), la roadmap ne retire rien : une action absente n'est
peut-être qu'une action pas vue. L'audit lui-même garde sa version en ligne.

## 10. Les propositions

Une proposition chiffrée (optimisation, refonte, maintenance, en heures ou en
euros) vit dans sa **page** sous CRM → **Propositions**, comme un audit vit
dans sa page de mission. L'espace en reçoit le **contenu entier** : texte,
encadrés, tableaux, bases inline (plan d'action, synthèse comparative) mises à
plat en tableaux, images rapatriées. Même lecteur que les audits
(`readAuditTree`), même doctrine : illisible ce tour-ci = ni publiée ni
retirée.

### Publier une proposition

1. Le destinataire a une fiche *Clients* (un prospect aussi : état **actif**,
   aucun service coché suffit) et au moins une ligne dans *Personnes*.
2. Dans la base **Propositions** (sous « Direction technique — clients »), une
   ligne : `Proposition` (le titre affiché), `Client`, `Page de la
   proposition` (le lien de la page, copié depuis Notion), `Date` (la remise),
   `Statut` (Envoyée, En discussion, Acceptée, Déclinée).
3. Relire la page, cocher `Publié`, synchroniser (`--a-blanc` d'abord), notifier.

Prérequis, une fois pour toutes : la page **CRM → Propositions** partagée avec
l'intégration (menu `•••` → *Connexions*). Une page de proposition rangée
ailleurs (hors de cette page) doit être partagée à part.

### Ce que voit le client

- L'entrée **Contrats → Propositions** apparaît dès qu'une proposition est
  publiée pour lui, **quels que soient ses services** — un prospect n'a rien
  souscrit. Elle ouvre la proposition directement si elle est seule.
- La lecture : statut, date de remise, versions et, tant qu'elle attend une
  réponse, les boutons « Répondre » et « En discuter » dès l'en-tête. Puis le
  document découpé à chaque **grand titre (H1)** de la page : les chapitres
  qui résument (titre contenant synthèse, recommandation, chiffrage, total,
  budget) passent **en tête, ouverts** ; les autres suivent, **repliés**. Un
  document court (moins de 25 lignes, un tableau comptant pour ses lignes) se
  lit d'un trait, dans son ordre. Un sommaire reste en vue dans la marge
  (`src/cto/espace/lecture.ts`). « Votre réponse » est redite à la fin.
- Pour écrire une proposition lisible : un H1 par chapitre, et un titre qui
  dit « Synthèse » ou « Recommandation » pour ce qui doit se lire d'abord.
- Tant que le `Statut` n'est pas Acceptée, Signée, Déclinée ou Refusée, la
  proposition est **à valider** : colonne « À valider » du bloc Contrats de
  l'accueil, pastille sur Propositions. Elle n'est **jamais** mêlée à « À
  arbitrer » ni à « Que pouvez-vous faire ? », qui ne portent que les
  opportunités de la roadmap : une proposition engage un contrat, une
  opportunité un chantier.

### Contrats : propositions et missions en cours

Le groupe **Contrats** de l'espace sépare le commercial du pilotage :
**Propositions** (ce qui attend l'accord du client) puis **Missions en cours**
(les prestations signées : tarif, avancement, règlements — ouvert par le
service « Prestations en cours »). Sur l'accueil, le bloc Contrats les met en
deux colonnes, « À valider » et « En cours ». La frontière est la signature :
une proposition acceptée quitte la colonne de gauche et revient à droite sous
la forme de sa prestation. Le groupe de la roadmap, des décisions et de l'audit
s'appelle désormais **Pilotage** (et non plus Missions) pour que le mot
« mission » ne désigne qu'une chose.

### Chaque client a un espace, la veille y est offerte

Décision du 2026-09-27.

- **Chaque fiche Clients ouvre un espace.** Vue d'ensemble, Missions en cours,
  Veille technique et Votre accompagnement sont ouvertes à tout client, sans
  service à cocher : le suivi des missions et des prestations ne demande pas
  la direction technique. Une entrée vide reste hors de la navigation.
- **La veille est offerte à l'ouverture de l'espace** : personnalisée (Signaux
  Faibles) et technique (Sentinelle). Pour un client **récurrent** (Direction
  technique, Actions en cours, Suivi technique, ou une veille cochée), elle ne
  s'arrête pas. Pour un client **ponctuel** (audit seul, prestation seule,
  rien encore), elle dure **un mois** à compter de la création de
  l'accompagnement (`src/cto/espace/veille-offerte.ts`, testé).
- **Pendant la veille offerte**, la synchro met en place Sentinelle comme si
  le service était coché — à condition que « Site surveillé » et « Contact
  veille » soient renseignés (le rapport le signale sinon).
- **À la fin du mois** : Sentinelle est désactivée ; les éditions Signaux
  Faibles datées après la fin ne deviennent plus des lettres ; celles déjà
  reçues restent lisibles. Le rapport de synchro rappelle d'**arrêter la
  production dans le pipeline** (fiche organisation), **sans délier** la
  « Veille — organisation » : délier retirerait les lettres déjà reçues. La
  carte « Prochaine étape » propose de continuer la veille (une semaine avant,
  jusqu'à un mois après).
- **L'espace reste ouvert** après la fin de la veille : seul l'état « clos »
  de la fiche le ferme.

### Votre accompagnement, Prochaine étape, sections en sommeil

Trois mécanismes pour inciter à l'étape suivante, **sans jamais afficher de
montant** (décision du 2026-09-27 : le tarif se discute en comité).

**Contrats → Votre accompagnement** (dès qu'un service est coché) : ce que le
client a (palier, engagement calculé depuis « Début du contrat » — 6 mois puis
au mois, préavis de 2 mois —, formule de suivi, mois inclus), ce que l'étape
d'après apporte (Référent après un audit seul, Direction technique après le
Référent, tel que le dit la page publique `lib/cto-externalise.ts`), ce qui peut
s'ajouter (suivi, veille personnalisée, projets ponctuels), et un seul bouton
« En parler ». La page liste aussi toutes les sections de l'espace.

**Carte « Prochaine étape »** sur l'accueil, sous Contrats : une suggestion à
la fois, la première qui s'applique, qui cite le fait qui la motive
(`src/cto/espace/suggestions.ts`, testé) :

1. une proposition sans réponse (non masquable) ;
2. les mois de suivi inclus qui se terminent sous 30 jours ;
3. des alertes critiques sur le site, sans suivi et maintenance ;
4. un audit remis, sans service Actions ni Direction technique ;
5. palier Référent et 3 opportunités ou plus à arbitrer.

« Pas maintenant » la masque 60 jours pour la personne. Jamais pour un
accompagnement suspendu, en restitution ou clos (la démo est suspendue). Les
clics « En parler » et les masquages sont journalisés (journal de l'admin, pas
celui des appareils du client).

**Sections sans information** (règle du 2026-09-27, remplace la semaine de
grâce) : une section qui n'a rien à montrer sort **tout de suite** de la barre
latérale et de la synthèse de son groupe, et revient au premier contenu. Cela
vaut aussi pour Actions (rien à traiter ni à arbitrer), Veille (ni lettre, ni
digest, ni nouvelle), Missions en cours (aucune prestation), l'état du site
(aucun relevé WP Umbrella) et la veille technique (aucun export Sentinelle).
Sa page reste ouverte et listée dans « Votre accompagnement ».

**Colonnes de la fiche Clients**, toutes facultatives :

| Colonne | Sert à |
| --- | --- |
| Début du contrat | fin d'engagement affichée |
| Formule suivi | Essentiel ou Actif, affichée dans « Votre accompagnement » |
| Fin du suivi inclus | déclencheur 2 |
| Sans suggestions | coupe la carte pour ce client (négociation en cours…) |

## 11. Les aperçus — maquettes et sites en développement

La base **Aperçus** (sous « Direction technique — clients ») porte ce que le
client peut déjà regarder : une maquette, ou le site en cours de
développement sur son adresse de test. Une ligne par version.

| Colonne | Type | Rôle |
| --- | --- | --- |
| Aperçu | titre | ce que le client ouvre (« Maquette de l'accueil », « Site de recette ») |
| Client | relation | l'accompagnement |
| Nature | sélection | `Maquette` ou `Site en développement` ; autre valeur : pas d'étiquette |
| Lien | URL | l'adresse à ouvrir |
| Identifiant | texte | l'identifiant de la protection de l'adresse de test, s'il y en a un |
| Mot de passe | texte | le mot de passe de cette protection |
| Date | date | mise en ligne de cette version ; la plus récente passe en tête |
| Note | texte | ce qu'il y a à regarder, ce qui n'est pas encore branché |
| Publié | case | comme partout |
| Affichage | sélection | facultative, comme partout (« À la une » remonte sur l'accueil) |

Base facultative (`CTO_NOTION_DB_APERCUS`), balayée comme Prestations.

**Ce que voit le client.** Une entrée **Votre site → Versions de travail**,
ouverte dès qu'une ligne est publiée, sans service à cocher, et absente
sinon. Chaque version y montre son lien (bouton « Ouvrir »), l'identifiant et
le mot de passe masqué (« Afficher », « Copier »). Une nouvelle version entre
dans « Nouveau pour vous » et dans l'e-mail de notification, qui ne cite que
la catégorie (« maquettes et versions de test »), jamais le lien ni l'accès.

**Le mot de passe.** Seulement celui de la *protection* de l'adresse de test
(accès HTTP, page protégée par mot de passe), fait pour être transmis. Jamais
un accès d'administration, d'hébergement ou de base : il est stocké en clair
dans Notion et en base. L'historique d'une version dit « Mot de passe :
modifié » sans montrer aucune des deux valeurs ; le dossier de restitution ne
reprend pas les aperçus.

**Une version remplacée se retire** (décocher « Publié ») : un lien mort ou un
mot de passe périmé laissés en ligne feraient douter du reste de l'espace.

## Fichiers

| Rôle | Fichier |
| --- | --- |
| Table append-only et ses raisons | `src/cto/db/schema.ts` (fin de fichier) |
| Lecture, écriture, empreinte, historique | `src/cto/deliverables/store.ts` |
| Forme d'un livrable, indépendante de Notion | `src/cto/deliverables/types.ts` |
| Appels HTTP et pagination Notion | `src/cto/notion/api.ts` |
| Noms des colonnes de l'atelier | `src/cto/notion/map.ts` |
| Balayage, garde-fous, rapport | `src/cto/notion/sync.ts` |
| Colonnes attendues, contrôle de schéma | `src/cto/notion/schema.ts` |
| Points à traiter / à regarder | `src/cto/notion/findings.ts` |
| Journal des balayages, e-mail d'alerte | `src/cto/admin/runs.ts`, `src/cto/db/schema.ts` — `cto_sync_runs` |
| Placement (table mutable) | `src/cto/db/schema.ts` — `cto_deliverable_placements` |
| Pages de catégorie | `app/(cto)/espace-direction/livrables/[categorie]/` |
| Commande | `scripts/cto-sync.ts` |
| Notification des publications | `src/cto/notify/store.ts`, `scripts/cto-notify.ts` |
| Balayage quotidien | `app/api/cto/cron/route.ts` |
| Lettres — table et lecture | `src/cto/letters/store.ts` |
| Lettres — blocs Notion | `src/cto/notion/blocks.ts` |
| Lettres — balayage | `src/cto/notion/letters.ts` |
| Lettres — affichage | `app/(cto)/espace-direction/lettre.tsx` |
| Lettres — grille (toutes sources : formes reconnues dans le corps) | `src/cto/letters/structure.ts`, `app/(cto)/espace-direction/lettre-grille.tsx` |
| Affichage | `app/(cto)/espace-direction/livrables.tsx` |
| Historique d'un livrable | `app/(cto)/espace-direction/historique.tsx` |
| Aperçus — écran et accès masqué | `app/(cto)/espace-direction/apercus.tsx`, `acces.tsx` |
| Personnes — balayage | `src/cto/notion/persons.ts` |
| Personnes — schéma | `src/cto/db/schema.ts` — `cto_persons.notion_page_id` |
| Invitation (voie de secours) | `scripts/cto-invite.ts` |
| Services → sections | `src/cto/espace/sections.ts`, `map.ts` (`SERVICE_CODES`) |
| Pièces jointes (rapatriement, lecture, appartenance) | `src/cto/files/store.ts` |
| Téléchargement d'une pièce | `app/(cto)/espace-direction/fichiers/[id]/route.ts` |
| Éditions du pipeline de veille | `src/cto/notion/letters.ts` (`syncEditions`) |
| Audits — lecture de la page de mission | `src/cto/notion/audit.ts` |
| Audits — balayage, pont vers la roadmap | `src/cto/notion/sync.ts` (`syncAudits`), `map.ts` (`auditActionInput`) |
| Audits — affichage | `app/(cto)/espace-direction/vues.tsx` (`VueAudit`, `VueLectureAudit`), `lettre.tsx` (`CorpsLettre`) |
