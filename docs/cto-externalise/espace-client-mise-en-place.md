# Espace client CTO — mise en place, local et production

Procédure d'installation et d'exploitation de la couche d'accès de l'espace
« CTO externalisé » (`src/cto/`, `app/(cto)/espace-direction`, `app/api/cto/`).

Périmètre : **l'accès** — identités par personne, passkeys, sessions, journal —,
**l'ouverture d'un accompagnement** (§ 3.1), **la notification** des clients
(§ 3.4) et **la supervision** (§ 5). Les livrables (atelier Notion,
synchronisation, affichage) ont leur propre document : `notion-livrables.md`.
L'export de restitution, lui, reste à écrire.

---

## 0. Ce qui doit déjà exister

| Ressource | Où | Déjà en place |
| --- | --- | --- |
| Base Postgres | Neon (`DATABASE_URL`, `DATABASE_URL_UNPOOLED`) | oui, partagée avec Sentinelle |
| Envoi d'e-mails | SMTP Google (`NODEMAILER_*`) | oui, celui du site |

L'espace CTO n'ajoute **aucun service** : il pose quatorze tables préfixées
`cto_` dans la base existante (dix pour l'espace client, quatre `cto_admin_*`
pour la supervision) et envoie ses e-mails par le transport du site. La
synchronisation des livrables ajoute une dépendance à l'API Notion, en lecture
seule et hors du chemin de requête du client (`notion-livrables.md`).

---

## 1. Installation en local

### 1.1 Trois variables à ajouter dans `.env.local`

Générer le secret de signature des liens :

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

Puis, dans `.env.local` :

```bash
CTO_ACCESS_SECRET=<le secret généré ci-dessus>
CTO_RP_ID=localhost
CTO_ORIGIN=http://localhost:3000
```

`CTO_RP_ID=localhost` est **obligatoire en local** : le navigateur refuse une
passkey dont l'identifiant de partie de confiance ne correspond pas au domaine
visité. Ne jamais mettre `127.0.0.1` — une adresse IP n'est pas un identifiant
valide au sens du protocole. `localhost` est traité comme une origine sûre même
en HTTP, les passkeys y fonctionnent donc sans certificat.

### 1.2 Appliquer les migrations

```bash
npm run db:cto:migrate
```

> **Avertissement.** `DATABASE_URL` de `.env.local` pointe aujourd'hui sur la
> même base que la production. Cette commande, comme `cto:invite` plus bas, y
> écrit donc pour de vrai. Avant de manipuler des données de test, créer une
> branche Neon (Neon → Branches → New branch) et mettre **sa** chaîne de
> connexion dans `.env.local`. Les migrations se rejouent sur la branche sans
> toucher à la production.

### 1.3 Lancer, créer un accompagnement, ouvrir l'espace

```bash
npm run dev

npm run cto:invite -- \
  --entreprise "Client de test" \
  --email vous@exemple.fr \
  --nom "Votre Nom" \
  --role "Dirigeant" \
  --sans-envoi
```

`--sans-envoi` affiche le lien de connexion dans le terminal au lieu de
l'envoyer : en local, inutile de faire transiter un e-mail. La commande imprime
aussi l'identifiant de l'accompagnement créé — le garder, il sert à rattacher les
personnes suivantes.

Ouvrir le lien affiché. Vous arrivez connecté sur `/espace-direction`.

`--entreprise` crée l'accompagnement sans fiche Notion : c'est le raccourci d'un
essai local, pas le chemin d'un vrai client. En production, l'accompagnement
naît de sa fiche Notion (§ 3.1).

### 1.4 Vérifier que la chaîne complète fonctionne

Dans cet ordre, chaque étape validant une brique différente :

1. **Appareils → « Enregistrer cet appareil »** → le système demande le visage,
   l'empreinte ou le code. *Valide l'enrôlement WebAuthn.*
2. Un e-mail « Nouvel appareil enregistré » arrive. *Valide la notification
   (détail 3) et le transport SMTP.*
3. **Renommer** la passkey, puis recharger. *Valide l'étiquetage (détail 2).*
4. **Se déconnecter**, puis **« Se connecter avec une passkey »** sans saisir
   d'adresse. *Valide les justificatifs découvrables — la connexion en un clic.*
5. Redemander un lien par e-mail alors qu'une passkey existe. *Valide que la voie
   de secours reste ouverte en permanence (détail 1).*
6. Recliquer le **même** lien : il doit être refusé. *Valide l'usage unique.*
7. Dans **Appareils → Activité récente**, les six gestes ci-dessus sont
   journalisés. *Valide le journal.*

---

## 2. Mise en production

### 2.1 Variables Vercel

Vercel → Settings → Environment Variables, **portée `Production` uniquement** :

| Variable | Valeur | Remarque |
| --- | --- | --- |
| `CTO_ACCESS_SECRET` | un secret **différent** de celui du local | même commande de génération |
| `CTO_RP_ID` | *(ne pas définir)* | défaut : `next-impact.digital` |
| `CTO_ORIGIN` | *(ne pas définir)* | déduit : `https://next-impact.digital` et `https://www.…` |
| `CRON_SECRET` | un secret au hasard | arme le balayage quotidien (§ 4) |
| `CTO_NOTION_*` | neuf variables (le jeton et huit bases) | synchro des accompagnements, des personnes et des livrables (`notion-livrables.md`) |

`/admin-cto` n'a pas de variable à lui : voir § 5.

Trois précisions qui comptent :

**Le secret de production doit différer de celui du local.** Un secret partagé
entre environnements fait qu'une fuite côté poste de travail ouvre la porte de
la production.

**Ne rien définir sur `Preview`, délibérément.** Les déploiements de
prévisualisation servent sur `*.vercel.app` : l'origine ne correspond pas au RP
ID, aucune passkey n'y fonctionnerait. Sans `CTO_ACCESS_SECRET`, l'espace
affiche un message de configuration explicite et reste fermé — ce qui est le
comportement voulu. Les passkeys se testent en local ou en production, jamais en
prévisualisation.

**`CTO_RP_ID` ne se change plus après le premier enrôlement.** Il vaut
`next-impact.digital`, le domaine enregistrable, et non `www.next-impact.digital` :
c'est ce qui permettra un déménagement futur sur `espace.next-impact.digital`
sans invalider les passkeys de tous les clients. Le modifier les invalide toutes,
sans recours.

### 2.2 Appliquer les migrations en production

Les migrations sont générées puis commitées ; leur application est une commande
manuelle, jamais un effet de bord du déploiement.

Depuis votre poste, avec les chaînes de connexion de production dans
`.env.local` :

```bash
npm run db:cto:migrate
```

Vérifier ensuite dans Neon que les quatorze tables `cto_*` existent. À refaire
à chaque nouvelle migration du dossier `src/cto/db/migrations/`, **avant** de
déployer le code qui l'utilise : une colonne attendue par le code mais absente
de la base fait échouer la synchro au premier balayage.

### 2.3 Déployer

```bash
git push
```

Vercel construit et déploie. Le build exécute déjà `check:docs`, l'isolation
Sentinelle et la compilation ; il échoue avant tout déploiement si l'un des trois
casse.

### 2.4 Recette en production

En navigation privée, sur `https://www.next-impact.digital/espace-direction` :

- [ ] L'écran de connexion s'affiche, sans message de configuration. *(Un message
      signifie que `CTO_ACCESS_SECRET` n'est pas posée.)*
- [ ] La source de la page contient `noindex` — aucun espace client ne doit être
      indexé.
- [ ] Demander un lien avec une adresse **inconnue** : le message est le même
      qu'avec une adresse connue. *(Cet écran ne doit jamais permettre de savoir
      qui est client.)*
- [ ] Inviter la première personne réelle, sans `--sans-envoi`, et dérouler la
      recette 1.4 de bout en bout.

---

## 3. Exploitation courante

### 3.1 Ouvrir un accompagnement

**L'accompagnement naît de sa fiche Notion.** Toute fiche de la base *Clients*
qu'aucun accompagnement ne revendique encore en crée un au balayage suivant
(`resolveClients`, `src/cto/notion/sync.ts`). Le rattachement se fait ensuite
par l'identifiant de la page Notion, conservé en base (`notion_page_id`) : il
n'y a plus d'UUID à recopier à la main.

Dans l'ordre :

1. **Créer la fiche** dans *Clients* : raison sociale, `Palier`, `État` à
   `actif`, relation `Organisation` vers sa fiche organisation, et
   `Lien vers l'espace` (`notion-livrables.md`, § 2).
2. **Synchroniser**, à blanc d'abord :
   ```bash
   npm run cto:sync -- --a-blanc   # « nouvel accompagnement — rien créé »
   npm run cto:sync                # « nouvel accompagnement créé (<uuid>) »
   ```
   Ou attendre le balayage de 4 h. L'UUID imprimé est celui de l'accompagnement.
3. **Inviter la première personne** avec cet UUID :
   ```bash
   npm run cto:invite -- \
     --client <uuid imprimé par la synchro> \
     --email dirigeant@client.fr \
     --nom "Prénom Nom" \
     --role "Dirigeant"
   ```
   Elle reçoit son lien de connexion par e-mail.

**Ne jamais utiliser `--entreprise` pour un client réel.** Cette option crée un
accompagnement sans fiche Notion ; la fiche créée ensuite en créerait un
second, et les livrables iraient dans celui-là. Si c'est déjà fait, coller
l'UUID du premier dans la colonne `ID espace` de la fiche **avant** la
synchro suivante : elle l'adopte au lieu d'en créer un autre.

Corollaire : une fiche de test dans *Clients* crée un vrai accompagnement.
Tester sur une branche Neon (§ 1.2), pas dans l'atelier de production.

### 3.2 Ajouter une personne à un accompagnement existant

**La base *Personnes* de l'atelier commande.** Ajouter une ligne (`Nom`,
`Email`, `Rôle`, relation `Client` vers sa fiche) crée l'accès au balayage
suivant — voir `notion-livrables.md` § 6. C'est la voie normale, et c'est ce
qui remplace la commande ci-dessous pour tout accès qui n'est pas le tout
premier de l'accompagnement.

**`cto:invite` garde deux rôles, et seulement deux : envoyer le premier lien
de connexion, et créer un accès en local.** La synchro n'envoie jamais
d'e-mail (§ 3.4) ; une ligne Notion crée donc l'accès, mais quelqu'un doit
encore prévenir la personne. Deux façons d'y arriver : elle se présente
elle-même sur `/espace-direction` avec son adresse, ou on lui envoie le
premier lien avec cette même commande, pointée sur l'accompagnement existant :

```bash
npm run cto:invite -- \
  --client <uuid de l'accompagnement> \
  --email daf@client.fr \
  --nom "Prénom Nom" \
  --role "Direction financière"
```

L'UUID est la fin de l'adresse de la page de détail, sur `/admin-cto/pilotage`
(`/admin-cto/pilotage/clients/<uuid>`). Une personne déjà créée en Notion est
**adoptée** par son adresse au balayage suivant plutôt que dupliquée — inutile
de choisir entre les deux, la synchro reconnecte les deux lignes toute seule
(`notion-livrables.md` § 6).

Il n'existe aucun parcours d'auto-inscription : le client n'ajoute personne
lui-même. La liste des personnes ayant accès aux contrats et aux budgets reste
une décision — prise dans Notion ou en CLI — jamais une conséquence.

### 3.3 Suspendre, restituer, clore

**La colonne `État` de la fiche Notion commande.** Chaque balayage recopie
`État` et `Palier` dans `cto_clients` dès qu'ils diffèrent, et date le
changement d'état. Pour suspendre, restituer ou clore, on change donc la
colonne, puis on synchronise (ou on attend 4 h).

| `État` | Effet |
| --- | --- |
| `actif` | Fonctionnement normal. |
| `suspendu` | L'espace reste lisible ; aucune notification n'est envoyée. |
| `restitution` | Fin de contrat : lecture seule, historique complet ; aucune notification. |
| `clos` | Plus aucun accès, y compris pour les sessions déjà ouvertes. |

L'effet est **immédiat** une fois en base : chaque chargement de page revérifie
l'état, une session déjà ouverte tombe à la page suivante.

**Le SQL reste possible, mais il est écrasé.** Un `update` direct sur
`cto_clients.status` tient jusqu'au balayage suivant, qui le remplace par la
valeur de la colonne `État` si elle est remplie et différente. Le SQL ne sert
donc que dans l'urgence (couper un accès avant la synchro), et il faut aligner
la fiche Notion dans la foulée :

```sql
-- Suspension temporaire : l'espace reste lisible, rien n'y est publié.
update cto_clients set status = 'suspendu',    status_changed_at = now() where id = '<uuid>';

-- Fin de contrat : lecture seule, historique complet, exports actifs.
update cto_clients set status = 'restitution', status_changed_at = now() where id = '<uuid>';

-- Clôture : plus aucun accès, y compris pour les sessions déjà ouvertes.
update cto_clients set status = 'clos',        status_changed_at = now() where id = '<uuid>';

-- Retour à la normale.
update cto_clients set status = 'actif',       status_changed_at = now() where id = '<uuid>';
```

Une fiche dont la colonne `État` est vide laisse la base décider : c'est le
seul cas où le SQL tient durablement.

### 3.4 Prévenir les clients des nouveautés

**La synchro n'envoie aucun e-mail.** Synchroniser dix fois dans l'après-midi
pendant qu'on relit un livrable ne doit prévenir personne. La notification est
un geste séparé, lancé quand le contenu est prêt à être vu :

```bash
npm run cto:notify -- --a-blanc   # dit qui serait notifié, n'envoie rien
npm run cto:notify                # envoie
```

Pour chaque accompagnement `actif`, la commande cherche ce qui a été publié ou
corrigé depuis **sa** dernière notification (`cto_clients.last_notified_at`), et
envoie un seul e-mail par personne active. Il annonce des nombres par catégorie
et un lien, jamais un titre : aucun contenu de l'espace ne voyage par courrier.

Un accompagnement `suspendu` ou en `restitution` n'est pas notifié, et sa date
n'avance pas : à la réactivation, il reçoit d'un coup tout ce qu'il a manqué.
Le Cron ne notifie jamais : seule cette commande envoie.

### 3.5 Révoquer une personne (départ de l'entreprise cliente)

**La case `Révoquée` de la base Personnes commande**, même logique que `État`
pour un accompagnement entier (§ 3.3) : cochée, l'accès tombe au balayage
suivant — sessions fermées, passkeys refusées. Décochée, il revient. ⚠️ Un
décochage accidentel restaure l'accès aussi silencieusement qu'un cochage le
coupe (`notion-livrables.md` § 6).

**Le SQL reste possible, mais il est écrasé** au balayage suivant si la case
Notion dit autre chose — pour couper avant que la synchro ne tourne :

```sql
update cto_persons set revoked_at = now() where email = 'daf@client.fr';
```

Une seule instruction suffit : ses sessions cessent d'être résolues et ses
passkeys sont refusées à la connexion. Les passkeys ne sont pas supprimées, pour
que le journal puisse dater une tentative postérieure au départ. Penser à
cocher `Révoquée` dans la foulée, sans quoi le prochain balayage rouvre
l'accès.

### 3.6 Faire tourner le secret

Changer `CTO_ACCESS_SECRET` invalide **tous les liens de connexion en
circulation**, et rien d'autre : les sessions vivent en base et ne sont pas
signées, les passkeys ne dépendent pas de ce secret. C'est le geste à faire si un
lien a fuité, et il n'oblige personne à se reconnecter.

Pour couper au contraire toutes les sessions d'une personne :

```sql
update cto_sessions set revoked_at = now() where person_id = '<uuid>' and revoked_at is null;
```

---

## 4. Le balayage quotidien

`/api/cto/cron`, déclarée dans `vercel.json`, tourne tous les jours à 4 h UTC et
fait deux travaux sans rapport entre eux :

- `purgeExpiredAccess()` et `purgeExpiredAdminAccess()` suppriment les liens
  échus ou servis, les défis expirés et les sessions mortes, côté client puis
  côté supervision. C'est la page de confidentialité qui l'exige, et c'est
  aussi ce qui empêche la liste des appareils de se charger de lignes mortes.
- `syncFromNotion()` crée les nouveaux accompagnements, aligne état et palier,
  et publie les livrables de l'atelier (`notion-livrables.md`). Il n'envoie
  aucun e-mail (§ 3.4).

Le ménage passe en premier et passe **quoi qu'il arrive** : il ne dépend que de
la base, là où la synchro dépend en plus de Notion. L'inverse ferait qu'une
indisponibilité de Notion emporterait aussi la purge.

### Poser `CRON_SECRET`

Vercel envoie `Authorization: Bearer <valeur>` dès que la variable existe.
**Sans elle, la route reste fermée** et répond 404 : une route de maintenance
ouverte laisserait n'importe qui déclencher des écritures et lire l'état de tous
les accompagnements. C'est donc la variable qui ARME le Cron, pas seulement qui
le protège — tant qu'elle manque, le balayage ne tourne pas.

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

À poser dans Vercel (portée Production) et dans `.env.local` si l'on veut
appeler la route en local.

### Lire son résultat

Vercel → Observability → Crons montre le corps de la réponse. Trois cas :

| Réponse | Ce que ça veut dire |
| --- | --- |
| 200, `synchro` chiffrée | Tout a tourné. |
| 200, `synchro: { ignoree }` | Les variables Notion ne sont pas posées sur Vercel. La purge, elle, a bien eu lieu. |
| 500 | Une des purges (`purge`, `purgeAdmin`) ou la synchro a échoué ; le corps dit laquelle et pourquoi. |

Le cas « ignorée » rend 200 délibérément : un Cron rouge tous les jours pour une
raison connue et acceptée finit par ne plus être lu, et c'est le vrai incident
qu'on manquerait alors.

---

## 5. Supervision — `/admin-cto`

Une identité, une vue d'ensemble, **presque en lecture seule**. Avant cet écran,
répondre à « qui est actif, qui est suspendu ? » demandait d'ouvrir Neon ;
`/admin-cto/pilotage` liste tous les accompagnements (statut, personnes,
sessions ouvertes, dernière connexion) et le détail de chacun (personnes,
journal d'accès).

**Un seul bouton : mettre la synchro en pause.** Sur le détail d'un
accompagnement, « Mettre en pause » (`basculerSynchro`,
`app/(cto)/admin-cto/pilotage/actions.ts`) gèle ses livrables : le balayage ne
crée, ne corrige ni ne retire plus rien chez lui, et le signale dans son
rapport. Utile pendant une reprise de l'atelier pour ce seul client. La pause
ne gèle ni `État` ni `Palier`, qui continuent de suivre la fiche Notion.
« Réactiver la synchro » rattrape tout au balayage suivant.

**Pourquoi rien de plus.** `scripts/cto-invite.ts` explique déjà pourquoi il
n'existe pas de back-office de création : à l'échelle de `CTO_TERMS` (quatre
accompagnements au maximum), un écran de saisie coûterait plus d'interface que
le produit n'en vaut. L'état se change dans la fiche Notion (§ 3.3), une
personne s'ajoute et se révoque dans la base Personnes du même atelier
(§ 3.2, § 3.5) : des gestes délibérés, pas des boutons pressés par réflexe —
seulement déplacés de la CLI vers Notion, pas vers un écran de plus.

### Aucune variable à poser

`/admin-cto` est associé en dur à `agathe@next-impact.digital`
(`src/cto/admin/identity.ts`) — pas à une table, pas à une variable
d'environnement à soi : c'est le code qui porte l'identité, pas la
configuration. L'accès réutilise le mécanisme de l'espace client (lien de
connexion signé + passkey) et donc son secret, `CTO_ACCESS_SECRET` (§ 2.1) :
rien de plus à poser en local ni sur Vercel. Faire tourner ce secret ferme
d'un coup toutes les sessions ouvertes, admin comprise.

### Utilisation

`/admin-cto/connexion` → « Recevoir un lien de connexion » → e-mail envoyé à
`agathe@next-impact.digital` → `/admin-cto/pilotage`. Une passkey enregistrée
depuis le tableau de bord permet ensuite de sauter l'e-mail. Session glissante
de sept jours, cookie non signé (`cto_admin`) dont la ligne vit en base
(`cto_admin_sessions`) : la révoquer — ou faire tourner `CTO_ACCESS_SECRET` —
la ferme immédiatement, sans attendre son échéance.

---

## Fichiers de référence

| Rôle | Fichier |
| --- | --- |
| Schéma et décisions de modélisation | `src/cto/db/schema.ts` |
| Jetons, durées, session glissante | `src/cto/access/token.ts` |
| Sessions, états d'accès, balayage | `src/cto/access/store.ts` |
| Cérémonies WebAuthn | `src/cto/access/passkeys.ts` |
| RP ID, origines, étiquettes | `src/cto/access/webauthn.ts` |
| Écrans client | `app/(cto)/espace-direction/` |
| Invitation | `scripts/cto-invite.ts` |
| Création d'accompagnement, alignement état/palier | `src/cto/notion/sync.ts` (`resolveClients`) |
| Notification des publications | `src/cto/notify/store.ts`, `scripts/cto-notify.ts` |
| Livrables (table, synchro, affichage) | `notion-livrables.md` |
| Balayage quotidien | `app/api/cto/cron/route.ts` |
| Supervision (requêtes) | `src/cto/admin/overview.ts` |
| Supervision (identité, lien, passkeys) | `src/cto/admin/identity.ts`, `src/cto/admin/passkeys.ts` |
| Supervision (pause de synchro) | `app/(cto)/admin-cto/pilotage/actions.ts` |
| Supervision (écrans) | `app/(cto)/admin-cto/` |
