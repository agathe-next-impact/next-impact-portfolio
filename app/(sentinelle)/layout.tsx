import type { Metadata } from 'next'
import { Figtree, Inter_Tight, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import '../globals.css'

// ─────────────────────────────────────────────────────────────────────────────
// Root layout du produit Sentinelle.
//
// Le site vitrine n'a pas de app/layout.tsx : c'est app/[locale]/layout.tsx qui
// tient le rôle de root layout. Ce groupe de routes a donc besoin du sien, qui
// rend <html>/<body>.
//
// Volontairement absents ici (ne pas « harmoniser » avec le layout vitrine) :
//   - Header / Footer / FloatingContact : Sentinelle est un produit, pas une
//     page marketing.
//   - NextIntlClientProvider : les contenus client sont en français (voir
//     docs/sentinelle/CLAUDE.md, « Conventions »).
//   - ConsentManager / GA4 / Clarity : aucun traçage sur les pages produit.
//     Les y ajouter imposerait de repasser par la bannière de consentement
//     (voir docs/sentinelle/plan-mise-en-oeuvre.md §9).
// ─────────────────────────────────────────────────────────────────────────────

const figtree = Figtree({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const interTight = Inter_Tight({
  weight: ['400', '500'],
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
})

const geistMono = Geist_Mono({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

// noindex par défaut sur tout le groupe : les rapports de scan (/scan/[id]) et
// l'admin ne doivent jamais être indexés. Si la page d'atterrissage /scan doit
// l'être un jour, elle surchargera ce bloc dans son propre generateMetadata.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function SentinelleRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`scroll-smooth ${figtree.variable} ${interTight.variable} ${geistMono.variable}`}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          storageKey="theme-v2"
          themes={['light', 'dark']}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
