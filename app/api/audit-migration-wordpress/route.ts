import { NextRequest, NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";



export async function POST(req: NextRequest) {
  const data = await req.json();
  const { nom, entreprise, mail, telephone, url } = data;

  if (!nom ||  !entreprise || !mail || !telephone || !url) {
    return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
  }

  try {
    // Envoi à l'équipe Next Impact
    await sendMail({
      to: process.env.AUDIT_MAIL_TO || "agathe@next-impact.digital",
      subject: "Nouvelle demande d'audit migration Wordpress",
      html: `
        <h2>Nouvelle demande d'audit migration Wordpress</h2>
        <ul>
          <li><strong>Nom:</strong> ${nom}</li>
          <li><strong>Entreprise:</strong> ${entreprise}</li>
          <li><strong>Email:</strong> ${mail}</li>
          <li><strong>Téléphone:</strong> ${telephone}</li>
          <li><strong>URL à auditer:</strong> ${url}</li>
        </ul>
      `
    });

    // Envoi accusé de réception à l'utilisateur
    await sendMail({
      to: mail,
      subject: "Accusé de réception - Audit Migration WordPress",
      from: process.env.NODEMAILER_USER || "agathe@next-impact.digital",
      html: `
      <!DOCTYPE html>
      <html lang=\"fr\">
        <head>
          <meta charset=\"UTF-8\" />
          <title>Accusé de réception - Audit Migration WordPress</title>
          <style>
            body { background: #f8fafc; font-family: "Open Sans", Helvetica, sans-serif; color: #021373; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 40px auto; background: rgba(255,255,255,0.95); border-radius: 1rem; box-shadow: 0 4px 24px rgba(30,41,59,0.08); padding: 2rem; border: 1px solid #e0e7ef; }
            .badge { display: inline-block; background: #1F54BF; color: rgba(255,255,255,0.95); font-size: 12px; font-weight: 600; text-transform: uppercase; border-radius: 999px; padding: 6px 18px; margin-bottom: 18px; letter-spacing: 1px; }
            h1 { color: #1F54BF; font-size: 2rem; font-weight: 500; margin-bottom: 0.5rem; }
            .subtitle { color: #1F54BF; font-size: 1.2rem; margin-bottom: 1.5rem; }
            .content { color: #021373; font-size: 1rem; margin-bottom: 2rem; }
            .cta { display: inline-block; background: #FF6B6B; color: rgba(255,255,255,0.95); font-weight: 500; border-radius: 999px; padding: 10px 32px; text-decoration: none; font-size: 1rem; margin-top: 1rem; }
            .footer { color: #021373; font-size: 0.9rem; margin-top: 2rem; text-align: center; }
          </style>
        </head>
        <body>
          <div class=\"container\">
            <div class=\"header\"><a href=\"https://next-impact.digital\"><img src=\"https://next-impact.digital/logo-bleu.png\" alt=\"Next Impact Logo\" width=\"120\" /></a></div>
            <h1>Merci pour votre demande d'audit</h1>
            <div class=\"subtitle\">Migration WordPress vers Headless</div>
            <div class=\"content\">
              Bonjour,<br><br>
              Nous avons bien reçu votre demande d’audit.<br>
              Notre équipe Next Impact va analyser votre projet et vous adresser des recommandations personnalisées sous 48h.<br><br>
              <strong>Rappel de votre demande :</strong><br>
              <ul style=\"margin: 1em 0 2em 0; padding-left: 1em;\">
                <li><b>Nom :</b> ${nom}</li>
                <li><b>Entreprise :</b> ${entreprise}</li>
                <li><b>Email :</b> ${mail}</li>
                <li><b>Téléphone :</b> ${telephone}</li>
                <li><b>URL à auditer :</b> ${url}</li>
              </ul>
            </div>
            <a href=\"https://next-impact.digital\" class=\"cta\">Visitez notre site</a>
            <div class=\"footer\">
              Next Impact • agathe@next-impact.digital<br>
              2026 &copy; Tous droits réservés
            </div>
          </div>
        </body>
      </html>
      `
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Erreur lors de l'envoi du mail." }, { status: 500 });
  }
}


