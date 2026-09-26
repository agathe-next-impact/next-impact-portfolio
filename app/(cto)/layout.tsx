import type { Metadata } from "next";
import { figtree, interTight, geistMono } from "../fonts";
import { ThemeProvider } from "@/components/theme-provider";
import "../globals.css";

// ─────────────────────────────────────────────────────────────────────────────
// Root layout de l'espace « CTO externalisé ».
//
// Le site vitrine n'a pas de app/layout.tsx : c'est app/[locale]/layout.tsx qui
// tient ce rôle. Ce groupe de routes a donc besoin du sien, qui rend
// <html>/<body>.
//
// Volontairement absents, et à ne pas « harmoniser » avec le layout vitrine :
//   - Header / Footer / FloatingContact : c'est un outil de travail, pas une
//     page marketing. Le client y vient pour lire une décision, pas pour
//     découvrir une offre qu'il a déjà achetée.
//   - NextIntlClientProvider : les contenus clients sont en français.
//   - ConsentManager / GA4 / Clarity : aucun traçage. Mesurer l'audience d'un
//     espace privé n'apprendrait rien et obligerait à repasser par la bannière
//     de consentement. Le journal d'accès, lui, est une fonctionnalité assumée
//     et annoncée, pas du traçage.
// ─────────────────────────────────────────────────────────────────────────────

// noindex sur tout le groupe, sans exception possible : aucune page de cet
// espace n'a vocation à être trouvée par un moteur.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function CtoRootLayout({
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
          themes={["light", "dark"]}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
