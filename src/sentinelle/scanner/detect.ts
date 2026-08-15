import type { Confidence, DetectedComponent } from "@sentinelle/types";
import type { Fingerprint, PageEvidence, Signal } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// Moteur de détection — générique et pur.
//
// Il ne connaît aucune technologie : il applique des empreintes à une
// PageEvidence. C'est ce qui rend la veille agnostique — le catalogue grossit
// sans que ce fichier bouge.
// ─────────────────────────────────────────────────────────────────────────────

const CONFIDENCE_RANK: Record<Confidence, number> = { low: 0, medium: 1, high: 2 };

function strongest(a: Confidence, b: Confidence): Confidence {
  return CONFIDENCE_RANK[a] >= CONFIDENCE_RANK[b] ? a : b;
}

/** Textes auxquels un signal s'applique, et libellé de la preuve pour l'audit. */
function subjectsFor(signal: Signal, evidence: PageEvidence): Array<{ text: string; label: string }> {
  switch (signal.on) {
    case "header": {
      const value = evidence.headers[signal.name.toLowerCase()];
      return value === undefined ? [] : [{ text: value, label: `en-tête ${signal.name}` }];
    }
    case "cookie":
      return evidence.cookieNames.map((name) => ({ text: name, label: `cookie ${name}` }));
    case "html":
      return [{ text: evidence.html, label: "code de la page" }];
    case "generator":
      return evidence.generator === null
        ? []
        : [{ text: evidence.generator, label: "meta generator" }];
    case "asset":
      return [...evidence.scripts, ...evidence.links].map((url) => ({
        text: url,
        label: `ressource ${url.slice(0, 80)}`,
      }));
    case "url":
      return [{ text: evidence.finalUrl, label: "adresse du site" }];
  }
}

interface SignalHit {
  confidence: Confidence;
  version: string | null;
  /** Confiance propre à la version — voir DetectedComponent.versionConfidence. */
  versionConfidence: Confidence;
  evidence: string;
}

function evaluate(signal: Signal, evidence: PageEvidence): SignalHit | null {
  for (const subject of subjectsFor(signal, evidence)) {
    // Un signal d'en-tête sans `match` se contente de la présence de l'en-tête.
    if (signal.on === "header" && !signal.match) {
      return {
        confidence: signal.confidence ?? "high",
        version: null,
        versionConfidence: "low",
        evidence: subject.label,
      };
    }

    const pattern = "match" in signal ? signal.match : undefined;
    if (!pattern) continue;

    // Les expressions du catalogue sont des objets partagés entre appels : avec
    // un drapeau /g ou /y, test() et exec() conservent un curseur d'un appel sur
    // l'autre. Sans cette remise à zéro, le deuxième scan d'un même site
    // répondrait faux — bug intermittent et très pénible à retrouver.
    pattern.lastIndex = 0;
    if (!pattern.test(subject.text)) continue;

    // Le signal « cookie » ne porte pas de version : on interroge l'union
    // plutôt que de supposer la propriété présente.
    const versionPattern = "version" in signal ? signal.version : undefined;

    let version: string | null = null;
    if (versionPattern) {
      versionPattern.lastIndex = 0;
      const found = versionPattern.exec(subject.text);
      // On n'accepte une version que si elle a été réellement capturée.
      version = found?.[1]?.trim() || null;
    }

    const confidence = signal.confidence ?? "medium";

    return {
      confidence,
      version,
      // Par défaut la version est aussi sûre que la détection ; une empreinte
      // peut la dégrader explicitement (cas du `?ver=`, qui peut porter la
      // version du site plutôt que celle du composant).
      versionConfidence: ("versionConfidence" in signal && signal.versionConfidence) || confidence,
      evidence: subject.label,
    };
  }

  return null;
}

/**
 * Applique le catalogue d'empreintes à une page observée.
 *
 * Un composant peut être touché par plusieurs signaux : on retient la confiance
 * la plus forte et la première version réellement capturée. L'ordre du résultat
 * est stable (celui du catalogue) pour que deux scans du même site se
 * comparent sans bruit.
 */
export function detect(
  evidence: PageEvidence,
  fingerprints: Fingerprint[],
): DetectedComponent[] {
  const found = new Map<string, DetectedComponent>();
  const byslug = new Map(fingerprints.map((print) => [print.slug, print]));

  for (const print of fingerprints) {
    let confidence: Confidence | null = null;
    let version: string | null = null;
    let versionConfidence: Confidence | null = null;
    const proofs: string[] = [];

    for (const signal of print.signals) {
      const hit = evaluate(signal, evidence);
      if (!hit) continue;

      confidence = confidence ? strongest(confidence, hit.confidence) : hit.confidence;

      // La meilleure version l'emporte : une version lue dans un meta generator
      // prime sur une version devinée dans une URL de ressource.
      if (
        hit.version &&
        (!version ||
          CONFIDENCE_RANK[hit.versionConfidence] > CONFIDENCE_RANK[versionConfidence ?? "low"])
      ) {
        version = hit.version;
        versionConfidence = hit.versionConfidence;
      }

      if (!proofs.includes(hit.evidence)) proofs.push(hit.evidence);
    }

    if (!confidence) continue;

    found.set(print.slug, {
      type: print.type,
      slug: print.slug,
      label: print.label,
      ecosystem: print.ecosystem ?? null,
      version,
      confidence,
      versionConfidence: version ? (versionConfidence ?? "low") : null,
      evidence: proofs.slice(0, 3).join(" · "),
    });
  }

  // Déductions : WooCommerce implique WordPress. Ajoutées seulement si absentes,
  // et en confiance dégradée — on ne les a pas observées, on les infère.
  for (const print of fingerprints) {
    if (!found.has(print.slug) || !print.implies) continue;

    for (const impliedSlug of print.implies) {
      if (found.has(impliedSlug)) continue;

      const implied = byslug.get(impliedSlug);
      if (!implied) continue;

      found.set(implied.slug, {
        type: implied.type,
        slug: implied.slug,
        label: implied.label,
        ecosystem: implied.ecosystem ?? null,
        version: null,
        confidence: "medium",
        versionConfidence: null,
        evidence: `déduit de ${print.label}`,
      });
    }
  }

  return [...found.values()];
}
