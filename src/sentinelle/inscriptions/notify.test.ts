import { describe, expect, it } from "vitest";
import { composerNotification, destinataire } from "./notify";

const demande = {
  email: "dirigeante@exemple.fr",
  name: "Camille <Martin>",
  organisation: "Mastora",
  siteUrl: "https://mastora.fr/",
  originScanId: null,
};

const admin = "https://next-impact.digital/admin/sentinelle/inscriptions";

describe("composerNotification", () => {
  it("donne à Agathe tout ce qu'il faut pour valider", () => {
    const mail = composerNotification(demande, { admin, rapport: null });
    expect(mail.subject).toBe("Inscription Sentinelle à valider : Mastora");
    expect(mail.text).toContain("E-mail : dirigeante@exemple.fr");
    expect(mail.text).toContain("Origine : page Sentinelle");
    expect(mail.text).toContain(`À valider : ${admin}`);
  });

  it("cite le rapport quand la demande en vient", () => {
    const mail = composerNotification(demande, { admin, rapport: "https://next-impact.digital/scan/x" });
    expect(mail.text).toContain("Origine : rapport d'analyse https://next-impact.digital/scan/x");
  });

  it("échappe ce que le demandeur a saisi", () => {
    const mail = composerNotification(demande, { admin, rapport: null });
    expect(mail.html).toContain("Camille &lt;Martin&gt;");
    expect(mail.html).not.toContain("<Martin>");
  });
});

describe("destinataire", () => {
  it("préfère l'adresse dédiée, sinon le répondre-à de Sentinelle", () => {
    expect(destinataire({ SENTINELLE_LEADS_TO: "a@x.fr", SENTINELLE_MAIL_REPLY_TO: "b@x.fr" })).toBe("a@x.fr");
    expect(destinataire({ SENTINELLE_MAIL_REPLY_TO: "b@x.fr" })).toBe("b@x.fr");
    expect(destinataire({})).toBeNull();
  });
});
