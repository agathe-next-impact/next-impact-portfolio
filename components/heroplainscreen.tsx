"use client";

import { BlueprintGrid } from "@/components/visuals/blueprint-grid";
import { CornerFrame } from "@/components/visuals/corner-frame";
import { FloatingParticles } from "@/components/visuals/floating-particles";
import { Hairline } from "@/components/visuals/hairline";
import { MouseGlow } from "@/components/visuals/mouse-glow";
import { WordAppear } from "@/components/visuals/word-appear";
import { cn } from "@/lib/utils";

type DigitalSerenityProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  footer?: string;
  className?: string;
};

/**
 * DigitalSerenity — reconstitution de l'écran d'origine, adaptée au design system
 * « Blueprint » : fond obsidian, accents indigo + doré/champagne, typographie très
 * légère, apparition mot à mot, filets fins, particules flottantes, halo curseur,
 * cadrage d'angle. Theme-aware et reduced-motion-safe. Réutilisable comme hero
 * (toutes les chaînes sont paramétrables).
 */
export function DigitalSerenity({
  eyebrow = "Stillness speaks",
  title = "Find your center,",
  subtitle = "where peace resides and clarity awakens within the soul.",
  footer = "Observe, accept, let go.",
  className,
}: DigitalSerenityProps) {
  return (
    <section
      className={cn(
        "relative flex min-h-[85vh] flex-col items-center justify-between overflow-hidden bg-obsidian px-6 py-12 sm:px-8 sm:py-16 md:px-16 md:py-20",
        className,
      )}
    >
      {/* Backdrops */}
      <BlueprintGrid />
      <FloatingParticles />
      <CornerFrame />
      <MouseGlow />

      {/* Eyebrow haut */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <p className="font-mono text-xs font-light uppercase tracking-[0.25em] text-mid-gray sm:text-sm">
          {eyebrow}
        </p>
        <Hairline className="mt-4" width={64} accent />
      </div>

      {/* Centre */}
      <div className="relative z-10 max-w-4xl text-center">
        <h1 className="text-3xl font-extralight leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl">
          <WordAppear text={title} className="block" />
          <WordAppear
            text={subtitle}
            delay={0.4}
            className="mt-4 block text-xl font-thin leading-relaxed tracking-wide text-mid-gray sm:text-2xl md:text-3xl lg:text-4xl"
          />
        </h1>
      </div>

      {/* Bas */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <Hairline className="mb-4" width={64} accent />
        <p className="font-mono text-xs font-light uppercase tracking-[0.25em] text-mid-gray sm:text-sm">
          {footer}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1 w-1 rounded-full bg-accent-secondary"
              style={{ opacity: i === 1 ? 0.7 : 0.4 }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default DigitalSerenity;
