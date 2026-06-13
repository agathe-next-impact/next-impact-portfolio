import { NextRequest, NextResponse } from "next/server";
import { after } from "next/server";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { sendMail } from "@/lib/sendMail";
import { renderAuditEmailHtml } from "@/lib/audit-email-renderer";
import {
  EMAIL,
  VISIO_URL,
  emailButton,
  emailDivider,
  emailH1,
  emailKicker,
  emailKvTable,
  emailLayout,
  emailLead,
  emailParagraph,
} from "@/lib/email-template";

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

    const adminTo = process.env.AUDIT_MAIL_TO;
    if (adminTo) {
      const adminContent =
        emailKicker("№ ADMIN", "Audit demandé") +
        emailH1("Nouvelle demande d'audit") +
        emailKvTable([
          ["Nom", name],
          ["Entreprise", company || "—"],
          ["Email", `<a href="mailto:${email}" style="color:${EMAIL.accent2};text-decoration:none;">${email}</a>`],
          ["URL analysée", `<a href="${url}" style="color:${EMAIL.accent2};text-decoration:none;word-break:break-all;">${url}</a>`],
        ]) +
        emailDivider() +
        auditHtml;
      await sendMail({
        to: adminTo,
        subject: `Nouvel audit IA demandé — ${url}`,
        html: emailLayout({ contentHtml: adminContent, preheader: `Audit IA — ${url}` }),
      });
    }

    const userSubject = isEn
      ? `Your AI audit is ready — ${url}`
      : `Votre audit IA est prêt — ${url}`;

    const intro = isEn
      ? emailLead(
          `Hi ${name}, thank you for your interest. Here is the full audit report for your site — performance, security, SEO and technical architecture, with concrete modernization opportunities.`,
        )
      : emailLead(
          `Bonjour ${name}, merci pour votre intérêt. Voici le rapport d'audit complet de votre site — performance, sécurité, SEO et architecture technique, avec des opportunités de modernisation concrètes.`,
        );

    const outro =
      emailDivider() +
      emailParagraph(
        isEn ? "Want to discuss it? Book a slot:" : "Vous souhaitez en discuter ? Réservez un créneau :",
      ) +
      `<div>${emailButton(VISIO_URL, isEn ? "Book a video call" : "Réserver un appel visio")}</div>`;

    await sendMail({
      to: email,
      subject: userSubject,
      html: emailLayout({
        contentHtml: intro + auditHtml + outro,
        preheader: isEn ? `Your AI audit — ${url}` : `Votre audit IA — ${url}`,
        locale,
      }),
    });
  } catch (err: any) {
    console.error("[send-audit] background failure:", err);
    const adminTo = process.env.AUDIT_MAIL_TO;
    if (adminTo) {
      try {
        await sendMail({
          to: adminTo,
          subject: `[ECHEC] Audit IA — ${url}`,
          html: emailLayout({
            contentHtml:
              emailKicker("№ ERREUR", "Audit échoué") +
              emailH1("L'audit en arrière-plan a échoué") +
              emailKvTable([
                ["Client", `${name} — ${email}`],
                ["URL", `<a href="${url}" style="color:${EMAIL.accent2};text-decoration:none;word-break:break-all;">${url}</a>`],
                ["Erreur", err?.message || "inconnue"],
              ]),
            preheader: `Échec audit ${url}`,
          }),
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
