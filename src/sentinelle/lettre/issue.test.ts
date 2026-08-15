import { describe, expect, it } from "vitest";
import type { NewsletterBlocks } from "@sentinelle/newsletter/blocks";
import { emptyProduction, isQuietIssue, missingForIssue, parseIssue, ISSUE_VERSION } from "./issue";
import type { IssueContent } from "./issue";

function constate(overrides: Partial<NewsletterBlocks> = {}): NewsletterBlocks {
  return {
    period: "2026-08-2",
    issueDate: "2026-08-15T00:00:00.000Z",
    health: { components: [], withoutVersion: 0 },
    delta: { since: null, alerts: [], newComponents: [] },
    watch: "",
    reco: "",
    radar: [],
    ...overrides,
  };
}

function issue(overrides: Partial<IssueContent> = {}): IssueContent {
  return {
    version: ISSUE_VERSION,
    constate: constate(),
    dossier: null,
    lettre: null,
    production: emptyProduction(),
    ...overrides,
  };
}

describe("parseIssue", () => {
  it("relit un numéro de la forme courante", () => {
    const parsed = parseIssue(JSON.parse(JSON.stringify(issue())));
    expect(parsed?.version).toBe(ISSUE_VERSION);
  });

  it("enveloppe un numéro de l'ancienne forme plutôt que de tomber", () => {
    // Les numéros fabriqués avant la lettre de veille portent les cinq blocs à
    // plat. L'admin doit continuer de les afficher.
    const ancien = { ...constate(), watch: "Quinzaine calme.", reco: "Ne rien faire." };
    const parsed = parseIssue(ancien);

    expect(parsed?.version).toBe(1);
    expect(parsed?.lettre).toBeNull();
    expect(parsed?.constate.period).toBe("2026-08-2");
  });

  it("rend null sur une colonne vidée par la purge", () => {
    expect(parseIssue({})).toBeNull();
    expect(parseIssue(null)).toBeNull();
  });
});

describe("missingForIssue", () => {
  it("refuse d'abord l'absence de lettre, sans énumérer le reste", () => {
    expect(missingForIssue(issue())).toEqual(["la lettre elle-même"]);
  });
});

describe("isQuietIssue", () => {
  it("reconnaît une quinzaine sans événement", () => {
    expect(isQuietIssue(constate())).toBe(true);
  });

  it("ne l'est plus dès qu'une alerte est partie", () => {
    const agitee = constate({
      delta: {
        since: null,
        alerts: [{ title: "Mise à jour du socle", verdict: "orange", at: "2026-08-10" }],
        newComponents: [],
      },
    });

    expect(isQuietIssue(agitee)).toBe(false);
  });
});
