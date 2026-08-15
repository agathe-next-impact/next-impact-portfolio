/**
 * Normalise une adresse de site saisie à la main.
 * « exemple.fr », « www.exemple.fr/ », « HTTP://Exemple.fr » → « https://exemple.fr ».
 * Renvoie null si la saisie ne donne rien d'exploitable.
 *
 * Partagé entre la facturation (adresse saisie au paiement) et le scanner
 * (adresse saisie dans le formulaire) : deux implémentations divergentes
 * feraient qu'un site payé ne serait pas celui scanné.
 */
export function normalizeSiteUrl(input: string | null | undefined): string | null {
  if (!input) return null;

  const trimmed = input.trim();
  if (!trimmed) return null;

  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  let parsed: URL;
  try {
    parsed = new URL(withScheme);
  } catch {
    return null;
  }

  // Un hôte sans point n'est pas un domaine public (« localhost », saisie libre).
  if (!parsed.hostname.includes(".")) return null;

  const path = parsed.pathname === "/" ? "" : parsed.pathname.replace(/\/$/, "");
  return `${parsed.protocol}//${parsed.hostname.toLowerCase()}${path}`;
}

/**
 * Le scan public ne doit pas servir à sonder un réseau interne : on refuse les
 * hôtes qui ne sont pas des domaines publics. Garde-fou contre l'usage du
 * scanner comme relais de requêtes (SSRF).
 */
export function isPubliclyScannable(url: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;

  const host = parsed.hostname.toLowerCase();

  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local")) return false;
  if (host === "[::1]" || host === "::1") return false;

  // Adresses IP littérales : privées, locales et de bouclage écartées.
  const ipv4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
  if (ipv4) {
    const [a, b] = [Number(ipv4[1]), Number(ipv4[2])];
    if (a === 10 || a === 127 || a === 0) return false;
    if (a === 169 && b === 254) return false; // lien-local, métadonnées cloud
    if (a === 172 && b >= 16 && b <= 31) return false;
    if (a === 192 && b === 168) return false;
    return true;
  }

  return host.includes(".");
}
