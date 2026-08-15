import { describe, expect, it } from "vitest";
import type { MailConfig } from "./config";
import { sendSentinelleMail, verifyMailTransport, type MailTransport } from "./send";

const config: MailConfig = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  user: "veille@next-impact.digital",
  pass: "abcdefghijklmnop",
  from: '"Sentinelle" <veille@next-impact.digital>',
  replyTo: "agathe@next-impact.digital",
};

/** Transport simulé : aucune connexion, on inspecte ce qui lui est passé. */
function fakeTransport(overrides: Partial<MailTransport> = {}) {
  const sent: Parameters<MailTransport["sendMail"]>[0][] = [];
  const transport: MailTransport = {
    async sendMail(message) {
      sent.push(message);
      return { messageId: "<test@sentinelle>" };
    },
    ...overrides,
  };
  return { transport, sent };
}

describe("sendSentinelleMail", () => {
  it("expédie sous l'identité configurée et remonte l'identifiant", async () => {
    const { transport, sent } = fakeTransport();

    const result = await sendSentinelleMail(
      { to: "client@example.com", subject: "Alerte", html: "<p>Bonjour</p>" },
      { transport, config },
    );

    expect(result.messageId).toBe("<test@sentinelle>");
    expect(sent).toHaveLength(1);
    expect(sent[0].from).toBe('"Sentinelle" <veille@next-impact.digital>');
    expect(sent[0].replyTo).toBe("agathe@next-impact.digital");
  });

  it("laisse un message surcharger le reply-to", async () => {
    const { transport, sent } = fakeTransport();

    await sendSentinelleMail(
      { to: "c@example.com", subject: "S", html: "<p>x</p>", replyTo: "autre@example.com" },
      { transport, config },
    );

    expect(sent[0].replyTo).toBe("autre@example.com");
  });

  it("n'ajoute ni texte ni en-têtes quand rien n'est fourni", async () => {
    // Un `text: undefined` transmis au transport produit une partie vide.
    const { transport, sent } = fakeTransport();

    await sendSentinelleMail({ to: "c@example.com", subject: "S", html: "<p>x</p>" }, {
      transport,
      config,
    });

    expect("text" in sent[0]).toBe(false);
    expect("headers" in sent[0]).toBe(false);
  });

  it("transmet les en-têtes de désabonnement de la newsletter", async () => {
    const { transport, sent } = fakeTransport();

    await sendSentinelleMail(
      {
        to: "c@example.com",
        subject: "Numéro du 15",
        html: "<p>x</p>",
        text: "x",
        headers: { "List-Unsubscribe": "<https://example.com/stop>" },
      },
      { transport, config },
    );

    expect(sent[0].text).toBe("x");
    expect(sent[0].headers).toEqual({ "List-Unsubscribe": "<https://example.com/stop>" });
  });
});

describe("verifyMailTransport", () => {
  it("confirme l'identité d'expédition quand l'authentification passe", async () => {
    const { transport } = fakeTransport({ async verify() { return true; } });

    await expect(verifyMailTransport({ transport, config })).resolves.toEqual({
      ok: true,
      from: '"Sentinelle" <veille@next-impact.digital>',
    });
  });

  it("renvoie la raison plutôt que de lever", async () => {
    const { transport } = fakeTransport({
      async verify() {
        throw new Error("535 5.7.8 Username and Password not accepted");
      },
    });

    await expect(verifyMailTransport({ transport, config })).resolves.toEqual({
      ok: false,
      reason: "535 5.7.8 Username and Password not accepted",
    });
  });
});
