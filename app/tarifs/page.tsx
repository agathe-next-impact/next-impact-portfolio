import { redirect } from "next/navigation";

// Cette page est redirigée vers /services via next.config.mjs (301)
// Ce fallback garantit la redirection côté serveur
export default function TarifsPage() {
  redirect("/services");
}
