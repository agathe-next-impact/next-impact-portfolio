import { sendMail } from "@/lib/sendMail";
import {
  EMAIL,
  emailCard,
  emailH1,
  emailKicker,
  emailKvTable,
  emailLayout,
  emailParagraph,
} from "@/lib/email-template";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Libellés lisibles des outils source (pour la notif admin).
const SOURCE_LABELS: Record<string, string> = {
  boussole: "Boussole Techno Web & IA",
  "reparer-ou-refaire": "Réparer ou refaire",
  "nocode-saas-surmesure": "No-code / SaaS / sur-mesure",
  "prototype-ia": "Prototype IA : jetable ou produit ?",
  "decrypteur-devis": "Décrypteur de devis",
  "estimateur-budget": "Estimateur de budget",
  "tco-saas-vs-sur-mesure": "TCO SaaS vs sur-mesure",
  "audit-pwa": "Diagnostic PWA",
};

export async function POST(req: Request) {
  let body: { email?: string; source?: string; locale?: string };
  try {
    body = await req.json();
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  const { email, source, locale } = body;
  const isEn = locale === "en";

  if (!email || typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
    return new Response(isEn ? "Invalid email" : "Email invalide", { status: 400 });
  }

  const cleanEmail = email.trim();
  const sourceLabel = (source && SOURCE_LABELS[source]) || source || "—";

  try {
    const mailLink = (e: string) =>
      `<a href="mailto:${e}" style="color:${EMAIL.accent2};text-decoration:none;">${e}</a>`;

    // ─── Notif admin (interne, FR) ───────────────────────────────────────────
    const adminHtml = emailLayout({
      contentHtml:
        emailKicker("№ ADMIN", "Newsletter") +
        emailH1("Nouvel abonné newsletter") +
        emailKvTable([
          ["Email", mailLink(cleanEmail)],
          ["Source", sourceLabel],
          ["Langue", isEn ? "EN" : "FR"],
        ]),
      preheader: `Newsletter — ${cleanEmail}`,
    });

    // ─── Confirmation abonné — locale-aware ──────────────────────────────────
    const userHtml = emailLayout({
      contentHtml:
        emailKicker("№ 01", isEn ? "Subscription confirmed" : "Inscription confirmée") +
        emailH1(isEn ? "You're in." : "Vous êtes inscrit·e.") +
        emailCard(
          `<p style="font-family:${EMAIL.body};font-size:15px;line-height:1.7;color:${EMAIL.fgSoft};margin:0;">${
            isEn
              ? `Once a month, a single web &amp; AI decision — WordPress, no-code, Headless, AI coding or custom — decoded plainly, with no jargon and no spam.`
              : `Une fois par mois, une seule décision web &amp; IA — WordPress, no-code, Headless, IA coding ou sur-mesure — décryptée simplement, sans jargon et sans spam.`
          }</p>`,
          { accent: true },
        ) +
        emailParagraph(
          isEn
            ? "Wrong address or changed your mind? Just reply to this email and I'll remove you right away."
            : "Mauvaise adresse ou vous avez changé d'avis ? Répondez simplement à cet email et je vous retire aussitôt.",
        ),
      locale,
      preheader: isEn
        ? "You're subscribed — Next Impact Digital"
        : "Votre inscription est confirmée — Next Impact Digital",
    });

    await Promise.all([
      sendMail({
        to: ["agathe@next-impact.digital"],
        subject: `[Newsletter] Nouvel abonné — ${sourceLabel}`,
        html: adminHtml,
      }),
      sendMail({
        to: [cleanEmail],
        subject: isEn
          ? "You're subscribed — Next Impact Digital"
          : "Votre inscription à la newsletter — Next Impact Digital",
        html: userHtml,
      }),
    ]);

    return new Response(isEn ? "Subscribed" : "Inscrit", { status: 200 });
  } catch (err) {
    console.error("Erreur newsletter:", err);
    return new Response((isEn ? "Error: " : "Erreur: ") + String(err), { status: 500 });
  }
}
