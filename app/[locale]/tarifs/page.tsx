import { redirect } from "next/navigation";

// Cette page est redirigée vers /solutions-web via next.config.mjs (301)
// Ce fallback garantit la redirection côté serveur
export default function TarifsPage() {
  redirect("/solutions-web");
}
