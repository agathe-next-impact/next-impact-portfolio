import type {
  SiteBackup,
  SiteIncident,
  SiteIntervention,
  SiteSnapshot,
  SiteUpdate,
  SiteVulnerability,
} from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Des réponses WP Umbrella au relevé de l'espace.
//
// Pur, sans réseau : c'est ici que se concentre tout ce qui peut casser le jour
// où WP Umbrella change un champ, et c'est donc ici que portent les tests.
//
// Même règle que `src/cto/notion/properties.ts` : un champ absent, vide ou d'un
// type inattendu rend `null`, jamais une exception. L'API ne publie que des
// exemples, pas de schéma — lire défensivement n'est pas une précaution de
// style, c'est la seule lecture honnête d'un contrat qu'on n'a pas.
// ─────────────────────────────────────────────────────────────────────────────

type Json = Record<string, unknown>;

function obj(value: unknown): Json | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Json) : null;
}

function arr(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function str(value: unknown): string | null {
  if (typeof value === "string") return value.trim() || null;
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
}

function num(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) {
    return Number(value);
  }
  return null;
}

function bool(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

/**
 * Une date de l'API, en ISO. WP Umbrella mélange chaînes ISO et horodatages
 * Unix (secondes) selon les endpoints ; les deux sont acceptés.
 */
export function isoDate(value: unknown): string | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    const ms = value < 1e12 ? value * 1000 : value;
    const date = new Date(ms);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }
  if (typeof value === "string" && value.trim() !== "") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }
  return null;
}

/**
 * Score de performance ramené sur 100.
 *
 * Les exemples de l'API donnent tantôt 0.95, tantôt 85.5 : on ne sait pas
 * lequel est la vérité, alors on accepte les deux. Sous 1, c'est une fraction.
 */
export function performanceScore(value: unknown): number | null {
  const score = num(value);
  if (score === null || score < 0) return null;
  const sur100 = score <= 1 ? score * 100 : score;
  return sur100 > 100 ? null : Math.round(sur100);
}

/** Les extensions dont une mise à jour attend, depuis `/projects/{id}/plugins`. */
export function pluginUpdates(plugins: unknown): SiteUpdate[] {
  const out: SiteUpdate[] = [];
  for (const item of arr(plugins)) {
    const plugin = obj(item);
    if (!plugin) continue;
    const update = obj(plugin.need_update);
    // `need_update` vaut `{}` sans mise à jour, un objet décrit sinon — et un
    // booléen dans le résumé du projet. Seul un objet avec une version compte.
    const newVersion = update ? str(update.new_version) : null;
    if (!newVersion && plugin.need_update !== true) continue;
    out.push({
      name: str(plugin.name) ?? str(plugin.slug) ?? str(plugin.key) ?? "extension",
      version: str(plugin.version),
      newVersion,
    });
  }
  return out;
}

/** Les thèmes en retard, depuis `/projects/{id}/themes`. */
export function themeUpdates(themes: unknown): SiteUpdate[] {
  const out: SiteUpdate[] = [];
  for (const item of arr(themes)) {
    const theme = obj(item);
    if (!theme) continue;
    const version = str(theme.version);
    const latest = str(theme.latest_version);
    if (!latest || !version || latest === version) continue;
    out.push({ name: str(theme.name) ?? str(theme.stylesheet) ?? "thème", version, newVersion: latest });
  }
  return out;
}

/** Les vulnérabilités connues, à plat, la plus grave en tête. */
export function vulnerabilities(payload: unknown): {
  items: SiteVulnerability[];
  lastScanAt: string | null;
} {
  const data = obj(payload);
  if (!data) return { items: [], lastScanAt: null };

  const items: SiteVulnerability[] = [];
  const push = (component: string, list: unknown) => {
    for (const entry of arr(list)) {
      const v = obj(entry);
      if (!v) continue;
      items.push({
        component,
        title: str(v.title) ?? "vulnérabilité",
        cvss: num(v.cvss_score),
        fixedIn: str(v.version_fixed_in),
        disclosedAt: isoDate(v.disclosure_date),
      });
    }
  };

  for (const entry of arr(data.plugin_vulnerabilities)) {
    const e = obj(entry);
    push(str(obj(e?.plugin)?.name) ?? "extension", e?.vulnerabilities);
  }
  for (const entry of arr(data.theme_vulnerabilities)) {
    const e = obj(entry);
    push(str(obj(e?.theme)?.name) ?? "thème", e?.vulnerabilities);
  }
  const wp = obj(data.wordpress_vulnerabilities);
  if (wp) push("WordPress", wp.vulnerabilities);

  items.sort((a, b) => (b.cvss ?? -1) - (a.cvss ?? -1));
  return { items, lastScanAt: isoDate(data.last_scan_date) };
}

export function uptime(payload: unknown): SiteSnapshot["uptime"] {
  const data = obj(payload);
  if (!data) return { enabled: null, percentage: null, from: null, to: null, incidents: [] };

  const incidents: SiteIncident[] = [];
  for (const entry of arr(data.incidents)) {
    const i = obj(entry);
    const startedAt = isoDate(i?.started_at);
    if (!i || !startedAt) continue;
    incidents.push({
      startedAt,
      endedAt: isoDate(i.ended_at),
      durationSeconds: num(i.duration_seconds),
    });
  }
  incidents.sort((a, b) => b.startedAt.localeCompare(a.startedAt));

  const pct = num(data.uptime_percentage);
  return {
    enabled: bool(data.monitoring_enabled),
    percentage: pct === null ? null : Math.round(pct * 100) / 100,
    from: isoDate(data.from),
    to: isoDate(data.to),
    incidents: incidents.slice(0, 20),
  };
}

export function backups(payload: unknown): SiteBackup[] {
  const out: SiteBackup[] = [];
  for (const entry of arr(payload)) {
    const b = obj(entry);
    const date = isoDate(b?.date_finished) ?? isoDate(b?.date);
    if (!b || !date) continue;
    out.push({
      date,
      status: (str(b.status) ?? "inconnu").toLowerCase(),
      sizeBytes: num(b.size_bytes),
    });
  }
  out.sort((a, b) => b.date.localeCompare(a.date));
  return out.slice(0, 10);
}

const TASK_LABELS: Record<string, string> = {
  UPDATE_PLUGIN: "Mise à jour d'extension",
  UPDATE_THEME: "Mise à jour de thème",
  UPDATE_CORE: "Mise à jour de WordPress",
  ACTIVATE_PLUGIN: "Activation d'extension",
  DEACTIVATE_PLUGIN: "Désactivation d'extension",
  DELETE_PLUGIN: "Suppression d'extension",
  DELETE_THEME: "Suppression de thème",
  OPTIMIZE_DATABASE: "Optimisation de la base",
};

export function interventions(payload: unknown): SiteIntervention[] {
  const out: SiteIntervention[] = [];
  for (const entry of arr(payload)) {
    const t = obj(entry);
    const date = isoDate(t?.created_at);
    if (!t || !date) continue;
    const type = str(t.type) ?? "";
    const entities = obj(t.entities);
    out.push({
      date,
      label: TASK_LABELS[type] ?? "Intervention",
      target: str(entities?.name),
      from: str(entities?.old_version),
      to: str(entities?.version),
    });
  }
  out.sort((a, b) => b.date.localeCompare(a.date));
  return out.slice(0, 30);
}

/** Le relevé complet, depuis les réponses DÉJÀ déballées (`data`) de chaque endpoint. */
export function buildSnapshot(parts: {
  project: unknown;
  plugins: unknown;
  themes: unknown;
  vulnerabilities: unknown;
  uptime: unknown;
  backups: unknown;
  tasks: unknown;
}): SiteSnapshot {
  const project = obj(parts.project) ?? {};
  const warnings = obj(project.warnings) ?? {};
  const sync = obj(project.last_synchronization);

  return {
    site: {
      name: str(project.name),
      url: str(project.base_url),
      wordpress: str(warnings.wordpress_version),
      php: str(warnings.php_current_version),
      phpRecommended: str(warnings.php_recommended_version),
      phpSecure: bool(warnings.php_is_secure),
      ssl: bool(warnings.is_ssl),
      performance: performanceScore(project.latest_performance_score),
      lastSyncAt: isoDate(sync?.date_with_success) ?? isoDate(sync?.date),
    },
    status: {
      down: bool(project.is_currently_down),
      disconnected: bool(project.is_disconnected),
    },
    updates: {
      plugins: pluginUpdates(parts.plugins),
      themes: themeUpdates(parts.themes),
    },
    vulnerabilities: vulnerabilities(parts.vulnerabilities),
    uptime: uptime(parts.uptime),
    backups: { recent: backups(parts.backups) },
    maintenance: { recent: interventions(parts.tasks) },
  };
}
