import nodemailer from "nodemailer";
import { resolveMailConfig, type MailConfig } from "./config";

// Transport d'envoi Sentinelle. Volontairement distinct de `lib/sendMail.ts` :
// même fournisseur aujourd'hui, mais deux identités, deux jeux de variables et
// deux cycles de vie. La vitrine et le produit ne doivent jamais tomber
// ensemble parce qu'un mot de passe d'application a été révoqué.

export type SentinelleMail = {
  to: string | string[];
  subject: string;
  /** Corps HTML — rendu d'un gabarit versionné, jamais du HTML écrit à la main. */
  html: string;
  /** Version texte. Optionnelle, mais elle améliore nettement la délivrabilité. */
  text?: string;
  /** Surcharge ponctuelle du reply-to configuré. */
  replyTo?: string;
  /** En-têtes additionnels — typiquement `List-Unsubscribe` sur la newsletter. */
  headers?: Record<string, string>;
};

/**
 * Le peu que l'envoi attend d'un transport : assez petit pour être simulé dans
 * un test sans ouvrir de connexion.
 */
export type MailTransport = {
  sendMail(message: {
    from: string;
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    replyTo?: string;
    headers?: Record<string, string>;
  }): Promise<{ messageId?: string }>;
  verify?(): Promise<unknown>;
};

type Deps = { transport?: MailTransport; config?: MailConfig };

let cached: { transport: MailTransport; config: MailConfig } | undefined;

function resolve(deps: Deps): { transport: MailTransport; config: MailConfig } {
  if (deps.transport && deps.config) return { transport: deps.transport, config: deps.config };

  if (!cached) {
    const config = deps.config ?? resolveMailConfig();
    cached = {
      config,
      transport: nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure,
        auth: { user: config.user, pass: config.pass },
      }) as unknown as MailTransport,
    };
  }

  return { transport: deps.transport ?? cached.transport, config: deps.config ?? cached.config };
}

/** Vide le transport mémorisé. Utile en test, et après rotation du mot de passe. */
export function resetMailTransport(): void {
  cached = undefined;
}

/**
 * Envoie un e-mail Sentinelle.
 *
 * Ne décide de rien du contenu : les gabarits vivent dans `emails/`, les règles
 * d'envoi (règle 4 : aucune alerte sans validation humaine) dans l'admin.
 */
export async function sendSentinelleMail(
  mail: SentinelleMail,
  deps: Deps = {},
): Promise<{ messageId: string | null }> {
  const { transport, config } = resolve(deps);

  const result = await transport.sendMail({
    from: config.from,
    to: mail.to,
    subject: mail.subject,
    html: mail.html,
    ...(mail.text ? { text: mail.text } : {}),
    ...(mail.replyTo ?? config.replyTo
      ? { replyTo: mail.replyTo ?? (config.replyTo as string) }
      : {}),
    ...(mail.headers ? { headers: mail.headers } : {}),
  });

  return { messageId: result.messageId ?? null };
}

/**
 * Vérifie la connexion et l'authentification SMTP sans envoyer de message.
 *
 * À appeler après toute rotation de mot de passe d'application : une erreur ici
 * coûte dix secondes, la même erreur découverte au premier envoi d'alerte coûte
 * la crédibilité du service.
 */
export async function verifyMailTransport(
  deps: Deps = {},
): Promise<{ ok: true; from: string } | { ok: false; reason: string }> {
  try {
    const { transport, config } = resolve(deps);
    if (transport.verify) await transport.verify();
    return { ok: true, from: config.from };
  } catch (error) {
    return {
      ok: false,
      reason: error instanceof Error ? error.message : "vérification impossible",
    };
  }
}
