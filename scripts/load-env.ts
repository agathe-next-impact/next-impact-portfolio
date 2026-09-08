// Chargement de `.env.local` pour les commandes lancées à la main (tsx).
//
// Ce fichier existe pour une raison d'ORDRE, pas de propreté : les déclarations
// `import` sont évaluées avant toute instruction du module qui les contient.
// Poser `process.loadEnvFile()` en haut d'un script, au-dessus de ses imports,
// ne sert donc à rien — les modules importés se seront déjà exécutés, et ceux
// qui lisent `process.env` au chargement (`lib/sendMail.ts` construit son
// transport SMTP à ce moment-là) auront vu des variables vides.
//
// Le seul ordre garanti est celui des imports entre eux. En important ce module
// EN PREMIER, on obtient l'effet voulu dans les deux formats de module.
//
// Node et tsx ne lisent pas `.env.local` d'eux-mêmes ; Next, si.

try {
  process.loadEnvFile(".env.local");
} catch {
  // Absent en CI et sur Vercel, qui passent les variables autrement.
}

export {};
