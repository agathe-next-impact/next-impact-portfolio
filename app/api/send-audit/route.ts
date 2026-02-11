import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { renderAuditEmailHtml } from "@/lib/audit-email-renderer";

const transporter = nodemailer.createTransport({
  host: process.env.NODEMAILER_HOST,
  port: Number(process.env.NODEMAILER_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { name, company, email, url, markdown } = await req.json();

    if (!name || !email || !url || !markdown) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants (name, email, url, markdown)" },
        { status: 400 }
      );
    }

    const adminTo = process.env.AUDIT_MAIL_TO;
    if (!adminTo) {
      return NextResponse.json(
        { error: "AUDIT_MAIL_TO non configuré" },
        { status: 500 }
      );
    }

    const from = `"Next Impact Audit" <${process.env.NODEMAILER_USER}>`;

    // Rendu HTML identique au site (dashboard + tableaux + stack + markdown)
    const auditHtml = renderAuditEmailHtml(markdown, url);

    const fontTitre = "'Nunito', Arial, sans-serif";
    const fontTexte = "'Inter', Arial, sans-serif";

    // 1. Email admin : coordonnées + audit complet rendu
    await transporter.sendMail({
      from,
      to: adminTo,
      subject: `Nouvel audit IA demandé — ${url}`,
      html: `
        <div style="font-family:${fontTexte};max-width:700px;margin:0 auto;">
          <h2 style="font-family:${fontTitre};color:#1e3a5f;">Nouvelle demande d'audit</h2>
          <table style="font-family:${fontTexte};border-collapse:collapse;width:100%;margin-bottom:24px;">
            <tr>
              <td style="padding:8px 12px;font-weight:bold;background:#f0f4f8;border:1px solid #d0d7de;">Nom</td>
              <td style="padding:8px 12px;border:1px solid #d0d7de;">${name}</td>
            </tr>
            <tr>
              <td style="padding:8px 12px;font-weight:bold;background:#f0f4f8;border:1px solid #d0d7de;">Entreprise</td>
              <td style="padding:8px 12px;border:1px solid #d0d7de;">${company || "—"}</td>
            </tr>
            <tr>
              <td style="padding:8px 12px;font-weight:bold;background:#f0f4f8;border:1px solid #d0d7de;">Email</td>
              <td style="padding:8px 12px;border:1px solid #d0d7de;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding:8px 12px;font-weight:bold;background:#f0f4f8;border:1px solid #d0d7de;">URL analysée</td>
              <td style="padding:8px 12px;border:1px solid #d0d7de;"><a href="${url}">${url}</a></td>
            </tr>
          </table>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
          ${auditHtml}
        </div>
      `,
    });

    // 2. Email utilisateur : message d'accompagnement + audit rendu
    await transporter.sendMail({
      from,
      to: email,
      subject: `Votre audit IA est prêt — ${url}`,
      html: `
        <div style="font-family:${fontTexte};max-width:700px;margin:0 auto;">
          <h2 style="font-family:${fontTitre};color:#1e3a5f;">Bonjour ${name},</h2>
          <p style="font-family:${fontTexte};font-size:16px;line-height:1.6;color:#333;">
            Merci pour votre intérêt ! Voici le rapport d'audit complet de votre site
            <a href="${url}" style="color:#4f46e5;">${url}</a>.
          </p>
          <p style="font-family:${fontTexte};font-size:16px;line-height:1.6;color:#333;">
            Ce rapport analyse la performance, la sécurité, le SEO et l'architecture technique de votre site
            afin d'identifier les opportunités de modernisation.
          </p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
          ${auditHtml}
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
          <p style="font-family:${fontTexte};font-size:16px;line-height:1.6;color:#333;">
            Vous souhaitez en discuter ? N'hésitez pas à réserver un créneau :
          </p>
          <p style="text-align:center;margin:24px 0;">
            <a href="https://calendar.app.google/Cw7TGQBzeZ1szKU86"
               style="font-family:${fontTitre};background:#ff6b6b;color:#1e3a5f;padding:12px 28px;border-radius:24px;text-decoration:none;font-weight:bold;font-size:16px;">
              Réserver un appel visio
            </a>
          </p>
          <p style="font-family:${fontTexte};font-size:14px;color:#666;text-align:center;">
            Next Impact Digital — <a href="mailto:agathe@next-impact.digital" style="color:#4f46e5;">agathe@next-impact.digital</a> — 06 73 98 16 38
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Erreur envoi audit:", err);
    return NextResponse.json(
      { error: err.message || "Erreur lors de l'envoi" },
      { status: 500 }
    );
  }
}
