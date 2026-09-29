import { sendMail } from "@/lib/sendMail";
import { emailButton, emailCard, emailCode, emailH1, emailKicker, emailLayout, emailLead, emailParagraph } from "@/lib/email-template";
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
export async function sendAdminLoginLink(url: string, code: string): Promise<void> {
  const html = emailLayout({
    preheader: `Code de connexion à la supervision : ${code}. Valable ${MINUTES} minutes.`,
    contentHtml: [
      emailKicker("01", "Supervision — direction technique"),
      emailH1("Votre lien de connexion"),
      emailLead(`Bonjour ${ADMIN_NAME},`),
      emailParagraph(
        `Voici votre accès à la vue d'ensemble des accompagnements. Ce lien est valable <strong>${MINUTES} minutes</strong> et ne fonctionne qu'une fois.`,
      ),
      emailButton(url, "Ouvrir la supervision"),
      emailCode(code, "Ou saisissez ce code dans l'application"),
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

/**
 * L'alerte d'un balayage : un nombre et un lien, jamais le détail.
 *
 * Les points eux-mêmes nomment des clients et des personnes ; ils se lisent
 * dans la supervision, derrière sa connexion. `failed` : le balayage a levé
 * avant d'aboutir.
 */
export async function sendSyncAlert(count: number, failed: boolean, url: string): Promise<void> {
  const titre = failed
    ? "Le balayage de l'atelier a échoué"
    : count > 1
      ? `${count} points à traiter après le balayage`
      : "Un point à traiter après le balayage";

  const html = emailLayout({
    preheader: failed
      ? "Le dernier balayage de l'atelier Notion n'a pas abouti."
      : "Le dernier balayage de l'atelier Notion a relevé du nouveau sur un accès ou un rattachement.",
    contentHtml: [
      emailKicker("01", "Supervision — direction technique"),
      emailH1(titre),
      emailLead(`Bonjour ${ADMIN_NAME},`),
      emailParagraph(
        failed
          ? "Le dernier balayage de l'atelier Notion n'a pas abouti : les espaces clients sont restés tels qu'ils étaient."
          : `Le dernier balayage de l'atelier Notion a relevé <strong>${count} point${count > 1 ? "s" : ""}</strong> ` +
              "qui touche" +
              (count > 1 ? "nt" : "") +
              " un accès ou un rattachement, et que le balayage précédent ne signalait pas.",
      ),
      emailButton(url, "Ouvrir la supervision"),
      emailCard(
        emailParagraph(
          "Le détail se lit dans la supervision, sous « Dernier balayage ». Un point déjà signalé n'est pas renvoyé tant qu'il reste le même.",
        ),
      ),
    ].join(""),
  });

  await sendMail({
    to: ADMIN_EMAIL,
    subject: failed ? "Balayage de l'atelier en échec — supervision CTO" : `${titre} — supervision CTO`,
    html,
  });
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
