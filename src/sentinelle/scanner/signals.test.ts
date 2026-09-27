import { describe, expect, it } from "vitest";
import { buildEvidence } from "./evidence";
import { buildSignals, decodeEntities } from "./signals";

const HTML = `<!doctype html>
<html lang="fr">
<head>
  <title>Atelier Dupont &amp; fils · Menuiserie à Lyon</title>
  <meta name="description" content="Menuiserie sur mesure pour les professionnels depuis 1982.">
  <meta name="viewport" content="width=device-width">
  <meta property="og:title" content="Atelier Dupont">
  <meta property="og:site_name" content="Atelier Dupont OG">
  <link rel="canonical" href="https://atelier-dupont.fr/">
  <script type="application/ld+json">{"@context":"https://schema.org","@graph":[{"@type":"Organization","name":"Atelier Dupont"},{"@type":"WebSite"}]}</script>
  <script src="https://www.googletagmanager.com/gtag/js"></script>
  <script src="/wp-includes/js/jquery.js"></script>
  <style>body{color:red}</style>
</head>
<body>
  <nav><a href="/">Accueil</a><a href="/realisations">Réalisations</a></nav>
  <h1>Menuiserie sur mesure</h1>
  <h2>Nos réalisations</h2><h2>Contact</h2>
  <p>Depuis 1982, l&rsquo;atelier fabrique&nbsp;vos agencements.</p>
  <img src="a.jpg" alt="Comptoir"><img src="b.jpg">
  <a href="https://www.linkedin.com/company/atelier-dupont">LinkedIn</a>
  <a href="https://example.org/partenaire">Partenaire</a>
  <script>var x = "texte invisible";</script>
</body>
</html>`;

function evidence(html = HTML, headers: Record<string, string> = {}) {
  return buildEvidence({
    url: "https://atelier-dupont.fr/",
    finalUrl: "https://atelier-dupont.fr/",
    status: 200,
    headers,
    setCookies: [],
    html,
  });
}

describe("buildSignals", () => {
  it("lit l'identité et le discours de la page", () => {
    const site = buildSignals(evidence(), 320);
    expect(site.title).toBe("Atelier Dupont & fils · Menuiserie à Lyon");
    expect(site.description).toBe("Menuiserie sur mesure pour les professionnels depuis 1982.");
    expect(site.lang).toBe("fr");
    expect(site.h1).toEqual(["Menuiserie sur mesure"]);
    expect(site.h2).toEqual(["Nos réalisations", "Contact"]);
    expect(site.navLabels).toEqual(["Accueil", "Réalisations"]);
    // Le JSON-LD Organization l'emporte sur og:site_name.
    expect(site.siteName).toBe("Atelier Dupont");
    expect(site.schemaTypes).toEqual(["Organization", "WebSite"]);
    expect(site.socialLinks).toEqual(["https://www.linkedin.com/company/atelier-dupont"]);
  });

  it("garde le texte visible, sans scripts ni styles", () => {
    const site = buildSignals(evidence(), null);
    expect(site.excerpt).toContain("Depuis 1982, l’atelier fabrique vos agencements.");
    expect(site.excerpt).not.toContain("texte invisible");
    expect(site.excerpt).not.toContain("color:red");
  });

  it("mesure le dispositif", () => {
    const site = buildSignals(evidence(HTML, { "strict-transport-security": "max-age=1" }), 320);
    expect(site.responseMs).toBe(320);
    expect(site.imageCount).toBe(2);
    expect(site.imagesWithoutAlt).toBe(1);
    expect(site.thirdPartyHosts).toEqual(["googletagmanager.com"]);
    expect(site.hasViewport).toBe(true);
    expect(site.hasCanonical).toBe(true);
    expect(site.hasOpenGraph).toBe(true);
    expect(site.https).toBe(true);
    expect(site.securityHeaders).toEqual({ hsts: true, csp: false, xFrameOptions: false });
  });

  it("tient sur une page vide", () => {
    const site = buildSignals(evidence("<html><body></body></html>"), null);
    expect(site.title).toBeNull();
    expect(site.siteName).toBeNull();
    expect(site.excerpt).toBe("");
    expect(site.wordCount).toBe(0);
  });

  it("ignore un JSON-LD invalide", () => {
    const html = `<script type="application/ld+json">{cassé</script><title>T</title>`;
    expect(buildSignals(evidence(html), null).schemaTypes).toEqual([]);
  });
});

describe("signaux commerciaux", () => {
  it("repère preuves, appels à l'action et moyens de contact", () => {
    const html = `<body>
      <h2>Ils nous font confiance</h2><p>Plus de 120 clients. Témoignages. Certifié Qualiopi.</p>
      <a href="/devis">Demander un devis</a><button>Prendre rendez-vous</button>
      <a href="/blog">Blog</a><a href="tel:+33100000000">01 00 00 00 00</a>
      <form><input type="email"></form><form role="search"><input type="search"></form>
    </body>`;
    const site = buildSignals(evidence(html), null);
    expect(site.proofs).toEqual(
      expect.arrayContaining(["témoignages", "références clients", "chiffres clés", "certifications ou labels"]),
    );
    expect(site.proofs).not.toContain("prix affichés");
    expect(site.callsToAction).toEqual(["Demander un devis", "Prendre rendez-vous"]);
    expect(site.formCount).toBe(1);
    expect(site.contactLinks).toBe(1);
  });
});

describe("decodeEntities", () => {
  it("décode les entités nommées et numériques", () => {
    expect(decodeEntities("&eacute;t&#233; &#x2019; &amp;")).toBe("été ’ &");
    expect(decodeEntities("&inconnue;")).toBe("&inconnue;");
  });
});
