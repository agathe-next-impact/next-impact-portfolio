import { NextResponse } from "next/server";
import { sendMail } from "@/lib/sendMail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nom, prenom, email, phone, accepteConditions } = body;

    // Validation
    if (!nom || !prenom || !email) {
      return NextResponse.json(
        { message: "Nom, prénom et email sont requis" },
        { status: 400 },
      );
    }

    if (!accepteConditions) {
      return NextResponse.json(
        {
          message:
            "Vous devez accepter de donner vos informations personnelles",
        },
        { status: 400 },
      );
    }

    const recipientEmail = "agathe@next-impact.digital";

    // Email to admin
    const adminEmailHtml = `
      <div style="font-family: 'Open Sans', sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: black; border-bottom: 2px solid #1F54BF; padding-bottom: 10px;">
          Nouveau livre blanc WordPress Headless demandé
        </h2>
        <div style="margin: 20px 0;">
          <p><strong>Nom:</strong> ${nom}</p>
          <p><strong>Prénom:</strong> ${prenom}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Téléphone:</strong> ${phone || "Non fourni"}</p>
        </div>
        <hr style="border: none; border-top: 1px solid #F2E57E; margin: 20px 0;">
        <p style="color: #021373; font-size: 12px;">
          Cette inscription a été effectuée le ${new Date().toLocaleDateString("fr-FR")} à ${new Date().toLocaleTimeString("fr-FR")}.
        </p>
      </div>
    `;

    // Email to subscriber
    const siteDomain = process.env.SITE_DOMAIN || "next-impact.digital";
    const logoUrl = `https://${siteDomain}/img/logo-small.png`;

    const subscriberEmailHtml = `
      <div style="font-family: 'Open Sans', sans-serif; color: #021373; max-width: 600px; margin: 0 auto; text-align: center;">
        <a href="https://${siteDomain}"> <img src="${logoUrl}" alt="Logo Next Impact" style="max-width: 80px; margin-bottom: 20px;" /></a>
        <div style="text-align: left;">
          <h2 style="color: #021373; border-bottom: 2px solid #1F54BF; padding-bottom: 10px;">
            Voici votre livre blanc WordPress Headless !
          </h2>
          <p>Bonjour ${prenom},</p>
          <p>Merci pour votre intérêt pour notre livre blanc sur WordPress Headless. Vous le trouverez en suivant le lien ci-dessous.</p>
          <p><a href="https://${siteDomain}/livre_blanc_wordpress_headless.pdf" style="color: #1F54BF; text-decoration: none; font-size:14px">Télécharger le livre blanc WordPress Headless</a></p>
          <p>Nous espérons que ce livre blanc vous sera utile pour comprendre les avantages et les meilleures pratiques du WordPress Headless.</p>
          <p>Si vous avez des questions ou souhaitez discuter de votre projet, n'hésitez pas à répondre à ce mail ou à prendre rendez-vous.</p>
          <div style="margin: 20px 0; text-align: center;"></div>
          <p>Cordialement,<br/>Agathe de Next Impact</p>
          <div style="margin: 20px 0; text-align: center;"></div>
          <a href="https://calendar.app.google/7ZJwqU9AGgk8bCf88" style="background: #F2E57E; color: #021373; padding: 10px 20px; border-radius: 25px; text-decoration: none;">Prendre rendez-vous</a>
          <hr style="border: none; border-top: 1px solid #021373; margin: 20px 0;">
          <p>Si vous n'êtes pas à l'origine de cette inscription, vous pouvez ignorer cet email.</p>
          <hr style="border: none; border-top: 1px solid #021373; margin: 20px 0;">
          <p style="color: #021373; font-size: 12px;">
            Next Impact
          </p>
        </div>
      </div>
    `;

    try {
      // Send both emails
      await Promise.all([
        sendMail({
          to: recipientEmail,
          subject: "Nouvelle inscription à la newsletter",
          html: adminEmailHtml,
        }),
        sendMail({
          to: email,
          subject: "Votre livre blanc WordPress Headless - Next Impact",
          html: subscriberEmailHtml,
        }),
      ]);

      return NextResponse.json({
        message:
          "Inscription réussie ! Vous recevrez bientôt votre livre blanc.",
      });
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      return NextResponse.json(
        {
          message:
            "Erreur lors de l'envoi de l'email. Veuillez vérifier la configuration SMTP.",
          error:
            emailError instanceof Error ? emailError.message : "Unknown error",
        },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error("Error processing newsletter subscription:", error);
    return NextResponse.json(
      {
        message: "Erreur lors du traitement de l'inscription",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
