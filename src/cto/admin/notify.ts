import { sendMail } from "@/lib/sendMail";
import { emailButton, emailCard, emailH1, emailKicker, emailLayout, emailLead, emailParagraph } from "@/lib/email-template";
import { MAGIC_LINK_TTL_MS } from "@cto/access";
import { ADMIN_EMAIL, ADMIN_NAME } from "./identity";

// ─────────────────────────────────────────────────────────────────────────────
// Les deux e-mails de l'admin de supervision — copie réduite de
// `src/cto/access/notify.ts`, adressée à la seule identité admin plutôt qu'à
// « la personne concernée ». Même règle de fond : aucun contenu de la
// supervision ne voyage par e-mail, seulement qu'il y a quelque chose à faire
// et un lien pour le faire.
// ─────────────────────────────────────────────────────────────────────────────

const MINUTES = Math.round(MAGIC_LINK_TTL_MS / 60000);

/** Le lien de secours vers `/admin-cto`. */
export async function sendAdminLoginLink(url: string): Promise<void> {
  const html = emailLayout({
    preheader: `Votre lien de connexion à la supervision, valable ${MINUTES} minutes.`,
    contentHtml: [
      emailKicker("01", "Supervision — direction technique"),
      emailH1("Votre lien de connexion"),
      emailLead(`Bonjour ${ADMIN_NAME},`),
      emailParagraph(
        `Voici votre accès à la vue d'ensemble des accompagnements. Ce lien est valable <strong>${MINUTES} minutes</strong> et ne fonctionne qu'une fois.`,
      ),
      emailButton(url, "Ouvrir la supervision"),
      emailCard(
        emailParagraph(
          "Enregistrez une passkey depuis l'écran de supervision : vous vous connecterez ensuite d'un geste, sans repasser par votre boîte mail.",
        ),
      ),
      emailParagraph(
        "Si vous n'êtes pas à l'origine de cette demande, ignorez ce message : sans le lien, personne n'entre.",
      ),
    ].join(""),
  });

  await sendMail({ to: ADMIN_EMAIL, subject: "Votre lien de connexion — supervision CTO", html });
}

/** La notification d'enrôlement d'un appareil admin — même détail qu'un accès client trahirait. */
export async function sendAdminEnrollmentNotice(label: string, when: Date): Promise<void> {
  const stamp = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  }).format(when);

  const html = emailLayout({
    preheader: `Un nouvel appareil a été enregistré sur la supervision : ${label}.`,
    contentHtml: [
      emailKicker("01", "Sécurité"),
      emailH1("Un nouvel appareil a été enregistré"),
      emailLead(`Bonjour ${ADMIN_NAME},`),
      emailParagraph(
        `Une passkey vient d'être ajoutée à l'accès de supervision : <strong>${escapeHtml(label)}</strong>, le ${stamp}.`,
      ),
      emailParagraph(
        "Si c'est bien vous, il n'y a rien à faire. Dans le cas contraire, faites tourner CTO_ACCESS_SECRET (docs/cto-externalise/espace-client-mise-en-place.md) : cela ferme d'un coup toutes les sessions ouvertes.",
      ),
    ].join(""),
  });

  await sendMail({ to: ADMIN_EMAIL, subject: "Nouvel appareil enregistré sur la supervision", html });
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
