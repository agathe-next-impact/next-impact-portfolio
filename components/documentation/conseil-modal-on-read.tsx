"use client";

import ConseilModal from "@/components/ui/conseil-modal";
import { useSeen } from "@/components/ui/use-seen";

/**
 * Arme la popup conseil quand le lecteur atteint le bas d'un contenu de
 * décision (rubrique « Choisir sa techno », article pilier techno).
 *
 * Le trafic y est froid et vient surtout de la recherche : on n'ouvre donc
 * rien à l'arrivée. Le sentinelle est posé en fin de contenu — être descendu
 * jusque-là est le signal d'engagement, bien plus fiable qu'un minuteur.
 *
 * Le plafond global de `conseil-modal` s'applique par-dessus : une seule
 * ouverture automatique par session, tous supports confondus.
 */
export function ConseilModalOnRead({ source }: { source: string }) {
  const [ref, seen] = useSeen<HTMLDivElement>();
  return (
    <>
      {/* Boîte de 1 px : un élément 0×0 n'est pas détecté de façon fiable
          par IntersectionObserver (constaté sur la rubrique). */}
      <div ref={ref} aria-hidden="true" className="h-px w-full" />
      <ConseilModal source={source} armed={seen} />
    </>
  );
}
