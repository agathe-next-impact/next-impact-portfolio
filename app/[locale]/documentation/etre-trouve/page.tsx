// Page thématique du hub — « Être trouvé à l'heure de l'IA » (SEO + GEO).
// Segment statique (prend le pas sur la route dynamique [category]). Tout le
// contenu vient de lib/hub-themes.ts.

import type { Metadata } from "next";
import { themeMetadata, ThemeRoute } from "@/components/hub/theme-route";
import type { Locale } from "@/i18n/routing";

const SLUG = "etre-trouve";
export const revalidate = 86400;

export function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  return themeMetadata(SLUG, params);
}

export default function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  return <ThemeRoute slug={SLUG} params={params} />;
}
