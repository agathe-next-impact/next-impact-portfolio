"use client";

import React, { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { EXPANDABLE_CARDS_VARIANTS } from "@/lib/homepage-profiles";
import type { ProfileId } from "@/lib/documentation-profiles";

// ─── Section titles per profile ─────────────────────────────────────────────

const SECTION_TITLES: Record<ProfileId | "default", { title: string; subtitle: string; tagline: string }> = {
  default: {
    title: "WordPress Headless :",
    subtitle: "quelques explications ?",
    tagline: "Un site combinant performance et le back-office le plus utilisé.",
  },
  decideur: {
    title: "WordPress Headless :",
    subtitle: "quel impact pour votre business ?",
    tagline: "Comprendre les gains stratégiques concrets pour votre organisation.",
  },
  utilisateur: {
    title: "WordPress Headless :",
    subtitle: "qu'est-ce qui change pour vous ?",
    tagline: "Tout ce que vous devez savoir pour gérer votre contenu sereinement.",
  },
  developpeur: {
    title: "WordPress Headless :",
    subtitle: "sous le capot",
    tagline: "Architecture, stack technique et bonnes pratiques d'implémentation.",
  },
};

// ─── Expanded content factories per profile ─────────────────────────────────

type ContentFactory = () => React.ReactNode;

const defaultContent: ContentFactory[] = [
  // Card 1: Fonctionnement du Headless
  () => (
    <div className="flex flex-col gap-12">
      <div className="mb-2 text-lg text-white/80">
        Le &quot;Headless&quot; (ou &quot;sans tête&quot;) est une manière moderne de concevoir
        un site web en séparant totalement deux éléments qui, auparavant,
        étaient soudés ensemble :
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        <div className="flex flex-col items-center bg-darkblue/70 rounded-xl p-4 w-60 shadow-md">
          <Image src="/icons/dashboard-icon.svg" alt="Backoffice" width={40} height={40} className="mb-2" />
          <span className="font-medium text-white font-googletitre text-2xl mb-1">Admin WordPress</span>
          <span className="text-base text-white/80 text-center">Gestion des contenus, médias, utilisateurs...</span>
        </div>
        <Image src="/icons/plugin-icon.svg" alt="Plugin" width={40} height={40} />
        <div className="flex flex-col items-center bg-darkblue/70 rounded-xl p-4 w-60 shadow-md">
          <Image src="/icons/desktop-headless-icon.svg" alt="Interface web" width={40} height={40} className="mb-2" />
          <span className="font-medium text-white font-googletitre text-2xl mb-1">Interface web</span>
          <span className="text-base text-white/80 text-center">Site, application, affichage public...</span>
        </div>
      </div>
      <div className="text-lg text-white/80">
        <div className="mb-2 font-medium text-white font-googletitre text-3xl">Le principe clé</div>
        Au lieu d&apos;avoir un outil rigide qui fait tout, vous avez deux
        systèmes spécialisés qui communiquent entre eux. Cela permet de
        changer le design de votre site sans jamais toucher à vos données,
        ou de diffuser le même contenu sur plusieurs écrans différents simultanément.
      </div>
    </div>
  ),
  // Card 2: Pourquoi choisir le Headless ?
  () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="text-lg text-white/80">
        <div className="font-googletitre text-3xl font-medium text-white">Le principe clé</div>
        <br />
        Bénéficier de l&apos;administration de WordPress tout en offrant une
        flexibilité maximale pour l&apos;interface client, des performances, des
        normes SEO et un sécurité optimisées.
      </div>
      <div className="flex flex-col md:flex-row items-center bg-darkblue/70 rounded-xl p-6 shadow-md h-full">
        <Image src="/icons/dashboard-icon.svg" alt="Admin WordPress" width={144} height={144} className="object-contain mb-2 w-20 md:w-36" />
        <div className="md:ml-6 flex flex-col">
          <span className="font-medium text-white font-googletitre text-2xl mb-4">Admin WordPress</span>
          <span className="text-sm text-white/80">Une interface familière garantissant une adoption immédiate et sans coût de formation supplémentaire.</span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center bg-darkblue/70 rounded-xl p-6 shadow-md h-full">
        <Image src="/icons/desktop-headless-icon.svg" alt="Liberté de design" width={144} height={144} className="object-contain mb-2 w-20 md:w-36" />
        <div className="md:ml-6 flex flex-col">
          <span className="font-medium text-white font-googletitre text-2xl mb-4">Liberté de design</span>
          <span className="text-sm text-white/80">Interface développée sur mesure, totalement libre, sans les limites ni la lourdeur des &quot;page builders&quot;.</span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center bg-darkblue/70 rounded-xl p-6 shadow-md h-full">
        <Image src="/icons/shield-icon.svg" alt="Sécurité totale" width={144} height={144} className="mb-4 w-20 md:w-36" />
        <div className="md:ml-6 flex flex-col">
          <span className="font-medium text-white font-googletitre text-2xl mb-1">Sécurité totale</span>
          <span className="text-sm text-white/80">Votre base de données devient invisible et inaccessible rendant les attaques traditionnelles impossibles.</span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center bg-darkblue/70 rounded-xl p-6 shadow-md h-full">
        <Image src="/icons/speed-icon.svg" alt="Vitesse fulgurante" width={144} height={144} className="mb-4 w-20 md:w-36" />
        <div className="md:ml-6 flex flex-col">
          <span className="font-medium text-white font-googletitre text-2xl mb-1">Vitesse fulgurante</span>
          <span className="text-sm text-white/80">Chargement des pages instantané, garantissant des indicateurs de performance (Core Web Vitals) au vert.</span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center bg-darkblue/70 rounded-xl p-6 shadow-md h-full">
        <Image src="/icons/globe-network-icon.svg" alt="SEO de haut niveau" width={144} height={144} className="mb-2 w-20 md:w-36" />
        <div className="md:ml-6 flex flex-col">
          <span className="font-medium text-white font-googletitre text-2xl mb-1">SEO de haut niveau</span>
          <span className="text-sm text-white/80">Grâce aux techniques de rendu moderne, les moteurs de recherche indexent votre contenu plus efficacement.</span>
        </div>
      </div>
    </div>
  ),
  // Card 3: Pour quels objectifs ?
  () => (
    <div className="flex flex-col gap-12">
      <div className="mb-2 text-lg text-white/80">
        L&apos;architecture Headless WordPress est puissante, mais elle n&apos;est pas
        nécessaire pour tous. Elle s&apos;adresse aux projets où le site web est
        un moteur de croissance critique et non une simple carte de visite.
      </div>
      <div className="grid md:grid-cols-2 gap-6 place-items-center items-start">
        <div className="col-span-1 space-y-12">
          <div className="flex flex-col gap-2 bg-mediumblue/10 rounded-xl w-full max-w-96 h-max shadow-md border border-lightyellow/20">
            <div className="w-full mb-2 px-2 py-1 rounded-t-xl bg-lightyellow text-darkblue font-googletitre font-semibold text-xl">PME</div>
            <div className="flex flex-col gap-2 px-4 pb-6">
              <div className="flex justify-end"><Image src="/icons/growth-icon.svg" alt="Passer à l'échelle" width={60} height={60} /></div>
              <h4 className="font-medium text-white font-googletitre text-2xl -mt-2 mb-1">Passer à l&apos;échelle</h4>
              <span className="text-base text-white/80 border-t-2 border-lightyellow pt-2">Pour répondre ou provoquer une croissance de l&apos;activité en alignant le site web avec les objectifs commerciaux.</span>
            </div>
          </div>
          <div className="flex flex-col gap-2 bg-mediumblue/10 rounded-xl w-full max-w-96 h-max shadow-md border border-lightyellow/20">
            <div className="w-full mb-2 px-2 py-1 rounded-t-xl bg-lightyellow text-darkblue font-googletitre font-semibold text-xl">PME</div>
            <div className="flex flex-col gap-2 px-4 pb-6">
              <div className="flex justify-end"><Image src="/icons/saas-features-icon.svg" alt="Proposer des services en ligne" width={60} height={60} /></div>
              <h4 className="font-medium text-white font-googletitre text-2xl -mt-2 mb-1">Proposer des services en ligne</h4>
              <span className="text-base text-white/80 border-t-2 border-lightyellow pt-2">Pour créer des offres en ligne ou des services associés, et renforcer l&apos;expérience client.</span>
            </div>
          </div>
        </div>
        <div className="col-span-1 space-y-12">
          <div className="flex flex-col bg-mediumblue rounded-xl w-full max-w-96 shadow-md border border-lightyellow/20">
            <div className="w-full mb-2 px-2 py-1 rounded-t-xl bg-coral text-darkblue font-googletitre font-semibold text-xl">ESS</div>
            <div className="flex flex-col gap-2 px-4 pb-6">
              <div className="flex justify-end"><Image src="/icons/brand-reach-icon.svg" alt="Gagner en autorité" width={60} height={60} /></div>
              <h4 className="font-medium text-coral font-googletitre text-2xl mb-1">Gagner en autorité</h4>
              <span className="text-base text-white/80 border-t-2 border-coral pt-2">Développer une image forte et crédible pour attirer des soutiens, partenaires et financements.</span>
            </div>
          </div>
          <div className="flex flex-col bg-mediumblue rounded-xl w-full max-w-96 shadow-md border border-lightyellow/20">
            <div className="w-full mb-2 px-2 py-1 rounded-t-xl bg-coral text-darkblue font-googletitre font-semibold text-xl">ESS</div>
            <div className="flex flex-col gap-2 px-4 pb-6">
              <div className="flex justify-end"><Image src="/icons/eco-design-icon.svg" alt="Montrer son engagement écologique" width={60} height={60} /></div>
              <h4 className="font-medium text-coral font-googletitre text-2xl mb-1">Montrer son engagement</h4>
              <span className="text-base text-white/80 border-t-2 border-coral pt-2">Réduire l&apos;empreinte environnementale numérique avec l&apos;écoconception.</span>
            </div>
          </div>
        </div>
      </div>
      <div className="text-lg text-white/80">
        <div className="mb-2 font-medium text-white font-googletitre text-3xl">Le principe clé</div>
        Idéal pour les PME et les organisations de l&apos;ESS cherchant à
        maximiser leur impact en ligne avec un budget maîtrisé. Lié à des
        besoins de performance, sécurité et flexibilité élevés pour
        développer et soutenir la croissance et l&apos;engagement.
      </div>
    </div>
  ),
];

// ─── Decideur content ───────────────────────────────────────────────────────

const decideurContent: ContentFactory[] = [
  // Card 1: Le headless, un avantage stratégique
  () => (
    <div className="flex flex-col gap-8">
      <div className="text-lg text-white/80">
        Dans un marché où la présence digitale est un facteur de différenciation, l&apos;architecture headless positionne votre site web comme un véritable outil de compétitivité.
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 shadow-md border border-orange/20">
          <span className="font-medium text-orange font-googletitre text-2xl mb-3">Agilité</span>
          <span className="text-sm text-white/80">Lancez de nouvelles pages, campagnes ou fonctionnalités sans attendre une refonte. Votre équipe marketing gagne en autonomie.</span>
        </div>
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 shadow-md border border-orange/20">
          <span className="font-medium text-orange font-googletitre text-2xl mb-3">Pérennité</span>
          <span className="text-sm text-white/80">Votre contenu et votre interface évoluent indépendamment. Pas de refonte totale : vous modernisez par itérations.</span>
        </div>
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 shadow-md border border-orange/20">
          <span className="font-medium text-orange font-googletitre text-2xl mb-3">Sécurité renforcée</span>
          <span className="text-sm text-white/80">Votre base de données est invisible pour les attaquants. Le risque de piratage est drastiquement réduit.</span>
        </div>
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 shadow-md border border-orange/20">
          <span className="font-medium text-orange font-googletitre text-2xl mb-3">Image premium</span>
          <span className="text-sm text-white/80">Un site instantané et fluide inspire confiance et professionnalisme auprès de vos clients et partenaires.</span>
        </div>
      </div>
    </div>
  ),
  // Card 2: ROI et performance business
  () => (
    <div className="flex flex-col gap-8">
      <div className="text-lg text-white/80">
        <div className="font-googletitre text-3xl font-medium text-white mb-4">Des résultats mesurables</div>
        Le passage au headless a un impact direct et quantifiable sur vos indicateurs business.
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center bg-darkblue/70 rounded-xl p-6 shadow-md text-center">
          <span className="font-googletitre text-4xl font-bold text-lightyellow mb-2">+40%</span>
          <span className="text-sm text-white/80">de vitesse de chargement en moyenne</span>
        </div>
        <div className="flex flex-col items-center bg-darkblue/70 rounded-xl p-6 shadow-md text-center">
          <span className="font-googletitre text-4xl font-bold text-lightyellow mb-2">-25%</span>
          <span className="text-sm text-white/80">de taux de rebond grâce à la fluidité</span>
        </div>
        <div className="flex flex-col items-center bg-darkblue/70 rounded-xl p-6 shadow-md text-center">
          <span className="font-googletitre text-4xl font-bold text-lightyellow mb-2">Top 3</span>
          <span className="text-sm text-white/80">positionnement SEO favorisé par Google</span>
        </div>
      </div>
      <div className="text-lg text-white/80">
        <div className="mb-2 font-medium text-white font-googletitre text-3xl">Investissement maîtrisé</div>
        La migration headless se fait progressivement. Pas besoin de tout reconstruire en une fois : vous investissez par étapes, avec un retour mesurable à chaque palier.
      </div>
    </div>
  ),
  // Card 3: Cas d'usage : croissance et investissement
  () => (
    <div className="flex flex-col gap-8">
      <div className="text-lg text-white/80">
        Le headless répond à des objectifs stratégiques concrets. Voici les cas les plus fréquents :
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 shadow-md border-l-4 border-orange">
          <span className="font-medium text-white font-googletitre text-xl mb-2">Accélérer la croissance</span>
          <span className="text-sm text-white/80">Votre site doit suivre le rythme de votre activité : nouvelles offres, nouveaux marchés, nouvelles audiences.</span>
        </div>
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 shadow-md border-l-4 border-orange">
          <span className="font-medium text-white font-googletitre text-xl mb-2">Réduire les coûts de maintenance</span>
          <span className="text-sm text-white/80">Moins de plugins, moins de failles, moins de mises à jour critiques. Le coût de possession diminue sur le long terme.</span>
        </div>
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 shadow-md border-l-4 border-coral">
          <span className="font-medium text-white font-googletitre text-xl mb-2">Gagner en crédibilité (ESS)</span>
          <span className="text-sm text-white/80">Un site performant et éco-conçu démontre votre engagement numérique responsable auprès de vos financeurs.</span>
        </div>
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 shadow-md border-l-4 border-coral">
          <span className="font-medium text-white font-googletitre text-xl mb-2">Digitaliser vos services</span>
          <span className="text-sm text-white/80">Proposez des espaces connectés, des formulaires dynamiques ou des outils en ligne intégrés à votre site.</span>
        </div>
      </div>
      <div className="mt-4">
        <Link href="/etudes-de-cas" className="inline-block px-5 py-2 rounded-2xl bg-orange text-darkblue font-googletitre font-semibold shadow hover:bg-orange/90 transition">
          Voir les études de cas
        </Link>
      </div>
    </div>
  ),
];

// ─── Utilisateur content ────────────────────────────────────────────────────

const utilisateurContent: ContentFactory[] = [
  // Card 1: WordPress reste votre outil
  () => (
    <div className="flex flex-col gap-8">
      <div className="text-lg text-white/80">
        La bonne nouvelle : vous continuez à utiliser WordPress exactement comme vous le faites déjà. L&apos;interface d&apos;administration ne change pas.
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        <div className="flex flex-col items-center bg-darkblue/70 rounded-xl p-6 w-72 shadow-md">
          <Image src="/icons/dashboard-icon.svg" alt="Admin WordPress" width={60} height={60} className="mb-3" />
          <span className="font-medium text-white font-googletitre text-2xl mb-2">Même interface</span>
          <span className="text-base text-white/80 text-center">Articles, pages, médias, menus... Tout est au même endroit.</span>
        </div>
        <div className="flex flex-col items-center bg-darkblue/70 rounded-xl p-6 w-72 shadow-md">
          <Image src="/icons/desktop-headless-icon.svg" alt="Résultat amélioré" width={60} height={60} className="mb-3" />
          <span className="font-medium text-white font-googletitre text-2xl mb-2">Meilleur résultat</span>
          <span className="text-base text-white/80 text-center">Votre contenu s&apos;affiche plus vite et plus joliment côté visiteur.</span>
        </div>
      </div>
      <div className="text-lg text-white/80">
        <div className="mb-2 font-medium text-white font-googletitre text-3xl">Zéro formation nécessaire</div>
        Si vous savez utiliser WordPress aujourd&apos;hui, vous saurez l&apos;utiliser demain en headless. La transition est transparente pour vous.
      </div>
    </div>
  ),
  // Card 2: Un site plus rapide pour vos visiteurs
  () => (
    <div className="flex flex-col gap-8">
      <div className="text-lg text-white/80">
        <div className="font-googletitre text-3xl font-medium text-white mb-4">L&apos;expérience visiteur transformée</div>
        Ce que vos visiteurs remarquent en premier : la rapidité. Un site headless charge en moins d&apos;une seconde.
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 shadow-md border border-regularblue/30">
          <span className="font-medium text-extralightblue font-googletitre text-2xl mb-3">Navigation fluide</span>
          <span className="text-sm text-white/80">Les pages se chargent instantanément, sans écran blanc. Vos visiteurs naviguent comme dans une application.</span>
        </div>
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 shadow-md border border-regularblue/30">
          <span className="font-medium text-extralightblue font-googletitre text-2xl mb-3">Meilleur référencement</span>
          <span className="text-sm text-white/80">Google favorise les sites rapides. Vos contenus remontent naturellement dans les résultats de recherche.</span>
        </div>
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 shadow-md border border-regularblue/30">
          <span className="font-medium text-extralightblue font-googletitre text-2xl mb-3">Mobile optimal</span>
          <span className="text-sm text-white/80">Même sur un réseau lent, votre site reste rapide et accessible pour tous vos visiteurs mobiles.</span>
        </div>
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 shadow-md border border-regularblue/30">
          <span className="font-medium text-extralightblue font-googletitre text-2xl mb-3">Plus d&apos;engagement</span>
          <span className="text-sm text-white/80">Les visiteurs restent plus longtemps, consultent plus de pages et reviennent plus souvent.</span>
        </div>
      </div>
    </div>
  ),
  // Card 3: Gérer votre contenu au quotidien
  () => (
    <div className="flex flex-col gap-8">
      <div className="text-lg text-white/80">
        Votre quotidien de gestionnaire de contenu devient plus agréable avec le headless :
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 shadow-md">
          <span className="font-medium text-white font-googletitre text-xl mb-2">Prévisualisation en temps réel</span>
          <span className="text-sm text-white/80">Voyez exactement le rendu final de votre contenu avant de le publier, directement depuis WordPress.</span>
        </div>
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 shadow-md">
          <span className="font-medium text-white font-googletitre text-xl mb-2">Gestion des médias simplifiée</span>
          <span className="text-sm text-white/80">Vos images sont automatiquement optimisées et redimensionnées. Plus besoin de vous soucier du poids des fichiers.</span>
        </div>
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 shadow-md">
          <span className="font-medium text-white font-googletitre text-xl mb-2">Workflow éditorial</span>
          <span className="text-sm text-white/80">Brouillon, relecture, publication : votre processus éditorial reste identique, avec la fiabilité en plus.</span>
        </div>
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 shadow-md">
          <span className="font-medium text-white font-googletitre text-xl mb-2">Publication sécurisée</span>
          <span className="text-sm text-white/80">Vos modifications sont publiées automatiquement et de manière fiable, sans risque de casser le site.</span>
        </div>
      </div>
      <div className="mt-4">
        <Link href="/demo" className="inline-block px-5 py-2 rounded-2xl bg-regularblue text-darkblue md:text-lg font-googletitre font-semibold shadow hover:shadow-[0_0_20px_rgba(31,84,191,0.45)] transition-all duration-300">
          Voir la démo
        </Link>
      </div>
    </div>
  ),
];

// ─── Developpeur content ────────────────────────────────────────────────────

const developpeurContent: ContentFactory[] = [
  // Card 1: Architecture découplée
  () => (
    <div className="flex flex-col gap-8">
      <div className="text-lg text-white/80">
        L&apos;architecture headless sépare le backend (WordPress) du frontend (Next.js/Astro) en communiquant via API.
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        <div className="flex flex-col items-center bg-darkblue/70 rounded-xl p-4 w-60 shadow-md border border-lightblue/30">
          <span className="font-medium text-lightblue font-googletitre text-xl mb-2">WordPress Backend</span>
          <span className="text-sm text-white/80 text-center font-mono">REST API / WPGraphQL<br/>CPT + ACF<br/>Auth JWT</span>
        </div>
        <div className="text-lightblue font-mono text-2xl">{`<->`}</div>
        <div className="flex flex-col items-center bg-darkblue/70 rounded-xl p-4 w-60 shadow-md border border-lightblue/30">
          <span className="font-medium text-lightblue font-googletitre text-xl mb-2">Frontend React</span>
          <span className="text-sm text-white/80 text-center font-mono">Next.js / Astro<br/>SSG + ISR + SSR<br/>Vercel Deploy</span>
        </div>
      </div>
      <div className="text-lg text-white/80">
        <div className="mb-2 font-medium text-white font-googletitre text-3xl">Principes fondamentaux</div>
        <ul className="list-disc pl-6 space-y-2 text-white/80">
          <li className="text-white/80">Séparation des responsabilités : le CMS gère le contenu, le frontend gère le rendu</li>
          <li className="text-white/80">Communication par API : REST ou GraphQL pour le data fetching</li>
          <li className="text-white/80">Déploiement indépendant : le frontend et le backend vivent sur des infrastructures séparées</li>
          <li className="text-white/80">Typage fort avec TypeScript pour une DX optimale</li>
        </ul>
      </div>
    </div>
  ),
  // Card 2: Stack technique et performance
  () => (
    <div className="flex flex-col gap-8">
      <div className="text-lg text-white/80">
        <div className="font-googletitre text-3xl font-medium text-white mb-4">Stack recommandée</div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 shadow-md border border-lightblue/20">
          <span className="font-medium text-lightblue font-googletitre text-xl mb-3">Next.js App Router</span>
          <span className="text-sm text-white/80">Server Components, streaming SSR, layout system. Le framework React de référence pour le headless WordPress.</span>
        </div>
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 shadow-md border border-lightblue/20">
          <span className="font-medium text-lightblue font-googletitre text-xl mb-3">Stratégies de rendu</span>
          <span className="text-sm text-white/80">SSG pour les pages statiques, ISR pour le contenu qui change, SSR pour le temps réel. Choisissez par page.</span>
        </div>
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 shadow-md border border-lightblue/20">
          <span className="font-medium text-lightblue font-googletitre text-xl mb-3">Core Web Vitals</span>
          <span className="text-sm text-white/80">LCP &lt; 2.5s, FID &lt; 100ms, CLS &lt; 0.1. Le headless vous donne le contrôle total sur ces métriques.</span>
        </div>
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 shadow-md border border-lightblue/20">
          <span className="font-medium text-lightblue font-googletitre text-xl mb-3">Tailwind + TypeScript</span>
          <span className="text-sm text-white/80">Styling utilitaire avec Tailwind CSS, typage strict avec TypeScript. Une DX moderne et productive.</span>
        </div>
      </div>
    </div>
  ),
  // Card 3: Implémentation de A à Z
  () => (
    <div className="flex flex-col gap-8">
      <div className="text-lg text-white/80">
        De la configuration initiale au déploiement en production, voici les étapes clés :
      </div>
      <div className="space-y-4">
        {[
          { step: "01", title: "Setup WordPress headless", desc: "Installer les plugins (WPGraphQL, ACF), configurer les CPT et les endpoints API." },
          { step: "02", title: "Initialiser le frontend Next.js", desc: "Créer le projet, connecter l'API WordPress, configurer TypeScript et Tailwind." },
          { step: "03", title: "Data fetching et rendu", desc: "Implémenter les fetchers, choisir SSG/ISR/SSR par route, gérer le cache et la revalidation." },
          { step: "04", title: "Authentification et preview", desc: "JWT pour les requêtes authentifiées, preview mode pour la prévisualisation éditoriale." },
          { step: "05", title: "Déploiement Vercel", desc: "CI/CD automatique, variables d'environnement, webhooks de revalidation depuis WordPress." },
        ].map((item) => (
          <div key={item.step} className="flex items-start gap-4 bg-darkblue/70 rounded-xl p-4 shadow-md border border-lightblue/10">
            <span className="font-mono text-lightblue text-2xl font-bold min-w-[3rem]">{item.step}</span>
            <div>
              <span className="font-medium text-white font-googletitre text-lg">{item.title}</span>
              <p className="text-sm text-white/80 mt-1">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <Link href="/documentation" className="inline-block px-5 py-2 rounded-2xl bg-lightblue text-darkblue font-googletitre font-semibold shadow hover:bg-lightblue/90 transition">
          Voir la documentation complète
        </Link>
      </div>
    </div>
  ),
];

// ─── Content map ────────────────────────────────────────────────────────────

const CONTENT_MAP: Record<ProfileId | "default", ContentFactory[]> = {
  default: defaultContent,
  decideur: decideurContent,
  utilisateur: utilisateurContent,
  developpeur: developpeurContent,
};

// ─── Component ──────────────────────────────────────────────────────────────

export function ExpandableCardDemo() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { profileId } = useDocumentationMode();

  const activeProfile = profileId || "default";
  const sectionTitle = SECTION_TITLES[activeProfile];
  const cardVariants = EXPANDABLE_CARDS_VARIANTS[activeProfile];
  const contentFactories = CONTENT_MAP[activeProfile];

  const activeCards = useMemo(
    () =>
      cardVariants.map((variant, i) => ({
        ...variant,
        content: contentFactories[i],
      })),
    [cardVariants, contentFactories]
  );

  return (
    <section className="relative my-12 md:my-48 py-12 md:py-24 bg-mediumblue/60 backdrop-blur-lg border-y border-white/10 mb-12 px-4 md:px-8 lg:px-16">
      <div className="pb-12 md:pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeProfile}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="font-googletexte text-4xl tracking-tight text-center text-white mb-2">
              {sectionTitle.title}{" "}
              <span className="font-googletitre text-lightyellow text-4xl md:text-5xl font-medium">
                {sectionTitle.subtitle}
              </span>
            </h2>
            <p className="font-normal text-lg text-center text-white/80">
              {sectionTitle.tagline}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      <AnimatePresence mode="wait">
        <motion.ul
          key={activeProfile}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="max-w-6xl mx-auto w-full flex flex-col gap-12"
        >
          {activeCards.map((card, idx) => (
            <li key={card.title} className="w-full">
              <button
                className="w-full p-4 flex flex-col md:flex-row justify-between items-center bg-darkblue/60 hover:bg-darkblue/50 backdrop-blur-xl rounded-xl cursor-pointer focus:outline-none border-1 border-white/20"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                aria-expanded={openIndex === idx}
                aria-controls={`panel-${idx}`}
              >
                <div className="flex md:gap-4 flex-col md:flex-row justify-between items-center wrap w-full">
                  <Image
                    width={100}
                    height={100}
                    src={card.src}
                    alt={card.title}
                    className="h-20 w-20 md:h-30 md:w-30 rounded-lg object-cover object-top hover:blur-sm transition-all duration-300"
                  />
                  <div className="flex flex-col items-center md:items-start justify-center flex-1">
                    <h3 className="font-medium text-lightyellow text-left text-3xl">
                      {card.title}
                    </h3>
                    <p className="text-white/70 text-base text-left">
                      {card.description}
                    </p>
                  </div>
                </div>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === idx && (
                  <motion.div
                    id={`panel-${idx}`}
                    initial={{ height: 0, opacity: 0, scale: 0.98 }}
                    animate={{ height: "auto", opacity: 1, scale: 1 }}
                    exit={{ height: 0, opacity: 0, scale: 0.98 }}
                    transition={{
                      height: { duration: 0.35, ease: "easeInOut" },
                      opacity: { duration: 0.25 },
                      scale: { duration: 0.25 },
                    }}
                    style={{ originY: 0.1 }}
                    className="overflow-hidden bg-darkblue/50 rounded-xl shadow-inner mt-4"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="flex flex-col md:flex-row p-6 gap-6">
                        <div className="flex-1 flex flex-col justify-center min-w-0">
                          <div className="overflow-auto flex flex-col gap-4">
                            {card.content()}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </section>
  );
}

export const ArrowTopRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    stroke="#021373"
    strokeWidth="2"
    className="inline-block"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7 17L17 7M7 7h10v10"
    />
  </svg>
);

export const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.05 } }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 text-black"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};
