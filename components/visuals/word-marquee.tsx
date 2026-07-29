import * as React from "react";

import { cn } from "@/lib/utils";

import { Marquee } from "./marquee";

/**
 * WordMarquee — bandeau typographique épuré : grands mots en graisse très légère,
 * alternant plein (foreground) et contour fin (text-stroke), séparés par un point
 * jaune. Réutilise le marquee CSS (coupé en reduced-motion).
 */
export function WordMarquee({
  words,
  className,
}: {
  words: string[];
  className?: string;
}) {
  return (
    <Marquee className={cn("py-2", className)} gap={28}>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span
            className="text-4xl font-extralight uppercase leading-none tracking-tight md:text-6xl"
            style={
              i % 2 === 1
                ? { WebkitTextStroke: "0.5px hsl(var(--mid-gray))", color: "transparent" }
                : { color: "hsl(var(--foreground))" }
            }
          >
            {w}
          </span>
          <span className="text-base text-accent-secondary md:text-xl" aria-hidden>
            ●
          </span>
        </React.Fragment>
      ))}
    </Marquee>
  );
}
