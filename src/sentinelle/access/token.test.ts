import { describe, expect, it } from "vitest";
import {
  createMagicToken,
  hashToken,
  magicLinkSecret,
  verifyMagicToken,
  MAGIC_LINK_TTL_MS,
  MIN_SECRET_LENGTH,
} from "./token";

const SECRET = "secret-de-test-suffisamment-long-pour-passer";
const AUTRE_SECRET = "un-autre-secret-de-test-tout-aussi-long-que-le-premier";
const CLIENT = "11111111-2222-3333-4444-555555555555";
const NOW = new Date("2026-08-15T10:00:00Z");

describe("magicLinkSecret", () => {
  it("lève quand la variable manque", () => {
    expect(() => magicLinkSecret({})).toThrow(/MAGIC_LINK_SECRET manquante/);
  });

  it("lève sur un secret trop court plutôt que de signer avec du devinable", () => {
    const court = "a".repeat(MIN_SECRET_LENGTH - 1);
    expect(() => magicLinkSecret({ MAGIC_LINK_SECRET: court })).toThrow(/trop courte/);
  });

  it("accepte un secret suffisant, espaces de bord retirés", () => {
    expect(magicLinkSecret({ MAGIC_LINK_SECRET: `  ${SECRET}  ` })).toBe(SECRET);
  });
});

describe("createMagicToken", () => {
  it("porte l'identifiant du client et l'expiration attendue", () => {
    const issued = createMagicToken(CLIENT, SECRET, NOW);

    expect(issued.expiresAt.getTime()).toBe(NOW.getTime() + MAGIC_LINK_TTL_MS);
    expect(issued.token.startsWith(`${CLIENT}.`)).toBe(true);
  });

  it("ne stocke jamais le jeton lui-même, seulement son condensat", () => {
    const issued = createMagicToken(CLIENT, SECRET, NOW);

    expect(issued.tokenHash).toBe(hashToken(issued.token));
    expect(issued.tokenHash).not.toContain(issued.token);
    expect(issued.tokenHash).toHaveLength(64);
  });

  it("produit deux jetons différents à la même milliseconde", () => {
    // Sans nonce, l'index unique sur le condensat rejetterait le second lien
    // demandé dans la même milliseconde pour le même client.
    const a = createMagicToken(CLIENT, SECRET, NOW);
    const b = createMagicToken(CLIENT, SECRET, NOW);

    expect(a.token).not.toBe(b.token);
    expect(a.tokenHash).not.toBe(b.tokenHash);
  });
});

describe("verifyMagicToken", () => {
  it("accepte un jeton frais et rend l'identifiant du client", () => {
    const { token } = createMagicToken(CLIENT, SECRET, NOW);
    const check = verifyMagicToken(token, SECRET, NOW);

    expect(check).toMatchObject({ valid: true, clientId: CLIENT });
  });

  it("refuse un jeton absent ou mal formé", () => {
    expect(verifyMagicToken(null, SECRET, NOW)).toMatchObject({ reason: "absent" });
    expect(verifyMagicToken("", SECRET, NOW)).toMatchObject({ reason: "absent" });
    expect(verifyMagicToken("abc.def", SECRET, NOW)).toMatchObject({ reason: "malformé" });
  });

  it("refuse un jeton signé avec un autre secret", () => {
    const { token } = createMagicToken(CLIENT, AUTRE_SECRET, NOW);
    expect(verifyMagicToken(token, SECRET, NOW)).toMatchObject({ reason: "signature" });
  });

  it("refuse une expiration réécrite, et répond « signature » et non « expiré »", () => {
    // Répondre « expiré » sur un jeton forgé dirait qu'il a été valide un jour.
    const { token } = createMagicToken(CLIENT, SECRET, NOW);
    const [clientId, , nonce, signature] = token.split(".");
    const prolonge = [clientId, NOW.getTime() + 10 * MAGIC_LINK_TTL_MS, nonce, signature].join(".");

    expect(verifyMagicToken(prolonge, SECRET, NOW)).toMatchObject({ reason: "signature" });
  });

  it("refuse un jeton pour un autre client, même signature intacte", () => {
    const { token } = createMagicToken(CLIENT, SECRET, NOW);
    const parts = token.split(".");
    parts[0] = "99999999-9999-9999-9999-999999999999";

    expect(verifyMagicToken(parts.join("."), SECRET, NOW)).toMatchObject({
      reason: "signature",
    });
  });

  it("expire à la minute près, pas à la journée", () => {
    const { token } = createMagicToken(CLIENT, SECRET, NOW);
    const avant = new Date(NOW.getTime() + MAGIC_LINK_TTL_MS - 1000);
    const apres = new Date(NOW.getTime() + MAGIC_LINK_TTL_MS + 1000);

    expect(verifyMagicToken(token, SECRET, avant)).toMatchObject({ valid: true });
    expect(verifyMagicToken(token, SECRET, apres)).toMatchObject({ reason: "expiré" });
  });
});
