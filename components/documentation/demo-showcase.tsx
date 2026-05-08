"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { VideoEmbed } from "@/components/documentation/video-embed";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { PROFILES } from "@/lib/documentation-profiles";
import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import {
  MousePointerClick,
  Layers,
  ArrowRight,
  Code,
  Globe,
  Smartphone,
  PlayCircle,
} from "lucide-react";
import { Link } from "@/i18n/navigation";

// ─── Video data ────────────────────────────────────────────────────────────

const VIDEOS_FR = {
  plateforme: {
    url: "https://youtu.be/I1qi5o31Lnk",
    title: "Billeterie événementielle — WordPress Headless Next.js",
  },
  cdf: {
    url: "https://youtu.be/6vUSbG6F50w",
    title: "Comme des Fous — Média participatif headless",
  },
  doleances: {
    url: "https://youtu.be/_OjiGiOWJus",
    title: "Doléances — Promotion citoyenne headless",
  },
  egc: {
    url: "https://youtu.be/dJIndpLBm7o",
    title: "États Généraux Communaux — Plateforme headless",
  },
};

const VIDEOS_EN = {
  plateforme: {
    url: "https://youtu.be/I1qi5o31Lnk",
    title: "Event ticketing — Headless WordPress + Next.js",
  },
  cdf: {
    url: "https://youtu.be/6vUSbG6F50w",
    title: "Comme des Fous — Headless participatory media",
  },
  doleances: {
    url: "https://youtu.be/_OjiGiOWJus",
    title: "Doléances — Headless citizen platform",
  },
  egc: {
    url: "https://youtu.be/dJIndpLBm7o",
    title: "États Généraux Communaux — Headless platform",
  },
};

// ─── Mini button playground (compact) ──────────────────────────────────────

type ButtonVariant = "default" | "outline" | "secondary" | "ghost";

const variantsFr: { label: string; value: ButtonVariant }[] = [
  { label: "Primaire", value: "default" },
  { label: "Secondaire", value: "secondary" },
  { label: "Contour", value: "outline" },
  { label: "Fantôme", value: "ghost" },
];

const variantsEn: { label: string; value: ButtonVariant }[] = [
  { label: "Primary", value: "default" },
  { label: "Secondary", value: "secondary" },
  { label: "Outline", value: "outline" },
  { label: "Ghost", value: "ghost" },
];

function MiniButtonPlayground() {
  const [variant, setVariant] = useState<ButtonVariant>("default");
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const variants = isEn ? variantsEn : variantsFr;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center rounded-2xl bg-darkblue/60 border border-lightblue/10 p-6 min-h-[100px]">
        <motion.div
          key={variant}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <Button variant={variant} size="lg">
            {isEn ? "Click me" : "Cliquez-moi"}
          </Button>
        </motion.div>
      </div>
      <div className="flex flex-wrap gap-2">
        {variants.map((v) => (
          <button
            key={v.value}
            onClick={() => setVariant(v.value)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-googletexte transition-all duration-200 border",
              variant === v.value
                ? "bg-regularblue/30 text-white border-regularblue/40"
                : "bg-darkblue/40 text-white/80 border-lightblue/10 hover:bg-darkblue/60 hover:text-white/80"
            )}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Architecture visuelle headless ────────────────────────────────────────

function HeadlessArchitectureVisual() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  return (
    <div className="flex items-center justify-center gap-3 md:gap-4 py-4">
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-regularblue/20 border border-regularblue/30">
          <Layers className="h-6 w-6 text-regularblue" />
        </div>
        <span className="text-xs text-white/80 font-googletexte">
          WordPress
        </span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="h-px w-8 md:w-12 bg-lightblue/30" />
        <span className="text-[10px] text-white/80 font-mono">API</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange/20 border border-orange/30">
          <Code className="h-6 w-6 text-orange" />
        </div>
        <span className="text-xs text-white/80 font-googletexte">Next.js</span>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="h-px w-8 md:w-12 bg-lightblue/30" />
        <span className="text-[10px] text-white/80 font-mono">CDN</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lightblue/20 border border-lightblue/30">
          <div className="flex gap-1">
            <Globe className="h-4 w-4 text-lightblue" />
            <Smartphone className="h-4 w-4 text-lightblue" />
          </div>
        </div>
        <span className="text-xs text-white/80 font-googletexte">
          {isEn ? "Your visitors" : "Vos visiteurs"}
        </span>
      </div>
    </div>
  );
}

// ─── Code snippet ──────────────────────────────────────────────────────────

function CodeSnippet() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const code = isEn
    ? `// Fetch WordPress via REST API
const res = await fetch(
  'https://cms.example.com/wp-json/wp/v2/posts'
);
const posts = await res.json();

// Next.js rendering with ISR
export const revalidate = 3600;`
    : `// Fetch WordPress via API REST
const res = await fetch(
  'https://cms.example.com/wp-json/wp/v2/posts'
);
const posts = await res.json();

// Rendu Next.js avec ISR
export const revalidate = 3600;`;
  return (
    <pre className="rounded-2xl bg-darkblue/60 border border-lightblue/10 p-4 text-xs text-extralightblue/80 font-mono overflow-x-auto leading-relaxed">
      <code>{code}</code>
    </pre>
  );
}

// ─── Demo card wrapper ─────────────────────────────────────────────────────

interface DemoCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
}

function DemoCard({ icon, title, children, className }: DemoCardProps) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-lightblue/10 bg-white/5 backdrop-blur-sm p-5 md:p-6",
        className
      )}
    >
      <div className="flex items-center gap-2.5 mb-4">
        
        <h3 className="font-googletitre  text-2xl font-medium text-lightyellow">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────

export function DemoShowcase() {
  const { profileId } = useDocumentationMode();
  const profile = profileId ? PROFILES[profileId] : null;
  const locale = useLocale() as Locale;
  const isEn = locale === "en";

  return (
    <section className="relative mt-12">
      {/* Full-width background + borders */}
      <div className="absolute inset-0 -left-[calc((100vw-100%)/2)] w-screen bg-darkblue/90 border-y border-lightblue/10" />

      <motion.div
        className="relative py-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 24, delay: 0.2 }}
      >
        {/* Section header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="font-googletitre text-2xl md:text-4xl font-medium text-white mb-1">
              {profileId
                ? isEn
                  ? "Interactive demo"
                  : "Démo interactive"
                : isEn
                  ? "See it in action"
                  : "Voir en action"}
            </h2>
            <p className="text-sm text-white/80 font-googletexte">
              {profileId
                ? isEn
                  ? `Videos and components for your ${profile?.label} profile.`
                  : `Vidéos et composants adaptés à votre profil ${profile?.label}.`
                : isEn
                  ? "Real project videos and interactive components."
                  : "Vidéos de projets réels et composants interactifs."}
            </p>
          </div>
          <Link
            href="/documentation/playground"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-darkblue/50 border border-lightblue/10 px-3 py-1.5 text-xs text-white/80 hover:text-white/80 hover:border-lightblue/20 transition-all duration-300 font-googletexte shrink-0"
          >
            {isEn ? "All playgrounds" : "Tous les playground"}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {/* Profile-contextual demos */}
        <AnimatePresence mode="wait">
          <motion.div
            key={profileId || "default"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {!profileId && <DefaultDemos />}
            {profileId === "decideur" && <DecideurDemos />}
            {profileId === "utilisateur" && <UtilisateurDemos />}
            {profileId === "developpeur" && <DeveloppeurDemos />}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </section>
  );
}

// ─── Demo layouts per profile ──────────────────────────────────────────────

function DefaultDemos() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const VIDEOS = isEn ? VIDEOS_EN : VIDEOS_FR;
  return (
    <div className="space-y-4">
      {/* Row 1: Video + Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DemoCard
          icon={<PlayCircle className="h-5 w-5 text-regularblue" />}
          title={isEn ? "Headless WordPress in action" : "WordPress Headless en action"}
        >
          <VideoEmbed
            url={VIDEOS.plateforme.url}
            title={VIDEOS.plateforme.title}
          />
        </DemoCard>

        <DemoCard
          icon={<Layers className="h-5 w-5 text-orange" />}
          title={isEn ? "Headless architecture" : "Architecture headless"}
        >
          <HeadlessArchitectureVisual />
          <p className="text-xs text-white/80 font-googletexte mt-3">
            {isEn
              ? "WordPress handles content, Next.js handles rendering. Result: a fast, secure and flexible site."
              : "WordPress gère le contenu, Next.js gère l'affichage. Résultat : un site rapide, sécurisé et flexible."}
          </p>
        </DemoCard>
      </div>

      {/* Row 2: Mini projects */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[VIDEOS.cdf, VIDEOS.doleances, VIDEOS.egc].map((video) => (
          <DemoCard
            key={video.url}
            icon={<PlayCircle className="h-4 w-4 text-white/80" />}
            title={video.title}
          >
            <VideoEmbed url={video.url} title={video.title} compact />
          </DemoCard>
        ))}
      </div>
    </div>
  );
}

function DecideurDemos() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const VIDEOS = isEn ? VIDEOS_EN : VIDEOS_FR;
  return (
    <div className="space-y-4">
      {/* Row 1: Featured video + key numbers */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <DemoCard
          icon={<PlayCircle className="h-5 w-5 text-orange" />}
          title={isEn ? "Production platform" : "Plateforme en production"}
          className="md:col-span-3"
        >
          <VideoEmbed
            url={VIDEOS.plateforme.url}
            title={VIDEOS.plateforme.title}
          />
          <p className="text-xs text-white/80 font-googletexte mt-3">
            {isEn
              ? "Event ticketing platform powered by Headless WordPress + Next.js."
              : "Billeterie événementielle propulsée par WordPress Headless + Next.js."}
          </p>
        </DemoCard>

        <DemoCard
          icon={<Globe className="h-5 w-5 text-orange" />}
          title={isEn ? "Why it changes everything" : "Pourquoi ça change tout"}
          className="md:col-span-2"
        >
          <div className="space-y-4 mt-2">
            {(isEn
              ? [
                  { value: "2×", label: "faster than a standard site" },
                  { value: "100", label: "achievable Lighthouse score" },
                  { value: "0", label: "frontend plugins to maintain" },
                ]
              : [
                  { value: "2×", label: "plus rapide qu'un site classique" },
                  { value: "100", label: "score Lighthouse accessible" },
                  { value: "0", label: "plugin frontend à maintenir" },
                ]
            ).map((stat) => (
              <div key={stat.label} className="flex items-baseline gap-3">
                <span className="text-2xl font-googletitre font-medium text-orange">
                  {stat.value}
                </span>
                <span className="text-xs text-white/80 font-googletexte">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <HeadlessArchitectureVisual />
          </div>
        </DemoCard>
      </div>

      {/* Row 2: Project demos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DemoCard
          icon={<PlayCircle className="h-4 w-4 text-orange/60" />}
          title={VIDEOS.cdf.title}
        >
          <VideoEmbed url={VIDEOS.cdf.url} title={VIDEOS.cdf.title} compact />
        </DemoCard>
        <DemoCard
          icon={<PlayCircle className="h-4 w-4 text-orange/60" />}
          title={VIDEOS.egc.title}
        >
          <VideoEmbed url={VIDEOS.egc.url} title={VIDEOS.egc.title} compact />
        </DemoCard>
      </div>
    </div>
  );
}

function UtilisateurDemos() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const VIDEOS = isEn ? VIDEOS_EN : VIDEOS_FR;
  return (
    <div className="space-y-4">
      {/* Row 1: Video + Button playground */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DemoCard
          icon={<PlayCircle className="h-5 w-5 text-regularblue" />}
          title={isEn ? "Managing content in headless" : "Gérer du contenu en headless"}
        >
          <VideoEmbed url={VIDEOS.cdf.url} title={VIDEOS.cdf.title} />
          <p className="text-xs text-white/80 font-googletexte mt-3">
            {isEn
              ? "You publish in WordPress as usual. The site updates automatically."
              : "Vous publiez sur WordPress comme d'habitude. Le site se met à jour automatiquement."}
          </p>
        </DemoCard>

        <DemoCard
          icon={<MousePointerClick className="h-5 w-5 text-regularblue" />}
          title={isEn ? "Test the components" : "Testez les composants"}
        >
          <MiniButtonPlayground />
          <div className="mt-4">
            <HeadlessArchitectureVisual />
          </div>
        </DemoCard>
      </div>

      {/* Row 2: More project videos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DemoCard
          icon={<PlayCircle className="h-4 w-4 text-regularblue/80" />}
          title={VIDEOS.plateforme.title}
        >
          <VideoEmbed
            url={VIDEOS.plateforme.url}
            title={VIDEOS.plateforme.title}
            compact
          />
        </DemoCard>
        <DemoCard
          icon={<PlayCircle className="h-4 w-4 text-regularblue/80" />}
          title={VIDEOS.doleances.title}
        >
          <VideoEmbed
            url={VIDEOS.doleances.url}
            title={VIDEOS.doleances.title}
            compact
          />
        </DemoCard>
      </div>
    </div>
  );
}

function DeveloppeurDemos() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const VIDEOS = isEn ? VIDEOS_EN : VIDEOS_FR;
  return (
    <div className="space-y-4">
      {/* Row 1: Video + Code */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <DemoCard
          icon={<PlayCircle className="h-5 w-5 text-lightblue" />}
          title={isEn ? "Production architecture" : "Architecture en production"}
          className="md:col-span-3"
        >
          <VideoEmbed
            url={VIDEOS.plateforme.url}
            title={VIDEOS.plateforme.title}
          />
          <p className="text-xs text-white/80 font-googletexte mt-3">
            {isEn
              ? "Next.js App Router, ISR, WordPress REST API — full stack in production."
              : "Next.js App Router, ISR, API REST WordPress — stack complet en prod."}
          </p>
        </DemoCard>

        <DemoCard
          icon={<Code className="h-5 w-5 text-lightblue" />}
          title="REST API & ISR"
          className="md:col-span-2"
        >
          <CodeSnippet />
          <p className="text-xs text-white/80 font-googletexte mt-3">
            {isEn ? (
              <>
                WordPress exposes data via{" "}
                <code className="text-lightblue/80">wp-json/wp/v2</code>. Next.js
                regenerates pages in the background.
              </>
            ) : (
              <>
                WordPress expose les données via{" "}
                <code className="text-lightblue/80">wp-json/wp/v2</code>. Next.js
                régénère les pages en arrière-plan.
              </>
            )}
          </p>
          <div className="mt-3">
            <MiniButtonPlayground />
          </div>
        </DemoCard>
      </div>

      {/* Row 2: Project demos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[VIDEOS.cdf, VIDEOS.doleances, VIDEOS.egc].map((video) => (
          <DemoCard
            key={video.url}
            icon={<PlayCircle className="h-4 w-4 text-lightblue/80" />}
            title={video.title}
          >
            <VideoEmbed url={video.url} title={video.title} compact />
          </DemoCard>
        ))}
      </div>
    </div>
  );
}
