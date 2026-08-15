import { describe, expect, it } from "vitest";
import {
  formatNewsletterPeriod,
  newsletterPeriodAt,
  newsletterPeriodKey,
  parseNewsletterPeriod,
  previousNewsletterPeriod,
} from "./period";

describe("newsletterPeriodAt", () => {
  it("range les 14 premiers jours dans le numéro 1", () => {
    expect(newsletterPeriodAt(new Date("2026-08-01T05:00:00Z"))).toEqual({
      year: 2026,
      month: 8,
      issue: 1,
    });
    // 14 août 20:00 UTC = 22:00 à Paris, toujours le 14.
    expect(newsletterPeriodAt(new Date("2026-08-14T20:00:00Z"))).toEqual({
      year: 2026,
      month: 8,
      issue: 1,
    });
  });

  it("bascule sur le numéro 2 à partir du 15", () => {
    expect(newsletterPeriodAt(new Date("2026-08-15T05:00:00Z")).issue).toBe(2);
    expect(newsletterPeriodAt(new Date("2026-08-31T21:00:00Z")).issue).toBe(2);
  });

  it("bascule à minuit heure de Paris, pas à minuit UTC", () => {
    // 14 août 23:00 UTC = 15 août 01:00 à Paris : c'est déjà le numéro 2.
    expect(newsletterPeriodAt(new Date("2026-08-14T23:00:00Z")).issue).toBe(2);
    // 14 août 21:00 UTC = 23:00 à Paris le 14 : encore le numéro 1.
    expect(newsletterPeriodAt(new Date("2026-08-14T21:00:00Z")).issue).toBe(1);
  });

  it("raisonne en heure de Paris, pas en UTC", () => {
    // 31 juillet 23:30 UTC = 1er août 01:30 à Paris (CEST, +2).
    // En lisant l'UTC on rangerait ce numéro en juillet.
    const parisFirstOfAugust = new Date("2026-07-31T23:30:00Z");
    expect(newsletterPeriodAt(parisFirstOfAugust)).toEqual({
      year: 2026,
      month: 8,
      issue: 1,
    });

    // 31 décembre 23:30 UTC = 1er janvier 00:30 à Paris (CET, +1) — l'année
    // change aussi.
    const parisNewYear = new Date("2026-12-31T23:30:00Z");
    expect(newsletterPeriodAt(parisNewYear)).toEqual({
      year: 2027,
      month: 1,
      issue: 1,
    });
  });

  it("produit la clé stockée en base", () => {
    expect(newsletterPeriodKey(new Date("2026-01-03T08:00:00Z"))).toBe("2026-01-1");
    expect(newsletterPeriodKey(new Date("2026-11-20T08:00:00Z"))).toBe("2026-11-2");
  });

  it("distingue bien les deux numéros d'un même mois", () => {
    // La raison d'être du format : l'index unique (clientId, period) rejetterait
    // le second envoi si les deux clés étaient identiques.
    const first = newsletterPeriodKey(new Date("2026-08-01T05:00:00Z"));
    const second = newsletterPeriodKey(new Date("2026-08-15T05:00:00Z"));
    expect(first).not.toBe(second);
  });
});

describe("formatNewsletterPeriod", () => {
  it("complète le mois sur deux chiffres", () => {
    expect(formatNewsletterPeriod({ year: 2026, month: 1, issue: 1 })).toBe("2026-01-1");
    expect(formatNewsletterPeriod({ year: 2026, month: 12, issue: 2 })).toBe("2026-12-2");
  });
});

describe("parseNewsletterPeriod", () => {
  it("relit une clé valide", () => {
    expect(parseNewsletterPeriod("2026-08-2")).toEqual({ year: 2026, month: 8, issue: 2 });
    expect(parseNewsletterPeriod("  2026-01-1  ")).toEqual({ year: 2026, month: 1, issue: 1 });
  });

  it("refuse tout le reste", () => {
    for (const key of [
      "2026-08", // ancien format mensuel
      "2026-08-3", // numéro inexistant
      "2026-13-1", // mois inexistant
      "2026-8-1", // mois non complété
      "",
      null,
      undefined,
    ]) {
      expect(parseNewsletterPeriod(key as string)).toBeNull();
    }
  });
});

describe("previousNewsletterPeriod", () => {
  it("remonte au numéro 1 du même mois", () => {
    expect(previousNewsletterPeriod({ year: 2026, month: 8, issue: 2 })).toEqual({
      year: 2026,
      month: 8,
      issue: 1,
    });
  });

  it("remonte au numéro 2 du mois précédent", () => {
    expect(previousNewsletterPeriod({ year: 2026, month: 8, issue: 1 })).toEqual({
      year: 2026,
      month: 7,
      issue: 2,
    });
  });

  it("passe l'année", () => {
    expect(previousNewsletterPeriod({ year: 2026, month: 1, issue: 1 })).toEqual({
      year: 2025,
      month: 12,
      issue: 2,
    });
  });
});
