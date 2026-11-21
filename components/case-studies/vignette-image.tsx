// Image de vignette d'une étude de cas, la même dans toutes les grilles du
// site (liste /etudes-de-cas, bas des pages d'offre, accueil, « projets
// similaires » d'une fiche). Demande d'Agathe du 2026-11-21 :
//
//   - un cadre noir, avec une marge de chaque côté de l'image ;
//   - toutes les images au format de la capture R.E.S.E.M.S. (800 × 410) ;
//   - l'image garde toute sa largeur ; si elle est plus haute que le format,
//     c'est le bas qui est coupé, jamais les côtés.
//
// Sans hook : importable côté serveur comme côté client.

import Image from "next/image";

import { cn } from "@/lib/utils";

/**
 * Classes du cadre noir. À poser sur le conteneur de la vignette (souvent le
 * lien), qui reçoit <VignetteImage /> et, au besoin, une étiquette en
 * surimpression.
 */
export const VIGNETTE_CADRE =
  "relative flex aspect-[16/9] items-center justify-center overflow-hidden bg-black";

export function VignetteImage({
  src,
  alt,
  sizes,
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  /** Classes ajoutées à l'image (ex. l'effet de survol). */
  className?: string;
}) {
  return (
    <span className="relative block aspect-[800/410] w-[88%] overflow-hidden">
      {/* `!h-auto` défait la hauteur imposée par `fill` : l'image part du haut,
          sur toute la largeur, et déborde vers le bas, hors cadre. */}
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={cn(
          "!bottom-auto !h-auto transition-transform duration-500 group-hover:scale-[1.03]",
          className,
        )}
      />
    </span>
  );
}
