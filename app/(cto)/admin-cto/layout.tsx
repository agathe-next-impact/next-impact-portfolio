import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { CAPTURE_INVITE } from "../pwa-commun";
import { ADMIN_MANIFEST_URL } from "./pwa-config";
import { EnregistrementPwaAdmin } from "./pwa";

// `/admin-cto` est déjà couvert par le Disallow générique `/admin` de
// robots.txt (correspondance par préfixe). On le redit ici quand même : une
// admin indexée est le genre d'accident qui ne se répare pas.
export const metadata: Metadata = {
  title: "Espace direction technique — supervision",
  robots: { index: false, follow: false, nocache: true },
  // Application installable, mobile et ordinateur (`pwa.tsx`, `sw.js`).
  manifest: ADMIN_MANIFEST_URL,
  applicationName: "Supervision",
  appleWebApp: {
    capable: true,
    title: "Supervision",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: [{ url: "/pwa/admin-bleu-apple-180.png", sizes: "180x180" }],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
  ],
};

/**
 * Coquille de l'admin de supervision. **Aucune garde ici** : la page de
 * connexion vit dans ce groupe, et un layout qui protégerait tout son
 * sous-arbre boucherait sa propre page de connexion. La garde est un cran plus
 * bas, dans `pilotage/layout.tsx`.
 */
export default function AdminCtoLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="theme-v2"
      themes={["light", "dark"]}
      disableTransitionOnChange
    >
      <script dangerouslySetInnerHTML={{ __html: CAPTURE_INVITE }} />
      <div className="min-h-screen bg-obsidian text-foreground">{children}</div>
      <EnregistrementPwaAdmin />
    </ThemeProvider>
  );
}
