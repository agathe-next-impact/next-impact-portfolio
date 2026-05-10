import { sendMail } from "@/lib/sendMail";

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
      Array.isArray(items) ? items.join(', ') : isEn ? 'Not specified' : 'Non précisé';

    const clientHtml = isEn
      ? `
        <h2>Thank you for your request ✨</h2>
        <p>Here is a summary of your project:</p>
        <ul>
          <li><strong>Organization:</strong> ${structure}</li>
          <li><strong>Objectives:</strong> ${list(objectifs)}</li>
          <li><strong>Autonomy needs:</strong> ${autonomie}</li>
          <li><strong>Existing content:</strong> ${contenu}</li>
          <li><strong>Pages requested:</strong> ${list(pages)}</li>
          <li><strong>Estimate:</strong> from <strong>${estimation} € incl. tax</strong></li>
        </ul>
        <p>🗓️ You can book a call directly here:<br/>
        <a href="${calendlyLink}" target="_blank">${calendlyLink}</a></p>
        <p>Talk soon,<br/><strong>The Next Impact Digital team</strong></p>
      `
      : `
        <h2>Merci pour votre demande ✨</h2>
        <p>Voici un récapitulatif de votre projet :</p>
        <ul>
          <li><strong>Structure :</strong> ${structure}</li>
          <li><strong>Objectifs :</strong> ${list(objectifs)}</li>
          <li><strong>Souhait d’autonomie :</strong> ${autonomie}</li>
          <li><strong>Contenu existant :</strong> ${contenu}</li>
          <li><strong>Pages souhaitées :</strong> ${list(pages)}</li>
          <li><strong>Estimation :</strong> à partir de <strong>${estimation} € TTC</strong></li>
        </ul>
        <p>🗓️ Vous pouvez directement planifier un appel avec nous ici :<br/>
        <a href="${calendlyLink}" target="_blank">${calendlyLink}</a></p>
        <p>À très vite,<br/><strong>L’équipe Next Impact Digital</strong></p>
      `;

    const adminHtml = `
      <h2>Nouvelle estimation reçue</h2>
      <p><strong>Email du client :</strong> ${userEmail}</p>
      <ul>
        <li><strong>Structure :</strong> ${structure}</li>
        <li><strong>Objectifs :</strong> ${list(objectifs)}</li>
        <li><strong>Autonomie :</strong> ${autonomie}</li>
        <li><strong>Contenu :</strong> ${contenu}</li>
        <li><strong>Pages :</strong> ${list(pages)}</li>
        <li><strong>Téléphone :</strong> ${contact?.phone || 'Non renseigné'}</li>
        <li><strong>Estimation :</strong> ${estimation} € TTC</li>
      </ul>
    `;

    try {
      await Promise.all([
        sendMail({
          to: userEmail,
          subject: isEn
            ? 'Your personalized estimate – Next Impact Digital'
            : 'Votre estimation personnalisée – Next Impact Digital',
          html: clientHtml,
        }),
        sendMail({
          to: adminEmail,
          subject: `Nouvelle estimation reçue de ${userEmail}`,
          html: adminHtml,
        })
      ]);
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
      console.error('Erreur envoi estimation mail:', error);
      return new Response(
        JSON.stringify({
          error: isEn ? 'Error sending emails.' : 'Erreur lors de l’envoi des e-mails.',
        }),
        { status: 500 },
      );
    }
  }
  catch (error) {
    console.error('Erreur traitement estimation:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur lors du traitement de la demande.' }),
      { status: 500 },
    );
  }
}
