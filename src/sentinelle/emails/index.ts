// Envoi d'e-mails Sentinelle — SMTP Google, transport propre au produit.
// Ne jamais utiliser lib/sendMail.ts ni lib/email-template.ts du site vitrine.
//
// Le transport existe dès maintenant ; les gabarits (alerte, newsletter) et le
// cycle draft → validated → sent arrivent en phase 4.
export {
  DEFAULT_FROM_NAME,
  DEFAULT_SMTP_HOST,
  DEFAULT_SMTP_PORT,
  formatAddress,
  resolveMailConfig,
  type MailConfig,
  type MailEnv,
} from "./config";

export {
  resetMailTransport,
  sendSentinelleMail,
  undeliverableReason,
  verifyMailTransport,
  type MailTransport,
  type SentinelleMail,
} from "./send";

export {
  newsletterSubject,
  previewAlertEmail,
  previewNewsletterEmail,
  renderAlertEmail,
  renderLoginEmail,
  renderNewsletterEmail,
  renderWelcomeEmail,
  type LoginEmailProps,
  type RenderedMail,
  type WelcomeEmailProps,
} from "./render";
