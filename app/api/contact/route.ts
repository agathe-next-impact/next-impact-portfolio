import { sendMail } from "@/lib/sendMail";

export async function POST(req: Request) {
  const { name, email, message, formData } = await req.json();

  // Prépare l'email pour l'admin
  const emailData: any = {
    from: "Next Impact <agathe@next-impact.digital>",
    to: ["agathe@next-impact.digital"],
    subject: `Nouveau message de ${name}`,
    replyTo: email,
    html: `
      <h3>Message reçu via le site</h3>
      <p><strong>Nom :</strong> ${name}</p>
      <p><strong>Email :</strong> ${email}</p>
      <p><strong>Message :</strong><br>${message}</p>
      ${
        formData 
          ? `<h4>Détails du Cahier des Charges :</h4><pre>${JSON.stringify(formData, null, 2)}</pre>`
          : ""
      }
    `,
  };

  // Prépare l'email de confirmation pour l'utilisateur
  const confirmationEmail = {
    from: "Next Impact <agathe@next-impact.digital>",
    to: [email],
    subject: "Confirmation de réception de votre message – Next Impact Digital",
    html: `
      <h3>Bonjour ${name},</h3>
      <p>Nous avons bien reçu votre message :</p>
      <blockquote style="border-left:2px solid #ccc;padding-left:10px;">
        ${message}
      </blockquote>
      <p>Notre équipe vous répondra dans les plus brefs délais.</p>
      <p>Merci de votre confiance,<br>L'équipe Next Impact Digital</p>
    `,
  };

  try {
    // Envoi en parallèle
    try {
      await Promise.all([
        sendMail({
          to: emailData.to,
          subject: emailData.subject,
          html: emailData.html,
          attachments: emailData.attachments,
        }),
        sendMail({
          to: confirmationEmail.to,
          subject: confirmationEmail.subject,
          html: confirmationEmail.html,
        })
      ]);
      return new Response("Message envoyé", { status: 200 });
    } catch (err) {
      console.error("Mail error:", err);
      return new Response("Erreur mail: " + String(err), { status: 500 });
    }
  }
  catch (error) {
    console.error('Erreur traitement estimation:', error);
    return new Response(JSON.stringify({ error: 'Erreur lors du traitement de la demande.' }), { status: 500 });
  }
}
