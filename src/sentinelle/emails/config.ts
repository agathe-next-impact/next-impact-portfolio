// Configuration d'envoi Sentinelle — SMTP Google (Gmail / Google Workspace).
//
// Le pack imposait Resend ; la décision du 2026-08-15 est d'envoyer par le
// compte Google qui sert déjà au site. Ce qui ne change pas, c'est l'isolation
// (plan §2, E7) : Sentinelle a son propre transport et ses propres variables,
// il n'importe jamais `lib/sendMail.ts`. Le jour de l'extraction en
// sous-domaine, ce dossier part tel quel.
//
// Aucun repli sur les variables NODEMAILER_* de la vitrine : un repli
// silencieux ferait partir la veille sous l'identité du site sans que personne
// s'en aperçoive. Il vaut mieux une erreur qui nomme la variable manquante.
//
// Trois contraintes propres à Google, à connaître avant de changer une valeur :
//
// 1. Le mot de passe n'est pas celui du compte : c'est un mot de passe
//    d'application de 16 caractères, qui exige la validation en deux étapes.
// 2. Google réécrit l'en-tête From s'il ne correspond pas au compte
//    authentifié ou à une adresse « Envoyer en tant que » vérifiée. Écrire une
//    adresse arbitraire dans SENTINELLE_MAIL_FROM ne sert donc à rien.
// 3. Quota : 2 000 destinataires/jour en Workspace, 500 en Gmail gratuit. Large
//    pour des alertes et deux numéros par mois, mais ce n'est pas illimité.

export type MailConfig = {
  host: string;
  port: number;
  /** TLS implicite (465) ou STARTTLS négocié après connexion (587). */
  secure: boolean;
  user: string;
  pass: string;
  /** En-tête From complet, prêt à passer au transport. */
  from: string;
  replyTo: string | null;
};

export const DEFAULT_SMTP_HOST = "smtp.gmail.com";
export const DEFAULT_SMTP_PORT = 465;
export const DEFAULT_FROM_NAME = "Sentinelle";

/** `"Sentinelle" <veille@example.com>` — nom entre guillemets, virgule comprise. */
export function formatAddress(name: string, address: string): string {
  return `"${name.replace(/"/g, "")}" <${address}>`;
}

/** Vue minimale de l'environnement : `process.env` s'y conforme, un objet de test aussi. */
export type MailEnv = Record<string, string | undefined>;

function required(env: MailEnv, key: string): string {
  const value = env[key]?.trim();
  if (!value) {
    throw new Error(
      `${key} manquante. Renseignez-la dans .env.local (voir .env.example).`,
    );
  }
  return value;
}

/**
 * Lit la configuration d'envoi depuis l'environnement.
 *
 * Fonction pure prenant `env` en paramètre : testable sans toucher au process,
 * et appelée paresseusement par `send.ts` pour que le module puisse être
 * importé sans variable configurée.
 */
export function resolveMailConfig(env: MailEnv = process.env): MailConfig {
  const host = env.SENTINELLE_SMTP_HOST?.trim() || DEFAULT_SMTP_HOST;

  const rawPort = env.SENTINELLE_SMTP_PORT?.trim();
  const port = rawPort ? Number(rawPort) : DEFAULT_SMTP_PORT;
  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`SENTINELLE_SMTP_PORT invalide : "${rawPort}". Attendu 465 ou 587.`);
  }

  const user = required(env, "SENTINELLE_SMTP_USER");

  // Google affiche les mots de passe d'application par groupes de quatre
  // (« abcd efgh ijkl mnop »). Collés tels quels, les espaces font échouer
  // l'authentification avec un message qui n'aide en rien : on les retire.
  const pass = required(env, "SENTINELLE_SMTP_PASS").replace(/\s+/g, "");

  return {
    host,
    port,
    secure: port === 465,
    user,
    pass,
    from: env.SENTINELLE_MAIL_FROM?.trim() || formatAddress(DEFAULT_FROM_NAME, user),
    replyTo: env.SENTINELLE_MAIL_REPLY_TO?.trim() || null,
  };
}
