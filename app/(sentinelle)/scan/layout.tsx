import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import Header from "@/components/header";
import Footer from "@/components/footer";
import { DocumentationModeProvider } from "@/contexts/documentation-mode-context";

// ─────────────────────────────────────────────────────────────────────────────
// Chrome du site sur les pages publiques de Sentinelle (/scan et /scan/[id]).
//
// Décision du 2026-08-16, qui REMPLACE la note du layout parent (« Header /
// Footer volontairement absents ») : ces deux pages sont les seules du produit
// qu'un inconnu rencontre avant d'être client. Les servir sans en-tête ni pied
// de page les détachait du site au moment précis où il faut prouver à qui on a
// affaire. L'admin et l'espace client, eux, restent nus — d'où ce layout au
// niveau du segment `scan` et non du groupe `(sentinelle)`.
//
// Deux prérequis, parce que ces routes vivent hors de `app/[locale]/` (elles
// sont exclues du matcher next-intl dans `proxy.ts`, voir
// docs/sentinelle/plan-mise-en-oeuvre.md §2 E1) :
//
//   · `setRequestLocale("fr")` — sans locale de requête, `i18n/request.ts`
//     retomberait sur la locale par défaut en lisant les en-têtes, ce qui
//     rendrait /scan dynamique. On la fixe : le produit est francophone
//     (docs/sentinelle/CLAUDE.md, « Conventions »).
//   · `NextIntlClientProvider` — Header et Footer appellent `useTranslations`.
//
// Le sens des dépendances reste conforme à la règle d'isolation : ce sont les
// routes du produit qui importent la vitrine, jamais l'inverse. Une extraction
// future en sous-domaine emporterait ce fichier et ces deux imports.
// ─────────────────────────────────────────────────────────────────────────────

export default function ScanLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  setRequestLocale("fr");

  return (
    <NextIntlClientProvider>
      <DocumentationModeProvider>
        <Header />
        {children}
        <Footer variant="product" />
      </DocumentationModeProvider>
    </NextIntlClientProvider>
  );
}
