import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  pgEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

// ─────────────────────────────────────────────────────────────────────────────
// Schéma de l'espace « CTO externalisé » — couche d'accès.
//
// Périmètre de ce fichier : QUI entre, COMMENT, et ce qu'on en garde comme
// trace. Les livrables (décisions, roadmap, cartographie…) viendront dans un
// second schéma ; ils n'ont aucune raison d'attendre celui-ci pour exister.
//
// Trois partis pris structurants, et leurs raisons :
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

export const ctoClients = pgTable("cto_clients", {
  id: uuid("id").primaryKey().defaultRandom(),
  /** Raison sociale. C'est le nom affiché en tête de l'espace. */
  company: text("company").notNull(),
  /** Palier souscrit : `referent` ou `direction` (cf. lib/cto-externalise.ts). */
  tier: text("tier").notNull().default("direction"),
  status: ctoClientStatusEnum("status").notNull().default("actif"),
  /**
   * Date du dernier changement d'état. Sans elle, « fenêtre de restitution de
   * trois mois » n'est pas implémentable : `status` dit où on en est, pas
   * depuis quand. Remise à jour à chaque transition, y compris un retour en
   * `actif` après une suspension.
   */
  statusChangedAt: timestamp("status_changed_at").notNull().defaultNow(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const ctoPersons = pgTable(
  "cto_persons",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientId: uuid("client_id")
      .notNull()
      .references(() => ctoClients.id, { onDelete: "cascade" }),
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
     */
    revokedAt: timestamp("revoked_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    // Unicité sur l'adresse normalisée : c'est la clé d'entrée du lien magique,
    // et deux fiches pour la même adresse rendraient l'envoi ambigu.
    uniqueIndex("cto_person_email").on(t.email),
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
