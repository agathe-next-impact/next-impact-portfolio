import { redirect } from "next/navigation";

// Cette page est redirigée vers /solutions-web/eligibilite via next.config.mjs (301)
// Ce fallback garantit la redirection côté serveur
export default function EligibilitePage() {
  redirect("/solutions-web/eligibilite");
}
