import localFont from 'next/font/local'

// Polices auto-hébergées (fichiers variables, sous-ensemble latin, téléchargés
// depuis Google Fonts). On n'utilise plus next/font/google : le build dépendait
// de la réponse de Google, qui a servi en septembre 2026 des URL
// `/l/font?kit=…&skey=…` que le loader Turbopack de Next 16.1 ne sait pas lire
// (« next/font/google queries have exactly one entry ») → build Vercel cassé.
// Figtree (titres/UI), Inter Tight (paragraphes via .font-inter-tight),
// Geist Mono (labels).

export const figtree = localFont({
  src: './figtree-latin-var.woff2',
  weight: '300 700',
  variable: '--font-sans',
  display: 'swap',
})

export const interTight = localFont({
  src: './inter-tight-latin-var.woff2',
  weight: '400 500',
  variable: '--font-inter-tight',
  display: 'swap',
})

export const geistMono = localFont({
  src: './geist-mono-latin-var.woff2',
  weight: '300 500',
  variable: '--font-mono',
  display: 'swap',
})
