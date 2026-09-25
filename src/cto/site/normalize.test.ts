import { describe, expect, it } from "vitest";
import {
  backups,
  buildSnapshot,
  interventions,
  isoDate,
  performanceScore,
  pluginUpdates,
  themeUpdates,
  uptime,
  vulnerabilities,
} from "./normalize";

// Les formes ci-dessous reprennent les EXEMPLES de la spécification publique de
// WP Umbrella (openapi-public.json). L'API ne publie pas de schéma : ces tests
// fixent ce qu'on sait lire, et vérifient qu'une réponse inattendue dégrade le
// relevé au lieu de le casser.

describe("relevé WP Umbrella", () => {
  it("accepte dates ISO et horodatages Unix", () => {
    expect(isoDate("2026-09-01T10:00:00Z")).toBe("2026-09-01T10:00:00.000Z");
    expect(isoDate(1788220800)).toBe(new Date(1788220800 * 1000).toISOString());
    expect(isoDate("pas une date")).toBeNull();
    expect(isoDate(null)).toBeNull();
  });

  it("ramène le score de performance sur 100, quelle que soit l'échelle", () => {
    expect(performanceScore(0.95)).toBe(95);
    expect(performanceScore(85.5)).toBe(86);
    expect(performanceScore(140)).toBeNull();
    expect(performanceScore("n/a")).toBeNull();
  });

  it("ne garde que les extensions qui ont une mise à jour", () => {
    expect(
      pluginUpdates([
        { name: "Yoast SEO", version: "22.0", need_update: { new_version: "23.1" } },
        { name: "Akismet", version: "5.3", need_update: {} },
        { slug: "wp-rocket", version: "3.15", need_update: true },
        "bruit",
      ]),
    ).toEqual([
      { name: "Yoast SEO", version: "22.0", newVersion: "23.1" },
      { name: "wp-rocket", version: "3.15", newVersion: null },
    ]);
  });

  it("repère un thème en retard sur sa dernière version", () => {
    expect(
      themeUpdates([
        { name: "Astra", version: "4.6", latest_version: "4.8" },
        { name: "À jour", version: "1.0", latest_version: "1.0" },
      ]),
    ).toEqual([{ name: "Astra", version: "4.6", newVersion: "4.8" }]);
  });

  it("met à plat les vulnérabilités, la plus grave en tête", () => {
    const result = vulnerabilities({
      plugin_vulnerabilities: [
        {
          plugin: { name: "Contact Form 7" },
          vulnerabilities: [{ title: "XSS", cvss_score: 5.4, version_fixed_in: "5.9.2" }],
        },
      ],
      wordpress_vulnerabilities: { vulnerabilities: [{ title: "SQLi cœur", cvss_score: 8.1 }] },
      last_scan_date: "2026-09-24T02:00:00Z",
    });
    expect(result.items.map((v) => [v.component, v.cvss])).toEqual([
      ["WordPress", 8.1],
      ["Contact Form 7", 5.4],
    ]);
    expect(result.lastScanAt).toBe("2026-09-24T02:00:00.000Z");
  });

  it("lit la disponibilité et laisse null quand la surveillance est coupée", () => {
    expect(uptime({ monitoring_enabled: false, uptime_percentage: null, incidents: [] }).percentage).toBeNull();
    const u = uptime({
      monitoring_enabled: true,
      uptime_percentage: 99.9612,
      incidents: [{ started_at: "2026-09-02T03:00:00Z", ended_at: "2026-09-02T03:05:00Z", duration_seconds: 300 }],
    });
    expect(u.percentage).toBe(99.96);
    expect(u.incidents).toHaveLength(1);
  });

  it("trie les sauvegardes et normalise leur statut", () => {
    const list = backups([
      { date: 1788000000, status: "FINISHED", size_bytes: 1024 },
      { date: 1788100000, status: "ERROR" },
    ]);
    expect(list.map((b) => b.status)).toEqual(["error", "finished"]);
  });

  it("traduit les interventions de maintenance", () => {
    expect(
      interventions([
        { type: "UPDATE_PLUGIN", created_at: "2026-09-20T01:00:00Z", entities: { name: "Yoast", old_version: "22", version: "23" } },
        { type: "INCONNU", created_at: "2026-09-21T01:00:00Z" },
      ]).map((t) => t.label),
    ).toEqual(["Intervention", "Mise à jour d'extension"]);
  });

  it("construit un relevé complet même quand toutes les parties facultatives manquent", () => {
    const snapshot = buildSnapshot({
      project: {
        name: "Mastora",
        base_url: "https://mastora.fr",
        is_currently_down: false,
        warnings: { wordpress_version: "6.6.2", php_current_version: "8.1", php_is_secure: true, is_ssl: true },
        latest_performance_score: 0.82,
      },
      plugins: undefined,
      themes: undefined,
      vulnerabilities: undefined,
      uptime: undefined,
      backups: undefined,
      tasks: undefined,
    });
    expect(snapshot.site).toMatchObject({ name: "Mastora", wordpress: "6.6.2", php: "8.1", performance: 82 });
    expect(snapshot.updates.plugins).toEqual([]);
    expect(snapshot.uptime.percentage).toBeNull();
  });
});
