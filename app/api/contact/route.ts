import { sendMail } from "@/lib/sendMail";
import { generateCahierDesChargesPDF } from "@/lib/cahier-des-charges-pdf-renderer";
import {
  EMAIL,
  VISIO_URL,
  emailButton,
  emailCard,
  emailDivider,
  emailH1,
  emailH2,
  emailKicker,
  emailKvTable,
  emailLayout,
  emailLead,
  emailParagraph,
  emailSteps,
} from "@/lib/email-template";

export async function POST(req: Request) {
  const { name, email, message, formData, type, subject, locale } = await req.json();
  const isEn = locale === "en";

  try {
    // Générer le PDF si la requête vient du cahier des charges
    let attachments: any[] | undefined;
    const isCahierDesCharges = type === "cahier-des-charges";

    if (isCahierDesCharges) {
      const pdfBuffer = await generateCahierDesChargesPDF(formData);
      const orgName = (formData.organisation_name || "projet").replace(/[^a-zA-Z0-9À-ÿ\s-]/g, "").trim().replace(/\s+/g, "-");
      attachments = [{
        filename: `cahier-des-charges-${orgName}.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      }];
    }

    const escapedMsg = (message || "").replace(/\n/g, "<br>");
    const mailLink = (e: string) =>
      `<a href="mailto:${e}" style="color:${EMAIL.accent2};text-decoration:none;">${e}</a>`;

    // ─── Email admin (interne, FR) ───────────────────────────────────────────
    const adminContent = isCahierDesCharges
      ? emailKicker("№ ADMIN", "Cahier des charges") +
        emailH1("Nouveau cahier des charges") +
        emailKvTable([
          ["Nom", name],
          ["Email", mailLink(email)],
          ["Organisation", formData?.organisation_name || "—"],
          ["Message", escapedMsg || "—"],
        ]) +
        emailParagraph("Le cahier des charges complet est joint en PDF.")
      : emailKicker("№ ADMIN", "Message site") +
        emailH1("Nouveau message") +
        emailKvTable([
          ...(subject ? ([["Objet", subject]] as [string, string][]) : []),
          ["Nom", name],
          ["Email", mailLink(email)],
          ["Message", escapedMsg || "—"],
        ]);

    const adminHtml = emailLayout({
      contentHtml: adminContent,
      preheader: isCahierDesCharges ? `Cahier des charges — ${name}` : `Message — ${name}`,
    });

    // ─── Email utilisateur — locale-aware ────────────────────────────────────
    const userContent = isCahierDesCharges
      ? emailKicker("№ 01", isEn ? "Specifications" : "Cahier des charges") +
        emailH1(isEn ? `Hi ${name},` : `Bonjour ${name},`) +
        emailLead(isEn ? "Thank you for your trust." : "Merci pour votre confiance.") +
        emailCard(
          `<p style="font-family:${EMAIL.body};font-size:15px;line-height:1.7;color:${EMAIL.fgSoft};margin:0;">${
            isEn
              ? `We have received your <strong style="color:${EMAIL.fg};">project specifications</strong>. The complete PDF is attached — our team will review it carefully and get back to you shortly.`
              : `Nous avons bien reçu votre <strong style="color:${EMAIL.fg};">cahier des charges</strong>. Le PDF complet est joint — notre équipe va l'étudier attentivement et vous recontactera rapidement.`
          }</p>`,
          { accent: true },
        ) +
        emailH2(isEn ? "Next steps" : "Prochaines étapes") +
        emailSteps(
          isEn
            ? [
                ["Review", "We study your specifications in detail"],
                ["Discussion", "We get back to you to refine the requirements"],
                ["Proposal", "You receive a personalized quote"],
              ]
            : [
                ["Analyse", "Nous étudions votre cahier des charges en détail"],
                ["Échange", "Nous vous recontactons pour affiner vos besoins"],
                ["Proposition", "Vous recevez un devis personnalisé"],
              ],
        ) +
        emailDivider() +
        emailParagraph(isEn ? "Want to discuss it now?" : "Vous souhaitez en discuter dès maintenant ?") +
        `<div>${emailButton(VISIO_URL, isEn ? "Book a video call" : "Réserver un appel visio")}</div>`
      : emailKicker("№ 01", isEn ? "Message received" : "Message reçu") +
        emailH1(isEn ? `Hi ${name},` : `Bonjour ${name},`) +
        emailParagraph(isEn ? "We have received your message:" : "Nous avons bien reçu votre message :") +
        emailCard(
          `<p style="font-family:${EMAIL.body};font-size:15px;line-height:1.7;color:${EMAIL.fgSoft};margin:0;">${escapedMsg}</p>`,
          { accent: true },
        ) +
        emailParagraph(
          isEn
            ? "Our team will get back to you shortly.<br>Thanks for reaching out — the Next Impact Digital team."
            : "Notre équipe vous répondra dans les plus brefs délais.<br>Merci de votre confiance — l'équipe Next Impact Digital.",
        );

    const userHtml = emailLayout({
      contentHtml: userContent,
      locale,
      preheader: isCahierDesCharges
        ? isEn
          ? "Your project specifications — Next Impact Digital"
          : "Votre cahier des charges — Next Impact Digital"
        : isEn
        ? "We received your message — Next Impact Digital"
        : "Confirmation de réception — Next Impact Digital",
    });

    await Promise.all([
      sendMail({
        to: ["agathe@next-impact.digital"],
        subject: isCahierDesCharges
          ? `Nouveau cahier des charges de ${name}`
          : subject
          ? `[${subject}] Nouveau message de ${name}`
          : `Nouveau message de ${name}`,
        html: adminHtml,
        attachments,
      }),
      sendMail({
        to: [email],
        subject: isCahierDesCharges
          ? isEn
            ? "Your project specifications — Next Impact Digital"
            : "Votre cahier des charges — Next Impact Digital"
          : isEn
          ? "We received your message — Next Impact Digital"
          : "Confirmation de réception de votre message — Next Impact Digital",
        html: userHtml,
        attachments,
      }),
    ]);

    return new Response(isEn ? "Message sent" : "Message envoyé", { status: 200 });
  } catch (err) {
    console.error("Erreur contact:", err);
    return new Response((isEn ? "Error: " : "Erreur: ") + String(err), { status: 500 });
  }
}
