import type { Metadata } from "next";
import type { ReactNode } from "react";

// `/admin-cto` est déjà couvert par le Disallow générique `/admin` de
// robots.txt (correspondance par préfixe). On le redit ici quand même : une
// admin indexée est le genre d'accident qui ne se répare pas.
export const metadata: Metadata = {
  title: "Espace direction technique — supervision",
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Coquille de l'admin de supervision. **Aucune garde ici** : la page de
 * connexion vit dans ce groupe, et un layout qui protégerait tout son
 * sous-arbre boucherait sa propre page de connexion. La garde est un cran plus
 * bas, dans `pilotage/layout.tsx`.
 */
export default function AdminCtoLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-obsidian text-foreground">{children}</div>;
}
