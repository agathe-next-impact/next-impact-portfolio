"use client";

import React, { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { getExpandableCardsVariants } from "@/lib/homepage-profiles";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { ProfileId } from "@/lib/documentation-profiles";

// ─── Expanded content factories per profile ─────────────────────────────────

type ContentFactory = (isEn: boolean) => React.ReactNode;

const defaultContent: ContentFactory[] = [
  // Card 1: How Headless works
  (isEn) => (
    <div className="flex flex-col gap-12">
      <div className="mb-2 text-lg text-white/80">
        {isEn ? (
          <>
            &quot;Headless&quot; is a modern way to build a website by fully
            separating two pieces that used to be welded together:
          </>
        ) : (
          <>
            Le &quot;Headless&quot; (ou &quot;sans tête&quot;) est une manière moderne de concevoir
            un site web en séparant totalement deux éléments qui, auparavant,
            étaient soudés ensemble :
          </>
        )}
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        <div className="flex flex-col items-center bg-darkblue/70 rounded-xl p-4 w-60 ">
          <Image src="/icons/dashboard-icon.svg" alt={isEn ? "Back office" : "Backoffice"} width={40} height={40} className="mb-2" />
          <span className="font-medium text-white font-googletitre text-2xl mb-1">
            {isEn ? "WordPress admin" : "Admin WordPress"}
          </span>
          <span className="text-base text-white/80 text-center">
            {isEn
              ? "Content, media, users management…"
              : "Gestion des contenus, médias, utilisateurs..."}
          </span>
        </div>
        <Image src="/icons/plugin-icon.svg" alt="Plugin" width={40} height={40} />
        <div className="flex flex-col items-center bg-darkblue/70 rounded-xl p-4 w-60 ">
          <Image src="/icons/desktop-headless-icon.svg" alt={isEn ? "Web interface" : "Interface web"} width={40} height={40} className="mb-2" />
          <span className="font-medium text-white font-googletitre text-2xl mb-1">
            {isEn ? "Web interface" : "Interface web"}
          </span>
          <span className="text-base text-white/80 text-center">
            {isEn
              ? "Site, app, public-facing display…"
              : "Site, application, affichage public..."}
          </span>
        </div>
      </div>
      <div className="text-lg text-white/80">
        <div className="mb-2 font-medium text-white font-googletitre text-3xl">
          {isEn ? "The key principle" : "Le principe clé"}
        </div>
        {isEn
          ? "Instead of one rigid tool that does everything, you get two specialized systems that talk to each other. You can change the design of your site without ever touching the data, or push the same content to several different displays simultaneously."
          : "Au lieu d'avoir un outil rigide qui fait tout, vous avez deux systèmes spécialisés qui communiquent entre eux. Cela permet de changer le design de votre site sans jamais toucher à vos données, ou de diffuser le même contenu sur plusieurs écrans différents simultanément."}
      </div>
    </div>
  ),
  // Card 2: Why choose Headless?
  (isEn) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="text-lg text-white/80">
        <div className="font-googletitre text-3xl font-medium text-white">
          {isEn ? "The key principle" : "Le principe clé"}
        </div>
        <br />
        {isEn
          ? "Get the WordPress admin you know, with maximum flexibility for the user-facing interface, plus optimized performance, SEO and security."
          : "Bénéficier de l'administration de WordPress tout en offrant une flexibilité maximale pour l'interface client, des performances, des normes SEO et un sécurité optimisées."}
      </div>
      <div className="flex flex-col md:flex-row items-center bg-darkblue/70 rounded-xl p-6 h-full">
        <Image src="/icons/dashboard-icon.svg" alt={isEn ? "WordPress admin" : "Admin WordPress"} width={144} height={144} className="object-contain mb-2 w-20 md:w-36" />
        <div className="md:ml-6 flex flex-col">
          <span className="font-medium text-white font-googletitre text-2xl mb-4">
            {isEn ? "WordPress admin" : "Admin WordPress"}
          </span>
          <span className="text-sm text-white/80">
            {isEn
              ? "A familiar interface for instant adoption with no extra training cost."
              : "Une interface familière garantissant une adoption immédiate et sans coût de formation supplémentaire."}
          </span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center bg-darkblue/70 rounded-xl p-6 h-full">
        <Image src="/icons/desktop-headless-icon.svg" alt={isEn ? "Design freedom" : "Liberté de design"} width={144} height={144} className="object-contain mb-2 w-20 md:w-36" />
        <div className="md:ml-6 flex flex-col">
          <span className="font-medium text-white font-googletitre text-2xl mb-4">
            {isEn ? "Design freedom" : "Liberté de design"}
          </span>
          <span className="text-sm text-white/80">
            {isEn
              ? "Custom-built interface, fully free, without the limits or weight of page builders."
              : "Interface développée sur mesure, totalement libre, sans les limites ni la lourdeur des \"page builders\"."}
          </span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center bg-darkblue/70 rounded-xl p-6 h-full">
        <Image src="/icons/shield-icon.svg" alt={isEn ? "Total security" : "Sécurité totale"} width={144} height={144} className="mb-4 w-20 md:w-36" />
        <div className="md:ml-6 flex flex-col">
          <span className="font-medium text-white font-googletitre text-2xl mb-1">
            {isEn ? "Total security" : "Sécurité totale"}
          </span>
          <span className="text-sm text-white/80">
            {isEn
              ? "Your database becomes invisible and inaccessible — traditional attacks are impossible."
              : "Votre base de données devient invisible et inaccessible rendant les attaques traditionnelles impossibles."}
          </span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center bg-darkblue/70 rounded-xl p-6 h-full">
        <Image src="/icons/speed-icon.svg" alt={isEn ? "Lightning speed" : "Vitesse fulgurante"} width={144} height={144} className="mb-4 w-20 md:w-36" />
        <div className="md:ml-6 flex flex-col">
          <span className="font-medium text-white font-googletitre text-2xl mb-1">
            {isEn ? "Lightning speed" : "Vitesse fulgurante"}
          </span>
          <span className="text-sm text-white/80">
            {isEn
              ? "Instant page loads, with green Core Web Vitals as the baseline."
              : "Chargement des pages instantané, garantissant des indicateurs de performance (Core Web Vitals) au vert."}
          </span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center bg-darkblue/70 rounded-xl p-6 h-full">
        <Image src="/icons/globe-network-icon.svg" alt={isEn ? "Top-tier SEO" : "SEO de haut niveau"} width={144} height={144} className="mb-2 w-20 md:w-36" />
        <div className="md:ml-6 flex flex-col">
          <span className="font-medium text-white font-googletitre text-2xl mb-1">
            {isEn ? "Top-tier SEO" : "SEO de haut niveau"}
          </span>
          <span className="text-sm text-white/80">
            {isEn
              ? "Modern rendering techniques let search engines index your content more efficiently."
              : "Grâce aux techniques de rendu moderne, les moteurs de recherche indexent votre contenu plus efficacement."}
          </span>
        </div>
      </div>
    </div>
  ),
  // Card 3: For which goals?
  (isEn) => (
    <div className="flex flex-col gap-12">
      <div className="mb-2 text-lg text-white/80">
        {isEn
          ? "Headless WordPress is powerful, but not necessary for everyone. It targets projects where the website is a critical growth engine, not just a business card."
          : "L'architecture Headless WordPress est puissante, mais elle n'est pas nécessaire pour tous. Elle s'adresse aux projets où le site web est un moteur de croissance critique et non une simple carte de visite."}
      </div>
      <div className="grid md:grid-cols-2 gap-6 place-items-center items-start">
        <div className="col-span-1 space-y-12">
          <div className="flex flex-col gap-2 bg-mediumblue/10 rounded-xl w-full max-w-96 h-max border border-lightyellow/20">
            <div className="w-full mb-2 px-2 py-1 rounded-t-xl bg-lightyellow text-darkblue font-googletitre font-semibold text-xl">{isEn ? "SME" : "PME"}</div>
            <div className="flex flex-col gap-2 px-4 pb-6">
              <div className="flex justify-end"><Image src="/icons/growth-icon.svg" alt={isEn ? "Scale up" : "Passer à l'échelle"} width={60} height={60} /></div>
              <h4 className="font-medium text-white font-googletitre text-2xl -mt-2 mb-1">
                {isEn ? "Scale up" : "Passer à l'échelle"}
              </h4>
              <span className="text-base text-white/80 border-t-2 border-lightyellow pt-2">
                {isEn
                  ? "To meet or drive business growth by aligning the website with commercial goals."
                  : "Pour répondre ou provoquer une croissance de l'activité en alignant le site web avec les objectifs commerciaux."}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2 bg-mediumblue/10 rounded-xl w-full max-w-96 h-max border border-lightyellow/20">
            <div className="w-full mb-2 px-2 py-1 rounded-t-xl bg-lightyellow text-darkblue font-googletitre font-semibold text-xl">{isEn ? "SME" : "PME"}</div>
            <div className="flex flex-col gap-2 px-4 pb-6">
              <div className="flex justify-end"><Image src="/icons/saas-features-icon.svg" alt={isEn ? "Offer online services" : "Proposer des services en ligne"} width={60} height={60} /></div>
              <h4 className="font-medium text-white font-googletitre text-2xl -mt-2 mb-1">
                {isEn ? "Offer online services" : "Proposer des services en ligne"}
              </h4>
              <span className="text-base text-white/80 border-t-2 border-lightyellow pt-2">
                {isEn
                  ? "To create online offers or related services and reinforce the customer experience."
                  : "Pour créer des offres en ligne ou des services associés, et renforcer l'expérience client."}
              </span>
            </div>
          </div>
        </div>
        <div className="col-span-1 space-y-12">
          <div className="flex flex-col bg-mediumblue rounded-xl w-full max-w-96 border border-lightyellow/20">
            <div className="w-full mb-2 px-2 py-1 rounded-t-xl bg-coral text-darkblue font-googletitre font-semibold text-xl">{isEn ? "Social economy" : "ESS"}</div>
            <div className="flex flex-col gap-2 px-4 pb-6">
              <div className="flex justify-end"><Image src="/icons/brand-reach-icon.svg" alt={isEn ? "Build authority" : "Gagner en autorité"} width={60} height={60} /></div>
              <h4 className="font-medium text-coral font-googletitre text-2xl mb-1">
                {isEn ? "Build authority" : "Gagner en autorité"}
              </h4>
              <span className="text-base text-white/80 border-t-2 border-coral pt-2">
                {isEn
                  ? "Develop a strong, credible image to attract supporters, partners and funding."
                  : "Développer une image forte et crédible pour attirer des soutiens, partenaires et financements."}
              </span>
            </div>
          </div>
          <div className="flex flex-col bg-mediumblue rounded-xl w-full max-w-96 border border-lightyellow/20">
            <div className="w-full mb-2 px-2 py-1 rounded-t-xl bg-coral text-darkblue font-googletitre font-semibold text-xl">{isEn ? "Social economy" : "ESS"}</div>
            <div className="flex flex-col gap-2 px-4 pb-6">
              <div className="flex justify-end"><Image src="/icons/eco-design-icon.svg" alt={isEn ? "Show your commitment" : "Montrer son engagement écologique"} width={60} height={60} /></div>
              <h4 className="font-medium text-coral font-googletitre text-2xl mb-1">
                {isEn ? "Show your commitment" : "Montrer son engagement"}
              </h4>
              <span className="text-base text-white/80 border-t-2 border-coral pt-2">
                {isEn
                  ? "Reduce digital environmental footprint with eco-design."
                  : "Réduire l'empreinte environnementale numérique avec l'écoconception."}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="text-lg text-white/80">
        <div className="mb-2 font-medium text-white font-googletitre text-3xl">
          {isEn ? "The key principle" : "Le principe clé"}
        </div>
        {isEn
          ? "Ideal for SMEs and social-economy organizations that want to maximize their online impact within a controlled budget. Tied to needs for high performance, security and flexibility to support growth and engagement."
          : "Idéal pour les PME et les organisations de l'ESS cherchant à maximiser leur impact en ligne avec un budget maîtrisé. Lié à des besoins de performance, sécurité et flexibilité élevés pour développer et soutenir la croissance et l'engagement."}
      </div>
    </div>
  ),
];

// ─── Decideur content ───────────────────────────────────────────────────────

const decideurContent: ContentFactory[] = [
  // Card 1: Headless as a strategic edge
  (isEn) => (
    <div className="flex flex-col gap-8">
      <div className="text-lg text-white/80">
        {isEn
          ? "In a market where digital presence is a differentiator, headless architecture turns your website into a real competitive tool."
          : "Dans un marché où la présence digitale est un facteur de différenciation, l'architecture headless positionne votre site web comme un véritable outil de compétitivité."}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 border border-orange/20">
          <span className="font-medium text-orange font-googletitre text-2xl mb-3">{isEn ? "Agility" : "Agilité"}</span>
          <span className="text-sm text-white/80">
            {isEn
              ? "Ship new pages, campaigns or features without waiting for a redesign. Your marketing team gains autonomy."
              : "Lancez de nouvelles pages, campagnes ou fonctionnalités sans attendre une refonte. Votre équipe marketing gagne en autonomie."}
          </span>
        </div>
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 border border-orange/20">
          <span className="font-medium text-orange font-googletitre text-2xl mb-3">{isEn ? "Longevity" : "Pérennité"}</span>
          <span className="text-sm text-white/80">
            {isEn
              ? "Your content and your interface evolve independently. No full redesign — you modernize iteratively."
              : "Votre contenu et votre interface évoluent indépendamment. Pas de refonte totale : vous modernisez par itérations."}
          </span>
        </div>
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 border border-orange/20">
          <span className="font-medium text-orange font-googletitre text-2xl mb-3">{isEn ? "Stronger security" : "Sécurité renforcée"}</span>
          <span className="text-sm text-white/80">
            {isEn
              ? "Your database is invisible to attackers. Hacking risk is drastically reduced."
              : "Votre base de données est invisible pour les attaquants. Le risque de piratage est drastiquement réduit."}
          </span>
        </div>
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 border border-orange/20">
          <span className="font-medium text-orange font-googletitre text-2xl mb-3">{isEn ? "Premium image" : "Image premium"}</span>
          <span className="text-sm text-white/80">
            {isEn
              ? "An instant, fluid site inspires confidence and professionalism with clients and partners."
              : "Un site instantané et fluide inspire confiance et professionnalisme auprès de vos clients et partenaires."}
          </span>
        </div>
      </div>
    </div>
  ),
  // Card 2: ROI and business performance
  (isEn) => (
    <div className="flex flex-col gap-8">
      <div className="text-lg text-white/80">
        <div className="font-googletitre text-3xl font-medium text-white mb-4">
          {isEn ? "Measurable results" : "Des résultats mesurables"}
        </div>
        {isEn
          ? "Going headless has a direct, quantifiable impact on your business metrics."
          : "Le passage au headless a un impact direct et quantifiable sur vos indicateurs business."}
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="flex flex-col items-center bg-darkblue/70 rounded-xl p-6 text-center">
          <span className="font-googletitre text-4xl font-bold text-lightyellow mb-2">+40%</span>
          <span className="text-sm text-white/80">{isEn ? "average load-speed gain" : "de vitesse de chargement en moyenne"}</span>
        </div>
        <div className="flex flex-col items-center bg-darkblue/70 rounded-xl p-6 text-center">
          <span className="font-googletitre text-4xl font-bold text-lightyellow mb-2">-25%</span>
          <span className="text-sm text-white/80">{isEn ? "lower bounce rate thanks to fluidity" : "de taux de rebond grâce à la fluidité"}</span>
        </div>
        <div className="flex flex-col items-center bg-darkblue/70 rounded-xl p-6 text-center">
          <span className="font-googletitre text-4xl font-bold text-lightyellow mb-2">Top 3</span>
          <span className="text-sm text-white/80">{isEn ? "SEO ranking favored by Google" : "positionnement SEO favorisé par Google"}</span>
        </div>
      </div>
      <div className="text-lg text-white/80">
        <div className="mb-2 font-medium text-white font-googletitre text-3xl">
          {isEn ? "Controlled investment" : "Investissement maîtrisé"}
        </div>
        {isEn
          ? "Headless migration is gradual. No need to rebuild everything at once: you invest in stages, with measurable returns at each step."
          : "La migration headless se fait progressivement. Pas besoin de tout reconstruire en une fois : vous investissez par étapes, avec un retour mesurable à chaque palier."}
      </div>
    </div>
  ),
  // Card 3: Use cases — growth and investment
  (isEn) => (
    <div className="flex flex-col gap-8">
      <div className="text-lg text-white/80">
        {isEn
          ? "Headless answers concrete strategic objectives. Here are the most common cases:"
          : "Le headless répond à des objectifs stratégiques concrets. Voici les cas les plus fréquents :"}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 border-l-4 border-orange">
          <span className="font-medium text-white font-googletitre text-xl mb-2">
            {isEn ? "Accelerate growth" : "Accélérer la croissance"}
          </span>
          <span className="text-sm text-white/80">
            {isEn
              ? "Your site must keep pace with your business: new offerings, new markets, new audiences."
              : "Votre site doit suivre le rythme de votre activité : nouvelles offres, nouveaux marchés, nouvelles audiences."}
          </span>
        </div>
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 border-l-4 border-orange">
          <span className="font-medium text-white font-googletitre text-xl mb-2">
            {isEn ? "Reduce maintenance costs" : "Réduire les coûts de maintenance"}
          </span>
          <span className="text-sm text-white/80">
            {isEn
              ? "Fewer plugins, fewer vulnerabilities, fewer critical updates. Total cost of ownership drops over time."
              : "Moins de plugins, moins de failles, moins de mises à jour critiques. Le coût de possession diminue sur le long terme."}
          </span>
        </div>
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 border-l-4 border-coral">
          <span className="font-medium text-white font-googletitre text-xl mb-2">
            {isEn ? "Build credibility (social economy)" : "Gagner en crédibilité (ESS)"}
          </span>
          <span className="text-sm text-white/80">
            {isEn
              ? "A performant, eco-designed site demonstrates your responsible digital commitment to funders."
              : "Un site performant et éco-conçu démontre votre engagement numérique responsable auprès de vos financeurs."}
          </span>
        </div>
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 border-l-4 border-coral">
          <span className="font-medium text-white font-googletitre text-xl mb-2">
            {isEn ? "Digitize your services" : "Digitaliser vos services"}
          </span>
          <span className="text-sm text-white/80">
            {isEn
              ? "Offer connected spaces, dynamic forms or online tools embedded in your site."
              : "Proposez des espaces connectés, des formulaires dynamiques ou des outils en ligne intégrés à votre site."}
          </span>
        </div>
      </div>
      <div className="mt-4">
        <Link href="/etudes-de-cas" className="inline-block px-5 py-2 rounded-full bg-orange text-darkblue font-googletitre font-semibold hover:bg-orange/90 transition">
          {isEn ? "View case studies" : "Voir les études de cas"}
        </Link>
      </div>
    </div>
  ),
];

// ─── Utilisateur content ────────────────────────────────────────────────────

const utilisateurContent: ContentFactory[] = [
  // Card 1: WordPress remains your tool
  (isEn) => (
    <div className="flex flex-col gap-8">
      <div className="text-lg text-white/80">
        {isEn
          ? "Good news: you keep using WordPress exactly the way you do today. The admin interface doesn't change."
          : "La bonne nouvelle : vous continuez à utiliser WordPress exactement comme vous le faites déjà. L'interface d'administration ne change pas."}
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        <div className="flex flex-col items-center bg-darkblue/70 rounded-xl p-6 w-72 ">
          <Image src="/icons/dashboard-icon.svg" alt={isEn ? "WordPress admin" : "Admin WordPress"} width={60} height={60} className="mb-3" />
          <span className="font-medium text-white font-googletitre text-2xl mb-2">
            {isEn ? "Same interface" : "Même interface"}
          </span>
          <span className="text-base text-white/80 text-center">
            {isEn
              ? "Posts, pages, media, menus… everything stays in the same place."
              : "Articles, pages, médias, menus... Tout est au même endroit."}
          </span>
        </div>
        <div className="flex flex-col items-center bg-darkblue/70 rounded-xl p-6 w-72 ">
          <Image src="/icons/desktop-headless-icon.svg" alt={isEn ? "Better outcome" : "Résultat amélioré"} width={60} height={60} className="mb-3" />
          <span className="font-medium text-white font-googletitre text-2xl mb-2">
            {isEn ? "Better outcome" : "Meilleur résultat"}
          </span>
          <span className="text-base text-white/80 text-center">
            {isEn
              ? "Your content displays faster and more beautifully on the visitor side."
              : "Votre contenu s'affiche plus vite et plus joliment côté visiteur."}
          </span>
        </div>
      </div>
      <div className="text-lg text-white/80">
        <div className="mb-2 font-medium text-white font-googletitre text-3xl">
          {isEn ? "Zero training required" : "Zéro formation nécessaire"}
        </div>
        {isEn
          ? "If you know how to use WordPress today, you'll know how to use it tomorrow in headless. The transition is transparent for you."
          : "Si vous savez utiliser WordPress aujourd'hui, vous saurez l'utiliser demain en headless. La transition est transparente pour vous."}
      </div>
    </div>
  ),
  // Card 2: A faster site for your visitors
  (isEn) => (
    <div className="flex flex-col gap-8">
      <div className="text-lg text-white/80">
        <div className="font-googletitre text-3xl font-medium text-white mb-4">
          {isEn ? "The visitor experience, transformed" : "L'expérience visiteur transformée"}
        </div>
        {isEn
          ? "What your visitors notice first: speed. A headless site loads in under a second."
          : "Ce que vos visiteurs remarquent en premier : la rapidité. Un site headless charge en moins d'une seconde."}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 border border-regularblue/30">
          <span className="font-medium text-extralightblue font-googletitre text-2xl mb-3">
            {isEn ? "Smooth navigation" : "Navigation fluide"}
          </span>
          <span className="text-sm text-white/80">
            {isEn
              ? "Pages load instantly with no white screens. Your visitors browse like they're inside an app."
              : "Les pages se chargent instantanément, sans écran blanc. Vos visiteurs naviguent comme dans une application."}
          </span>
        </div>
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 border border-regularblue/30">
          <span className="font-medium text-extralightblue font-googletitre text-2xl mb-3">
            {isEn ? "Better SEO" : "Meilleur référencement"}
          </span>
          <span className="text-sm text-white/80">
            {isEn
              ? "Google favors fast sites. Your content rises naturally in search results."
              : "Google favorise les sites rapides. Vos contenus remontent naturellement dans les résultats de recherche."}
          </span>
        </div>
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 border border-regularblue/30">
          <span className="font-medium text-extralightblue font-googletitre text-2xl mb-3">
            {isEn ? "Optimal mobile" : "Mobile optimal"}
          </span>
          <span className="text-sm text-white/80">
            {isEn
              ? "Even on slow networks, your site stays fast and accessible for all your mobile visitors."
              : "Même sur un réseau lent, votre site reste rapide et accessible pour tous vos visiteurs mobiles."}
          </span>
        </div>
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 border border-regularblue/30">
          <span className="font-medium text-extralightblue font-googletitre text-2xl mb-3">
            {isEn ? "More engagement" : "Plus d'engagement"}
          </span>
          <span className="text-sm text-white/80">
            {isEn
              ? "Visitors stay longer, view more pages and come back more often."
              : "Les visiteurs restent plus longtemps, consultent plus de pages et reviennent plus souvent."}
          </span>
        </div>
      </div>
    </div>
  ),
  // Card 3: Manage content day-to-day
  (isEn) => (
    <div className="flex flex-col gap-8">
      <div className="text-lg text-white/80">
        {isEn
          ? "Your content-management routine becomes more pleasant with headless:"
          : "Votre quotidien de gestionnaire de contenu devient plus agréable avec le headless :"}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 ">
          <span className="font-medium text-white font-googletitre text-xl mb-2">
            {isEn ? "Real-time preview" : "Prévisualisation en temps réel"}
          </span>
          <span className="text-sm text-white/80">
            {isEn
              ? "See exactly the final rendering of your content before publishing — directly from WordPress."
              : "Voyez exactement le rendu final de votre contenu avant de le publier, directement depuis WordPress."}
          </span>
        </div>
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 ">
          <span className="font-medium text-white font-googletitre text-xl mb-2">
            {isEn ? "Simplified media management" : "Gestion des médias simplifiée"}
          </span>
          <span className="text-sm text-white/80">
            {isEn
              ? "Your images are automatically optimized and resized. No more worrying about file weight."
              : "Vos images sont automatiquement optimisées et redimensionnées. Plus besoin de vous soucier du poids des fichiers."}
          </span>
        </div>
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 ">
          <span className="font-medium text-white font-googletitre text-xl mb-2">
            {isEn ? "Editorial workflow" : "Workflow éditorial"}
          </span>
          <span className="text-sm text-white/80">
            {isEn
              ? "Draft, review, publish: your editorial process stays the same, with added reliability."
              : "Brouillon, relecture, publication : votre processus éditorial reste identique, avec la fiabilité en plus."}
          </span>
        </div>
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 ">
          <span className="font-medium text-white font-googletitre text-xl mb-2">
            {isEn ? "Safe publishing" : "Publication sécurisée"}
          </span>
          <span className="text-sm text-white/80">
            {isEn
              ? "Your changes are published automatically and reliably, with no risk of breaking the site."
              : "Vos modifications sont publiées automatiquement et de manière fiable, sans risque de casser le site."}
          </span>
        </div>
      </div>
      <div className="mt-4">
        <Link href="/demo" className="inline-block px-5 py-2 rounded-full bg-regularblue text-darkblue md:text-lg font-googletitre font-semibold transition-all duration-300">
          {isEn ? "View the demo" : "Voir la démo"}
        </Link>
      </div>
    </div>
  ),
];

// ─── Developpeur content ────────────────────────────────────────────────────

const developpeurContent: ContentFactory[] = [
  // Card 1: Decoupled architecture
  (isEn) => (
    <div className="flex flex-col gap-8">
      <div className="text-lg text-white/80">
        {isEn
          ? "Headless architecture separates the backend (WordPress) from the frontend (Next.js), communicating via API."
          : "L'architecture headless sépare le backend (WordPress) du frontend (Next.js) en communiquant via API."}
      </div>
      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        <div className="flex flex-col items-center bg-darkblue/70 rounded-xl p-4 w-60 border border-lightblue/30">
          <span className="font-medium text-lightblue font-googletitre text-xl mb-2">WordPress Backend</span>
          <span className="text-sm text-white/80 text-center font-mono">REST API / WPGraphQL<br/>CPT + ACF<br/>Auth JWT</span>
        </div>
        <div className="text-lightblue font-mono text-2xl">{`<->`}</div>
        <div className="flex flex-col items-center bg-darkblue/70 rounded-xl p-4 w-60 border border-lightblue/30">
          <span className="font-medium text-lightblue font-googletitre text-xl mb-2">Frontend Next.js</span>
          <span className="text-sm text-white/80 text-center font-mono">Next.js App Router<br/>SSG + ISR + SSR<br/>Vercel Deploy</span>
        </div>
      </div>
      <div className="text-lg text-white/80">
        <div className="mb-2 font-medium text-white font-googletitre text-3xl">
          {isEn ? "Core principles" : "Principes fondamentaux"}
        </div>
        <ul className="list-disc pl-6 space-y-2 text-white/80">
          <li className="text-white/80">
            {isEn
              ? "Separation of concerns: the CMS handles content, the frontend handles rendering"
              : "Séparation des responsabilités : le CMS gère le contenu, le frontend gère le rendu"}
          </li>
          <li className="text-white/80">
            {isEn
              ? "API-driven communication: REST or GraphQL for data fetching"
              : "Communication par API : REST ou GraphQL pour le data fetching"}
          </li>
          <li className="text-white/80">
            {isEn
              ? "Independent deployment: frontend and backend live on separate infrastructures"
              : "Déploiement indépendant : le frontend et le backend vivent sur des infrastructures séparées"}
          </li>
          <li className="text-white/80">
            {isEn
              ? "Strong typing with TypeScript for an optimal DX"
              : "Typage fort avec TypeScript pour une DX optimale"}
          </li>
        </ul>
      </div>
    </div>
  ),
  // Card 2: Stack and performance
  (isEn) => (
    <div className="flex flex-col gap-8">
      <div className="text-lg text-white/80">
        <div className="font-googletitre text-3xl font-medium text-white mb-4">
          {isEn ? "Recommended stack" : "Stack recommandée"}
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 border border-lightblue/20">
          <span className="font-medium text-lightblue font-googletitre text-xl mb-3">Next.js App Router</span>
          <span className="text-sm text-white/80">
            {isEn
              ? "Server Components, streaming SSR, layout system. The de-facto React framework for headless WordPress."
              : "Server Components, streaming SSR, layout system. Le framework React de référence pour le headless WordPress."}
          </span>
        </div>
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 border border-lightblue/20">
          <span className="font-medium text-lightblue font-googletitre text-xl mb-3">
            {isEn ? "Rendering strategies" : "Stratégies de rendu"}
          </span>
          <span className="text-sm text-white/80">
            {isEn
              ? "SSG for static pages, ISR for content that changes, SSR for real-time. Choose per page."
              : "SSG pour les pages statiques, ISR pour le contenu qui change, SSR pour le temps réel. Choisissez par page."}
          </span>
        </div>
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 border border-lightblue/20">
          <span className="font-medium text-lightblue font-googletitre text-xl mb-3">Core Web Vitals</span>
          <span className="text-sm text-white/80">
            {isEn
              ? "LCP < 2.5s, FID < 100ms, CLS < 0.1. Headless gives you full control over these metrics."
              : "LCP < 2.5s, FID < 100ms, CLS < 0.1. Le headless vous donne le contrôle total sur ces métriques."}
          </span>
        </div>
        <div className="flex flex-col bg-darkblue/70 rounded-xl p-6 border border-lightblue/20">
          <span className="font-medium text-lightblue font-googletitre text-xl mb-3">Tailwind + TypeScript</span>
          <span className="text-sm text-white/80">
            {isEn
              ? "Utility-first styling with Tailwind, strict typing with TypeScript. A modern, productive DX."
              : "Styling utilitaire avec Tailwind CSS, typage strict avec TypeScript. Une DX moderne et productive."}
          </span>
        </div>
      </div>
    </div>
  ),
  // Card 3: End-to-end implementation
  (isEn) => {
    const steps = isEn
      ? [
          { step: "01", title: "Set up headless WordPress", desc: "Install plugins (WPGraphQL, ACF), configure CPTs and API endpoints." },
          { step: "02", title: "Initialize the Next.js frontend", desc: "Create the project, connect to the WordPress API, configure TypeScript and Tailwind." },
          { step: "03", title: "Data fetching and rendering", desc: "Implement fetchers, choose SSG/ISR/SSR per route, manage cache and revalidation." },
          { step: "04", title: "Authentication and preview", desc: "JWT for authenticated requests, preview mode for editorial previews." },
          { step: "05", title: "Vercel deployment", desc: "Automatic CI/CD, environment variables, revalidation webhooks from WordPress." },
        ]
      : [
          { step: "01", title: "Setup WordPress headless", desc: "Installer les plugins (WPGraphQL, ACF), configurer les CPT et les endpoints API." },
          { step: "02", title: "Initialiser le frontend Next.js", desc: "Créer le projet, connecter l'API WordPress, configurer TypeScript et Tailwind." },
          { step: "03", title: "Data fetching et rendu", desc: "Implémenter les fetchers, choisir SSG/ISR/SSR par route, gérer le cache et la revalidation." },
          { step: "04", title: "Authentification et preview", desc: "JWT pour les requêtes authentifiées, preview mode pour la prévisualisation éditoriale." },
          { step: "05", title: "Déploiement Vercel", desc: "CI/CD automatique, variables d'environnement, webhooks de revalidation depuis WordPress." },
        ];
    return (
      <div className="flex flex-col gap-8">
        <div className="text-lg text-white/80">
          {isEn
            ? "From initial setup to production deployment, here are the key steps:"
            : "De la configuration initiale au déploiement en production, voici les étapes clés :"}
        </div>
        <div className="space-y-4">
          {steps.map((item) => (
            <div key={item.step} className="flex items-start gap-4 bg-darkblue/70 rounded-xl p-4 border border-lightblue/10">
              <span className="font-mono text-lightblue text-2xl font-bold min-w-[3rem]">{item.step}</span>
              <div>
                <span className="font-medium text-white font-googletitre text-lg">{item.title}</span>
                <p className="text-sm text-white/80 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Link href="/documentation" className="inline-block px-5 py-2 rounded-full bg-lightblue text-darkblue font-googletitre font-semibold hover:bg-lightblue/90 transition">
            {isEn ? "View full documentation" : "Voir la documentation complète"}
          </Link>
        </div>
      </div>
    );
  },
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
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const t = useTranslations("expandableCards");

  const activeProfile = profileId || "default";
  const sectionTitle = {
    title: t(`${activeProfile}.title`),
    subtitle: t(`${activeProfile}.subtitle`),
    tagline: t(`${activeProfile}.tagline`),
  };
  const cardVariants = getExpandableCardsVariants(locale)[activeProfile];
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
    <section
      style={{
        background: "var(--paper-2)",
        padding: "80px 0",
        borderTop: "1px solid var(--rule)",
        borderBottom: "1px solid var(--rule)",
      }}
    >
      <div className="container">
        {/* Sec-head */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "56px 1fr auto",
            alignItems: "baseline",
            gap: "0 24px",
            marginBottom: 40,
            borderBottom: "1px solid var(--rule)",
            paddingBottom: 16,
          }}
        >
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              letterSpacing: "0.08em",
              color: "var(--accent-color)",
            }}
          >
            № 03
          </div>
          <AnimatePresence mode="wait">
            <motion.h2
              key={activeProfile}
              className="ni-serif"
              style={{
                fontSize: "clamp(28px, 3.5vw, 52px)",
                lineHeight: 1.1,
                margin: 0,
                color: "var(--ink)",
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {sectionTitle.title}{" "}
              <em style={{ color: "var(--ink)" }}>{sectionTitle.subtitle}</em>
            </motion.h2>
          </AnimatePresence>
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--muted-color)",
              textAlign: "right",
            }}
          >
            Services
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={`tagline-${activeProfile}`}
            style={{ fontSize: 14, color: "var(--ink-2)", marginBottom: 48 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {sectionTitle.tagline}
          </motion.p>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.ul
            key={activeProfile}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 0,
              borderTop: "1px solid var(--rule)",
            }}
          >
            {activeCards.map((card, idx) => (
              <li
                key={card.title}
                style={{ borderBottom: "1px solid var(--rule)" }}
              >
                <button
                  style={{
                    width: "100%",
                    display: "grid",
                    gridTemplateColumns: "80px 1fr 24px",
                    gap: 24,
                    padding: "24px 0",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    textAlign: "left",
                    alignItems: "center",
                  }}
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  aria-expanded={openIndex === idx}
                  aria-controls={`panel-${idx}`}
                >
                  <Image
                    width={80}
                    height={60}
                    src={card.src}
                    alt={card.title}
                    style={{ width: 80, height: 60, objectFit: "cover", objectPosition: "top", display: "block" }}
                  />
                  <div>
                    <div
                      className="ni-serif"
                      style={{ fontSize: 20, color: "var(--ink)", marginBottom: 4 }}
                    >
                      {card.title}
                    </div>
                    <p style={{ fontSize: 13, color: "var(--ink-2)", margin: 0 }}>
                      {card.description}
                    </p>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 16,
                      color: "var(--muted-color)",
                      transform: openIndex === idx ? "rotate(45deg)" : "none",
                      transition: "transform 0.2s",
                      display: "inline-block",
                      textAlign: "center",
                    }}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {openIndex === idx && (
                    <motion.div
                      id={`panel-${idx}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{
                        height: { duration: 0.35, ease: "easeInOut" },
                        opacity: { duration: 0.25 },
                      }}
                      style={{ overflow: "hidden" }}
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div
                          style={{
                            padding: "0 0 40px 104px",
                          }}
                        >
                          {card.content(isEn)}
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
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
    stroke="var(--ink)"
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
