"use client";

import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import { BlueprintSection, SectionHeading } from "@/components/aspect/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";

type Testimonial = {
  quote: string;
  author: string;
  role: string;
};

// Verbatim, repris des études de cas (lib/case-studies-data.ts).
const FR: Testimonial[] = [
  {
    quote:
      "Agathe se distingue par sa capacité à comprendre rapidement les enjeux business et à les traduire en solutions techniques efficaces. Pour notre projet, elle a su créer une landing page sur mesure qui reflète parfaitement notre identité de marque, tout en intégrant un système multilingue fluide et intuitif.",
    author: "Christophe Riboulet",
    role: "PDG, Proditec",
  },
  {
    quote:
      "Du professionnalisme, un réel esprit d'initiative, le sens du conseil et une réactivité totale ! Ajouter un bon état d'esprit d'une personne qui n'hésite pas à « dépasser » la charge de travail et sa fonction pour améliorer la qualité de la prestation.",
    author: "Luc Poigniez",
    role: "Fondateur, Agence Créaclic",
  },
];

const EN: Testimonial[] = [
  {
    quote:
      "Agathe stands out for how quickly she grasps business challenges and translates them into effective technical solutions. For our project, she built a custom landing page that perfectly reflects our brand identity, alongside a smooth, intuitive multilingual system.",
    author: "Christophe Riboulet",
    role: "CEO, Proditec",
  },
  {
    quote:
      "Professionalism, real initiative, sharp judgement and complete responsiveness! Add to that the right mindset — someone who doesn't hesitate to go beyond the workload and the brief to raise the quality of the deliverable.",
    author: "Luc Poigniez",
    role: "Founder, Agence Créaclic",
  },
];

// Signature discrète — logos à fond transparent, rendus en monochrome blanc
// pour être lisibles sur fond sombre quel que soit leur format d'origine.
const LOGOS = [
  { src: "/img/logo-proditec.png", alt: "Proditec" },
  { src: "/img/logo-sowee.webp", alt: "Sowee" },
  { src: "/img/logo-mediatico.webp", alt: "Mediatico" },
  { src: "/img/logo-infralliance.png", alt: "Infralliance" },
  { src: "/img/logo-hermitage.webp", alt: "Tiers Lieu L'Hermitage" },
  { src: "/img/logo-salondelacarrosserie.webp", alt: "Salon de la Carrosserie" },
];

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
              : "Des mots de clients, nominatifs : nom, fonction, entreprise. Pas d'étoiles anonymes."
          }
        />
      </Reveal>

      {/* Cartes */}
      <Stagger className="grid border-b border-dark-gray md:grid-cols-2">
        {testimonials.map((t) => (
          <StaggerItem
            key={t.author}
            className="flex h-full flex-col border-b border-dark-gray p-6 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 lg:p-10"
          >
            <span aria-hidden className="font-mono text-4xl leading-none text-accent-secondary/60">
              &ldquo;
            </span>
            <blockquote className="mt-4 flex-1 font-inter-tight text-base leading-relaxed text-foreground md:text-lg">
              {t.quote}
            </blockquote>
            <div className="mt-8 border-t border-dark-gray pt-5">
              <div className="text-sm font-medium tracking-tight text-foreground">{t.author}</div>
              <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-mid-gray">
                {t.role}
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>

      {/* Logos — signature, pas un mur */}
      <div className="px-6 py-8 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray">
            {isEn ? "Trusted by" : "Ils m'ont fait confiance"}
          </p>
          <Link
            href="/etudes-de-cas"
            className="group inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-accent-secondary transition-colors hover:text-foreground"
          >
            {isEn ? "All case studies" : "Toutes les études de cas"}
            <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-6">
          {LOGOS.map((l) => (
            // eslint-disable-next-line @next/next/no-img-element
            // eslint-disable-next-line @next/next/no-img-element -- silhouette grise (light) / blanche (dark)
            <img
              key={l.src}
              src={l.src}
              alt={l.alt}
              className="h-6 w-auto opacity-60 [filter:brightness(0)_invert(0.4)] dark:opacity-50 dark:[filter:brightness(0)_invert(1)] md:h-7"
            />
          ))}
        </div>
      </div>
    </BlueprintSection>
  );
}
