"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Smartphone,
  MapPin,
  Database,
  Wifi,
  Lock,
  Settings2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

type Copy = {
  sectionLabel: string;
  title: string;
  subtitle: string;
  priceLabel: string;
  characteristicsLabel: string;
  characteristics: { icon: typeof Smartphone; text: string }[];
  useCasesLabel: string;
  useCases: string[];
  differentiatorTitle: string;
  differentiator: string;
  advantagesLabel: string;
  advantages: string[];
  limitsLabel: string;
  limits: string[];
  proofsLabel: string;
  proofs: { slug: string; title: string; tagline: string; imageUrl: string }[];
  oethBadge: string;
  oethTitle: string;
  oethDescription: string;
  oethCta: string;
  ctaPrimary: string;
};

const COPY: Record<Locale, Copy> = {
  fr: {
    sectionLabel: "Applications web & mobile sur-mesure",
    title: "Quand WordPress n'est plus le bon outil",
    subtitle:
      "Pour vos marketplaces, outils métier, simulateurs ou applications mobiles : une stack sur-mesure pensée pour votre logique métier.",
    priceLabel: "Sur devis, après cadrage",
    characteristicsLabel: "Caractéristiques",
    characteristics: [
      { icon: Settings2, text: "Logique métier propre" },
      { icon: Lock, text: "Comptes utilisateurs" },
      { icon: Database, text: "Données temps réel" },
      {
        icon: MapPin,
        text: "Géolocalisation, mode hors-ligne, installation sur écran d'accueil",
      },
    ],
    useCasesLabel: "Cas d'usage",
    useCases: [
      "Marketplace ou annuaire B2B",
      "Outil interne ou plateforme métier",
      "Simulateur, calculateur, configurateur",
      "Jeu en ligne, gamification",
      "Application terrain ou mobile",
    ],
    differentiatorTitle: "Vous gardez la main",
    differentiator:
      "Comme WordPress vous permet de gérer votre site sans dépendre d'un développeur au quotidien, chaque application livrée s'accompagne d'une interface d'administration autonome, conçue sur-mesure pour votre logique métier. Vous gérez vos contenus, vos données et vos utilisateurs en toute autonomie.",
    advantagesLabel: "Avantages",
    advantages: [
      "Sur-mesure intégral, adapté à votre métier",
      "Performances maximales (Next.js + base dédiée)",
      "Autonomie de gestion comparable à WordPress",
      "Pas de limites imposées par un CMS générique",
    ],
    limitsLabel: "À prévoir",
    limits: [
      "Budget plus conséquent qu'un site WordPress",
      "Maintenance continue de l'infrastructure",
      "Équipe technique nécessaire pour les évolutions structurelles",
    ],
    proofsLabel: "Réalisations",
    proofs: [
      {
        slug: "panorama-pub",
        title: "Panorama Pub",
        tagline: "Marketplace B2B livrée en 2 mois — admin autonome sur-mesure",
        imageUrl: "/img/desktop-screen-panoramapub.png",
      },
      {
        slug: "hermitage-jeu-de-piste",
        title: "Hermitage — Jeu de piste",
        tagline:
          "Application mobile PWA — géolocalisée, installable sans store, hors-ligne",
        imageUrl: "/img/mobile-screen-jeu-de-piste-hermitage.jpg",
      },
    ],
    oethBadge: "Avantage OETH applicable",
    oethTitle: "Déduction AGEFIPH transverse",
    oethDescription:
      "Toute prestation Next Impact ouvre droit à la déduction AGEFIPH (30 % du coût de main-d'œuvre) — site WordPress, site Headless, web app ou application mobile.",
    oethCta: "Simuler mon économie",
    ctaPrimary: "Discuter de mon projet",
  },
  en: {
    sectionLabel: "Custom web & mobile applications",
    title: "When WordPress is no longer the right tool",
    subtitle:
      "For your marketplaces, business tools, simulators or mobile applications: a custom stack built for your business logic.",
    priceLabel: "On quote, after scoping",
    characteristicsLabel: "Characteristics",
    characteristics: [
      { icon: Settings2, text: "Dedicated business logic" },
      { icon: Lock, text: "User accounts" },
      { icon: Database, text: "Real-time data" },
      {
        icon: MapPin,
        text: "Geolocation, offline mode, install on home screen",
      },
    ],
    useCasesLabel: "Use cases",
    useCases: [
      "Marketplace or B2B directory",
      "Internal tool or business platform",
      "Simulator, calculator, configurator",
      "Online game, gamification",
      "Field or mobile application",
    ],
    differentiatorTitle: "You stay in control",
    differentiator:
      "Just as WordPress lets you manage your site without depending on a developer every day, every application I deliver comes with an autonomous admin interface tailored to your business logic. You manage your content, your data and your users in full autonomy.",
    advantagesLabel: "Advantages",
    advantages: [
      "Fully bespoke, adapted to your business",
      "Maximum performance (Next.js + dedicated database)",
      "Management autonomy comparable to WordPress",
      "No limits imposed by a generic CMS",
    ],
    limitsLabel: "To consider",
    limits: [
      "Larger budget than a WordPress site",
      "Ongoing infrastructure maintenance",
      "Technical team required for structural changes",
    ],
    proofsLabel: "Selected work",
    proofs: [
      {
        slug: "panorama-pub",
        title: "Panorama Pub",
        tagline:
          "B2B marketplace shipped in 2 months — custom autonomous admin",
        imageUrl: "/img/desktop-screen-panoramapub.png",
      },
      {
        slug: "hermitage-jeu-de-piste",
        title: "Hermitage — Treasure Hunt",
        tagline: "Mobile PWA — geolocated, store-free install, offline",
        imageUrl: "/img/mobile-screen-jeu-de-piste-hermitage.jpg",
      },
    ],
    oethBadge: "OETH benefit applicable",
    oethTitle: "Transverse AGEFIPH deduction",
    oethDescription:
      "Every Next Impact engagement qualifies for the AGEFIPH deduction (30 % of labor cost) — WordPress site, Headless site, web app or mobile application.",
    oethCta: "Simulate my savings",
    ctaPrimary: "Discuss my project",
  },
};

export default function AppsSection() {
  const locale = useLocale() as Locale;
  const copy = COPY[locale] ?? COPY.fr;

  return (
    <section className="container mx-auto px-4 mt-20" id="apps-sur-mesure">
      <div className="max-w-6xl mx-auto">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-12"
        >
          <p className="text-white/60 font-googletexte uppercase tracking-widest mb-4 text-sm">
            {copy.sectionLabel}
          </p>
          <h2 className="text-3xl md:text-5xl font-googletitre font-medium text-white mb-4">
            {copy.title}
          </h2>
          <p className="text-white/70 font-googletexte text-lg max-w-3xl mx-auto leading-relaxed">
            {copy.subtitle}
          </p>
          <p className="mt-4 text-coral font-googletitre font-semibold">
            {copy.priceLabel}
          </p>
        </motion.div>

        {/* Caractéristiques + Cas d'usage */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="border border-white/10 rounded-2xl p-8 bg-darkblue/40 backdrop-blur-sm">
            <p className="text-sm text-white/50 font-googletexte uppercase tracking-widest mb-4">
              {copy.characteristicsLabel}
            </p>
            <ul className="space-y-3">
              {copy.characteristics.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <li key={idx} className="flex items-start gap-3">
                    <Icon className="h-5 w-5 text-lightyellow shrink-0 mt-0.5" />
                    <span className="text-white/80 font-googletexte">
                      {item.text}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="border border-white/10 rounded-2xl p-8 bg-darkblue/40 backdrop-blur-sm">
            <p className="text-sm text-white/50 font-googletexte uppercase tracking-widest mb-4">
              {copy.useCasesLabel}
            </p>
            <ul className="space-y-2">
              {copy.useCases.map((useCase, idx) => (
                <li
                  key={idx}
                  className="text-white/80 font-googletexte flex items-start gap-2"
                >
                  <span className="text-coral">·</span>
                  <span className="text-white/80 font-googletexte">
                    {useCase}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Différenciateur — autonomie de gestion */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4 }}
          className="border-2 border-coral/30 rounded-2xl p-8 md:p-10 bg-gradient-to-br from-coral/10 to-mediumblue/20 backdrop-blur-sm mb-12"
        >
          <div className="flex items-start gap-4">
            <Smartphone className="h-8 w-8 text-coral shrink-0 mt-1" />
            <div>
              <h3 className="text-2xl md:text-3xl font-googletitre font-medium text-white mb-3">
                {copy.differentiatorTitle}
              </h3>
              <p className="text-white/80 font-googletexte text-lg leading-relaxed italic">
                « {copy.differentiator} »
              </p>
            </div>
          </div>
        </motion.div>

        {/* Avantages / Limites */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="border border-lightyellow/20 rounded-2xl p-6 bg-lightyellow/5">
            <p className="text-sm text-lightyellow font-googletitre uppercase tracking-widest mb-3 font-semibold">
              {copy.advantagesLabel}
            </p>
            <ul className="space-y-2">
              {copy.advantages.map((adv, idx) => (
                <li
                  key={idx}
                  className="text-white/80 font-googletexte text-sm"
                >
                  + {adv}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-white/10 rounded-2xl p-6 bg-darkblue/30">
            <p className="text-sm text-white/50 font-googletitre uppercase tracking-widest mb-3 font-semibold">
              {copy.limitsLabel}
            </p>
            <ul className="space-y-2">
              {copy.limits.map((lim, idx) => (
                <li
                  key={idx}
                  className="text-white/70 font-googletexte text-sm"
                >
                  — {lim}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Preuves */}
        <div className="mb-12">
          <p className="text-center text-white/60 font-googletexte uppercase tracking-widest mb-6 text-sm">
            {copy.proofsLabel}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {copy.proofs.map((proof) => (
              <Link
                key={proof.slug}
                href={`/etudes-de-cas/${proof.slug}`}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-darkblue/40 backdrop-blur-sm transition-all duration-300 hover:border-coral/40">
                  <div className="relative aspect-video">
                    <Image
                      src={proof.imageUrl}
                      alt={proof.title}
                      fill
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                  </div>
                  <div className="p-5">
                    <h4 className="text-xl font-googletitre font-medium text-white mb-1">
                      {proof.title}
                    </h4>
                    <p className="text-sm text-white/60 font-googletexte">
                      {proof.tagline}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Encart OETH transverse */}
        <div className="border border-lightblue/30 rounded-2xl p-6 md:p-8 bg-lightblue/10 mb-12">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <Wifi className="h-6 w-6 text-extralightblue shrink-0" />
              <span className="text-sm uppercase tracking-widest font-googletitre font-semibold text-extralightblue">
                {copy.oethBadge}
              </span>
            </div>
            <div className="flex-1">
              <h4 className="text-lg font-googletitre font-medium text-white mb-1">
                {copy.oethTitle}
              </h4>
              <p className="text-white/70 font-googletexte text-sm">
                {copy.oethDescription}
              </p>
            </div>
            <Link href="/avantage-oeth">
              <Button className="inline-flex items-center gap-2 rounded-full bg-lightblue/20 hover:bg-lightblue/30 border border-lightblue/30 text-white font-googletitre font-semibold transition-all duration-300">
                {copy.oethCta}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* CTA principal */}
        <div className="text-center">
          <Link
            href="https://calendar.app.google/RwZqaabSR5aDMnk46"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="h-14 px-10 font-bold font-googletitre text-lg rounded-full bg-coral text-darkblue transition-all duration-300 hover:scale-[1.02]">
              {copy.ctaPrimary}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
