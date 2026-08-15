#!/usr/bin/env node
// Vérifie la configuration d'envoi Sentinelle (SMTP Google) sans envoyer
// d'e-mail : connexion + authentification seulement.
//
//   node --env-file=.env.local scripts/check-sentinelle-mail.mjs
//   npm run check:mail
//
// À lancer après toute rotation de mot de passe d'application, et avant le
// premier envoi depuis un nouvel environnement (Vercel compris). Dix secondes
// ici valent mieux qu'une alerte client qui ne part pas.
//
// La configuration est lue par `resolveMailConfig` — le même code que l'envoi,
// pour que ce contrôle ne puisse pas diverger de la réalité.

import nodemailer from "nodemailer";
import { resolveMailConfig } from "../src/sentinelle/emails/config.ts";

let config;
try {
  config = resolveMailConfig();
} catch (error) {
  console.error(`Configuration incomplète : ${error.message}`);
  process.exit(1);
}

console.log(`Serveur    : ${config.host}:${config.port} (${config.secure ? "TLS" : "STARTTLS"})`);
console.log(`Compte     : ${config.user}`);
console.log(`Expéditeur : ${config.from}`);
if (config.replyTo) console.log(`Répondre à : ${config.replyTo}`);

const transporter = nodemailer.createTransport({
  host: config.host,
  port: config.port,
  secure: config.secure,
  auth: { user: config.user, pass: config.pass },
});

try {
  await transporter.verify();
  console.log("\nAuthentification SMTP : OK — aucun e-mail envoyé.");

  // Google n'annonce pas la réécriture du From : elle se constate à la
  // réception. Autant prévenir ici plutôt que sur le premier envoi client.
  if (!config.from.includes(config.user)) {
    console.log(
      `\nAttention : l'expéditeur affiché n'est pas le compte authentifié.\n` +
        `Gmail réécrira le From tant que cette adresse n'est pas déclarée en\n` +
        `« Envoyer en tant que » (Gmail → Paramètres → Comptes) et vérifiée.`,
    );
  }
} catch (error) {
  console.error(`\nAuthentification SMTP : ÉCHEC — ${error.message}`);
  if (/5\.7\.8|Username and Password not accepted/i.test(error.message)) {
    console.error(
      "\nCause la plus fréquente : SENTINELLE_SMTP_PASS n'est pas un mot de\n" +
        "passe d'application (16 caractères, validation en deux étapes requise),\n" +
        "ou il a été révoqué. Le mot de passe du compte Google ne fonctionne pas.",
    );
  }
  process.exit(1);
}
