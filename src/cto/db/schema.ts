import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  jsonb,
  boolean,
  pgEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

// ─────────────────────────────────────────────────────────────────────────────
// Schéma de l'espace « CTO externalisé » — accès et livrables.
//
// Deux périmètres, dans cet ordre : QUI entre, COMMENT, et ce qu'on en garde
// comme trace ; puis CE QU'IL Y TROUVE — les livrables, en bas de fichier. Le
// second dépend du premier (un livrable appartient à un accompagnement) ;
// l'inverse est faux, et la couche d'accès se lit sans descendre plus bas.
//
// Quatre partis pris structurants, et leurs raisons :
//
//  1. **L'unité d'accès est la PERSONNE, pas le client.** Chez une structure de
//     20 à 250 salariés, trois personnes consultent l'espace : le dirigeant, la
//     direction financière, la communication (cf. CTO_FAQ, « le service
//     communication siège au comité sans en être le commanditaire »). Un compte
//     partagé rendrait le journal inutilisable et l'offboarding impossible :
//     le jour où le DAF part, on coupe SON accès, pas celui du dirigeant.
//  2. **La session vit en base, pas dans la signature d'un cookie.** Sentinelle
//     a fait le choix inverse, et c'était le bon pour elle : aucune requête. Ici
//     la page interroge de toute façon la base pour afficher les livrables, donc
//     la lecture est gratuite. Elle achète quatre choses qu'un cookie signé ne
//     donne pas : révocation immédiate, session glissante, liste des appareils,
//     journal.
//  3. **Aucun secret d'authentification n'est stocké en clair.** Les jetons de
//     lien magique et de session ne vivent en base que sous forme de condensat
//     SHA-256 ; les passkeys ne stockent qu'une clé PUBLIQUE. Une base lue en
//     entier ne donne accès à rien.
//
//  4. **Un livrable ne se modifie jamais, il s'empile.** Une correction écrit
//     une version de plus ; aucune ligne n'est mise à jour, aucune n'est
//     supprimée, pas même au retrait. C'est ce qui rend le relevé opposable :
//     « ce qui était écrit en mars » doit rester lisible en septembre, y
//     compris quand l'atelier a été corrigé depuis.
//
// Ce schéma n'importe rien de `src/sentinelle/` et ne doit jamais le faire :
// les deux produits partagent la base Neon, pas leur code.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Enums ────────────────────────────────────────────────────────────────

/**
 * État d'un accompagnement, et donc de l'accès de ses personnes.
 *
 * Quatre états et non un booléen, parce que « résilié » recouvre trois
 * situations qui n'appellent pas le même comportement :
 *
 *  - `actif`       : contrat en cours, tout est ouvert.
 *  - `suspendu`    : suspension temporaire. L'espace reste lisible, la synchro
 *                    continue en silence, aucune notification ne part. Prévu
 *                    parce que l'engagement est de six mois puis mensuel : une
 *                    suspension est plus probable qu'une rupture.
 *  - `restitution` : le préavis est échu. Lecture seule, historique complet,
 *                    exports actifs. C'est cet état qui EXÉCUTE la clause de
 *                    restitution de CTO_TERMS au lieu de la déclarer.
 *  - `clos`        : plus aucun accès. Seul état qui ferme la porte.
 */
export const ctoClientStatusEnum = pgEnum("cto_client_status", [
  "actif",
  "suspendu",
  "restitution",
  "clos",
]);

/**
 * Nature d'un événement du journal d'accès.
 *
 * Le journal sert deux usages qui ne se confondent pas : montrer au client ce
 * qui se passe sur son espace, et te protéger le jour où quelqu'un demande qui
 * a consulté quoi. D'où l'enregistrement des refus (`acces_refuse`) au même
 * titre que les succès : un journal qui ne consigne que ce qui a marché ne
 * raconte rien d'un incident.
 */
export const ctoAccessEventEnum = pgEnum("cto_access_event", [
  "connexion_lien",
  "connexion_passkey",
  "passkey_ajoutee",
  "passkey_supprimee",
  "session_fermee",
  "session_revoquee",
  "acces_refuse",
]);

// ─── Clients et personnes ─────────────────────────────────────────────────

export const ctoClients = pgTable(
  "cto_clients",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /**
     * Page Notion de la base Clients dont cet accompagnement est né — sa clé
     * de rattachement, comme `notion_page_id` sur les livrables et les
     * lettres.
     *
     * `null` sur un accompagnement créé avant ce mécanisme (via `cto:invite`,
     * relié à la main par la colonne texte « ID espace »). La synchro adopte
     * ces lignes-là au premier passage qui les recroise
     * (`src/cto/notion/sync.ts`), plutôt que d'en créer un double : elle ne
     * réécrit jamais Notion, donc l'identifiant de page est la SEULE clé qui
     * lui permette de reconnaître un accompagnement déjà créé sans qu'on lui
     * recolle l'UUID à la main.
     */
    notionPageId: text("notion_page_id"),
    /** Raison sociale. C'est le nom affiché en tête de l'espace. */
    company: text("company").notNull(),
    /** Palier souscrit : `referent` ou `direction` (cf. lib/cto-externalise.ts). */
    tier: text("tier").notNull().default("direction"),
    status: ctoClientStatusEnum("status").notNull().default("actif"),
    /**
     * Interrupteur de la synchro Notion, indépendant de `status`. `status`
     * dit si la PERSONNE a accès à l'espace ; celui-ci dit si l'ATELIER
     * continue à l'alimenter. Utile à l'entrée d'un accompagnement — le temps
     * de relire ce qui est publié avant de laisser la synchro l'alimenter
     * pour de bon. Vrai par défaut : la synchro reste le comportement
     * normal, ce champ n'existe que pour la pause volontaire.
     *
     * Suspendu, un balayage laisse les livrables déjà publiés tels quels — ni
     * mis à jour, ni retirés — et ignore les lignes nouvellement publiées de
     * cet accompagnement (`src/cto/notion/sync.ts`).
     */
    syncEnabled: boolean("sync_enabled").notNull().default(true),
    /**
     * Date du dernier changement d'état. Sans elle, « fenêtre de restitution
     * de trois mois » n'est pas implémentable : `status` dit où on en est,
     * pas depuis quand. Remise à jour à chaque transition, y compris un
     * retour en `actif` après une suspension — que la transition vienne d'un
     * geste SQL ou de la colonne « État » de l'atelier.
     */
    statusChangedAt: timestamp("status_changed_at").notNull().defaultNow(),
    /**
     * Le **pack sectoriel** de la fiche organisation (ex. `pack-industrie-btp.md`),
     * recopié à chaque balayage. Sert uniquement à distribuer les lettres
     * sectorielles ; un client sans pack reçoit la générale et la sienne, ce
     * qui est le comportement voulu par défaut.
     *
     * La valeur n'est PAS saisie ici : elle vient de la « Base des fiches
     * organisation », qui est la source de vérité. Texte brut et non enum,
     * pour que la liste des packs évolue chez elle sans coûter une migration
     * ici.
     */
    sector: text("sector"),
    /**
     * Identifiant du site chez WP Umbrella (supervision technique : uptime,
     * sauvegardes, vulnérabilités). Saisi dans Notion (colonne « ID projet WP
     * Umbrella »), jamais par le client : résolu depuis SA session, jamais
     * depuis un paramètre d'URL — un projet WP Umbrella donne accès aux
     * données techniques d'un site, se tromper de client serait grave.
     */
    wpUmbrellaProjectId: integer("wp_umbrella_project_id"),
    /**
     * Services souscrits, en valeurs de code (`direction-technique`,
     * `suivi-technique`, `actions`, `veille-personnalisee`, `prestations`),
     * recopiés de la colonne « Services » de la fiche Notion.
     *
     * Décide des sections de l'espace, pas de l'accès : une personne d'un
     * accompagnement sans aucun service entre quand même, et voit le tableau de
     * bord, la veille générale et le contact.
     *
     * `null` = colonne jamais renseignée : l'espace garde alors l'affichage
     * d'avant les services (toute section qui a du contenu). Distinct d'un
     * tableau vide, qui dit « aucun service optionnel » et masque tout ce qui
     * n'est pas toujours visible (`src/cto/espace/services.ts`).
     */
    services: text("services").array(),
    /**
     * Dernière fois qu'un e-mail « il y a du nouveau » est parti pour cet
     * accompagnement. `null` : jamais notifié.
     *
     * C'est l'état qui sépare la synchro (`src/cto/notion/sync.ts`, écrit
     * dans `cto_deliverables`) de la notification (`src/cto/notify/`, lue
     * ici) : deux processus déclenchés séparément, l'un par un balayage
     * régulier, l'autre par un geste délibéré. Sans cette date, il n'y aurait
     * rien à comparer entre les deux passages, et « ce qui est nouveau
     * depuis la dernière notification » ne voudrait plus rien dire une fois
     * le balayage terminé.
     */
    lastNotifiedAt: timestamp("last_notified_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("cto_client_notion_page").on(t.notionPageId)],
);

export const ctoPersons = pgTable(
  "cto_persons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => ctoClients.id, { onDelete: "cascade" }),
    /**
     * Page Notion de la base Personnes dont cette personne est née — même
     * mécanique que `ctoClients.notionPageId` : la synchro reconnaît une
     * personne déjà créée par son `page.id`, jamais en réécrivant Notion.
     *
     * `null` sur une personne créée avant ce mécanisme (via `cto:invite`). La
     * synchro l'ADOPTE par adresse e-mail au premier passage qui la recroise
     * (`src/cto/notion/persons.ts`) plutôt que d'échouer sur l'index unique
     * `cto_person_email` en tentant d'en créer une seconde.
     */
    notionPageId: text("notion_page_id"),
    email: text("email").notNull(),
    name: text("name").notNull(),
    /**
     * Rôle affiché, en texte libre (« Dirigeant », « Direction financière »).
     * Volontairement pas un enum : un intitulé de plus ne doit pas coûter une
     * migration, et aucun code ne branche dessus.
     */
    role: text("role"),
    /**
     * Révocation individuelle. C'est le geste d'offboarding : une personne
     * quitte l'entreprise cliente, on pose cette date, ses passkeys cessent de
     * fonctionner et ses sessions tombent, sans toucher aux autres.
     *
     * Pilotable depuis Notion (case « Révoquée » de la base Personnes) autant
     * qu'en SQL : les deux posent et lèvent la même date, symétriquement,
     * comme `cto_clients.status` le fait déjà pour un accompagnement entier.
     * ⚠️ Corollaire assumé : décocher la case dans Notion restaure l'accès.
     */
    revokedAt: timestamp("revoked_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    // Unicité sur l'adresse normalisée : c'est la clé d'entrée du lien magique,
    // et deux fiches pour la même adresse rendraient l'envoi ambigu.
    uniqueIndex("cto_person_email").on(t.email),
    uniqueIndex("cto_person_notion_page").on(t.notionPageId),
    index("cto_person_client").on(t.clientId),
  ],
);

// ─── Passkeys ─────────────────────────────────────────────────────────────

/**
 * Une passkey enrôlée. Plusieurs par personne : c'est le fonctionnement normal
 * de WebAuthn et c'est ce qu'on veut — portable professionnel, poste fixe,
 * téléphone.
 *
 * Ce qui est stocké est une clé PUBLIQUE : elle ne permet pas de se connecter,
 * seulement de vérifier une signature produite par l'appareil du client.
 */
export const ctoCredentials = pgTable(
  "cto_credentials",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    personId: uuid("person_id")
      .notNull()
      .references(() => ctoPersons.id, { onDelete: "cascade" }),
    /** Identifiant du justificatif, en base64url. Unique au monde. */
    credentialId: text("credential_id").notNull(),
    /** Clé publique COSE, encodée en base64url pour tenir dans une colonne texte. */
    publicKey: text("public_key").notNull(),
    /**
     * Compteur de signatures rapporté par l'authentificateur. Sert à détecter un
     * clonage : un compteur qui régresse trahit une copie de la clé. La plupart
     * des passkeys synchronisées renvoient 0 en permanence, auquel cas le
     * contrôle ne dit rien, et c'est normal.
     */
    counter: integer("counter").notNull().default(0),
    /** Transports annoncés (`internal`, `hybrid`, `usb`…), séparés par des virgules. */
    transports: text("transports"),
    /**
     * Nom lisible, saisi par la personne (« iPhone d'Alain »). Sans lui, une
     * liste d'appareils est une liste d'identifiants opaques, donc inutilisable.
     */
    label: text("label").notNull(),
    /** Type d'authentificateur, pour afficher « iCloud », « Windows Hello »… */
    aaguid: text("aaguid"),
    lastUsedAt: timestamp("last_used_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("cto_credential_id").on(t.credentialId),
    index("cto_credential_person").on(t.personId),
  ],
);

/**
 * Défi WebAuthn en cours.
 *
 * Le protocole exige que le serveur ait émis le défi qu'il vérifie ensuite :
 * sans stockage, n'importe qui pourrait rejouer une réponse capturée. Durée de
 * vie très courte, purge par le même balayage que les liens échus.
 *
 * `personId` est NULLABLE, et c'est ce qui permet la connexion en un clic : sur
 * un défi d'authentification on ne sait pas encore qui se présente, le
 * navigateur propose la passkey et l'identité se déduit du justificatif rendu.
 */
export const ctoChallenges = pgTable(
  "cto_challenges",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    personId: uuid("person_id").references(() => ctoPersons.id, {
      onDelete: "cascade",
    }),
    challenge: text("challenge").notNull(),
    /** `registration` ou `authentication` : un défi d'enrôlement ne vaut pas connexion. */
    kind: text("kind").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("cto_challenge_expires").on(t.expiresAt)],
);

// ─── Liens magiques ───────────────────────────────────────────────────────

/**
 * Voie de SECOURS, maintenue en permanence : premier accès, nouvel appareil,
 * passkey perdue. Une passkey se perd avec un téléphone, et certaines ne se
 * synchronisent pas — si c'était l'unique porte, il faudrait dépanner un
 * dirigeant un vendredi soir.
 *
 * Seul le condensat est stocké, la ligne disparaît à la consommation.
 */
export const ctoMagicLinks = pgTable(
  "cto_magic_links",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    personId: uuid("person_id")
      .notNull()
      .references(() => ctoPersons.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    usedAt: timestamp("used_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("cto_magic_link_hash").on(t.tokenHash),
    index("cto_magic_link_person_created").on(t.personId, t.createdAt),
  ],
);

// ─── Sessions ─────────────────────────────────────────────────────────────

/**
 * Une session ouverte, c'est-à-dire un appareil connecté.
 *
 * Le cookie ne porte qu'un aléa de 32 octets ; la base en garde le condensat.
 * Rien n'est signé, et il n'y a rien à signer : la ligne EST l'autorisation.
 * La supprimer ou la révoquer ferme l'accès à la seconde, ce qu'aucun jeton
 * auto-porteur ne permet.
 */
export const ctoSessions = pgTable(
  "cto_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    personId: uuid("person_id")
      .notNull()
      .references(() => ctoPersons.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    /**
     * Échéance glissante, repoussée à chaque visite. Un client qui passe une
     * fois par mois n'est jamais déconnecté ; un appareil oublié quelque part
     * expire tout seul.
     */
    expiresAt: timestamp("expires_at").notNull(),
    lastSeenAt: timestamp("last_seen_at").notNull().defaultNow(),
    /** Agent utilisateur tronqué, pour que la liste d'appareils soit lisible. */
    userAgent: text("user_agent"),
    revokedAt: timestamp("revoked_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("cto_session_hash").on(t.tokenHash),
    index("cto_session_person").on(t.personId),
  ],
);

// ─── Journal d'accès ──────────────────────────────────────────────────────

export const ctoAccessLog = pgTable(
  "cto_access_log",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /**
     * `set null` et non `cascade` : effacer une personne ne doit pas effacer la
     * trace qu'elle s'est connectée. Le journal survit anonymisé, ce qui est
     * exactement ce que demande la rétention — la preuve de prestation reste,
     * la donnée personnelle part.
     */
    personId: uuid("person_id").references(() => ctoPersons.id, {
      onDelete: "set null",
    }),
    clientId: uuid("client_id").references(() => ctoClients.id, {
      onDelete: "set null",
    }),
    event: ctoAccessEventEnum("event").notNull(),
    /** Précision libre : nom de l'appareil, motif du refus. Jamais un secret. */
    detail: text("detail"),
    at: timestamp("at").notNull().defaultNow(),
  },
  (t) => [
    index("cto_access_log_client_at").on(t.clientId, t.at),
    index("cto_access_log_person_at").on(t.personId, t.at),
  ],
);

// ─── Admin de supervision (compte unique) ────────────────────────────────

/**
 * Quatre tables qui recopient, ligne pour ligne, la forme de celles de la
 * couche d'accès client (magic links, défis, justificatifs, sessions)
 * ci-dessus — et c'est délibéré, voir `src/cto/admin/identity.ts`. Ce qui
 * change : il n'y a ni `cto_clients` ni `cto_persons` à référencer. Il
 * n'existe qu'UNE identité (agathe@next-impact.digital, en dur dans le code,
 * jamais en base), donc aucune de ces tables n'a de colonne « personne » —
 * une ligne suffit à en dire toute l'histoire.
 *
 * Isolées de `cto_magic_links` / `cto_challenges` / `cto_credentials` /
 * `cto_sessions` : un secret de l'espace admin qui fuiterait ne doit ouvrir
 * qu'une supervision en lecture seule, jamais l'espace d'un client, et
 * réciproquement.
 */

export const ctoAdminMagicLinks = pgTable(
  "cto_admin_magic_links",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("cto_admin_magic_link_hash").on(t.tokenHash),
    index("cto_admin_magic_link_created").on(t.createdAt),
  ],
);

export const ctoAdminChallenges = pgTable(
  "cto_admin_challenges",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    challenge: text("challenge").notNull(),
    /** `registration` ou `authentication`, même vocabulaire que côté client. */
    kind: text("kind").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("cto_admin_challenge_expires").on(t.expiresAt)],
);

export const ctoAdminCredentials = pgTable(
  "cto_admin_credentials",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    credentialId: text("credential_id").notNull(),
    publicKey: text("public_key").notNull(),
    counter: integer("counter").notNull().default(0),
    transports: text("transports"),
    label: text("label").notNull(),
    aaguid: text("aaguid"),
    lastUsedAt: timestamp("last_used_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("cto_admin_credential_id").on(t.credentialId)],
);

export const ctoAdminSessions = pgTable(
  "cto_admin_sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    lastSeenAt: timestamp("last_seen_at").notNull().defaultNow(),
    userAgent: text("user_agent"),
    revokedAt: timestamp("revoked_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [uniqueIndex("cto_admin_session_hash").on(t.tokenHash)],
);

// ─── Livrables ────────────────────────────────────────────────────────────

/**
 * Nature d'un livrable, et donc forme de son `payload`.
 *
 * Cinq valeurs pour six bases Notion : le budget à trois ans n'en est pas une,
 * il se déduit de la cartographie (`docs/cto-externalise/notion-livrables.md`).
 * `document` est déclaré dès maintenant bien que sa synchro vienne plus tard —
 * un enum Postgres se complète par une migration, autant ne pas en devoir une
 * pour une valeur qu'on sait déjà nécessaire.
 */
export const ctoDeliverableKindEnum = pgEnum("cto_deliverable_kind", [
  "decision",
  "roadmap",
  "cartographie",
  "veille",
  "document",
  "prestation",
]);

/**
 * Un livrable publié, dans une de ses versions.
 *
 * **Table strictement append-only. Aucun code n'y fait d'UPDATE ni de DELETE.**
 * Corriger un livrable écrit une version de plus ; le retirer écrit une version
 * portant `withdrawnAt`. C'est la propriété qui rend le relevé opposable : le
 * client doit pouvoir relire ce qui lui a été communiqué en mars, y compris
 * après correction, et personne — moi compris — ne doit pouvoir réécrire le
 * passé depuis Notion.
 *
 * La version courante d'un livrable est celle de plus haut `version` pour un
 * même `notionPageId` ; elle est visible si son `withdrawnAt` est nul. D'où
 * l'absence de colonne « courant » : un drapeau à maintenir se désynchronise,
 * un maximum se calcule.
 *
 * `notionPageId` est la clé de rapprochement avec l'atelier. Elle survit au
 * renommage du livrable, à son déplacement dans la base et à la réécriture de
 * tout son contenu — ce qu'aucun titre ne fait.
 */
export const ctoDeliverables = pgTable(
  "cto_deliverables",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => ctoClients.id, { onDelete: "cascade" }),
    /** Identifiant de la page Notion d'origine. Stable, contrairement au titre. */
    notionPageId: text("notion_page_id").notNull(),
    kind: ctoDeliverableKindEnum("kind").notNull(),
    /** 1 pour la première publication, puis strictement croissant. */
    version: integer("version").notNull(),
    title: text("title").notNull(),
    /** Le contenu, dont la forme dépend de `kind`. Voir `src/cto/deliverables`. */
    payload: jsonb("payload").notNull(),
    /**
     * Empreinte du contenu publié. Sert à ne PAS écrire de version quand la
     * synchro relit un livrable inchangé : sans elle, un balayage quotidien
     * produirait trois cent soixante-cinq versions identiques par an et rendrait
     * l'historique illisible, c'est-à-dire inutile.
     */
    digest: text("digest").notNull(),
    /**
     * La date qui compte pour le client : date du comité, échéance, date du
     * document. Hors du `payload` parce qu'elle sert à trier, et qu'un tri sur
     * du JSON est un index qu'on n'aura pas.
     */
    occurredAt: timestamp("occurred_at"),
    /**
     * Posée sur une version de retrait. Le livrable quitte l'espace, son
     * histoire reste. Republier écrit une version de plus, avec `null`.
     */
    withdrawnAt: timestamp("withdrawn_at"),
    /** Quand cette version a été écrite ici. Jamais la date de rédaction. */
    recordedAt: timestamp("recorded_at").notNull().defaultNow(),
  },
  (t) => [
    // Deux synchros concurrentes calculeraient le même numéro de version : la
    // seconde échoue à l'insertion plutôt que de dédoubler l'historique. Le
    // driver HTTP n'ayant pas de transaction interactive, c'est cet index — et
    // non un verrou applicatif — qui tient l'invariant.
    uniqueIndex("cto_deliverable_version").on(t.notionPageId, t.version),
    index("cto_deliverable_client_kind").on(t.clientId, t.kind),
  ],
);

/**
 * Où un livrable s'affiche : à la une, ou seulement dans sa catégorie.
 *
 * **Table mutable, et c'est tout l'intérêt de la séparer.** Le placement n'est
 * pas un livrable : basculer une décision de « À la une » vers « Archive » ne
 * corrige rien, ne dit rien de neuf au client, et ne doit donc ni écrire une
 * version ni faire apparaître « corrigé le… » sur son écran. Rangé dans
 * `cto_deliverables`, il aurait fallu choisir entre deux maux : l'inclure dans
 * l'empreinte et polluer l'historique à chaque rangement, ou l'en exclure et ne
 * jamais voir le changement remonter — puisque la synchro saute ce qui n'a pas
 * bougé.
 *
 * Clé sur `notionPageId` et non sur une version : le placement suit le livrable
 * dans toute son histoire, pas une de ses versions.
 */
export const ctoDeliverablePlacements = pgTable("cto_deliverable_placements", {
  notionPageId: text("notion_page_id").primaryKey(),
  /** Vrai si la ligne remonte sur la page d'accueil de l'espace. */
  featured: boolean("featured").notNull().default(false),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ─── Lettres de veille ────────────────────────────────────────────────────

/**
 * À qui une lettre s'adresse.
 *
 * `generale` ne porte aucun destinataire : elle va à tous les accompagnements
 * actifs. C'est ce qui évite d'avoir à cocher les clients un par un sur chaque
 * édition mensuelle — un oubli garanti au troisième mois.
 */
export const ctoLetterScopeEnum = pgEnum("cto_letter_scope", [
  "generale",
  "sectorielle",
  "personnalisee",
]);

/**
 * Une lettre de veille, dans son édition courante.
 *
 * **Table volontairement NON append-only**, contrairement à `cto_deliverables`,
 * et la différence tient à la nature de l'objet. Un relevé de décisions engage :
 * ce qui y était écrit en mars doit rester lisible en septembre. Une lettre est
 * une publication datée : on ne « corrige » pas l'édition d'août six mois plus
 * tard, on publie celle de septembre. Garder trente versions d'un document de
 * trente kilo-octets alourdirait la base pour une preuve dont personne n'a
 * l'usage.
 *
 * Une lettre n'est pas non plus rattachée à un client au moment de la synchro,
 * mais à sa *portée*. La lettre générale existe en UN exemplaire : la recopier
 * par accompagnement multiplierait un long texte par le nombre de clients, et
 * une correction obligerait à repasser partout.
 */
export const ctoLetters = pgTable(
  "cto_letters",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    /** Page Notion d'origine. Clé de rapprochement, stable au renommage. */
    notionPageId: text("notion_page_id").notNull(),
    scope: ctoLetterScopeEnum("scope").notNull(),
    /** Renseigné sur une sectorielle : doit correspondre à `cto_clients.sector`. */
    sector: text("sector"),
    /** Renseigné sur une personnalisée, nul partout ailleurs. */
    clientId: uuid("client_id").references(() => ctoClients.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    /** Le mois de l'édition. Sert au tri et à la fenêtre de six mois. */
    period: timestamp("period"),
    /** L'accroche affichée en liste, sans avoir à charger tout le corps. */
    chapo: text("chapo"),
    /**
     * Le corps, en blocs structurés (cf. `src/cto/notion/blocks.ts`). Ni HTML ni
     * Markdown : du HTML obligerait à faire confiance à une chaîne pour
     * l'injecter dans la page, du Markdown ajouterait un analyseur au rendu.
     * Des blocs typés se rendent en composants, sans l'un ni l'autre.
     */
    body: jsonb("body").notNull(),
    /** Empreinte du corps : évite de réécrire une lettre inchangée. */
    digest: text("digest").notNull(),
    /** Posée quand la lettre cesse d'être publiée, ou sort de la fenêtre. */
    withdrawnAt: timestamp("withdrawn_at"),
    syncedAt: timestamp("synced_at").notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("cto_letter_page").on(t.notionPageId),
    index("cto_letter_period").on(t.period),
  ],
);

// ─── Fichiers ─────────────────────────────────────────────────────────────

/**
 * Un fichier rapatrié : pièce jointe d'un document Notion, rapport PDF de
 * maintenance WP Umbrella.
 *
 * **Pourquoi en base et non chez un hébergeur de fichiers.** Les deux sources
 * rendent des liens qui expirent (une heure chez Notion, quinze minutes chez WP
 * Umbrella) : stocker le lien ne produirait que des liens morts, il faut garder
 * le fichier. Un stockage objet public (Vercel Blob) le rendrait lisible par
 * quiconque obtient l'URL ; un contrat ou un audit n'a rien à faire derrière
 * une adresse devinable. En base, le fichier ne sort que par une route qui
 * vérifie la session ET l'appartenance (`app/(cto)/espace-direction/fichiers`).
 * À quatre accompagnements et quelques dizaines de PDF, le volume ne justifie
 * pas un service de plus.
 *
 * Clé = empreinte SHA-256 du contenu : un même fichier republié n'est stocké
 * qu'une fois, et une empreinte qui change dit qu'un document a changé — c'est
 * ce qui fait écrire une version de plus au livrable qui le porte.
 *
 * Contenu en base64 dans une colonne texte plutôt qu'en `bytea` : le pilote
 * HTTP de Neon sérialise mal le binaire, et le surcoût d'un tiers sur des
 * fichiers bornés à 15 Mo (`MAX_FILE_BYTES`) ne pèse rien ici.
 */
export const ctoFiles = pgTable("cto_files", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  mime: text("mime").notNull(),
  size: integer("size").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Suivi technique (WP Umbrella) ────────────────────────────────────────

/**
 * Le dernier état connu du site d'un accompagnement, tel que WP Umbrella le
 * décrit : versions, extensions à mettre à jour, vulnérabilités, disponibilité,
 * sauvegardes, maintenance récente.
 *
 * **Une ligne par accompagnement, écrasée à chaque balayage.** Ce n'est pas un
 * livrable : c'est un relevé d'instruments, et l'historique utile (incidents,
 * sauvegardes, interventions) est déjà daté DANS le relevé. Le garder
 * version par version reproduirait chez nous la base de WP Umbrella.
 *
 * Écrite par le Cron, jamais pendant une requête client : l'espace ne dépend
 * pas plus de WP Umbrella qu'il ne dépend de Notion.
 */
export const ctoSiteSnapshots = pgTable("cto_site_snapshots", {
  clientId: uuid("client_id")
    .primaryKey()
    .references(() => ctoClients.id, { onDelete: "cascade" }),
  projectId: integer("project_id").notNull(),
  /** Le relevé normalisé (`src/cto/site/types.ts`), jamais la réponse brute. */
  data: jsonb("data").notNull(),
  fetchedAt: timestamp("fetched_at").notNull().defaultNow(),
  /** Dernière erreur de balayage. Le relevé précédent reste affiché. */
  error: text("error"),
  errorAt: timestamp("error_at"),
});

/**
 * Un rapport de maintenance mensuel, archivé.
 *
 * Contrairement au relevé, les rapports S'EMPILENT : c'est l'archive que le
 * client consulte et qu'il emporte à la restitution. Le PDF est rapatrié dans
 * `cto_files` au premier passage (son lien d'origine expire en quinze minutes)
 * et n'est plus jamais redemandé.
 */
export const ctoSiteReports = pgTable(
  "cto_site_reports",
  {
    /** Identifiant du rapport chez WP Umbrella. */
    id: text("id").primaryKey(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => ctoClients.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    periodStart: timestamp("period_start"),
    periodEnd: timestamp("period_end"),
    generatedAt: timestamp("generated_at"),
    fileId: text("file_id").references(() => ctoFiles.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("cto_site_report_client").on(t.clientId, t.generatedAt)],
);
