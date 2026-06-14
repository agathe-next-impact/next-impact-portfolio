"use server";

// Audit léger « instantané » (étape 1 de /audit-site-ia) : récupère réellement
// la page côté serveur et calcule des heuristiques HONNÊTES et vérifiables sur le
// HTML (SEO, accessibilité, conversion, détection de stack) + une estimation de
// légèreté (poids/scripts) clairement labellisée. Rapide (un seul fetch), gratuit,
// sans clé API. Les vrais Core Web Vitals et l'analyse fine relèvent du verdict IA
// (Gemini, grounding) et du rapport complet par email.

import type { Locale } from "@/i18n/routing";
import type {
  AuditObjective,
  AxisKey,
  Impact,
  QuickAuditResult,
  QuickAxis,
  QuickIssue,
  QuickProblem,
  QuickTech,
} from "./quick-audit-types";

const IMPACT_RANK: Record<Impact, number> = { high: 3, medium: 2, low: 1 };
const AXIS_RANK: Record<AxisKey, number> = {
  performance: 4,
  seo: 3,
  conversion: 2,
  accessibility: 1,
};

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function count(html: string, re: RegExp): number {
  const m = html.match(re);
  return m ? m.length : 0;
}

function deriveVerdict(
  objective: AuditObjective,
  score: number,
  isWp: boolean,
): "A" | "B" | "C" | "D" {
  switch (objective) {
    case "headless":
      return "C";
    case "design":
      return "B";
    case "seo":
      return isWp ? "C" : "B";
    case "refonte":
      return score < 45 ? "B" : "C";
    case "vitesse":
      return score >= 55 ? "A" : "B";
    case "demandes":
      return score >= 60 ? "A" : "B";
    default:
      return score >= 60 ? "A" : "B";
  }
}

export async function runQuickAudit(input: {
  url: string;
  objective: AuditObjective;
  locale: Locale;
}): Promise<QuickAuditResult> {
  const isEn = input.locale === "en";
  const tr = (fr: string, en: string) => (isEn ? en : fr);

  let url = input.url.trim();
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;

  const emptyTech: QuickTech = { wordpress: false, pageBuilder: null, generator: null };

  // ── Récupération de la page ────────────────────────────────────────────────
  let html = "";
  try {
    new URL(url);
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; NextImpactAuditBot/1.0; +https://www.next-impact.digital)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(9000),
    });
    if (!res.ok) {
      return unreachable(url, input.objective, tr, `HTTP ${res.status}`);
    }
    const ct = res.headers.get("content-type") || "";
    if (ct && !ct.includes("html")) {
      return unreachable(url, input.objective, tr, `content-type ${ct}`);
    }
    html = await res.text();
  } catch (err) {
    const msg = err instanceof Error ? err.message : "fetch error";
    return unreachable(url, input.objective, tr, msg);
  }

  // On limite la regex aux 600 premiers Ko (le <head> et le haut de page suffisent).
  const head = html.slice(0, 600_000);
  const lower = head.toLowerCase();
  const bytes = Buffer.byteLength(html, "utf8");

  // ── Détection de stack ─────────────────────────────────────────────────────
  const generatorMatch = head.match(
    /<meta[^>]+name=["']generator["'][^>]*content=["']([^"']+)["']/i,
  );
  const generator = generatorMatch ? generatorMatch[1].trim() : null;
  const wordpress =
    /wp-content|wp-includes|wp-json/i.test(lower) ||
    /wordpress/i.test(generator || "");
  let pageBuilder: string | null = null;
  if (/elementor/i.test(lower)) pageBuilder = "Elementor";
  else if (/et_pb_|divi/i.test(lower)) pageBuilder = "Divi";
  else if (/fl-builder|beaver/i.test(lower)) pageBuilder = "Beaver Builder";
  else if (/wpb_|vc_row|js_composer/i.test(lower)) pageBuilder = "WPBakery";
  else if (/brizy/i.test(lower)) pageBuilder = "Brizy";
  const tech: QuickTech = { wordpress, pageBuilder, generator };

  // ── Axe SEO ────────────────────────────────────────────────────────────────
  const seo: QuickAxis = { key: "seo", score: 0, available: true, positives: [], issues: [] };
  {
    let s = 0;
    const titleMatch = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "";
    if (title.length >= 10) {
      s += 22;
      seo.positives.push(tr("Balise title présente", "Title tag present"));
    } else {
      seo.issues.push({ title: tr("Balise <title> absente ou trop courte", "Missing or too-short <title> tag"), impact: "high" });
    }
    const desc = head.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i);
    if (desc && desc[1].trim().length >= 50) {
      s += 18;
      seo.positives.push(tr("Meta description renseignée", "Meta description present"));
    } else {
      seo.issues.push({ title: tr("Meta description absente ou trop courte", "Missing or too-short meta description"), impact: "medium" });
    }
    const h1 = count(head, /<h1[\s>]/gi);
    if (h1 === 1) {
      s += 16;
      seo.positives.push(tr("Un seul H1, bien structuré", "Single, well-structured H1"));
    } else {
      seo.issues.push({
        title: h1 === 0 ? tr("Aucun titre H1 détecté", "No H1 heading detected") : tr(`Plusieurs H1 (${h1}) — hiérarchie confuse`, `Multiple H1s (${h1}) — confusing hierarchy`),
        impact: "medium",
      });
    }
    if (/<link[^>]+rel=["']canonical["']/i.test(head)) {
      s += 12;
      seo.positives.push(tr("URL canonique déclarée", "Canonical URL declared"));
    } else {
      seo.issues.push({ title: tr("Pas de balise canonique", "No canonical tag"), impact: "low" });
    }
    if (/<meta[^>]+property=["']og:(title|image)["']/i.test(head)) {
      s += 10;
      seo.positives.push(tr("Métadonnées de partage (Open Graph)", "Open Graph share metadata"));
    } else {
      seo.issues.push({ title: tr("Métadonnées de partage social manquantes", "Missing social-share metadata"), impact: "low" });
    }
    if (/application\/ld\+json/i.test(head)) {
      s += 12;
      seo.positives.push(tr("Données structurées (schema.org)", "Structured data (schema.org)"));
    } else {
      seo.issues.push({ title: tr("Aucune donnée structurée (schema.org)", "No structured data (schema.org)"), impact: "medium" });
    }
    const noindex = /<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(head);
    if (noindex) {
      seo.issues.push({ title: tr("La page est en noindex (invisible sur Google)", "Page is set to noindex (hidden from Google)"), impact: "high" });
    } else {
      s += 10;
    }
    seo.score = clamp(s);
  }

  // ── Axe Accessibilité ──────────────────────────────────────────────────────
  const a11y: QuickAxis = { key: "accessibility", score: 0, available: true, positives: [], issues: [] };
  {
    let s = 0;
    if (/<html[^>]+lang=/i.test(head)) {
      s += 22;
      a11y.positives.push(tr("Langue de la page déclarée", "Page language declared"));
    } else {
      a11y.issues.push({ title: tr("Attribut lang manquant sur <html>", "Missing lang attribute on <html>"), impact: "high" });
    }
    if (/<meta[^>]+name=["']viewport["']/i.test(head)) {
      s += 18;
      a11y.positives.push(tr("Viewport mobile configuré", "Mobile viewport configured"));
    } else {
      a11y.issues.push({ title: tr("Pas de viewport mobile (lisibilité dégradée)", "No mobile viewport (poor readability)"), impact: "high" });
    }
    const imgs = count(head, /<img[\s>]/gi);
    const imgsAlt = count(head, /<img[^>]*\salt=/gi);
    if (imgs === 0) {
      s += 25;
    } else {
      const ratio = imgsAlt / imgs;
      s += Math.round(ratio * 25);
      if (ratio < 0.8) {
        a11y.issues.push({
          title: tr(`${imgs - imgsAlt}/${imgs} images sans texte alternatif`, `${imgs - imgsAlt}/${imgs} images without alt text`),
          impact: ratio < 0.5 ? "high" : "medium",
        });
      } else {
        a11y.positives.push(tr("Images correctement décrites (alt)", "Images properly described (alt)"));
      }
    }
    const h1any = count(head, /<h1[\s>]/gi);
    if (h1any >= 1) {
      s += 15;
    } else {
      a11y.issues.push({ title: tr("Structure de titres incomplète (pas de H1)", "Incomplete heading structure (no H1)"), impact: "medium" });
    }
    const inputs = count(head, /<input[\s>]/gi) + count(head, /<textarea[\s>]/gi) + count(head, /<select[\s>]/gi);
    const labels = count(head, /<label[\s>]/gi);
    if (inputs === 0 || labels >= inputs * 0.6) {
      s += 20;
      if (inputs > 0) a11y.positives.push(tr("Champs de formulaire étiquetés", "Form fields labelled"));
    } else {
      a11y.issues.push({ title: tr("Champs de formulaire sans label associé", "Form fields without associated labels"), impact: "medium" });
    }
    a11y.score = clamp(s);
  }

  // ── Axe Conversion ─────────────────────────────────────────────────────────
  const conv: QuickAxis = { key: "conversion", score: 0, available: true, positives: [], issues: [] };
  {
    let s = 0;
    const ctaWords = isEn
      ? /(contact|get a quote|quote|book|buy|download|sign ?up|get started|subscribe|request|start now)/i
      : /(contact|devis|réserver|reserver|acheter|télécharger|telecharger|inscri|demander|commander|prendre rendez|démarrer|demarrer|essai)/i;
    const ctaCount = (head.match(new RegExp(ctaWords, "gi")) || []).length;
    if (ctaCount === 0) {
      conv.issues.push({ title: tr("Aucun appel à l'action clair détecté", "No clear call-to-action detected"), impact: "high" });
    } else if (ctaCount <= 6) {
      s += 32;
      conv.positives.push(tr("Appel à l'action présent et lisible", "Clear call-to-action present"));
    } else {
      s += 16;
      conv.issues.push({ title: tr("Trop d'appels à l'action concurrents", "Too many competing calls-to-action"), impact: "medium" });
    }
    if (/href=["'](tel:|mailto:)/i.test(head)) {
      s += 16;
      conv.positives.push(tr("Contact direct accessible (tél/email)", "Direct contact available (phone/email)"));
    } else {
      conv.issues.push({ title: tr("Pas de contact direct visible (tél/email)", "No visible direct contact (phone/email)"), impact: "low" });
    }
    if (/<form[\s>]/i.test(head)) {
      s += 20;
      conv.positives.push(tr("Formulaire de capture présent", "Capture form present"));
    } else {
      conv.issues.push({ title: tr("Aucun formulaire de capture détecté", "No capture form detected"), impact: "medium" });
    }
    if (isEn ? /(testimonial|review|rated|trusted by|clients?)/i.test(head) : /(témoignage|temoignage|avis|recommand|ils nous font confiance|clients?)/i.test(head)) {
      s += 16;
      conv.positives.push(tr("Éléments de réassurance (preuve sociale)", "Reassurance elements (social proof)"));
    } else {
      conv.issues.push({ title: tr("Peu de preuves sociales visibles", "Little visible social proof"), impact: "medium" });
    }
    conv.score = clamp(s);
  }

  // ── Axe Performance (estimation de légèreté, pas Core Web Vitals) ───────────
  const perf: QuickAxis = {
    key: "performance",
    score: 0,
    available: true,
    estimated: true,
    note: tr("Estimation par le poids et les ressources de la page. Core Web Vitals réels dans le rapport complet.", "Estimated from page weight and resources. Real Core Web Vitals in the full report."),
    positives: [],
    issues: [],
  };
  {
    let s = 100;
    const kb = Math.round(bytes / 1024);
    const scripts = count(head, /<script[\s>]/gi);
    const stylesheets = count(head, /<link[^>]+rel=["']stylesheet["']/gi);
    const imgs = count(head, /<img[\s>]/gi);
    const imgsNoDim = imgs - count(head, /<img[^>]*\b(width|height)=/gi);
    if (kb > 400) {
      s -= 30;
      perf.issues.push({ title: tr(`HTML très lourd (~${kb} Ko)`, `Very heavy HTML (~${kb} KB)`), impact: "high" });
    } else if (kb > 150) {
      s -= 15;
      perf.issues.push({ title: tr(`HTML lourd (~${kb} Ko)`, `Heavy HTML (~${kb} KB)`), impact: "medium" });
    } else {
      perf.positives.push(tr("Document HTML léger", "Lightweight HTML document"));
    }
    if (scripts > 30) {
      s -= 25;
      perf.issues.push({ title: tr(`Beaucoup de scripts (${scripts})`, `Many scripts (${scripts})`), impact: "high" });
    } else if (scripts > 15) {
      s -= 15;
      perf.issues.push({ title: tr(`Nombre de scripts élevé (${scripts})`, `High script count (${scripts})`), impact: "medium" });
    }
    if (stylesheets > 6) {
      s -= 10;
      perf.issues.push({ title: tr(`Feuilles de style multiples (${stylesheets})`, `Multiple stylesheets (${stylesheets})`), impact: "low" });
    }
    if (imgs > 0 && imgsNoDim / imgs > 0.5) {
      s -= 10;
      perf.issues.push({ title: tr("Images sans dimensions (décalages possibles)", "Images without dimensions (possible layout shift)"), impact: "medium" });
    }
    if (pageBuilder) {
      s -= 10;
      perf.issues.push({ title: tr(`Constructeur de page « ${pageBuilder} » (souvent lourd)`, `Page builder "${pageBuilder}" (often heavy)`), impact: "medium" });
    }
    perf.score = clamp(s);
  }

  // ── Agrégation ─────────────────────────────────────────────────────────────
  const axes: QuickAxis[] = [perf, seo, a11y, conv];
  const measured = axes.filter((a) => a.available);
  const overallScore = clamp(
    measured.reduce((sum, a) => sum + a.score, 0) / Math.max(1, measured.length),
  );

  const problems: QuickProblem[] = axes
    .flatMap((a) => a.issues.map((i: QuickIssue) => ({ title: i.title, axis: a.key, impact: i.impact })))
    .sort((x, y) => IMPACT_RANK[y.impact] - IMPACT_RANK[x.impact] || AXIS_RANK[y.axis] - AXIS_RANK[x.axis])
    .slice(0, 3);

  const verdict = deriveVerdict(input.objective, overallScore, wordpress);

  return { url, reachable: true, overallScore, axes, problems, tech, verdict };
}

function unreachable(
  url: string,
  objective: AuditObjective,
  tr: (fr: string, en: string) => string,
  error: string,
): QuickAuditResult {
  console.warn("[quick-audit] unreachable:", url, "—", error);
  return {
    url,
    reachable: false,
    overallScore: 0,
    axes: [],
    problems: [],
    tech: { wordpress: false, pageBuilder: null, generator: null },
    verdict: deriveVerdict(objective, 50, false),
    error: tr(
      "Impossible de récupérer la page (site inaccessible, protégé ou trop lent). L'analyse IA ci-dessous peut tout de même aboutir.",
      "Could not fetch the page (site unreachable, protected or too slow). The AI analysis below may still succeed.",
    ),
  };
}
