import Link from "next/link";
import { prochaineEtape, sitePoints, suggestionsMasquees } from "@cto/espace";
import { sentinelleStateFor } from "@cto/sentinelle";
import { masquerLaSuggestion } from "./actions";
import { livrableHref } from "./pilotage";
import { contactHref, type EspaceContext } from "./shell";
import { buttonClass, Label, Panel } from "./ui";
import type { Viewer } from "./viewer";

// ─────────────────────────────────────────────────────────────────────────────
// La carte « Prochaine étape » de l'accueil : une suggestion, adossée au fait
// qui la motive. La règle de choix vit dans `@cto/espace` (suggestions.ts),
// pure et testée ; ici, seulement la collecte des faits et la forme.
// ─────────────────────────────────────────────────────────────────────────────

const JOUR = 86_400_000;

export async function CarteProchaineEtape({ viewer, context }: { viewer: Viewer; context: EspaceContext }) {
  const profil = context.profile;
  const maintenant = new Date();

  const [masquees, sentinelle] = await Promise.all([
    suggestionsMasquees(viewer.personId),
    profil.hasSentinelle ? sentinelleStateFor(viewer.clientId) : Promise.resolve(null),
  ]);

  // Les failles d'aujourd'hui : le relevé du site s'il est suivi, sinon les
  // alertes critiques de la veille technique des trente derniers jours.
  const alertesSite = context.site?.snapshot
    ? sitePoints(context.site.snapshot).filter((point) => point.tone === "alerte").length
    : 0;
  const alertesVeille = (sentinelle?.data.alerts ?? []).filter(
    (alerte) => alerte.verdict === "red" && maintenant.getTime() - new Date(alerte.at).getTime() < 30 * JOUR,
  ).length;

  const suggestion = prochaineEtape({
    status: profil.status,
    tier: profil.tier,
    services: profil.services,
    suggestionsCoupees: profil.suggestionsCoupees,
    suiviInclusJusquau: profil.suiviInclusJusquau,
    propositionsEnAttente: context.actions.aValider.flatMap((action) =>
      action.item ? [{ titre: action.title, chemin: livrableHref(action.item, context, viewer.base) }] : [],
    ),
    audits: context.items.filter((item) => item.kind === "audit").length,
    arbitrages: context.actions.aArbitrer.length,
    alertesCritiques: Math.max(alertesSite, alertesVeille),
    masquees,
    maintenant,
  });
  if (!suggestion) return null;

  // Le bouton passe par `/suggestion/<id>` pour être journalisé, sauf vu de
  // l'admin : ses clics de supervision ne sont pas ceux du client.
  const cible =
    suggestion.action.vers === "contact"
      ? contactHref(viewer.company, suggestion.action.objet)
      : suggestion.action.chemin.startsWith("/")
        ? suggestion.action.chemin
        : `${viewer.base}/${suggestion.action.chemin}`;
  const href = viewer.personId
    ? `${viewer.base}/suggestion/${encodeURIComponent(suggestion.id)}?vers=${encodeURIComponent(cible)}`
    : cible;

  return (
    <section aria-labelledby="prochaine-etape-titre" className="mt-10">
      <Panel className="border-l-2 border-l-accent-secondary px-5 py-5">
        <h2 id="prochaine-etape-titre">
          <Label>Prochaine étape</Label>
        </h2>
        <p className="mt-2 font-sans text-lg font-normal leading-snug text-foreground">{suggestion.titre}</p>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-accent-secondary">
          {suggestion.fait}
        </p>
        <p className="mt-2 max-w-prose font-inter-tight text-sm leading-relaxed text-mid-gray">{suggestion.texte}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {suggestion.action.vers === "contact" || href.startsWith(viewer.base + "/suggestion/") ? (
            <a href={href} className={buttonClass.primary}>
              {suggestion.action.libelle}
            </a>
          ) : (
            <Link href={href} className={buttonClass.primary}>
              {suggestion.action.libelle}
            </Link>
          )}
          {suggestion.masquable && viewer.personId ? (
            <form action={masquerLaSuggestion}>
              <input type="hidden" name="id" value={suggestion.id} />
              <button type="submit" className={buttonClass.quiet}>
                Pas maintenant
              </button>
            </form>
          ) : null}
        </div>
      </Panel>
    </section>
  );
}
