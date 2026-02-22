import { sendMail } from "@/lib/sendMail";
import { generateCahierDesChargesPDF } from "@/lib/cahier-des-charges-pdf-renderer";

export async function POST(req: Request) {
  const { name, email, message, formData, type } = await req.json();

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

    // Email admin
    const adminHtml = isCahierDesCharges
      ? `
        <div style="font-family:'Inter',Arial,sans-serif;max-width:700px;margin:0 auto;">
          <h2 style="font-family:'Nunito',Arial,sans-serif;color:#1e3a5f;">Nouveau cahier des charges reçu</h2>
          <table style="border-collapse:collapse;width:100%;margin-bottom:24px;">
            <tr>
              <td style="padding:8px 12px;font-weight:bold;background:#f0f4f8;border:1px solid #d0d7de;">Nom</td>
              <td style="padding:8px 12px;border:1px solid #d0d7de;">${name}</td>
            </tr>
            <tr>
              <td style="padding:8px 12px;font-weight:bold;background:#f0f4f8;border:1px solid #d0d7de;">Email</td>
              <td style="padding:8px 12px;border:1px solid #d0d7de;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding:8px 12px;font-weight:bold;background:#f0f4f8;border:1px solid #d0d7de;">Organisation</td>
              <td style="padding:8px 12px;border:1px solid #d0d7de;">${formData.organisation_name || "—"}</td>
            </tr>
            <tr>
              <td style="padding:8px 12px;font-weight:bold;background:#f0f4f8;border:1px solid #d0d7de;">Message</td>
              <td style="padding:8px 12px;border:1px solid #d0d7de;">${message || "—"}</td>
            </tr>
          </table>
          <p style="font-size:14px;color:#666;">Le cahier des charges complet est joint en PDF.</p>
        </div>
      `
      : `
        <h3>Message reçu via le site</h3>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Message :</strong><br>${message}</p>
      `;

    // Email utilisateur
    const userHtml = isCahierDesCharges
      ? `
        <div style="font-family:'Inter',Arial,sans-serif;max-width:700px;margin:0 auto;">
          <h2 style="font-family:'Nunito',Arial,sans-serif;color:#1e3a5f;">Bonjour ${name},</h2>
          <p style="font-size:16px;line-height:1.6;color:#333;">
            Nous avons bien reçu votre cahier des charges. Vous trouverez ci-joint le PDF complet de votre document.
          </p>
          <p style="font-size:16px;line-height:1.6;color:#333;">
            Notre équipe va l'étudier et vous recontactera dans les plus brefs délais pour discuter de votre projet.
          </p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
          <p style="font-size:16px;line-height:1.6;color:#333;">
            Vous souhaitez en discuter ? N'hésitez pas à réserver un créneau :
          </p>
          <p style="text-align:center;margin:24px 0;">
            <a href="https://calendar.app.google/Cw7TGQBzeZ1szKU86"
               style="font-family:'Nunito',Arial,sans-serif;background:#ff6b6b;color:#1e3a5f;padding:12px 28px;border-radius:24px;text-decoration:none;font-weight:bold;font-size:16px;">
              Réserver un appel visio
            </a>
          </p>
          <p style="font-size:14px;color:#666;text-align:center;">
            Next Impact Digital — <a href="mailto:agathe@next-impact.digital" style="color:#4f46e5;">agathe@next-impact.digital</a> — 06 73 98 16 38
          </p>
        </div>
      `
      : `
        <h3>Bonjour ${name},</h3>
        <p>Nous avons bien reçu votre message :</p>
        <blockquote style="border-left:2px solid #ccc;padding-left:10px;">
          ${message}
        </blockquote>
        <p>Notre équipe vous répondra dans les plus brefs délais.</p>
        <p>Merci de votre confiance,<br>L'équipe Next Impact Digital</p>
      `;

    await Promise.all([
      sendMail({
        to: ["agathe@next-impact.digital"],
        subject: isCahierDesCharges
          ? `Nouveau cahier des charges de ${name}`
          : `Nouveau message de ${name}`,
        html: adminHtml,
        attachments,
      }),
      sendMail({
        to: [email],
        subject: isCahierDesCharges
          ? "Votre cahier des charges — Next Impact Digital"
          : "Confirmation de réception de votre message — Next Impact Digital",
        html: userHtml,
        attachments,
      }),
    ]);

    return new Response("Message envoyé", { status: 200 });
  } catch (err) {
    console.error("Erreur contact:", err);
    return new Response("Erreur: " + String(err), { status: 500 });
  }
}
