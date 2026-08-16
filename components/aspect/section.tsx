import * as React from "react";

import { cn } from "@/lib/utils";

type Tone = "obsidian" | "jet";

/**
 * BlueprintSection — bande pleine largeur dont le contenu vit dans le container
 * 1200px encadré de rails verticaux. Les props (`tone`, `framed`, `backdrop`,
 * `ticks`) permettent de varier le traitement d'une section à l'autre tout en
 * gardant le langage « blueprint ». Composant serveur (aucun hook).
 */
export function BlueprintSection({
  children,
  tone = "obsidian",
  framed = true,
  backdrop,
  ticks = false,
  id,
  className,
  innerClassName,
}: {
  children: React.ReactNode;
  tone?: Tone;
  framed?: boolean;
  backdrop?: React.ReactNode;
  ticks?: boolean;
  id?: string;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden px-2.5 lg:px-0",
        tone === "jet" ? "bg-jet" : "bg-obsidian",
        className,
      )}
    >
      <div
        className={cn(
          "relative mx-auto w-full max-w-[1200px]",
          framed && "border-x border-dark-gray",
        )}
      >
        {backdrop && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {backdrop}
          </div>
        )}
        {ticks && <CornerTicks />}
        <div className={cn("relative", innerClassName)}>{children}</div>
      </div>
    </section>
  );
}

/** Équerres fines (1px) aux quatre coins — signature blueprint épurée. */
export function CornerTicks() {
  const c = "pointer-events-none absolute z-10 h-2.5 w-2.5 border-mid-gray/40";
  return (
    <>
      <span className={cn(c, "left-[-1px] top-[-1px] border-l border-t")} />
      <span className={cn(c, "right-[-1px] top-[-1px] border-r border-t")} />
      <span className={cn(c, "bottom-[-1px] left-[-1px] border-b border-l")} />
      <span className={cn(c, "bottom-[-1px] right-[-1px] border-b border-r")} />
    </>
  );
}

/** En-tête de section : index № + kicker mono vermillon + titre + description.
 *  `as="h1"` réserve le niveau 1 aux héros de page (un seul par page). */
export function SectionHeading({
  index,
  kicker,
  title,
  description,
  align = "left",
  as: Tag = "h2",
  className,
}: {
  index?: string;
  kicker?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {(index || kicker) && (
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
          {index && <span>{index}</span>}
          {index && kicker && <span className="h-px w-6 bg-accent-secondary/50" />}
          {kicker && <span className="text-mid-gray">{kicker}</span>}
        </div>
      )}
      <Tag className="max-w-3xl text-3xl font-light tracking-tight text-foreground md:text-4xl lg:text-5xl">
        {title}
      </Tag>
      {description && (
        <p className="max-w-2xl font-inter-tight text-base leading-relaxed text-mid-gray md:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

/** Spacer bordé qui maintient les rails entre deux blocs, ponctué d'un point. */
export function Separator({ className }: { className?: string }) {
  return (
    <div className={cn("bg-obsidian px-2.5 lg:px-0", className)}>
      <div className="relative mx-auto h-16 w-full max-w-[1200px] border-x border-b border-dark-gray">
        <span className="absolute bottom-[-3px] left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-accent-secondary/70" />
      </div>
    </div>
  );
}
