import { describe, expect, it } from "vitest";
import { createMagicToken } from "./token";
import {
  createClientSessionToken,
  sessionMaxAgeSeconds,
  verifyClientSessionToken,
  CLIENT_SESSION_TTL_MS,
} from "./session";

const SECRET = "secret-de-test-suffisamment-long-pour-passer";
const CLIENT = "11111111-2222-3333-4444-555555555555";
const NOW = new Date("2026-08-15T10:00:00Z");

describe("session de l'espace client", () => {
  it("ouvre et relit une session", () => {
    const token = createClientSessionToken(CLIENT, SECRET, NOW);

    expect(verifyClientSessionToken(token, SECRET, NOW)).toMatchObject({
      valid: true,
      clientId: CLIENT,
    });
  });

  it("refuse un cookie absent, tronqué ou signé ailleurs", () => {
    expect(verifyClientSessionToken(null, SECRET, NOW)).toMatchObject({ reason: "absent" });
    expect(verifyClientSessionToken(`${CLIENT}.123`, SECRET, NOW)).toMatchObject({
      reason: "malformé",
    });
    expect(
      verifyClientSessionToken(createClientSessionToken(CLIENT, "un-autre-secret-tout-aussi-long-que-lautre", NOW), SECRET, NOW),
    ).toMatchObject({ reason: "signature" });
  });

  it("refuse une session dont l'identifiant a été échangé", () => {
    const token = createClientSessionToken(CLIENT, SECRET, NOW);
    const parts = token.split(".");
    parts[0] = "99999999-9999-9999-9999-999999999999";

    expect(verifyClientSessionToken(parts.join("."), SECRET, NOW)).toMatchObject({
      reason: "signature",
    });
  });

  it("expire au terme annoncé", () => {
    const token = createClientSessionToken(CLIENT, SECRET, NOW);
    const apres = new Date(NOW.getTime() + CLIENT_SESSION_TTL_MS + 1000);

    expect(verifyClientSessionToken(token, SECRET, apres)).toMatchObject({ reason: "expiré" });
  });

  it("ne confond jamais un lien magique avec une session", () => {
    // Un jeton de lien voyage dans une URL — donc dans des historiques et des
    // journaux de serveur. S'il valait cookie de session, la fuite serait
    // permanente. Les deux signatures ont des préfixes distincts, exprès.
    const { token } = createMagicToken(CLIENT, SECRET, NOW);
    expect(verifyClientSessionToken(token, SECRET, NOW)).toMatchObject({ valid: false });

    const session = createClientSessionToken(CLIENT, SECRET, NOW);
    expect(session.split(".")).toHaveLength(3);
  });

  it("annonce une durée en secondes cohérente avec le TTL", () => {
    expect(sessionMaxAgeSeconds()).toBe(CLIENT_SESSION_TTL_MS / 1000);
  });
});
