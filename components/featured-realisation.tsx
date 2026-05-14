"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";

type Copy = {
  badge: string;
  tagline: string;
  description: string;
  stats: { value: string; label: string }[];
  ctaPrimary: string;
  ctaSecondary: string;
  imageAlt: string;
};

const COPY: Record<Locale, Copy> = {
  fr: {
    badge: "Réalisation phare — Mai 2026",
    tagline: "Marketplace B2B livrée en 2 mois",
    description:
      "Premier annuaire en ligne dédié aux fournisseurs d'objets publicitaires en France : Next.js, base PostgreSQL serverless, architecture pensée SEO et croissance. De l'idée à la mise en ligne en 2 mois.",
    stats: [
      { value: "1ᵉʳ", label: "Annuaire du secteur en France" },
      { value: "2 mois", label: "Du concept à la production" },
      { value: "B2B", label: "Sourcing fournisseurs simplifié" },
    ],
    ctaPrimary: "Voir l'étude de cas",
    ctaSecondary: "Discuter d'un projet similaire",
    imageAlt:
      "Page d'accueil de l'annuaire Panorama Pub — marketplace B2B des fournisseurs d'objets publicitaires",
  },
  en: {
    badge: "Featured project — May 2026",
    tagline: "B2B marketplace shipped in 2 months",
    description:
      "The first online directory dedicated to promotional product suppliers in France: Next.js, serverless PostgreSQL database, architecture designed for SEO and growth. From idea to launch in 2 months.",
    stats: [
      { value: "1st", label: "Industry directory in France" },
      { value: "2 months", label: "From concept to production" },
      { value: "B2B", label: "Streamlined supplier sourcing" },
    ],
    ctaPrimary: "View the case study",
    ctaSecondary: "Discuss a similar project",
    imageAlt:
      "Homepage of the Panorama Pub directory — B2B marketplace for promotional product suppliers",
  },
};

export default function FeaturedRealisation() {
  const locale = useLocale() as Locale;
  const copy = COPY[locale] ?? COPY.fr;

  return (
    <section className="relative w-full overflow-hidden border-y border-white/10 bg-gradient-to-br from-darkblue via-mediumblue/40 to-darkblue py-16 md:py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-6"
          >
            <span className="inline-flex items-center gap-2 self-start rounded-full border border-lightyellow/30 bg-lightyellow/10 px-4 py-1.5 text-sm font-googletitre font-semibold text-lightyellow">
              <Sparkles className="h-4 w-4" />
              {copy.badge}
            </span>
            <h2 className="font-googletitre text-3xl font-medium leading-tight text-white md:text-5xl">
              Panorama Pub
            </h2>
            <p className="font-googletitre text-xl font-medium text-coral md:text-2xl">
              {copy.tagline}
            </p>
            <p className="font-googletexte text-base leading-relaxed text-white/80 md:text-lg">
              {copy.description}
            </p>
            <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {copy.stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/10 bg-darkblue/40 p-4 backdrop-blur-sm"
                >
                  <dt className="font-googletitre text-2xl font-medium text-lightyellow md:text-3xl">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 font-googletexte text-sm leading-snug text-white/60">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/etudes-de-cas/panorama-pub">
                <Button className="inline-flex items-center gap-2 rounded-2xl bg-coral px-6 py-3 font-googletitre font-semibold text-darkblue transition-all duration-300 hover:scale-[1.02]">
                  {copy.ctaPrimary}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-transparent px-6 py-3 font-googletitre font-semibold text-white transition-all duration-300 hover:bg-white/10">
                  {copy.ctaSecondary}
                  <ArrowRight className="h-4 w-4 text-white/70" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-darkblue/40 shadow-2xl"
          >
            <div className="relative aspect-[16/10] w-full">
              <Image
                src="/img/desktop-screen-panorama-pub.jpg"
                alt={copy.imageAlt}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-top"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
