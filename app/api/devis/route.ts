import { sendMail } from "@/lib/sendMail";
import {
  EMAIL,
  emailButton,
  emailDivider,
  emailH1,
  emailKicker,
  emailKvTable,
  emailLayout,
  emailLead,
  emailParagraph,
} from "@/lib/email-template";

export async function POST(req: Request) {
  try {
    const {
      contact,
      estimation,
      structure,
      objectifs,
      autonomie,
      contenu,
      pages,
      calendlyLink,
      locale,
    } = await req.json();
    const isEn = locale === "en";

    const userEmail = contact?.email;
    const adminEmail = "agathe@next-impact.digital"; // Adresse fixe

    const list = (items: any) =>
      Array.isArray(items) ? items.join(", ") : isEn ? "Not specified" : "Non précisé";

    const strong = (s: string) => `<strong style="color:${EMAIL.fg};">${s}</strong>`;

    // ─── Email client — locale-aware ─────────────────────────────────────────
    const clientContent =
      emailKicker("№ 01", isEn ? "Estimate" : "Estimation") +
      emailH1(isEn ? "Thank you for your request" : "Merci pour votre demande") +
      emailLead(isEn ? "Here is a summary of your project:" : "Voici un récapitulatif de votre projet :") +
      emailKvTable(
        isEn
          ? [
              ["Organization", structure],
              ["Objectives", list(objectifs)],
              ["Autonomy needs", autonomie],
              ["Existing content", contenu],
              ["Pages requested", list(pages)],
              ["Estimate", `from ${strong(`${estimation} € incl. tax`)}`],
            ]
          : [
              ["Structure", structure],
              ["Objectifs", list(objectifs)],
              ["Souhait d'autonomie", autonomie],
              ["Contenu existant", contenu],
              ["Pages souhaitées", list(pages)],
              ["Estimation", `à partir de ${strong(`${estimation} € TTC`)}`],
            ],
      ) +
      emailDivider() +
      emailParagraph(
        isEn
          ? "You can book a call with us directly:"
          : "Vous pouvez directement planifier un appel avec nous :",
      ) +
      `<div>${emailButton(calendlyLink, isEn ? "Book a call" : "Planifier un appel")}</div>`;

    const clientHtml = emailLayout({
      contentHtml: clientContent,
      locale,
      preheader: isEn
        ? "Your personalized estimate — Next Impact Digital"
        : "Votre estimation personnalisée — Next Impact Digital",
    });

    // ─── Email admin (interne, FR) ───────────────────────────────────────────
    const adminContent =
      emailKicker("№ ADMIN", "Estimation") +
      emailH1("Nouvelle estimation reçue") +
      emailKvTable([
        ["Email client", `<a href="mailto:${userEmail}" style="color:${EMAIL.accent2};text-decoration:none;">${userEmail}</a>`],
        ["Structure", structure],
        ["Objectifs", list(objectifs)],
        ["Autonomie", autonomie],
        ["Contenu", contenu],
        ["Pages", list(pages)],
        ["Téléphone", contact?.phone || "Non renseigné"],
        ["Estimation", `${estimation} € TTC`],
      ]);

    const adminHtml = emailLayout({
      contentHtml: adminContent,
      preheader: `Estimation — ${userEmail}`,
    });

    try {
      await Promise.all([
        sendMail({
          to: userEmail,
          subject: isEn
            ? "Your personalized estimate – Next Impact Digital"
            : "Votre estimation personnalisée – Next Impact Digital",
          html: clientHtml,
        }),
        sendMail({
          to: adminEmail,
          subject: `Nouvelle estimation reçue de ${userEmail}`,
          html: adminHtml,
        }),
      ]);
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
      console.error("Erreur envoi estimation mail:", error);
      return new Response(
        JSON.stringify({
          error: isEn ? "Error sending emails." : "Erreur lors de l'envoi des e-mails.",
        }),
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Erreur traitement estimation:", error);
    return new Response(
      JSON.stringify({ error: "Erreur lors du traitement de la demande." }),
      { status: 500 },
    );
  }
}
