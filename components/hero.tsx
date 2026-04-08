"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { BrandLogo } from "@/components/brand-logo";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowDownLeft,
  ArrowLeftRightIcon,
  ArrowRightLeftIcon,
  ArrowRightSquare,
  LucideArrowUpRight,
  PresentationIcon,
} from "lucide-react";
import AiAuditBannerSVG from "./AiAuditBannerSVG";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { HERO_VARIANTS } from "@/lib/homepage-profiles";
const GeminiSearch = dynamic(() => import("@/components/gemini/gemini-search"), { ssr: false });

// Prompt et instruction identiques à ClientGeminiBlock
const system_instruction = `Tu es un expert en stratégie digitale et UX avec une forte compétence en audit technique.
Ta méthode est rigoureuse :
1. OBSERVATION : Tu extrais d'abord les données factuelles (métadonnées, structure légale, vocabulaire utilisé).
2. ANALYSE : Tu croises ces données pour établir un diagnostic précis de l'identité de l'organisation.
3. RECOMMANDATION : Tu fournis des conseils stratégiques basés sur ces preuves.
Ton ton est direct, professionnel et factuel.`;
const prompt = `
**Mission :** Audit stratégique de l'URL {$url} pour évaluer la pertinence d'une migration vers une architecture Headless.

**Synthèse globale des résultats
*Insère une synthèse des résultats et de la recommandation sans évoquer l'identité issue du diagnostic*
---

**Étape 1 : Diagnostic d'Identité (Scan Précis)**
*Effectue une analyse croisée des metadonnées et dans un deuxième temps du contenu visible (Header, Footer, Page "À Propos").*

1.  **Nature de l'organisation :** (Ex: Entreprise privée, Association, Collectivité, Institution publique, Startup, Indépendant/Freelance, ONG, etc.)
2.  **Secteur d'activité :** (Ex: E-commerce B2C, SaaS B2B, Média, etc.)
3.  **Proposition de valeur :** Quelle est la promesse principale faite au client ?
3.  **Mission :** Cite un court extrait du site qui valide cette proposition.
4.  **Cibles prioritaires :** Identifie les 2 profils d'utilisateurs les plus évidents.
*Si le site est inaccessible ou le contenu protégé, réponds uniquement : "Accès bloqué : Diagnostic impossible." et arrête l'analyse.*

---

**Étape 2 : Analyse Stratégique (Format Markdown)**

### 1. Positionnement Actuel
*   **Perception de marque :** Le design et la navigation du site inspirent-ils confiance et modernité, ou montrent-ils des signes de retard technologique (lenteur, design daté) ?
*   **Friction UX Majeure :** Quel est le principal obstacle visible dans le parcours utilisateur (ex: formulaire complexe, navigation peu claire, temps de chargement) ?
*   **Indice de modernité :** [Note sur 10] évaluant la performance et l'expérience globale par rapport aux standards actuels.

### 2. Pertinence d'une Migration WordPress Headless
*   **Verdict Stratégique :** [Migrer rapidement / Maintenir WordPress monolithique / Migrer progressivement]. Justifie en une phrase.
*   **Enjeu de Différenciation :** Comment le Headless peut-il transformer l'expérience (ex: ultra-rapide, personnalisée) pour créer un avantage concurrentiel ?
*   **Justification Business :** Quels sont les arguments clés (ROI potentiel) justifiant l'investissement face aux gains attendus en performance, SEO et agilité marketing ?

### 3. Indicateurs d'Impact Business
*   **Performance & SEO :** Quel serait l'impact de temps de chargement quasi-instantanés (Core Web Vitals optimaux) sur le classement Google et le taux de rebond ?
*   **Agilité Marketing :** Explique comment le Headless permettrait aux équipes de lancer plus rapidement des campagnes ou de nouveaux contenus sans dépendre du back-end.

### 4. Leviers de Croissance via Headless
*Identifie 3 fonctionnalités de 3 niveaux de complexité que le Headless rendrait possibles.*
1. Rapide
2. Moyennement complexe
3. Très complexe

### 5. Stack recommandée (uniquement si migration recommandée et sur WordPress Headless)

Comparatif des stacks : WordPress monolithique, WP Astro, WP Next.js
Recommandation de stack
---

**Instruction de sortie :** Réponds exclusivement en Markdown. La structure doit suivre les titres et les points de l'étape 2. Assure la capitalisation française du texte. Et n'introduit pas trop d'icones
`;

export default function Hero() {
  const url = ""; // Default empty URL or set a default value
  const { profileId } = useDocumentationMode();
  const variant = profileId ? HERO_VARIANTS[profileId] : HERO_VARIANTS.default;

  return (
    <>
      <main className="h-full md:h-screen flex items-center relative overflow-hidden">

        <div className="container flex flex-col lg:flex-row justify-between lg:justify-evenly items-end gap-12 lg:gap-24 px-4 md:px-6 relative">
          {/* Text Content */}
          <div className="flex flex-col lg:col-span-7 bg-darkblue/60 backdrop-blur-md border border-white/10 p-6 md:p-10 rounded-2xl mt-4 md:mt-12 lg:mt-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={profileId || "default"}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="mb-1 text-3xl lg:text-4xl text-white/80 font-googletexte">
                  {variant.headline}
                </h1>
                <p className="mt-2 text-4xl lg:text-5xl text-coral font-googletitre font-medium">
                  {variant.subHeadline}
                </p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-5 flex flex-wrap items-center justify-start gap-4">
              <BrandLogo
                src="/img/logo-wordpress-blanc.webp"
                srcLight="/img/logo-wordpress-small.webp"
                alt="Logo WordPress"
                width={45}
                height={60}
                priority
                fetchPriority="high"
              />
              <BrandLogo
                src="/img/logo-nextjs-blanc.webp"
                srcLight="/img/logo-nextjs.webp"
                alt="Logo Next.js"
                width={80}
                height={80}
                priority
                fetchPriority="high"
              />
              <BrandLogo
                src="/img/logo-astro-blanc.webp"
                srcLight="/img/logo-astro.webp"
                alt="Logo Astro"
                width={90}
                height={80}
                className="mt-1.5"
                priority
                fetchPriority="high"
              />
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={`desc-${profileId || "default"}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <p className="mt-10 md:mt-16 font-googletexte md:text-xl text-white/80 max-w-xl">
                  {variant.description}
                </p>

                <p className="mt-4 mb-4 font-googletexte italic text-white/70 text-base">
                  {variant.valueProposition}
                </p>
                <div className="flex flex-col sm:flex-row content-start justify-start gap-4">
                  <Button className="mx-0 inline-flex bg-orange py-2 px-8 rounded-2xl hover:scale-[1.02] transition-all duration-300 ease-in">
                    <Link
                      href={variant.ctaPrimary.href}
                      className="gap-2 text-darkblue font-googletitre font-semibold text-lg"
                    >
                      {variant.ctaPrimary.label}
                    </Link>
                    <LucideArrowUpRight className="w-8 h-8 text-darkblue" />
                  </Button>
                  <Button className="mx-0 inline-flex border border-white/30 bg-transparent py-2 px-8 rounded-2xl hover:bg-white/10 transition-all duration-300 ease-in">
                    <Link
                      href={variant.ctaSecondary.href}
                      className="gap-2 text-white font-googletitre font-semibold text-lg"
                    >
                      {variant.ctaSecondary.label}
                    </Link>
                    <LucideArrowUpRight className="w-8 h-8 text-white/70" />
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>

          </div>

          {/* Hero Image */}
          <div className="relative lg:col-span-5">
            <div className="relative rounded-xl overflow-hidden aspect-square max-w-md mx-auto">
              {/* Placeholder for profile image - replace with actual image */}
              <div className="bg-gradient-to-br from-brand-400/80 to-brand-600/80 w-full h-full flex items-center justify-center">
                <Image
                  src="/img/avatar.jpg" // Replace with your image path
                  alt="Profile"
                  className="bg-white object-cover w-full h-full rounded-xl"
                  width={500} // Adjust width as needed
                  height={500} // Adjust height as needed
                  priority
                  fetchPriority="high"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>

              {/* Floating badges */}
              <div className="absolute left-6 top-6 bg-extralightblue py-2 px-4 rounded-full flex items-center gap-2 animate-float">
                <span className="h-3 w-3 bg-green-500 rounded-full"></span>
                <span className="text-sm font-medium text-black">
                  Disponible
                </span>
              </div>

              <div className="absolute right-4 bottom-12 bg-extralightblue py-2 px-4 rounded-full animate-float-delayed">
                <span className="text-sm font-medium text-black">
                  8+ ans d'expérience
                </span>
              </div>

              <div className="absolute left-4 bottom-4 bg-lightyellow py-1.5 px-3 rounded-full animate-float hidden md:flex items-center gap-1.5">
                <span className="text-xs font-medium text-darkblue">
                  Prestataire TIH — Déduction AGEFIPH
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/*Gemini Search Section */}
      <section id="audit" className="bg-mediumblue/60 w-full mx-auto flex flex-col backdrop-blur-xl border-y border-white/10 md:px-6 py-16 md:py-32 relative">

          <h2 className="font-googletitre text-white text-4xl md:text-5xl font-medium flex items-end justify-center px-4 gap-4 z-10">
            {variant.auditTitle}
          </h2>
        <div className="w-full max-w-full mx-auto xl:max-w-5xl flex flex-col relative px-4 md:px-20 md:mt-8 xl:mt-0 xl:px-0">
          <div className="text-left mt-1 xxl:mt-24 lg:pt-6 z-10">
            <h3 className="font-googletexte text-2xl lg:text-3xl">
              <span className="text-3xl md:text-4xl font-googletitre text-coral dark:text-lightyellow font-medium">
                {variant.auditSubtitle}
              </span>
              {" "}
              <span className="text-white/70">
               rapide et personnalisé
              </span>
            </h3>
            <p className="text-white/70 text-lg md:text-xl mt-2 md:mb-8">
              {variant.auditDescription}
            </p>
          </div>
          <div style={{
          position: "absolute",
          top: 140,
          left: 0,
          width: "70vw",
          height: "100vh",
          zIndex: 0,
          overflow: "hidden",
          opacity: 0.4,
        }}
        className="md:top-[-120px]">
            <AiAuditBannerSVG />
          </div>
          <div className="w-full max-w-6xl mx-auto relative h-full overflow-hidden">
            <div className="relative z-10">
        <div className="relative md:max-w-5xl my-16 mx-0 md:mx-auto bg-darkblue/50 backdrop-blur-md border p-2 md:p-12 border-1 border-white/10 rounded-2xl">
        <GeminiSearch
          onResult={() => {}}
          prompt={prompt}
          systemInstruction={system_instruction}
          defaultUrl={url}
        />
        <div className="mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
            <div
              className="hidden md:flex flex-col items-center justify-center gap-3 backdrop-blur-sm rounded-xl px-4 py-4 border border-white/20 hover:bg-white/15 transition-all hover:scale-105"
            >
              <div className="w-40 h-40 rounded-lg flex items-center justify-center">
                <BrandLogo src="/img/logo-wordpress-blanc.webp" srcLight="/img/logo-wordpress-small.webp" alt="Logo WordPress" width={120} height={120} />
              </div>
            </div>
            <div
              className="hidden md:flex flex-col items-center justify-center gap-3 backdrop-blur-sm rounded-xl px-4 py-4 border border-white/20 hover:bg-white/15 transition-all hover:scale-105"
            >
              <div className="w-40 h-40 rounded-lg flex items-center justify-center">
                <BrandLogo src="/img/logo-nextjs-blanc.webp" srcLight="/img/logo-nextjs.webp" alt="Logo Next.js" width={120} height={120} />
              </div>
            </div>
            <div
              className="hidden md:flex flex-col items-center justify-center gap-3 backdrop-blur-sm rounded-xl px-4 py-4 border border-white/20 hover:bg-white/15 transition-all hover:scale-105"
            >
              <div className="w-40 h-40 rounded-lg flex items-center justify-center">
                <BrandLogo src="/img/logo-astro-blanc.webp" srcLight="/img/logo-astro.webp" alt="Logo Astro" width={120} height={120} />
              </div>
            </div>
        </div>
        </div>
      </div>
                  </div>
          </div>
      </section>
    </>
  );
}
