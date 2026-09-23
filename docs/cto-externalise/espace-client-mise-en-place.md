# Espace client CTO — mise en place, local et production

Procédure d'installation et d'exploitation de la couche d'accès de l'espace
« CTO externalisé » (`src/cto/`, `app/(cto)/espace-direction`, `app/api/cto/`).

Périmètre : **l'accès** — identités par personne, passkeys, sessions, journal —
et **la supervision** en lecture seule (§ 5). Les livrables (atelier Notion,
synchronisation, affichage) ont leur propre document : `notion-livrables.md`.
L'export de restitution, lui, reste à écrire.

---

## 0. Ce qui doit déjà exister

| Ressource | Où | Déjà en place |
| --- | --- | --- |
| Base Postgres | Neon (`DATABASE_URL`, `DATABASE_URL_UNPOOLED`) | oui, partagée avec Sentinelle |
| Envoi d'e-mails | SMTP Google (`NODEMAILER_*`) | oui, celui du site |

L'espace CTO n'ajoute **aucun service** : il pose dix tables préfixées `cto_`
dans la base existante et envoie ses deux e-mails par le transport du site. La
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
| `CTO_NOTION_*` | sept variables | seulement pour la synchro des livrables (`notion-livrables.md`) |
| `CTO_ADMIN_PASSWORD` | 16 caractères minimum, au hasard | ouvre `/admin-cto` (§ 5) |

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

Vérifier ensuite dans Neon que les huit tables `cto_*` existent.

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

### 3.1 Ajouter une personne à un accompagnement existant

```bash
npm run cto:invite -- \
  --client <uuid de l'accompagnement> \
  --email daf@client.fr \
  --nom "Prénom Nom" \
  --role "Direction financière"
```

Il n'existe aucun parcours d'auto-inscription : le client n'ajoute personne
lui-même. La liste des personnes ayant accès aux contrats et aux budgets reste
une décision, pas une conséquence.

### 3.2 Suspendre, restituer, clore

Tant que l'écran d'administration n'existe pas, ces transitions se font en SQL
(Neon → SQL Editor) :

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

L'effet est **immédiat** : chaque chargement de page revérifie l'état, une
session déjà ouverte tombe à la page suivante.

### 3.3 Révoquer une personne (départ de l'entreprise cliente)

```sql
update cto_persons set revoked_at = now() where email = 'daf@client.fr';
```

Une seule instruction suffit : ses sessions cessent d'être résolues et ses
passkeys sont refusées à la connexion. Les passkeys ne sont pas supprimées, pour
que le journal puisse dater une tentative postérieure au départ.

### 3.4 Faire tourner le secret

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

- `purgeExpiredAccess()` supprime les liens échus ou servis, les défis expirés
  et les sessions mortes. C'est la page de confidentialité qui l'exige, et c'est
  aussi ce qui empêche la liste des appareils de se charger de lignes mortes.
- `syncFromNotion()` publie les livrables de l'atelier (`notion-livrables.md`).

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
| 500 | Un des deux travaux a échoué ; le corps dit lequel et pourquoi. |

Le cas « ignorée » rend 200 délibérément : un Cron rouge tous les jours pour une
raison connue et acceptée finit par ne plus être lu, et c'est le vrai incident
qu'on manquerait alors.

---

## 5. Supervision — `/admin-cto`

Un mot de passe, une vue d'ensemble, **lecture seule**. Avant cet écran,
répondre à « qui est actif, qui est suspendu ? » demandait d'ouvrir Neon ;
`/admin-cto/pilotage` liste tous les accompagnements (statut, personnes,
sessions ouvertes, dernière connexion) et le détail de chacun (personnes,
journal d'accès).

**Pourquoi lecture seule, et pas un formulaire de plus.** `scripts/cto-invite.ts`
explique déjà pourquoi il n'existe pas de back-office de création : à l'échelle
de `CTO_TERMS` (quatre accompagnements au maximum), un écran de saisie
coûterait plus d'interface que le produit n'en vaut. Cet écran répond à un
besoin différent — voir, pas écrire — et s'y tient : changer un statut ou
révoquer une personne reste un geste SQL délibéré (§ 3.2 et § 3.3 ci-dessus),
pas un bouton pressé par réflexe. Le jour où la lecture ne suffit plus, ce
paragraphe dit ce que l'écran devra faire en plus.

### Poser le mot de passe

```bash
node -e "console.log(require('crypto').randomBytes(18).toString('base64url'))"
```

Dans `.env.local` **et** dans Vercel (portée Production, secret différent de
celui du local, même logique que `CTO_ACCESS_SECRET` au § 2.1). Sans lui,
`/admin-cto/connexion` affiche un message de configuration et reste fermé.

### Utilisation

`/admin-cto/connexion` → mot de passe → `/admin-cto/pilotage`. Session de
12 h, cookie signé (`cto_admin`), aucune ligne en base : changer le mot de
passe ferme d'un coup toutes les sessions ouvertes.

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
| Livrables (table, synchro, affichage) | `notion-livrables.md` |
| Balayage quotidien | `app/api/cto/cron/route.ts` |
| Supervision (requêtes, lecture seule) | `src/cto/admin/overview.ts` |
| Supervision (mot de passe, session) | `src/cto/admin/session.ts` |
| Supervision (écrans) | `app/(cto)/admin-cto/` |
