import { afterEach, describe, expect, it, vi } from "vitest";
import { createBudget, fetchPage } from "./fetch";

// ─────────────────────────────────────────────────────────────────────────────
// La couche réseau du scanner, sans réseau : fetch est remplacé. Ce qui se
// teste ici est le contrat de robustesse — une reprise et une seule sur échec
// de connexion, dans le budget de politesse — et l'honnêteté des raisons
// (« connexion interrompue (ECONNRESET) », jamais le « fetch failed » opaque
// d'undici, qui a coûté deux diagnostics en production).
// ─────────────────────────────────────────────────────────────────────────────

function reset(code: string): TypeError {
  // La forme exacte d'undici : TypeError générique, cause porteuse du code.
  return new TypeError("fetch failed", {
    cause: Object.assign(new Error(`read ${code}`), { code }),
  });
}

function abortError(): Error {
  return Object.assign(new Error("This operation was aborted"), {
    name: "AbortError",
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchPage", () => {
  it("reprend une fois après une coupure de connexion, et la reprise compte au budget", async () => {
    const mock = vi
      .fn()
      .mockRejectedValueOnce(reset("ECONNRESET"))
      .mockResolvedValueOnce(new Response("<html>ok</html>", { status: 200 }));
    vi.stubGlobal("fetch", mock);

    const budget = createBudget(4);
    const outcome = await fetchPage("https://exemple.fr/", budget);

    expect(outcome.ok).toBe(true);
    expect(mock).toHaveBeenCalledTimes(2);
    expect(budget.spent()).toBe(2);
  });

  it("ne reprend qu'une fois — deux coupures font un échec, avec la cause nommée", async () => {
    const mock = vi.fn().mockRejectedValue(reset("ECONNRESET"));
    vi.stubGlobal("fetch", mock);

    const outcome = await fetchPage("https://exemple.fr/", createBudget(4));

    expect(outcome).toEqual({
      ok: false,
      reason: "connexion interrompue par le serveur (ECONNRESET)",
    });
    expect(mock).toHaveBeenCalledTimes(2);
  });

  it("ne reprend pas quand le budget est épuisé — la politesse prime", async () => {
    const mock = vi.fn().mockRejectedValue(reset("ECONNRESET"));
    vi.stubGlobal("fetch", mock);

    const outcome = await fetchPage("https://exemple.fr/", createBudget(1));

    expect(outcome.ok).toBe(false);
    expect(mock).toHaveBeenCalledTimes(1);
  });

  it("ne reprend jamais sur un délai dépassé — un site lent le restera", async () => {
    const mock = vi.fn().mockRejectedValue(abortError());
    vi.stubGlobal("fetch", mock);

    const outcome = await fetchPage("https://exemple.fr/", createBudget(4));

    expect(outcome).toEqual({ ok: false, reason: "délai dépassé (8 s)" });
    expect(mock).toHaveBeenCalledTimes(1);
  });

  it("nomme la cause même enfouie dans un agrégat — le cas ECONNREFUSED d'undici", async () => {
    const aggregate = new TypeError("fetch failed", {
      cause: new AggregateError([
        Object.assign(new Error("connect ECONNREFUSED ::1:443"), { code: "ECONNREFUSED" }),
      ]),
    });
    const mock = vi.fn().mockRejectedValue(aggregate);
    vi.stubGlobal("fetch", mock);

    const outcome = await fetchPage("https://exemple.fr/", createBudget(4));

    expect(outcome).toEqual({ ok: false, reason: "connexion refusée (ECONNREFUSED)" });
  });

  it("traduit un domaine introuvable pour le rapport", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(reset("ENOTFOUND")));

    const outcome = await fetchPage("https://nexistepas.exemple/", createBudget(4));

    expect(outcome.ok).toBe(false);
    if (!outcome.ok) expect(outcome.reason).toBe("domaine introuvable (ENOTFOUND)");
  });
});
