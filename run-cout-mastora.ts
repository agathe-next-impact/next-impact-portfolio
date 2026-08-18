import { readFileSync } from "node:fs";

// 1. Charger .env.local AVANT d'importer le code Sentinelle.
const env = readFileSync("./.env.local", "utf8");
for (const line of env.split(/\r?\n/)) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) {
    let v = m[2].trim();
    if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
    if (process.env[m[1]] === undefined) process.env[m[1]] = v;
  }
}

// Le défaut du code est désormais claude-sonnet-5 (ANTHROPIC_MODEL non défini) :
// on le laisse tel quel pour tester le vrai palier de prod.
process.env.SENTINELLE_LETTRES_PAR_JOUR = "9999";

const ARG = process.argv[2] ?? "1c45d505-3d16-47b0-82af-1bea4885fcc6";

async function main() {
  const { neon } = await import("@neondatabase/serverless");
  const nodemailer = (await import("nodemailer")).default;
  const { collectDossier, writeLettre, isQuietIssue, estimeCoutLettre, formateCoutLettre } =
    await import("@sentinelle/lettre");
  const { contextFromScan, ECHANTILLON_RECHERCHES, ECHANTILLON_LECTURES } = await import(
    "@sentinelle/apercu/lettre"
  );
  const { renderEchantillonEmail } = await import("@sentinelle/emails/render");
  const { sendSentinelleMail } = await import("@sentinelle/emails/send");
  const { formatAddress } = await import("@sentinelle/emails/config");

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(ARG);

  let result: never;
  let siteUrl: string;
  if (isUuid) {
    const sql = neon(process.env.DATABASE_URL!);
    const [row] = await sql`select url, result from scans where id = ${ARG}`;
    if (!row) {
      console.error(`Scan ${ARG} introuvable`);
      process.exit(1);
    }
    result = row.result as never;
    siteUrl = row.url as string;
  } else {
    // Argument = URL/domaine → scan passif en direct (pas besoin de ligne en base).
    const { scanSite } = await import("@sentinelle/scanner");
    const target = /^https?:\/\//.test(ARG) ? ARG : `https://${ARG}`;
    console.log(`Scan passif de ${target}…`);
    const outcome = await scanSite(target);
    if (!outcome.ok) {
      console.error(`Scan échoué : ${outcome.reason}`);
      process.exit(1);
    }
    result = outcome.result as never;
    siteUrl = outcome.result.url;
    console.log(`Scan OK : ${(result as { components: unknown[] }).components.length} composants.`);
  }

  const row = { url: siteUrl } as { url: string };
  const ctx = contextFromScan(result, [], new Date());
  const model = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5";

  console.log(`Modèle facturé : ${model}`);
  console.log(`Site           : ${row.url}`);
  console.log("Collecte web (une fois) puis rédaction (retry sur le garde-fou)…\n");

  const t0 = Date.now();

  const collecte = await collectDossier(ctx, {
    effort: "medium",
    searchBudget: ECHANTILLON_RECHERCHES,
    fetchBudget: ECHANTILLON_LECTURES,
  });

  const tel = {
    inputTokens: collecte.telemetry.inputTokens,
    outputTokens: collecte.telemetry.outputTokens,
    cachedTokens: collecte.telemetry.cachedTokens,
  };

  if (!collecte.ok) {
    console.error(`Collecte échouée : ${collecte.reason}`);
    process.exit(1);
  }

  // Collecte réussie : on ne réessaie QUE la rédaction (3 appels, pas d'outils).
  let lettre: Awaited<ReturnType<typeof writeLettre>> extends { lettre: infer L } ? L : never;
  let ok = false;
  let dernierRefus = "";
  for (let attempt = 1; attempt <= 3; attempt++) {
    const red = await writeLettre(ctx, collecte.dossier, {
      ficheNames: (result as { components: { label: string }[] }).components.map((c) => c.label),
      quiet: isQuietIssue(ctx.blocks),
    });
    tel.inputTokens += red.telemetry.inputTokens;
    tel.outputTokens += red.telemetry.outputTokens;
    tel.cachedTokens += red.telemetry.cachedTokens;
    if (red.ok) {
      lettre = red.lettre as never;
      ok = true;
      console.log(`Rédaction acceptée à l'essai ${attempt}.`);
      break;
    }
    dernierRefus = red.reason;
    console.warn(`Essai ${attempt} refusé : ${red.reason}`);
  }

  const secondes = Math.round((Date.now() - t0) / 1000);

  const conso = {
    recherches: collecte.telemetry.searches,
    lectures: collecte.telemetry.fetches,
    reprises: collecte.telemetry.continuations,
    jetonsEntree: tel.inputTokens,
    jetonsSortie: tel.outputTokens,
    jetonsCacheLecture: tel.cachedTokens,
  };

  const fr = (n: number) => n.toLocaleString("fr-FR");
  console.log("\nConsommation réelle mastora.fr (échantillon : 10 recherches / 4 lectures)");
  console.log("──────────────────────────────────────────────────────────────────────");
  console.log(`durée              : ${secondes} s`);
  console.log(`recherches / lectures : ${conso.recherches} / ${conso.lectures}`);
  console.log(`jetons entrée      : ${fr(conso.jetonsEntree)}`);
  console.log(`jetons cache-lect. : ${fr(conso.jetonsCacheLecture)}`);
  console.log(`jetons sortie      : ${fr(conso.jetonsSortie)}`);
  console.log(formateCoutLettre(conso));
  const cout = estimeCoutLettre(conso);
  console.log(`→ en euros (×0,92) : ≈ ${(cout.total * 0.92).toFixed(3)} €\n`);

  if (!ok) {
    console.error(`Aucune lettre valide après 3 essais (dernier : ${dernierRefus}). Pas d'envoi.`);
    process.exit(1);
  }

  // ── Rendu + envoi de test ────────────────────────────────────────────────
  const rendered = await renderEchantillonEmail({
    lettre,
    siteUrl: row.url as string,
    issueDate: new Date(),
    echantillon: { rapportUrl: null },
  });

  const to = process.env.AUDIT_MAIL_TO;
  if (!to) {
    console.error("AUDIT_MAIL_TO absente — pas de destinataire de test, envoi annulé.");
    process.exit(1);
  }

  // Transport de TEST bâti sur les creds NODEMAILER_* du site (les SENTINELLE_SMTP_*
  // ne sont pas configurées ici). Envoi à l'adresse d'audit interne uniquement.
  const port = Number(process.env.NODEMAILER_PORT ?? "465");
  const user = process.env.NODEMAILER_USER!;
  const transport = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port,
    secure: port === 465,
    auth: { user, pass: (process.env.NODEMAILER_PASS ?? "").replace(/\s+/g, "") },
  }) as never;

  const config = {
    host: process.env.NODEMAILER_HOST!,
    port,
    secure: port === 465,
    user,
    pass: process.env.NODEMAILER_PASS!,
    from: formatAddress("Sentinelle (test)", user),
    replyTo: null,
  };

  console.log(`Envoi de test → ${to.replace(/(.).*(@.*)/, "$1***$2")}`);
  const { messageId } = await sendSentinelleMail(
    { to, subject: `[TEST] ${rendered.subject}`, html: rendered.html, text: rendered.text },
    { transport, config },
  );
  console.log(`Envoyé ✅  messageId=${messageId}`);
  console.log(`Longueur lettre : ${lettre.axes.length} axes, ~${rendered.text.split(/\s+/).filter(Boolean).length} mots (texte).`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
