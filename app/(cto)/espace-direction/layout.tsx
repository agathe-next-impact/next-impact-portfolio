import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { MANIFEST_URL } from "./pwa-config";
import { CAPTURE_INVITE } from "../pwa-commun";
import { EnregistrementPwa } from "./pwa";

// ─────────────────────────────────────────────────────────────────────────────
// L'espace client en application installable.
//
// Ce layout ne rend rien de visible : il déclare le manifeste, la couleur de
// la barre système et l'écran bord à bord (`viewport-fit=cover`, que la barre
// du bas compense par `env(safe-area-inset-*)`), puis installe le worker.
//
// Uniquement sous `/espace-direction` : la vue de supervision de l'admin
// (`/admin-cto/…/espace`) réutilise les mêmes écrans mais relève de
// l'application de l'admin (`admin-cto/pwa.tsx`), qui ne met aucune page en
// cache.
//
// Thème clair par défaut, sans suivre le système ; la bascule est en haut à
// droite de chaque page (`bascule-theme.tsx`). Clé de stockage propre à
// l'espace : la vitrine, sur le même domaine, est sombre par défaut et ne doit
// pas imposer son choix ici.
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  manifest: MANIFEST_URL,
  applicationName: "Espace direction",
  appleWebApp: {
    capable: true,
    title: "Espace direction",
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: [{ url: "/pwa/espace-apple-180.png", sizes: "180x180" }],
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

export default function EspaceLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="theme-espace"
      themes={["light", "dark"]}
      disableTransitionOnChange
    >
      <script dangerouslySetInnerHTML={{ __html: CAPTURE_INVITE }} />
      {children}
      <EnregistrementPwa />
    </ThemeProvider>
  );
}
