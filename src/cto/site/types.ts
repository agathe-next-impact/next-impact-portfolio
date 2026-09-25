// ─────────────────────────────────────────────────────────────────────────────
// Le relevé technique d'un site, tel que l'espace client l'affiche.
//
// Forme à nous, indépendante de WP Umbrella : l'API ne publie que des exemples
// de réponse, pas de schéma, et ses noms de champs ne sont pas ceux qu'on veut
// voir dans un composant. `src/cto/site/normalize.ts` est le seul endroit qui
// connaît les deux. Le jour où la supervision change d'outil, c'est lui qui
// change, pas l'écran.
//
// Tout est facultatif en pratique (`null`) : un champ que l'API ne rend pas ne
// doit ni casser le relevé ni s'afficher comme une valeur fausse. « Inconnu »
// vaut mieux que « 0 % de disponibilité ».
// ─────────────────────────────────────────────────────────────────────────────

export interface SiteUpdate {
  name: string;
  version: string | null;
  newVersion: string | null;
}

export interface SiteVulnerability {
  /** Extension, thème ou « WordPress ». */
  component: string;
  title: string;
  cvss: number | null;
  fixedIn: string | null;
  disclosedAt: string | null;
}

export interface SiteIncident {
  startedAt: string;
  endedAt: string | null;
  durationSeconds: number | null;
}

export interface SiteBackup {
  date: string;
  status: string;
  sizeBytes: number | null;
}

export interface SiteIntervention {
  date: string;
  /** Libellé lisible : « Mise à jour d'extension », « Optimisation de la base »… */
  label: string;
  target: string | null;
  from: string | null;
  to: string | null;
}

export interface SiteSnapshot {
  site: {
    name: string | null;
    url: string | null;
    wordpress: string | null;
    php: string | null;
    phpRecommended: string | null;
    phpSecure: boolean | null;
    ssl: boolean | null;
    /** Score de performance ramené sur 100, ou null si non mesuré. */
    performance: number | null;
    lastSyncAt: string | null;
  };
  status: {
    down: boolean | null;
    disconnected: boolean | null;
  };
  updates: {
    plugins: SiteUpdate[];
    themes: SiteUpdate[];
  };
  vulnerabilities: {
    items: SiteVulnerability[];
    lastScanAt: string | null;
  };
  uptime: {
    enabled: boolean | null;
    /** Sur 100, sur la fenêtre `from` → `to` (trente jours par défaut). */
    percentage: number | null;
    from: string | null;
    to: string | null;
    incidents: SiteIncident[];
  };
  backups: {
    recent: SiteBackup[];
  };
  maintenance: {
    recent: SiteIntervention[];
  };
}

/** Le relevé tel que l'espace le lit : données, fraîcheur, dernière erreur. */
export interface SiteState {
  projectId: number;
  snapshot: SiteSnapshot | null;
  fetchedAt: Date | null;
  error: string | null;
  errorAt: Date | null;
}

export interface SiteReport {
  id: string;
  name: string;
  periodStart: Date | null;
  periodEnd: Date | null;
  generatedAt: Date | null;
  fileId: string | null;
}
