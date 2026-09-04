"use client";

import * as React from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { BlueprintSection, SectionHeading } from "@/components/aspect/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";

type Testimonial = {
  quote: string;
  /** Sous-chaîne EXACTE de `quote` — la punchline surlignée au scroll. */
  highlight?: string;
  author: string;
  role: string;
  /** Logo de l'entreprise, si on possède le fichier. Sinon → monogramme seul. */
  logo?: string;
};

// Verbatim — recommandations LinkedIn et études de cas (lib/case-studies-data.ts).
// Sélection orientée « qualité du conseil » (pas seulement la réalisation) :
// c'est ce qui rassure un décideur qui achète un accompagnement, pas un livrable.
const FR: Testimonial[] = [
  {
    quote:
      "Agathe se distingue par sa capacité à comprendre rapidement les enjeux business et à les traduire en solutions techniques efficaces. Pour notre projet, elle a su créer une vitrine qui reflète parfaitement notre identité de marque, tout en intégrant un système multilingue fluide et intuitif.",
    highlight: "comprendre rapidement les enjeux business",
    author: "Christophe Riboulet",
    role: "PDG, Proditec",
    logo: "/img/logo-proditec.webp",
  },
  {
    quote:
      "Son écoute est impeccable et c'est un plaisir de savoir qu'avec elle les choses seront faites, conformes aux briefs et aux instructions, sans détours ou complexités. Elle est également de très bon conseil dans son domaine et se montre réellement impliquée dans la problématique client. Vivement recommandée.",
    highlight: "les choses seront faites",
    author: "Serge Parienti",
    role: "Président fondateur, SUNEIDO",
    logo: "/img/logo-suneido.png",
  },
  {
    quote:
      "Du professionnalisme, un réel esprit d'initiative, le sens du conseil et une réactivité totale ! Ajouter un bon état d'esprit d'une personne qui n'hésite pas à « dépasser » la charge de travail et sa fonction pour améliorer la qualité de la prestation.",
    highlight: "le sens du conseil et une réactivité totale",
    author: "Luc Poigniez",
    role: "Fondateur, Agence Créaclic",
    logo: "/img/logo-salondelacarrosserie.webp",
  },
];

const EN: Testimonial[] = [
  {
    quote:
      "Agathe stands out for how quickly she grasps business challenges and translates them into effective technical solutions. For our project, she built a custom landing page that perfectly reflects our brand identity, alongside a smooth, intuitive multilingual system.",
    highlight: "how quickly she grasps business challenges",
    author: "Christophe Riboulet",
    role: "CEO, Proditec",
    logo: "/img/logo-proditec.webp",
  },
  {
    quote:
      "Her attentiveness is impeccable, and it's a pleasure knowing that with her, things get done — true to the brief, without detours or needless complexity. She also gives excellent advice in her field and is genuinely invested in the client's problem. Highly recommended.",
    highlight: "things get done",
    author: "Serge Parienti",
    role: "Founding President, SUNEIDO",
    logo: "/img/logo-suneido.png",
  },
  {
    quote:
      "Professionalism, real initiative, sharp judgement and complete responsiveness! Add to that the right mindset — someone who doesn't hesitate to go beyond the workload and the brief to raise the quality of the deliverable.",
    highlight: "sharp judgement and complete responsiveness",
    author: "Luc Poigniez",
    role: "Founder, Agence Créaclic",
  },
];

/** Initiales du persona (2 premiers mots du nom) — ex. « Christophe Riboulet » → « CR ». */
function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? "")
    .join("")
    .toUpperCase();
}

/** Durée (s) pour dérouler une citation entière — règle la vitesse de frappe. */
const TYPE_DURATION = 1.8;

/** Surligneur (statique) appliqué à la punchline, révélée par le passage du caret. */
const HL =
  "bg-gradient-to-r from-accent-secondary/10 to-accent-secondary/20 bg-no-repeat [-webkit-box-decoration-break:clone] [background-position:0_148%] [background-size:100%_55%] [box-decoration-break:clone]";

/** Caret vermillon clignotant qui suit la frappe. */
function Caret() {
  return (
    <span
      aria-hidden
      className="ml-px inline-block h-[1.05em] w-[2px] translate-y-[0.18em] bg-accent-secondary/80 motion-safe:animate-pulse"
    />
  );
}

/**
 * Effet « typewriter éditorial » : la citation se déroule caractère par caractère
 * quand la carte entre dans le viewport, avec un caret vermillon qui suit la frappe ;
 * la punchline (`highlight`) apparaît surlignée au passage du caret.
 *
 * Garde-fous : le texte COMPLET reste dans le DOM en permanence (parts « tapées » +
 * reste en opacity-0) → aucun impact SEO / citabilité IA, lecture d'écran intégrale,
 * hauteur figée dès le départ (zéro layout shift). Rendu plein et immédiat en SSR,
 * sans JS, et en prefers-reduced-motion.
 */
function Quote({
  quote,
  highlight,
  duration = TYPE_DURATION,
  typewriter = true,
}: {
  quote: string;
  highlight?: string;
  duration?: number;
  typewriter?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [mounted, setMounted] = React.useState(false);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => setMounted(true), []);

  const segments = React.useMemo(() => {
    const idx = highlight ? quote.indexOf(highlight) : -1;
    if (!highlight || idx === -1) return [{ text: quote, hi: false }];
    return [
      { text: quote.slice(0, idx), hi: false },
      { text: highlight, hi: true },
      { text: quote.slice(idx + highlight.length), hi: false },
    ].filter((s) => s.text.length > 0);
  }, [quote, highlight]);

  const typing = typewriter && mounted && !reduce;

  React.useEffect(() => {
    if (!typing || !inView) return;
    const total = quote.length;
    const stepMs = 40;
    const perStep = Math.max(1, Math.ceil(total / ((duration * 1000) / stepMs)));
    const id = setInterval(() => {
      setCount((c) => {
        const next = c + perStep;
        if (next >= total) {
          clearInterval(id);
          return total;
        }
        return next;
      });
    }, stepMs);
    return () => clearInterval(id);
  }, [typing, inView, quote.length, duration]);

  // État plein : SSR / sans JS / reduced-motion → texte complet, sans caret.
  if (!typing) {
    return (
      <span ref={ref}>
        {segments.map((s, i) => (
          <span key={i} className={s.hi ? HL : undefined}>
            {s.text}
          </span>
        ))}
      </span>
    );
  }

  const revealed = inView ? count : 0;
  const done = revealed >= quote.length;
  let acc = 0;

  return (
    <span ref={ref}>
      {segments.map((s, i) => {
        const start = acc;
        acc += s.text.length;
        const vis = Math.min(Math.max(revealed - start, 0), s.text.length);
        const active = !done && revealed >= start && revealed < start + s.text.length;
        return (
          <span key={i}>
            <span className={s.hi ? HL : undefined}>{s.text.slice(0, vis)}</span>
            {active && <Caret />}
            <span aria-hidden className="opacity-0">
              {s.text.slice(vis)}
            </span>
          </span>
        );
      })}
    </span>
  );
}

export default function HomeTestimonials() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const testimonials = isEn ? EN : FR;

  return (
    <BlueprintSection tone="jet">
      {/* En-tête */}
      <Reveal className="border-b border-dark-gray px-6 py-12 lg:px-8 lg:py-16">
        <SectionHeading
          index="№ 03"
          kicker={isEn ? "Testimonials" : "Témoignages"}
          title={
            isEn ? (
              <>
                What my clients <span className="text-accent-secondary">say</span>
              </>
            ) : (
              <>
                Ce que disent <span className="text-accent-secondary">mes clients</span>
              </>
            )
          }
          description={
            isEn
              ? "Direct quotes — name, role, company. No anonymous five-stars."
              : "Quelques retours directs de mes clients."
          }
        />
      </Reveal>

      {/* Cartes */}
      <Stagger className="grid md:grid-cols-2">
        {testimonials.map((t, i) => {
          const featured = i === 0;
          return (
          <StaggerItem
            key={t.author}
            className={cn(
              "flex h-full flex-col border-dark-gray p-6 lg:p-10",
              featured
                ? "border-b md:col-span-2"
                : "border-b last:border-b-0 md:border-b-0",
              i === 1 && "md:border-r",
            )}
          >
            <span aria-hidden className="font-mono text-4xl leading-none text-accent-secondary/60">
              &ldquo;
            </span>
            <blockquote
              className={cn(
                "mt-4 flex-1 font-inter-tight leading-relaxed text-foreground",
                featured ? "text-lg md:text-xl" : "text-base md:text-md",
              )}
            >
              <Quote quote={t.quote} highlight={t.highlight} typewriter={featured} duration={3.6} />
            </blockquote>
            <div className="mt-8 flex items-center gap-3 border-t border-dark-gray pt-5">
              {/* Persona — monogramme d'initiales (pas de fausse photo client) */}
              <span
                aria-hidden
                className="flex h-10 w-10 shrink-0 items-center justify-center border border-dark-gray bg-obsidian font-mono text-xs font-medium uppercase tracking-[0.06em] text-mid-gray"
              >
                {initials(t.author)}
              </span>
              <div className="min-w-0">
                <div className="text-sm font-medium tracking-tight text-foreground">{t.author}</div>
                <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.1em] text-mid-gray">
                  {t.role}
                </div>
              </div>
              {/* Logo entreprise — affiché seulement si l'asset existe */}
              {t.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={t.logo}
                  alt=""
                  aria-hidden
                  className="ml-auto h-10 w-auto max-w-[90px] shrink-0 object-contain"
                />
              )}
            </div>
          </StaggerItem>
          );
        })}
      </Stagger>

    </BlueprintSection>
  );
}
