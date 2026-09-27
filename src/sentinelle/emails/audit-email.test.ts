import { describe, expect, it } from "vitest";
import type { DiagnosticDone } from "./AuditEmail";
import { renderAuditEmail } from "./render";

const DIAGNOSTIC: DiagnosticDone = {
  status: "done",
  secteur: "Fédération sportive",
  concurrents: [],
  organisation: { tonalite: "solide", lignes: ["Une promesse claire, lisible dès l'accueil."] },
  ecosysteme: { tonalite: "a_renforcer", lignes: ["Deux concurrents répondent plus vite."] },
  dispositif: { tonalite: "fragile", lignes: ["Aucun appel à l'action au-dessus de la ligne de flottaison."] },
  conclusion: {
    issue: "refonte",
    besoin: "necessaire",
    objectif: "Transformer les visites en demandes d'adhésion.",
    lignes: ["Le socle freine le site : une refonte le remet au niveau."],
  },
  sources: [],
  genereLe: "2026-09-27T10:00:00Z",
};

describe("renderAuditEmail", () => {
  it("nomme le site dans l'objet et reprend la réponse et les quatre cases", async () => {
    const mail = await renderAuditEmail({
      diagnostic: DIAGNOSTIC,
      siteUrl: "https://exemple.fr/",
      nom: "Exemple",
      genereLe: new Date(DIAGNOSTIC.genereLe),
      rapportUrl: "https://next-impact.digital/scan/abc",
    });

    expect(mail.subject).toBe("Audit de Exemple : votre diagnostic");
    expect(mail.html).toContain("Refonte : nécessaire");
    expect(mail.text).toContain("Deux concurrents répondent plus vite.");
    expect(mail.text).toContain("Ma recommandation : Refonte");
    expect(mail.html).toContain("https://next-impact.digital/scan/abc");
    expect(mail.html).toContain("https://next-impact.digital/packs/site-wordpress-lent");
  });
});
