import { sendMail } from "@/lib/sendMail";
import {
  emailButton,
  emailCard,
  emailH1,
  emailKicker,
  emailLayout,
  emailLead,
  emailParagraph,
} from "@/lib/email-template";
import { MAGIC_LINK_TTL_MS } from "./token";

// ─────────────────────────────────────────────────────────────────────────────
// Les deux e-mails de la couche d'accès.
//
// Ils passent par `lib/email-template.ts` (kit Blueprint) et `lib/sendMail.ts`,
// comme tout le reste du site : un gabarit d'e-mail ad hoc de plus finirait par
// diverger de la charte, et personne ne s'en apercevrait avant qu'un client le
// reçoive.
//
// Règle commune, et elle est structurante : **aucun contenu de l'espace ne
// voyage par e-mail.** Ni décision, ni extrait de roadmap, ni nom de
// fournisseur. Un message dit qu'il y a quelque chose à lire et donne un lien.
// Sinon la boîte du client devient l'archive, hors de tout contrôle : ni
// révocable, ni journalisée, ni effaçable.
// ─────────────────────────────────────────────────────────────────────────────

const MINUTES = Math.round(MAGIC_LINK_TTL_MS / 60000);

export interface Recipient {
  email: string;
  name: string;
}

/**
 * Le lien de secours.
 *
 * Premier accès, nouvel appareil, passkey perdue. Le message dit explicitement
 * qu'il est à usage unique et pourquoi il expire vite : sans cette phrase, un
 * client qui reclique le lendemain conclut que « le site est cassé ».
 */
export async function sendLoginLink(to: Recipient, url: string): Promise<void> {
  const html = emailLayout({
    preheader: `Votre lien de connexion, valable ${MINUTES} minutes.`,
    contentHtml: [
      emailKicker("01", "Espace direction technique"),
      emailH1("Votre lien de connexion"),
      emailLead(`Bonjour ${escapeHtml(to.name)},`),
      emailParagraph(
        `Voici votre accès à votre espace. Ce lien est valable <strong>${MINUTES} minutes</strong> et ne fonctionne qu'une fois.`,
      ),
      emailButton(url, "Ouvrir mon espace"),
      emailCard(
        emailParagraph(
          "Une fois connecté, enregistrez une passkey depuis l'écran « Appareils » : vous vous connecterez ensuite d'un geste, sans repasser par votre boîte mail.",
        ),
      ),
      emailParagraph(
        "Si vous n'êtes pas à l'origine de cette demande, ignorez ce message : sans le lien, personne n'entre.",
      ),
    ].join(""),
  });

  await sendMail({
    to: to.email,
    subject: "Votre lien de connexion — espace direction technique",
    html,
  });
}

/**
 * La notification d'enrôlement d'un appareil.
 *
 * C'est le détail qui rend un ajout illégitime visible, et il ne coûte qu'un
 * message. Il part vers la personne CONCERNÉE, jamais vers une adresse
 * générique : l'intérêt est qu'elle reconnaisse, ou non, un geste qu'elle vient
 * de faire.
 */
export async function sendEnrollmentNotice(
  to: Recipient,
  label: string,
  when: Date,
  manageUrl: string,
): Promise<void> {
  const stamp = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  }).format(when);

  const html = emailLayout({
    preheader: `Un nouvel appareil a été enregistré : ${label}.`,
    contentHtml: [
      emailKicker("01", "Sécurité"),
      emailH1("Un nouvel appareil a été enregistré"),
      emailLead(`Bonjour ${escapeHtml(to.name)},`),
      emailParagraph(
        `Une passkey vient d'être ajoutée à votre accès : <strong>${escapeHtml(label)}</strong>, le ${stamp}.`,
      ),
      emailParagraph(
        "Si c'est bien vous, il n'y a rien à faire. Dans le cas contraire, ouvrez votre espace et supprimez cet appareil : l'accès associé cesse immédiatement.",
      ),
      emailButton(manageUrl, "Voir mes appareils"),
    ].join(""),
  });

  await sendMail({
    to: to.email,
    subject: "Nouvel appareil enregistré sur votre espace",
    html,
  });
}

/**
 * Échappement minimal.
 *
 * Les noms viennent de la base, donc de toi : le risque est théorique. Il coûte
 * trois lignes, et une apostrophe dans « L'Atelier » suffirait à casser le
 * rendu.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Ce que la notification de publication a le droit de dire.
 *
 * Des NOMBRES et des intitulés de catégorie, jamais un titre de livrable. La
 * règle de tête du fichier s'applique ici plus qu'ailleurs : c'est la
 * notification la plus fréquente, et celle qui serait la plus tentante à
 * enrichir « pour le confort du client ». Un relevé de décisions qui se lit
 * dans une boîte mail n'est plus révocable, plus journalisé, plus effaçable.
 */
export interface PublicationSummary {
  nouveautes: number;
  corrections: number;
  parCategorie: { label: string; count: number }[];
}

/**
 * « Il y a du nouveau dans votre espace. »
 *
 * Envoyée après une publication, parce que l'offre promet le relevé « dans les
 * 24 h qui suivent le comité » et qu'un livrable en ligne dont personne n'est
 * prévenu n'est pas livré. Un seul message par balayage et par personne : trois
 * e-mails pour trois décisions du même comité se feraient filtrer, et à raison.
 */
export async function sendPublicationNotice(
  to: Recipient,
  summary: PublicationSummary,
  url: string,
): Promise<void> {
  const total = summary.nouveautes + summary.corrections;
  const titre =
    summary.corrections === 0
      ? `${summary.nouveautes} ${summary.nouveautes > 1 ? "nouveaux livrables" : "nouveau livrable"}`
      : summary.nouveautes === 0
        ? `${summary.corrections} ${summary.corrections > 1 ? "livrables corrigés" : "livrable corrigé"}`
        : `${total} mises à jour`;

  const detail = summary.parCategorie
    .map((ligne) => `${ligne.count} en ${escapeHtml(ligne.label.toLowerCase())}`)
    .join(", ");

  const html = emailLayout({
    preheader: `${titre} dans votre espace direction technique.`,
    contentHtml: [
      emailKicker("01", "Espace direction technique"),
      emailH1(titre),
      emailLead(`Bonjour ${escapeHtml(to.name)},`),
      emailParagraph(
        summary.corrections === 0
          ? `Votre espace vient d'être mis à jour : ${escapeHtml(detail)}.`
          : `Votre espace vient d'être mis à jour : ${escapeHtml(detail)}. Les livrables corrigés indiquent la date de leur correction et vous laissent relire les versions précédentes.`,
      ),
      emailButton(url, "Ouvrir mon espace"),
      emailCard(
        emailParagraph(
          "Le détail n'est volontairement pas dans ce message : il reste dans votre espace, où il est daté, versionné et révocable.",
        ),
      ),
    ].join(""),
  });

  await sendMail({
    to: to.email,
    subject: `${titre} dans votre espace — direction technique`,
    html,
  });
}
