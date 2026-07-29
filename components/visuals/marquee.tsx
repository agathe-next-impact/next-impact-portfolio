import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Marquee — bandeau défilant continu (deux groupes jumeaux), masqué en fondu
 * sur les bords, mis en pause au survol. CSS only (animation coupée en
 * reduced-motion par le garde-fou global).
 */
export function Marquee({
  children,
  className,
  gap = 48,
}: {
  children: React.ReactNode;
  className?: string;
  gap?: number;
}) {
  return (
    <div className={cn("group mask-fade-x relative flex overflow-hidden", className)}>
      <div
        className="animate-marquee flex shrink-0 items-center group-hover:[animation-play-state:paused]"
        style={{ gap, paddingRight: gap }}
      >
        {children}
      </div>
      <div
        aria-hidden
        className="animate-marquee flex shrink-0 items-center group-hover:[animation-play-state:paused]"
        style={{ gap, paddingRight: gap }}
      >
        {children}
      </div>
    </div>
  );
}
