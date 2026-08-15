import { describe, expect, it } from "vitest";
import { formatAddress, resolveMailConfig, type MailEnv } from "./config";

// Environnement minimal valide — chaque test part de là et ne change qu'un point.
const base = {
  SENTINELLE_SMTP_USER: "veille@next-impact.digital",
  SENTINELLE_SMTP_PASS: "abcdefghijklmnop",
} satisfies MailEnv;

describe("resolveMailConfig", () => {
  it("vise Google en TLS implicite par défaut", () => {
    const config = resolveMailConfig(base);

    expect(config.host).toBe("smtp.gmail.com");
    expect(config.port).toBe(465);
    expect(config.secure).toBe(true);
  });

  it("bascule en STARTTLS sur le port 587", () => {
    expect(resolveMailConfig({ ...base, SENTINELLE_SMTP_PORT: "587" }).secure).toBe(false);
  });

  it("retire les espaces du mot de passe d'application", () => {
    // Google l'affiche par groupes de quatre ; collé tel quel, l'auth échoue.
    const config = resolveMailConfig({ ...base, SENTINELLE_SMTP_PASS: "abcd efgh ijkl mnop" });

    expect(config.pass).toBe("abcdefghijklmnop");
  });

  it("expédie sous le compte authentifié quand aucun From n'est donné", () => {
    expect(resolveMailConfig(base).from).toBe('"Sentinelle" <veille@next-impact.digital>');
  });

  it("respecte un From explicite", () => {
    const config = resolveMailConfig({
      ...base,
      SENTINELLE_MAIL_FROM: "Sentinelle <veille@next-impact.digital>",
    });

    expect(config.from).toBe("Sentinelle <veille@next-impact.digital>");
  });

  it("n'invente pas de reply-to", () => {
    expect(resolveMailConfig(base).replyTo).toBeNull();
    expect(
      resolveMailConfig({ ...base, SENTINELLE_MAIL_REPLY_TO: "agathe@next-impact.digital" }).replyTo,
    ).toBe("agathe@next-impact.digital");
  });

  it("nomme la variable manquante plutôt que d'échouer à l'envoi", () => {
    expect(() => resolveMailConfig({ SENTINELLE_SMTP_PASS: "x" })).toThrow(
      /SENTINELLE_SMTP_USER/,
    );
    expect(() => resolveMailConfig({ SENTINELLE_SMTP_USER: "x@y.z" })).toThrow(
      /SENTINELLE_SMTP_PASS/,
    );
  });

  it("ne se rabat jamais sur les variables de la vitrine", () => {
    // Une veille qui part sous l'identité du site serait pire qu'un envoi manqué.
    expect(() =>
      resolveMailConfig({
        NODEMAILER_USER: "agathe@next-impact.digital",
        NODEMAILER_PASS: "abcdefghijklmnop",
      }),
    ).toThrow(/SENTINELLE_SMTP_USER/);
  });

  it("refuse un port illisible", () => {
    expect(() => resolveMailConfig({ ...base, SENTINELLE_SMTP_PORT: "quatre-cent" })).toThrow(
      /SENTINELLE_SMTP_PORT/,
    );
  });
});

describe("formatAddress", () => {
  it("met le nom entre guillemets", () => {
    expect(formatAddress("Sentinelle", "veille@next-impact.digital")).toBe(
      '"Sentinelle" <veille@next-impact.digital>',
    );
  });

  it("neutralise un guillemet dans le nom", () => {
    expect(formatAddress('Sentinelle "veille"', "a@b.c")).toBe('"Sentinelle veille" <a@b.c>');
  });
});
