import { describe, expect, it } from "vitest";
import {
  adminPassword,
  createSessionToken,
  MIN_PASSWORD_LENGTH,
  safeEqual,
  SESSION_TTL_MS,
  verifySessionToken,
} from "./session";

const PASSWORD = "mot-de-passe-de-test-tres-long";
const NOW = new Date("2026-08-15T10:00:00Z");

describe("adminPassword", () => {
  it("lève quand la variable manque", () => {
    expect(() => adminPassword({})).toThrow(/SENTINELLE_ADMIN_PASSWORD manquante/);
  });

  it("lève sur un mot de passe trop court plutôt que de protéger à moitié", () => {
    const court = "a".repeat(MIN_PASSWORD_LENGTH - 1);
    expect(() => adminPassword({ SENTINELLE_ADMIN_PASSWORD: court })).toThrow(/trop courte/);
  });

  it("accepte un mot de passe de longueur suffisante, espaces de bord retirés", () => {
    expect(adminPassword({ SENTINELLE_ADMIN_PASSWORD: `  ${PASSWORD}  ` })).toBe(PASSWORD);
  });
});

describe("safeEqual", () => {
  it("reconnaît deux chaînes identiques", () => {
    expect(safeEqual(PASSWORD, PASSWORD)).toBe(true);
  });

  it("refuse une chaîne différente, y compris de longueur différente", () => {
    expect(safeEqual(PASSWORD, `${PASSWORD}x`)).toBe(false);
    expect(safeEqual(PASSWORD, "")).toBe(false);
    expect(safeEqual("", "")).toBe(true);
  });
});

describe("verifySessionToken", () => {
  it("accepte un jeton fraîchement émis", () => {
    const token = createSessionToken(PASSWORD, NOW);
    const check = verifySessionToken(token, PASSWORD, NOW);

    expect(check.valid).toBe(true);
    if (check.valid) {
      expect(check.expiresAt.getTime()).toBe(NOW.getTime() + SESSION_TTL_MS);
    }
  });

  it("refuse un jeton absent ou malformé", () => {
    expect(verifySessionToken(null, PASSWORD, NOW)).toEqual({ valid: false, reason: "absent" });
    expect(verifySessionToken("", PASSWORD, NOW)).toEqual({ valid: false, reason: "absent" });
    expect(verifySessionToken("sans-point", PASSWORD, NOW)).toEqual({
      valid: false,
      reason: "malformé",
    });
    expect(verifySessionToken("abc.def", PASSWORD, NOW)).toEqual({
      valid: false,
      reason: "malformé",
    });
  });

  it("refuse un jeton signé avec un autre mot de passe — changer le mot de passe ferme les sessions", () => {
    const token = createSessionToken(PASSWORD, NOW);
    expect(verifySessionToken(token, "un-autre-mot-de-passe-long", NOW)).toEqual({
      valid: false,
      reason: "signature",
    });
  });

  it("refuse un jeton dont l'expiration a été repoussée à la main", () => {
    const token = createSessionToken(PASSWORD, NOW);
    const signature = token.slice(token.indexOf(".") + 1);
    const repousse = `${NOW.getTime() + 10 * SESSION_TTL_MS}.${signature}`;

    expect(verifySessionToken(repousse, PASSWORD, NOW)).toEqual({
      valid: false,
      reason: "signature",
    });
  });

  it("refuse un jeton expiré, à la milliseconde près", () => {
    const token = createSessionToken(PASSWORD, NOW);
    const juste = new Date(NOW.getTime() + SESSION_TTL_MS - 1);
    const trop = new Date(NOW.getTime() + SESSION_TTL_MS);

    expect(verifySessionToken(token, PASSWORD, juste).valid).toBe(true);
    expect(verifySessionToken(token, PASSWORD, trop)).toEqual({ valid: false, reason: "expiré" });
  });

  it("dit « signature » et non « expiré » sur un jeton forgé au passé", () => {
    // Sinon la réponse « expiré » renseignerait l'attaquant : elle signifierait
    // que sa signature, elle, était bonne.
    const forge = `${NOW.getTime() - 1000}.deadbeef`;
    expect(verifySessionToken(forge, PASSWORD, NOW)).toEqual({
      valid: false,
      reason: "signature",
    });
  });
});
