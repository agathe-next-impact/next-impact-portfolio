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
        <style>@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap');</style>
        <div style="font-family:'Inter',Arial,sans-serif;max-width:700px;margin:0 auto;background:#ffffff;">
          <!-- Header -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:0;background:#020F59;border-radius:12px 12px 0 0;padding:0;">
            <tr>
              <td style="padding:24px 32px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td valign="middle" style="width:50%;">
                      <a href="https://next-impact.digital" style="text-decoration:none;">
                        <img src="https://next-impact.digital/img/logo-small.png" alt="Next Impact Digital" height="40" style="height:40px;width:auto;display:block;" />
                      </a>
                    </td>
                    <td valign="middle" style="width:50%;text-align:right;">
                      <a href="https://calendar.app.google/Cw7TGQBzeZ1szKU86" style="font-family:'Nunito',Arial,sans-serif;font-size:12px;color:#FF6B6B;text-decoration:none;font-weight:700;margin-right:16px;">
                        Visio
                      </a>
                      <a href="tel:0673981638" style="font-family:'Inter',Arial,sans-serif;font-size:12px;color:#D0DCF2;text-decoration:none;">
                        06 73 98 16 38
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- Bandeau accent -->
          <div style="height:4px;background:linear-gradient(90deg,#FF6B6B 0%,#F29F05 50%,#F2E57E 100%);"></div>

          <!-- Corps -->
          <div style="padding:40px 32px 32px;">
            <h1 style="font-family:'Nunito',Arial,sans-serif;font-size:24px;font-weight:700;color:#020F59;margin:0 0 8px;">
              Bonjour ${name},
            </h1>
            <p style="font-family:'Inter',Arial,sans-serif;font-size:15px;line-height:1.7;color:#021373;margin:0 0 20px;">
              Merci pour votre confiance.
            </p>

            <!-- Card confirmation -->
            <div style="background:#f0f4ff;border-left:4px solid #1F54BF;border-radius:0 8px 8px 0;padding:20px 24px;margin:0 0 24px;">
              <p style="font-family:'Inter',Arial,sans-serif;font-size:15px;line-height:1.7;color:#020F59;margin:0 0 8px;">
                Nous avons bien reçu votre <strong>cahier des charges</strong>. Vous trouverez ci-joint le PDF complet de votre document.
              </p>
              <p style="font-family:'Inter',Arial,sans-serif;font-size:15px;line-height:1.7;color:#020F59;margin:0;">
                Notre équipe va l'étudier attentivement et vous recontactera dans les plus brefs délais pour discuter de votre projet.
              </p>
            </div>

            <!-- Étapes -->
            <h2 style="font-family:'Nunito',Arial,sans-serif;font-size:16px;font-weight:700;color:#020F59;margin:0 0 16px;text-transform:uppercase;letter-spacing:1px;">
              Prochaines étapes
            </h2>
            <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
              <tr>
                <td style="padding:12px 16px;vertical-align:top;width:40px;">
                  <div style="width:32px;height:32px;border-radius:50%;background:#1F54BF;color:#ffffff;font-family:'Nunito',Arial,sans-serif;font-size:14px;font-weight:700;text-align:center;line-height:32px;">1</div>
                </td>
                <td style="padding:12px 16px;vertical-align:middle;">
                  <p style="font-family:'Inter',Arial,sans-serif;font-size:14px;line-height:1.6;color:#021373;margin:0;">
                    <strong>Analyse</strong> — Nous étudions votre cahier des charges en détail
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 16px;vertical-align:top;width:40px;">
                  <div style="width:32px;height:32px;border-radius:50%;background:#1F54BF;color:#ffffff;font-family:'Nunito',Arial,sans-serif;font-size:14px;font-weight:700;text-align:center;line-height:32px;">2</div>
                </td>
                <td style="padding:12px 16px;vertical-align:middle;">
                  <p style="font-family:'Inter',Arial,sans-serif;font-size:14px;line-height:1.6;color:#021373;margin:0;">
                    <strong>Échange</strong> — Nous vous recontactons pour affiner vos besoins
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:12px 16px;vertical-align:top;width:40px;">
                  <div style="width:32px;height:32px;border-radius:50%;background:#1F54BF;color:#ffffff;font-family:'Nunito',Arial,sans-serif;font-size:14px;font-weight:700;text-align:center;line-height:32px;">3</div>
                </td>
                <td style="padding:12px 16px;vertical-align:middle;">
                  <p style="font-family:'Inter',Arial,sans-serif;font-size:14px;line-height:1.6;color:#021373;margin:0;">
                    <strong>Proposition</strong> — Vous recevez un devis personnalisé
                  </p>
                </td>
              </tr>
            </table>

            <!-- Séparateur -->
            <hr style="border:none;border-top:1px solid #D0DCF2;margin:0 0 24px;" />

            <!-- CTA -->
            <p style="font-family:'Inter',Arial,sans-serif;font-size:15px;line-height:1.7;color:#021373;margin:0 0 16px;text-align:center;">
              Vous souhaitez en discuter dès maintenant ?
            </p>
            <p style="text-align:center;margin:0 0 32px;">
              <a href="https://calendar.app.google/Cw7TGQBzeZ1szKU86"
                 style="font-family:'Nunito',Arial,sans-serif;display:inline-block;background:#FF6B6B;color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;letter-spacing:0.5px;">
                Réserver un appel visio
              </a>
            </p>
          </div>

          <!-- Footer -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#020F59;border-radius:0 0 12px 12px;">
            <tr>
              <td style="padding:24px 32px;text-align:center;">
                <p style="font-family:'Nunito',Arial,sans-serif;font-size:14px;font-weight:700;color:#D0DCF2;margin:0 0 8px;">
                  Next Impact Digital
                </p>
                <p style="font-family:'Inter',Arial,sans-serif;font-size:12px;color:#719ED9;margin:0 0 4px;">
                  <a href="mailto:agathe@next-impact.digital" style="color:#FF6B6B;text-decoration:none;">agathe@next-impact.digital</a>
                  &nbsp;&middot;&nbsp;
                  <a href="tel:0673981638" style="color:#D0DCF2;text-decoration:none;">06 73 98 16 38</a>
                </p>
                <p style="font-family:'Inter',Arial,sans-serif;font-size:11px;color:#719ED9;margin:8px 0 0;">
                  <a href="https://next-impact.digital" style="color:#719ED9;text-decoration:none;">next-impact.digital</a>
                </p>
              </td>
            </tr>
          </table>
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
