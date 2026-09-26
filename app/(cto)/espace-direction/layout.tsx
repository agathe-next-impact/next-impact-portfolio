import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { MANIFEST_URL } from "./pwa-config";
import { CAPTURE_INVITE, EnregistrementPwa } from "./pwa";

// ─────────────────────────────────────────────────────────────────────────────
// L'espace client en application installable.
//
// Ce layout ne rend rien de visible : il déclare le manifeste, la couleur de
// la barre système et l'écran bord à bord (`viewport-fit=cover`, que la barre
// du bas compense par `env(safe-area-inset-*)`), puis installe le worker.
//
// Uniquement sous `/espace-direction` : la vue de supervision de l'admin
// (`/admin-cto/…/espace`) réutilise les mêmes écrans mais n'a pas à être
// installée ni mise en cache.
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
    <>
      <script dangerouslySetInnerHTML={{ __html: CAPTURE_INVITE }} />
      {children}
      <EnregistrementPwa />
    </>
  );
}
