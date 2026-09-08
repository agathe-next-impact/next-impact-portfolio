// ─────────────────────────────────────────────────────────────────────────────
// Configuration WebAuthn — module PUR.
//
// Deux valeurs commandent tout le reste, et se tromper sur l'une d'elles ne se
// voit qu'en production : l'identifiant de partie de confiance (RP ID) et
// l'origine attendue.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Identifiant de partie de confiance : le DOMAINE ENREGISTRABLE, jamais l'hôte
 * complet.
 *
 * C'est le piège le plus coûteux de WebAuthn. Une passkey est liée à ce RP ID :
 * si on enrôlait sur `www.next-impact.digital`, le jour où l'espace déménage sur
 * `espace.next-impact.digital` TOUTES les passkeys deviendraient invalides et
 * chaque client repartirait de zéro. En enrôlant sur `next-impact.digital`, tout
 * sous-domaine présent et futur les accepte.
 *
 * L'inverse n'est pas vrai : on ne peut pas élargir un RP ID après coup. C'est
 * donc une décision qui se prend maintenant, une fois.
 */
export const DEFAULT_RP_ID = "next-impact.digital";

/** Nom affiché par le système d'exploitation dans la fenêtre de confirmation. */
export const RP_NAME = "Next Impact — Direction technique";

export type WebAuthnEnv = Record<string, string | undefined>;

/**
 * RP ID effectif.
 *
 * Surchargeable par `CTO_RP_ID` pour le développement local, où le domaine est
 * `localhost` : une passkey posée en local ne doit pas prétendre valoir pour le
 * domaine de production, et le navigateur refuserait de toute façon.
 */
export function rpId(env: WebAuthnEnv = process.env): string {
  return env.CTO_RP_ID?.trim() || DEFAULT_RP_ID;
}

/**
 * Origines acceptées, au sens strict du protocole (schéma + hôte + port).
 *
 * Le navigateur signe l'origine réelle ; la vérification échoue si elle ne
 * figure pas ici. C'est ce contrôle qui rend les passkeys résistantes au
 * hameçonnage : un site sosie a forcément une autre origine, et aucune signature
 * produite chez lui ne sera acceptée ici.
 */
export function expectedOrigins(env: WebAuthnEnv = process.env): string[] {
  const configured = env.CTO_ORIGIN?.trim();
  if (configured) {
    return configured
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
  }

  const id = rpId(env);
  // Les deux hôtes servent le même site en production (cf. proxy.ts, où seul
  // `www` est canonique pour l'indexation) ; un client qui atterrit sur l'un ou
  // l'autre doit pouvoir se connecter.
  return [`https://${id}`, `https://www.${id}`];
}

/**
 * Étiquette proposée par défaut pour une passkey, déduite du type
 * d'authentificateur.
 *
 * C'est une SUGGESTION, pas une vérité : la personne renomme ce qu'elle veut
 * dans l'écran « Appareils ». Une correspondance manquante ou fausse n'a donc
 * aucune conséquence, ce qui justifie une table courte plutôt qu'un annuaire
 * complet à tenir à jour.
 */
const KNOWN_AUTHENTICATORS: Record<string, string> = {
  "fbfc3007-154e-4ecc-8c0b-6e020557d7bd": "Trousseau iCloud",
  "adce0002-35bc-c60a-648b-0b25f1f05503": "Chrome (Touch ID)",
  "ea9b8d66-4d01-1d21-3ce4-b6b48cb575d4": "Gestionnaire Google",
  "08987058-cadc-4b81-b6e1-30de50dcbe96": "Windows Hello",
  "6028b017-b1d4-4c02-b4b3-afcdafc96bb2": "Windows Hello",
  "9ddd1817-af5a-4672-a2b9-3e3dd95000a9": "Windows Hello",
  "bada5566-a7aa-401f-bd96-45619a55120d": "1Password",
  "d548826e-79b4-db40-a3d8-11116f7e8349": "Bitwarden",
  "531126d6-e717-415c-9320-3d9aa6981239": "Dashlane",
};

export function suggestLabel(
  aaguid: string | null | undefined,
  transports: string[] | null | undefined,
): string {
  const known = aaguid ? KNOWN_AUTHENTICATORS[aaguid.toLowerCase()] : undefined;
  if (known) return known;

  const list = transports ?? [];
  if (list.includes("internal")) return "Cet appareil";
  if (list.includes("hybrid")) return "Téléphone";
  if (list.includes("usb") || list.includes("nfc")) return "Clé de sécurité";

  return "Appareil";
}

/**
 * Résumé lisible d'un agent utilisateur, pour la liste des sessions.
 *
 * On ne cherche ni exhaustivité ni exactitude : il s'agit qu'une personne
 * reconnaisse SA ligne dans une liste de trois. La chaîne est tronquée parce
 * qu'un agent utilisateur complet est à la fois illisible et inutilement
 * bavard sur la configuration d'un poste.
 */
export function describeDevice(userAgent: string | null | undefined): string {
  if (!userAgent) return "Appareil inconnu";

  const ua = userAgent.slice(0, 400);
  const system = /iPhone|iPad/.test(ua)
    ? "iOS"
    : /Android/.test(ua)
      ? "Android"
      : /Macintosh|Mac OS X/.test(ua)
        ? "macOS"
        : /Windows/.test(ua)
          ? "Windows"
          : /Linux/.test(ua)
            ? "Linux"
            : null;

  // L'ordre compte : Edge et Chrome annoncent tous deux « Chrome », Safari est
  // annoncé par à peu près tout le monde. On teste du plus spécifique au moins.
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /OPR\//.test(ua)
      ? "Opera"
      : /Firefox\//.test(ua)
        ? "Firefox"
        : /Chrome\//.test(ua)
          ? "Chrome"
          : /Safari\//.test(ua)
            ? "Safari"
            : null;

  if (system && browser) return `${browser} sur ${system}`;
  return browser ?? system ?? "Appareil inconnu";
}
