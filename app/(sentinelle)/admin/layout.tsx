import type { Metadata } from "next";
import type { ReactNode } from "react";

// Le groupe (sentinelle) est déjà en noindex ; on le redit ici parce qu'une
// admin indexée est le genre d'accident qui ne se répare pas.
export const metadata: Metadata = {
  title: "Sentinelle — admin",
  robots: { index: false, follow: false, nocache: true },
};

/**
 * Coquille de l'admin. **Aucune garde ici** : la page de connexion vit dans ce
 * layout, et un layout qui protégerait tout son sous-arbre boucherait sa propre
 * page de connexion. La garde est un cran plus bas, dans `sentinelle/layout.tsx`.
 */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-obsidian text-foreground">{children}</div>;
}
