"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Callout } from "./mdx/callout";
import { ComparisonTable } from "./mdx/comparison-table";
import { StepByStep, Step } from "./mdx/step-by-step";
import { StatCard, StatGrid } from "./mdx/stat-card";
import { Quiz } from "./mdx/quiz";
import { FlowDiagram, ArchitectureDiagram, HighlightBox } from "./mdx/infographic";

type ComponentId =
  | "callout"
  | "comparison"
  | "steps"
  | "stats"
  | "quiz"
  | "flow"
  | "architecture"
  | "highlight";

interface GalleryItem {
  id: ComponentId;
  label: string;
  description: string;
}

const components: GalleryItem[] = [
  { id: "callout", label: "Callout", description: "Encarts contextuels avec 6 variantes" },
  { id: "comparison", label: "ComparisonTable", description: "Tableau comparatif deux colonnes" },
  { id: "steps", label: "StepByStep", description: "Timeline verticale numérotée" },
  { id: "stats", label: "StatCard", description: "Statistiques animées au scroll" },
  { id: "quiz", label: "Quiz", description: "QCM interactif avec correction" },
  { id: "flow", label: "FlowDiagram", description: "Diagramme de flux directionnel" },
  { id: "architecture", label: "ArchitectureDiagram", description: "Architecture en couches" },
  { id: "highlight", label: "HighlightBox", description: "Encadré de synthèse" },
];

const calloutVariants = ["tip", "warning", "info", "decideur", "developpeur", "utilisateur"] as const;

function CalloutDemo() {
  const [variant, setVariant] = useState<(typeof calloutVariants)[number]>("tip");

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide sm:overflow-visible sm:flex-wrap">
        {calloutVariants.map((v) => (
          <button
            key={v}
            onClick={() => setVariant(v)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-googletexte border transition-all whitespace-nowrap shrink-0",
              variant === v
                ? "bg-regularblue/30 text-white border-regularblue/40"
                : "bg-darkblue/40 text-white/80 border-lightblue/10 hover:text-white/80"
            )}
          >
            {v}
          </button>
        ))}
      </div>
      <div className="rounded-2xl bg-extralightblue/90 p-3 sm:p-5">
        <div className="article-text text-mediumblue">
          <Callout variant={variant} title={`Exemple de callout « ${variant} »`}>
            Ce composant adapte son icône, sa couleur et son style en fonction de la variante sélectionnée. Il est utilisé dans les articles pour contextualiser l&apos;information selon le profil du lecteur.
          </Callout>
        </div>
      </div>
    </div>
  );
}

function ComparisonDemo() {
  return (
    <div className="rounded-2xl bg-extralightblue/90 p-5">
      <div className="article-text text-mediumblue">
        <ComparisonTable
          headers={["WordPress Traditionnel", "WordPress Headless"]}
          rows={[
            { label: "Performance", left: "3-5s de chargement", right: "< 1s de chargement" },
            { label: "Multi-canal", left: false, right: true },
            { label: "SEO", left: "Plugins requis", right: "Contrôle natif" },
            { label: "Sécurité", left: "Surface exposée", right: "Back-end isolé" },
          ]}
          highlight="right"
        />
      </div>
    </div>
  );
}

function StepsDemo() {
  return (
    <div className="rounded-2xl bg-extralightblue/90 p-5">
      <div className="article-text text-mediumblue">
        <StepByStep>
          <Step number={1} title="Cadrage du projet">
            Définir les objectifs, identifier les parties prenantes et rédiger le cahier des charges fonctionnel et technique.
          </Step>
          <Step number={2} title="Conception et développement">
            Produire les maquettes, valider l&apos;architecture technique et développer les fonctionnalités par itérations.
          </Step>
          <Step number={3} title="Tests et mise en production">
            Exécuter les tests fonctionnels et de performance, puis déployer via le pipeline CI/CD.
          </Step>
        </StepByStep>
      </div>
    </div>
  );
}

function StatsDemo() {
  const [accent, setAccent] = useState<"blue" | "orange" | "coral">("blue");

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["blue", "orange", "coral"] as const).map((a) => (
          <button
            key={a}
            onClick={() => setAccent(a)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-googletexte border transition-all",
              accent === a
                ? "bg-regularblue/30 text-white border-regularblue/40"
                : "bg-darkblue/40 text-white/80 border-lightblue/10 hover:text-white/80"
            )}
          >
            {a}
          </button>
        ))}
      </div>
      <div className="rounded-2xl bg-extralightblue/90 p-3 sm:p-5">
        <div className="article-text text-mediumblue">
          <StatGrid>
            <StatCard value="40%" label="du web mondial" description="Part de marché WordPress" accent={accent} />
            <StatCard value="×3" label="plus rapide" description="Gain de performance headless" accent={accent} />
            <StatCard value="< 1s" label="temps de chargement" description="Avec SSG et CDN" accent={accent} />
          </StatGrid>
        </div>
      </div>
    </div>
  );
}

function QuizDemo() {
  return (
    <div className="rounded-2xl bg-extralightblue/90 p-5">
      <div className="article-text text-mediumblue">
        <Quiz
          question="Quel est le principal avantage du pré-rendu SSG en architecture headless ?"
          options={[
            "Il supprime le besoin d'un serveur web",
            "Les pages HTML statiques sont servies depuis un CDN, réduisant le temps de chargement sous la seconde",
            "Il remplace automatiquement les images par du WebP",
            "Il élimine le besoin de base de données",
          ]}
          answer={1}
          explanation="Le Static Site Generation (SSG) pré-génère les pages en HTML au moment du build. Ces fichiers statiques sont distribués via un CDN mondial, ce qui élimine le temps de traitement serveur et réduit le TTFB à quelques millisecondes."
        />
      </div>
    </div>
  );
}

function FlowDemo() {
  const [direction, setDirection] = useState<"horizontal" | "vertical">("horizontal");

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["horizontal", "vertical"] as const).map((d) => (
          <button
            key={d}
            onClick={() => setDirection(d)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-googletexte border transition-all",
              direction === d
                ? "bg-regularblue/30 text-white border-regularblue/40"
                : "bg-darkblue/40 text-white/80 border-lightblue/10 hover:text-white/80"
            )}
          >
            {d}
          </button>
        ))}
      </div>
      <div className="rounded-2xl bg-extralightblue/90 p-3 sm:p-5">
        <div className="article-text text-mediumblue">
          <FlowDiagram
            nodes={[
              { label: "WordPress", description: "Back-end CMS", icon: "📦" },
              { label: "API", description: "REST ou GraphQL", icon: "🔗" },
              { label: "Next.js", description: "Front-end SSG/SSR", icon: "⚡" },
              { label: "CDN", description: "Distribution mondiale", icon: "🌍" },
            ]}
            direction={direction}
            accent="blue"
          />
        </div>
      </div>
    </div>
  );
}

function ArchitectureDemo() {
  return (
    <div className="rounded-2xl bg-extralightblue/90 p-5">
      <div className="article-text text-mediumblue">
        <ArchitectureDiagram
          title="Stack WordPress Headless"
          layers={[
            { label: "Front-end", items: ["Next.js", "React", "Tailwind CSS"], color: "orange" },
            { label: "Couche API", items: ["WPGraphQL", "REST API", "Auth JWT"], color: "blue" },
            { label: "Back-end", items: ["WordPress", "MySQL", "ACF Pro"], color: "dark" },
          ]}
        />
      </div>
    </div>
  );
}

function HighlightDemo() {
  const [accent, setAccent] = useState<"blue" | "orange">("blue");

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["blue", "orange"] as const).map((a) => (
          <button
            key={a}
            onClick={() => setAccent(a)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-googletexte border transition-all",
              accent === a
                ? "bg-regularblue/30 text-white border-regularblue/40"
                : "bg-darkblue/40 text-white/80 border-lightblue/10 hover:text-white/80"
            )}
          >
            {a}
          </button>
        ))}
      </div>
      <div className="rounded-2xl bg-extralightblue/90 p-3 sm:p-5">
        <div className="article-text text-mediumblue">
          <HighlightBox title="Points clés à retenir" accent={accent}>
            <ul>
              <li>Le SEO intégré dès la conception réduit le coût total du projet</li>
              <li>Le trafic organique représente 53 % du trafic total d&apos;un site web</li>
              <li>Les Core Web Vitals (LCP, FID, CLS) sont des facteurs de classement Google</li>
            </ul>
          </HighlightBox>
        </div>
      </div>
    </div>
  );
}

const demoMap: Record<ComponentId, () => JSX.Element> = {
  callout: CalloutDemo,
  comparison: ComparisonDemo,
  steps: StepsDemo,
  stats: StatsDemo,
  quiz: QuizDemo,
  flow: FlowDemo,
  architecture: ArchitectureDemo,
  highlight: HighlightDemo,
};

export function MdxGallery() {
  const [active, setActive] = useState<ComponentId>("callout");
  const Demo = demoMap[active];
  const activeItem = components.find((c) => c.id === active)!;

  return (
    <div className="rounded-3xl border border-lightblue/10 bg-mediumblue/80 backdrop-blur-sm p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
      <div>
        <h3 className="font-googletitre text-xl text-white font-medium">
          Galerie de composants MDX
        </h3>
        <p className="text-sm text-white/80 font-googletexte mt-1">
          Les composants enrichis utilisés dans les articles de documentation.
        </p>
      </div>

      {/* Component selector */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {components.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={cn(
              "rounded-full px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-googletexte border transition-all duration-200",
              active === c.id
                ? "bg-regularblue/30 text-white border-regularblue/40"
                : "bg-darkblue/40 text-white/80 border-lightblue/10 hover:bg-darkblue/60 hover:text-white/80"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Description */}
      <p className="text-sm text-white/80 font-googletexte">
        {activeItem.description}
      </p>

      {/* Live preview */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <Demo />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
