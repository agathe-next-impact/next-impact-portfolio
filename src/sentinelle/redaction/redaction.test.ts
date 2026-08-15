import { describe, expect, it } from "vitest";
import type { DraftedAlert } from "@sentinelle/types";
import { buildContext, renderContext, type ContextSources } from "./context";
import { citedOutsideContext, guardDraft, redIsJustified } from "./guards";
import { systemPrompt } from "./prompts";
import { DraftSchema, DRAFT_JSON_SCHEMA, toDraftedAlert } from "./schema";

function sources(overrides: Partial<ContextSources> = {}): ContextSources {
  return {
    client: { sector: "Agence immobilière, 12 salariés", notes: "Pas d'informaticien en interne." },
    stackItem: {
      label: "Contact Form 7",
      slug: "contact-form-7",
      type: "cms_plugin",
      ecosystem: "wordpress",
      version: "5.9.3",
      meta: { versionConfidence: "high" },
    },
    intelItem: {
      kind: "vulnerability",
      source: "wpscan",
      title: "Contact Form 7 < 5.9.4 — Injection",
      severity: "high",
      affectedRange: "< 5.9.4",
      fixedIn: "5.9.4",
      publishedAt: new Date("2026-04-02T00:00:00.000Z"),
    },
    verdict: "red",
    reason: "version affectée, sévérité haute, version certaine",
    ...overrides,
  };
}

function draft(overrides: Partial<DraftedAlert> = {}): DraftedAlert {
  return {
    verdict: "orange",
    title: "Une mise à jour de sécurité attend votre formulaire de contact",
    body: "Une faille corrigée dans la version 5.9.4 concerne la version installée sur votre site.",
    whatItChanges: "Votre formulaire de contact peut être détourné pour envoyer des messages.",
    recommendedAction: "Mettre à jour l'extension depuis votre tableau de bord.",
    diyPossible: true,
    effortEstimate: "5 min",
    ...overrides,
  };
}

describe("contexte transmis au modèle", () => {
  it("ne contient ni le nom ni l'adresse du client", () => {
    // Anthropic est sous-traitant : le prompt n'a pas besoin de l'identité du
    // client pour écrire une alerte sur une version de logiciel.
    const withIdentity = {
      ...sources(),
      client: {
        sector: "Agence immobilière",
        notes: "Contact direct : Jeanne Perrin.",
        name: "Jeanne Perrin",
        email: "jeanne@perrin-immobilier.fr",
        company: "Agence Perrin Immobilier",
      },
    } as ContextSources;

    const rendered = renderContext(buildContext(withIdentity));

    expect(rendered).not.toContain("jeanne@perrin-immobilier.fr");
    expect(rendered).not.toContain("Perrin Immobilier");
    // Les notes, elles, sont transmises — c'est ce qui permet de contextualiser.
    expect(rendered).toContain("Agence immobilière");
  });

  it("transmet la certitude sur la version en toutes lettres", () => {
    const probable = buildContext(
      sources({
        stackItem: {
          label: "jQuery",
          slug: "jquery",
          type: "js_library",
          ecosystem: "npm",
          version: "1.12.4",
          meta: { versionConfidence: "medium" },
        },
      }),
    );

    expect(renderContext(probable)).toContain("probable");
  });

  it("retombe sur « probable » quand la métadonnée manque", () => {
    const context = buildContext(
      sources({
        stackItem: {
          label: "PHP",
          slug: "php",
          type: "runtime",
          ecosystem: "endoflife",
          version: "8.1.27",
          meta: null,
        },
      }),
    );

    expect(context.component.versionConfidence).toBe("medium");
  });

  it("donne au modèle le verdict calculé et sa raison", () => {
    const rendered = renderContext(buildContext(sources()));

    expect(rendered).toContain("Verdict proposé : red");
    expect(rendered).toContain("sévérité haute");
  });
});

describe("garde-fou 1 — le rouge se mérite", () => {
  it("laisse passer un rouge justifié", () => {
    const context = buildContext(sources());
    expect(redIsJustified(context)).toBe(true);
    expect(guardDraft(draft({ verdict: "red" }), context)).toMatchObject({
      ok: true,
      draft: { verdict: "red" },
      corrections: [],
    });
  });

  it("abaisse un rouge fondé sur une version probable", () => {
    const context = buildContext(
      sources({
        stackItem: {
          label: "Contact Form 7",
          slug: "contact-form-7",
          type: "cms_plugin",
          ecosystem: "wordpress",
          version: "5.9.3",
          meta: { versionConfidence: "medium" },
        },
      }),
    );

    const outcome = guardDraft(draft({ verdict: "red" }), context);
    expect(outcome.draft.verdict).toBe("orange");
    expect(outcome.corrections[0]).toContain("abaissé");
    // Corrigeable, donc pas un rejet : le texte reste utilisable.
    expect(outcome.ok).toBe(true);
  });

  it("abaisse un rouge fondé sur une sévérité modérée", () => {
    const context = buildContext(
      sources({
        intelItem: {
          kind: "vulnerability",
          source: "osv.dev",
          title: "XSS",
          severity: "medium",
          affectedRange: "< 5.9.4",
          fixedIn: "5.9.4",
          publishedAt: null,
        },
      }),
    );

    expect(guardDraft(draft({ verdict: "red" }), context).draft.verdict).toBe("orange");
  });

  it("abaisse un rouge fondé sur une version hors plage", () => {
    const context = buildContext(
      sources({
        stackItem: {
          label: "Contact Form 7",
          slug: "contact-form-7",
          type: "cms_plugin",
          ecosystem: "wordpress",
          version: "6.1.0",
          meta: { versionConfidence: "high" },
        },
      }),
    );

    expect(redIsJustified(context)).toBe(false);
    expect(guardDraft(draft({ verdict: "red" }), context).draft.verdict).toBe("orange");
  });
});

describe("garde-fou 2 — aucun composant hors contexte", () => {
  const context = buildContext(sources());

  it("accepte le composant de l'alerte et sa plateforme", () => {
    // Une alerte sur une extension WordPress dit naturellement « votre site
    // WordPress » : le lui interdire produirait des rejets absurdes.
    const texte = draft({
      body: "Contact Form 7 corrige cette faille en 5.9.4 ; la mise à jour se fait depuis WordPress.",
    });

    expect(citedOutsideContext(texte.body, context)).toEqual([]);
    expect(guardDraft(texte, context).ok).toBe(true);
  });

  it("rejette un texte qui nomme une technologie absente du contexte", () => {
    const invente = draft({
      body: "Pensez aussi à mettre à jour Drupal et votre serveur nginx.",
    });

    const outcome = guardDraft(invente, context);
    expect(outcome.ok).toBe(false);
    expect(outcome.violations[0]).toContain("Drupal");
    expect(outcome.violations[0]).toContain("nginx");
  });

  it("ne se déclenche pas sur des mots français qui ressemblent à des slugs", () => {
    // « vue », « expression », « astronomie » ne sont pas Vue.js, Express ni Astro.
    const texte = "Cette vue d'ensemble expose une expression du problème, sans astronomie.";
    expect(citedOutsideContext(texte, context)).toEqual([]);
  });

  it("inspecte tous les champs lus par le client, pas seulement le corps", () => {
    const dansLaction = draft({ recommendedAction: "Migrer vers Shopify." });
    expect(guardDraft(dansLaction, context).ok).toBe(false);
  });
});

describe("schéma de sortie", () => {
  it("interdit les champs surnuméraires et les rend tous obligatoires", () => {
    expect(DRAFT_JSON_SCHEMA.additionalProperties).toBe(false);
    expect(DRAFT_JSON_SCHEMA.required).toHaveLength(
      Object.keys(DRAFT_JSON_SCHEMA.properties).length,
    );
  });

  it("traduit le vocabulaire du prompt vers celui du modèle", () => {
    const payload = DraftSchema.parse({
      verdict: "orange",
      title: "Titre",
      body: "Corps",
      what_it_changes: "Impact",
      recommended_action: "Mettre à jour",
      diy_possible: true,
      effort_estimate: "5 min",
    });

    expect(toDraftedAlert(payload)).toMatchObject({
      whatItChanges: "Impact",
      recommendedAction: "Mettre à jour",
      diyPossible: true,
      effortEstimate: "5 min",
    });
  });

  it("refuse une sortie incomplète", () => {
    expect(DraftSchema.safeParse({ verdict: "orange", title: "x" }).success).toBe(false);
  });
});

describe("prompt système", () => {
  it("se charge depuis le disque, sans son préambule de maintenance", () => {
    const prompt = systemPrompt();

    expect(prompt).toContain("Règle absolue de factualité");
    // Le préambule explique où vit le fichier : inutile au modèle.
    expect(prompt).not.toContain("outputFileTracingIncludes");
  });
});
