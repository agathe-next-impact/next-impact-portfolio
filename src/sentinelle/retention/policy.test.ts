import { describe, expect, it } from "vitest";
import {
  anonymizableAlerts,
  cutoffs,
  expiredClients,
  expiredScans,
  minus,
  RETENTION,
  type ClientRow,
  type ScanRow,
} from "./policy";

// Horloge fixe : toutes les dates du fichier se lisent par rapport à celle-ci.
const MAINTENANT = new Date("2026-08-15T03:00:00.000Z");

function ilYA(duration: Parameters<typeof minus>[1]): Date {
  return minus(MAINTENANT, duration);
}

/** Une ligne de scan par défaut : récente, anonyme, avec IP et résultat. */
function scan(overrides: Partial<ScanRow> = {}): ScanRow {
  return {
    id: overrides.id ?? "scan",
    createdAt: MAINTENANT,
    leadEmail: null,
    ipHash: "a".repeat(64),
    userAgent: "Mozilla/5.0",
    result: { url: "https://exemple.fr" },
    ...overrides,
  };
}

describe("arithmétique des durées", () => {
  it("recule d'un nombre d'heures et de jours", () => {
    expect(minus(MAINTENANT, { hours: 24 }).toISOString()).toBe("2026-08-14T03:00:00.000Z");
    expect(minus(MAINTENANT, { days: 30 }).toISOString()).toBe("2026-07-16T03:00:00.000Z");
  });

  it("compte les mois en mois calendaires", () => {
    expect(minus(MAINTENANT, { months: 12 }).toISOString()).toBe("2025-08-15T03:00:00.000Z");
    expect(minus(MAINTENANT, { years: 3 }).toISOString()).toBe("2023-08-15T03:00:00.000Z");
  });

  it("écrête le quantième au lieu de déborder sur le mois suivant", () => {
    // Un mois avant le 31 mars, c'est le 28 février — pas le 3 mars. Un report
    // silencieux allongerait la conservation au-delà de ce qui est annoncé.
    const trenteEtUnMars = new Date("2026-03-31T12:00:00.000Z");
    expect(minus(trenteEtUnMars, { months: 1 }).toISOString()).toBe("2026-02-28T12:00:00.000Z");

    const trenteEtUnMarsBissextile = new Date("2024-03-31T12:00:00.000Z");
    expect(minus(trenteEtUnMarsBissextile, { months: 1 }).toISOString()).toBe(
      "2024-02-29T12:00:00.000Z",
    );
  });

  it("expose une date limite par durée déclarée", () => {
    const limits = cutoffs(MAINTENANT);
    for (const key of Object.keys(RETENTION)) {
      expect(limits[key as keyof typeof RETENTION]).toBeInstanceOf(Date);
    }
  });
});

describe("scans", () => {
  it("efface l'empreinte d'IP passé 24 h, sans toucher au reste", () => {
    const verdict = expiredScans(
      [
        scan({ id: "recent", createdAt: ilYA({ hours: 23 }) }),
        scan({ id: "hier", createdAt: ilYA({ hours: 25 }) }),
      ],
      MAINTENANT,
    );

    expect(verdict.identifiersToClear).toEqual(["hier"]);
    expect(verdict.rowsToDelete).toEqual([]);
    expect(verdict.resultsToPurge).toEqual([]);
  });

  it("n'efface pas deux fois une empreinte déjà retirée", () => {
    const verdict = expiredScans(
      [scan({ id: "propre", createdAt: ilYA({ days: 5 }), ipHash: null, userAgent: null })],
      MAINTENANT,
    );

    expect(verdict.identifiersToClear).toEqual([]);
  });

  it("supprime un scan anonyme à 30 jours", () => {
    const verdict = expiredScans(
      [
        scan({ id: "29j", createdAt: ilYA({ days: 29 }) }),
        scan({ id: "31j", createdAt: ilYA({ days: 31 }) }),
      ],
      MAINTENANT,
    );

    expect(verdict.rowsToDelete).toEqual(["31j"]);
    // La ligne supprimée n'apparaît pas dans les autres listes : une écriture
    // pour rien, et un journal deux fois plus long à lire.
    expect(verdict.identifiersToClear).toEqual(["29j"]);
  });

  it("garde le scan d'un prospect au-delà de 30 jours et purge son résultat à 12 mois", () => {
    const verdict = expiredScans(
      [
        scan({ id: "prospect-6mois", createdAt: ilYA({ months: 6 }), leadEmail: "a@b.fr" }),
        scan({ id: "prospect-13mois", createdAt: ilYA({ months: 13 }), leadEmail: "a@b.fr" }),
      ],
      MAINTENANT,
    );

    expect(verdict.rowsToDelete).toEqual([]);
    expect(verdict.resultsToPurge).toEqual(["prospect-13mois"]);
  });

  it("supprime la ligne du prospect à 3 ans", () => {
    const verdict = expiredScans(
      [scan({ id: "vieux", createdAt: ilYA({ years: 3, days: 1 }), leadEmail: "a@b.fr" })],
      MAINTENANT,
    );

    expect(verdict.rowsToDelete).toEqual(["vieux"]);
    expect(verdict.resultsToPurge).toEqual([]);
  });

  it("ne purge pas un résultat déjà vidé", () => {
    const verdict = expiredScans(
      [scan({ id: "vide", createdAt: ilYA({ months: 18 }), leadEmail: "a@b.fr", result: null })],
      MAINTENANT,
    );

    expect(verdict.resultsToPurge).toEqual([]);
  });
});

describe("clients résiliés", () => {
  function client(overrides: Partial<ClientRow> = {}): ClientRow {
    return { id: "client", active: false, deactivatedAt: ilYA({ months: 4 }), ...overrides };
  }

  it("efface trois mois après la résiliation, pas avant", () => {
    const { toAnonymize } = expiredClients(
      [
        client({ id: "resilie-2mois", deactivatedAt: ilYA({ months: 2 }) }),
        client({ id: "resilie-4mois", deactivatedAt: ilYA({ months: 4 }) }),
      ],
      MAINTENANT,
    );

    expect(toAnonymize).toEqual(["resilie-4mois"]);
  });

  it("épargne un client réactivé, même avec une vieille date de résiliation", () => {
    // Cas produit par le rejeu d'un webhook Stripe : il ne doit pas coûter ses
    // données à un abonné payant.
    const { toAnonymize } = expiredClients(
      [client({ id: "revenu", active: true, deactivatedAt: ilYA({ months: 10 }) })],
      MAINTENANT,
    );

    expect(toAnonymize).toEqual([]);
  });

  it("ignore un client sans date de résiliation", () => {
    const { toAnonymize } = expiredClients(
      [client({ id: "actif", active: false, deactivatedAt: null })],
      MAINTENANT,
    );

    expect(toAnonymize).toEqual([]);
  });
});

describe("textes d'alertes et de numéros", () => {
  it("purge douze mois après la résiliation", () => {
    const ids = anonymizableAlerts(
      [
        { id: "recent", clientDeactivatedAt: ilYA({ months: 11 }), hasText: true },
        { id: "ancien", clientDeactivatedAt: ilYA({ months: 13 }), hasText: true },
      ],
      MAINTENANT,
    );

    expect(ids).toEqual(["ancien"]);
  });

  it("laisse tranquilles les lignes déjà vidées et les clients en cours", () => {
    const ids = anonymizableAlerts(
      [
        { id: "deja-vide", clientDeactivatedAt: ilYA({ years: 2 }), hasText: false },
        { id: "client-actif", clientDeactivatedAt: null, hasText: true },
      ],
      MAINTENANT,
    );

    expect(ids).toEqual([]);
  });
});
