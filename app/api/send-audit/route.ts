import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { sendMail } from "@/lib/sendMail";
import { renderAuditEmailHtml } from "@/lib/audit-email-renderer";

export const maxDuration = 300;

async function runGeminiAnalysis(url: string, prompt: string, systemInstruction: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("Clé API Gemini manquante");

  const genAI = new GoogleGenerativeAI(apiKey);
  const modelsToTry = [
    "gemini-2.5-pro",
    "gemini-2.0-pro",
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
  ];

  const generationConfig = {
    temperature: 0.2,
    topP: 0.85,
    topK: 20,
    maxOutputTokens: 8192,
  };
  const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  ];

  const fullPrompt = prompt.replace(/\{\$url\}|\*\*url\*\*/g, url);

  let lastError: any = null;
  for (const modelName of modelsToTry) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction,
        generationConfig,
        safetySettings,
        // Grounding via Google Search : Gemini va lire la page en temps réel
        // au lieu de halluciner à partir du nom de domaine.
        // googleSearch (Gemini 2.0+) n'est pas dans les types SDK v0.24.x → cast.
        tools: [{ googleSearch: {} } as unknown as never],
      });
      const result = await model.generateContent(fullPrompt);
      return result.response.text();
    } catch (err: any) {
      lastError = err;
      continue;
    }
  }
  throw new Error(`Aucun modèle Gemini disponible. Dernière erreur: ${lastError?.message || "inconnu"}`);
}

async function deliverAudit(opts: {
  name: string;
  company: string;
  email: string;
  url: string;
  locale: string;
  prompt: string;
  systemInstruction: string;
}) {
  const { name, company, email, url, locale, prompt, systemInstruction } = opts;
  const isEn = locale === "en";

  try {
    const markdown = await runGeminiAnalysis(url, prompt, systemInstruction);
    const auditHtml = renderAuditEmailHtml(markdown, url);

    const fontTitre = "'Nunito', Arial, sans-serif";
    const fontTexte = "'Inter', Arial, sans-serif";

    const adminTo = process.env.AUDIT_MAIL_TO;
    if (adminTo) {
      await sendMail({
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
    }

    const userSubject = isEn
      ? `Your AI audit is ready — ${url}`
      : `Votre audit IA est prêt — ${url}`;

    const userHtml = isEn
      ? `
        <div style="font-family:${fontTexte};max-width:700px;margin:0 auto;">
          <h2 style="font-family:${fontTitre};color:#1e3a5f;">Hi ${name},</h2>
          <p style="font-family:${fontTexte};font-size:16px;line-height:1.6;color:#333;">
            Thank you for your interest! Here is the full audit report for your site
            <a href="${url}" style="color:#4f46e5;">${url}</a>.
          </p>
          <p style="font-family:${fontTexte};font-size:16px;line-height:1.6;color:#333;">
            This report analyzes the performance, security, SEO and technical architecture of your site
            to identify modernization opportunities.
          </p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
          ${auditHtml}
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;" />
          <p style="font-family:${fontTexte};font-size:16px;line-height:1.6;color:#333;">
            Want to discuss it? Feel free to book a slot:
          </p>
          <p style="text-align:center;margin:24px 0;">
            <a href="https://calendar.app.google/Cw7TGQBzeZ1szKU86"
               style="font-family:${fontTitre};background:#ff6b6b;color:#1e3a5f;padding:12px 28px;border-radius:24px;text-decoration:none;font-weight:bold;font-size:16px;">
              Book a video call
            </a>
          </p>
          <p style="font-family:${fontTexte};font-size:14px;color:#666;text-align:center;">
            Next Impact Digital — <a href="mailto:agathe@next-impact.digital" style="color:#4f46e5;">agathe@next-impact.digital</a> — +33 6 73 98 16 38
          </p>
        </div>
      `
      : `
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
      `;

    await sendMail({ to: email, subject: userSubject, html: userHtml });
  } catch (err: any) {
    console.error("[send-audit] background failure:", err);
    const adminTo = process.env.AUDIT_MAIL_TO;
    if (adminTo) {
      try {
        await sendMail({
          to: adminTo,
          subject: `[ECHEC] Audit IA — ${url}`,
          html: `
            <p>L'audit en arrière-plan a échoué pour <strong>${email}</strong> (${name}).</p>
            <p>URL : <a href="${url}">${url}</a></p>
            <p>Erreur : ${err?.message || "inconnue"}</p>
          `,
        });
      } catch (mailErr) {
        console.error("[send-audit] failed to notify admin:", mailErr);
      }
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, company, email, url, locale, prompt, systemInstruction } = await req.json();

    if (!name || !email || !url || !prompt || !systemInstruction) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants (name, email, url, prompt, systemInstruction)" },
        { status: 400 },
      );
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Format d'URL invalide" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Clé API Gemini manquante" }, { status: 500 });
    }

    after(() =>
      deliverAudit({
        name,
        company: company || "",
        email,
        url,
        locale: locale || "fr",
        prompt,
        systemInstruction,
      }),
    );

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Erreur envoi audit:", err);
    return NextResponse.json(
      { error: err.message || "Erreur lors de l'envoi" },
      { status: 500 },
    );
  }
}
