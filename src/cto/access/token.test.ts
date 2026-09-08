import { describe, expect, it } from "vitest";
import {
  accessSecret,
  createMagicToken,
  createSessionToken,
  hashToken,
  shouldSlide,
  verifyMagicToken,
  MAGIC_LINK_TTL_MS,
  MIN_SECRET_LENGTH,
  SESSION_TTL_MS,
} from "./token";

const SECRET = "u".repeat(MIN_SECRET_LENGTH + 8);
const PERSON = "3f7c1a2e-0000-4000-8000-000000000001";

describe("accessSecret", () => {
  it("refuse une variable absente", () => {
    expect(() => accessSecret({})).toThrow(/CTO_ACCESS_SECRET manquante/);
  });

  it("refuse un secret trop court plutôt que de signer avec", () => {
    expect(() => accessSecret({ CTO_ACCESS_SECRET: "court" })).toThrow(/trop courte/);
  });

  it("accepte un secret de longueur suffisante", () => {
    expect(accessSecret({ CTO_ACCESS_SECRET: SECRET })).toBe(SECRET);
  });
});

describe("jeton de lien magique", () => {
  it("se vérifie avec le bon secret", () => {
    const issued = createMagicToken(PERSON, SECRET);
    const check = verifyMagicToken(issued.token, SECRET);

    expect(check.valid).toBe(true);
    if (check.valid) {
      expect(check.personId).toBe(PERSON);
      expect(check.tokenHash).toBe(issued.tokenHash);
    }
  });

  it("ne stocke jamais le jeton, seulement son condensat", () => {
    const issued = createMagicToken(PERSON, SECRET);
    expect(issued.tokenHash).toBe(hashToken(issued.token));
    expect(issued.tokenHash).not.toContain(issued.token);
  });

  it("rejette un jeton signé avec un autre secret", () => {
    const issued = createMagicToken(PERSON, SECRET);
    const check = verifyMagicToken(issued.token, `${SECRET}x`);

    expect(check).toEqual({ valid: false, reason: "signature" });
  });

  it("rejette une charge utile modifiée après signature", () => {
    const issued = createMagicToken(PERSON, SECRET);
    const [, expiry, nonce, signature] = issued.token.split(".");
    const forged = `autre-personne.${expiry}.${nonce}.${signature}`;

    expect(verifyMagicToken(forged, SECRET)).toEqual({ valid: false, reason: "signature" });
  });

  it("rejette un jeton échu", () => {
    const now = new Date("2026-09-08T10:00:00Z");
    const issued = createMagicToken(PERSON, SECRET, now);
    const later = new Date(now.getTime() + MAGIC_LINK_TTL_MS + 1000);

    expect(verifyMagicToken(issued.token, SECRET, later)).toEqual({
      valid: false,
      reason: "expiré",
    });
  });

  it("rejette proprement l'absence et le malformé, sans lever", () => {
    expect(verifyMagicToken(null, SECRET)).toEqual({ valid: false, reason: "absent" });
    expect(verifyMagicToken("a.b.c", SECRET)).toEqual({ valid: false, reason: "malformé" });
  });

  it("produit deux jetons distincts pour la même personne au même instant", () => {
    // Sans l'aléa, leurs condensats entreraient en collision sur l'index unique
    // et la seconde demande de lien échouerait.
    const now = new Date("2026-09-08T10:00:00Z");
    const a = createMagicToken(PERSON, SECRET, now);
    const b = createMagicToken(PERSON, SECRET, now);

    expect(a.token).not.toBe(b.token);
    expect(a.tokenHash).not.toBe(b.tokenHash);
  });
});

describe("jeton de session", () => {
  it("ne porte aucune information exploitable", () => {
    const issued = createSessionToken();

    expect(issued.token).not.toContain(PERSON);
    expect(issued.token).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(issued.tokenHash).toBe(hashToken(issued.token));
  });

  it("est différent à chaque émission", () => {
    const a = createSessionToken();
    const b = createSessionToken();
    expect(a.token).not.toBe(b.token);
  });
});

describe("session glissante", () => {
  const now = new Date("2026-09-08T10:00:00Z");

  it("ne repousse pas une échéance qui vient d'être posée", () => {
    const fresh = new Date(now.getTime() + SESSION_TTL_MS);
    expect(shouldSlide(fresh, now)).toBe(false);
  });

  it("repousse une échéance vieille de plusieurs heures", () => {
    const stale = new Date(now.getTime() + SESSION_TTL_MS - 5 * 60 * 60 * 1000);
    expect(shouldSlide(stale, now)).toBe(true);
  });
});
