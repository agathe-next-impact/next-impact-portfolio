"use client"

import { Link } from "@/i18n/navigation"
import {
  BotMessageSquare,
  FileText,
  BadgePercent,
  Smartphone,
  Compass,
  ScrollText,
  Wrench,
  FlaskConical,
  Blocks,
  Radar,
  ClipboardCheck,
  ArrowRight,
} from "lucide-react"
import { useLocale } from "next-intl"
import type { Locale } from "@/i18n/routing"

interface BentoCard {
  id: string
  title: string
  description: string
  icon: React.ElementType
  href: string
  tag?: string
}

const buildCards = (isEn: boolean): Record<string, BentoCard> => ({
  "selecteur-techno": {
    id: "selecteur-techno",
    title: isEn ? "Web & AI tech selector" : "Sélecteur techno web & IA",
    description: isEn
      ? "8 criteria, one recommendation: WordPress, no-code, Headless, SaaS or custom. The hub's master decision tool."
      : "8 critères, une recommandation : WordPress, no-code, Headless, SaaS ou sur-mesure. L'outil de décision maître du hub.",
    icon: Compass,
    href: "/outils/selecteur-techno",
    tag: isEn ? "New" : "Nouveau",
  },
  "visibilite-ia": {
    id: "visibilite-ia",
    title: isEn
      ? "Is your site visible to AI engines?"
      : "Votre site est-il visible dans les moteurs IA ?",
    description: isEn
      ? "ChatGPT, Perplexity, AI Overviews: 10 questions, a score on 4 axes and your priority actions to get cited."
      : "ChatGPT, Perplexity, AI Overviews : 10 questions, un score sur 4 axes et vos actions prioritaires pour être cité.",
    icon: Radar,
    href: "/outils/visibilite-ia",
    tag: isEn ? "New" : "Nouveau",
  },
  "checklist-geo": {
    id: "checklist-geo",
    title: isEn ? "The GEO checklist" : "La checklist GEO",
    description: isEn
      ? "24 concrete actions to get cited by AI engines, across 4 priorities: crawler access, answer pages, markup, authority. Checkable and downloadable."
      : "24 actions concrètes pour être cité par les moteurs IA, sur 4 chantiers : accès des robots, pages-réponses, balisage, autorité. Cochable et téléchargeable.",
    icon: ClipboardCheck,
    href: "/outils/checklist-geo",
    tag: isEn ? "New" : "Nouveau",
  },
  "decrypteur-devis": {
    id: "decrypteur-devis",
    title: isEn ? "Web quote decoder" : "Décrypteur de devis web",
    description: isEn
      ? "Received a quote? 9 checks, a health score and the questions to ask before you sign."
      : "Un devis en main ? 9 vérifications, un score de santé et les questions à poser avant de signer.",
    icon: ScrollText,
    href: "/outils/decrypteur-devis",
    tag: isEn ? "New" : "Nouveau",
  },
  "reparer-refaire": {
    id: "reparer-refaire",
    title: isEn ? "Repair or rebuild?" : "Réparer ou refaire ?",
    description: isEn
      ? "Is your site at the end of the road? 9 checks, a health score and a clear signal: repair, optimize or rebuild."
      : "Votre site est-il en bout de course ? 9 vérifications, un score de santé et un signal clair : réparer, optimiser ou refondre.",
    icon: Wrench,
    href: "/outils/reparer-ou-refaire",
    tag: isEn ? "New" : "Nouveau",
  },
  "prototype-ia": {
    id: "prototype-ia",
    title: isEn ? "AI prototype: throwaway or maintainable?" : "Prototype IA : jetable ou maintenable ?",
    description: isEn
      ? "Vibe-coded something with AI? 9 checks and a signal: keep the prototype, scope it, or rebuild it for production."
      : "Un truc vibe-codé avec l'IA ? 9 vérifications et un signal : garder le prototype, le cadrer, ou le reconstruire pour la production.",
    icon: FlaskConical,
    href: "/outils/prototype-ia",
    tag: isEn ? "New" : "Nouveau",
  },
  "nocode-saas-surmesure": {
    id: "nocode-saas-surmesure",
    title: isEn ? "No-code, SaaS or custom?" : "No-code, SaaS ou sur-mesure ?",
    description: isEn
      ? "Build, buy or no-code? 8 criteria to find the right family for your tool."
      : "Construire, acheter ou no-code ? 8 critères pour trouver la bonne famille pour votre outil.",
    icon: Blocks,
    href: "/outils/nocode-saas-surmesure",
    tag: isEn ? "New" : "Nouveau",
  },
  "determiner-offre": {
    id: "determiner-offre",
    title: isEn ? "Project diagnostic" : "Diagnostic projet",
    description: isEn
      ? "In a few clicks, identify the right path: classic WordPress, Headless + Next.js, web app or mobile."
      : "Identifiez en quelques clics la voie adaptée : site WordPress classique, Headless + Next.js, web app ou mobile.",
    icon: BadgePercent,
    href: "/solutions-web/eligibilite",
  },
  "cahier-des-charges": {
    id: "cahier-des-charges",
    title: isEn ? "Specifications" : "Cahier des Charges",
    description: isEn
      ? "Generate a complete, structured specifications document for your web project."
      : "Générez un cahier des charges complet et structuré pour votre projet web.",
    icon: FileText,
    href: "/cahier-des-charges",
  },
  "audit-ia": {
    id: "audit-ia",
    title: isEn ? "Should I migrate to Headless WordPress?" : "Faut-il migrer en WordPress Headless ?",
    description: isEn
      ? "AI-powered audit: performance, SEO, accessibility, conversion. Personalized recommendations."
      : "Audit IA de votre site actuel : performance, SEO, accessibilité, conversion.",
    icon: BotMessageSquare,
    href: "/audit-site-web",
  },
  "audit-pwa": {
    id: "audit-pwa",
    title: isEn ? "PWA opportunity diagnostic" : "Diagnostic d'opportunité PWA",
    description: isEn
      ? "Should your project become an installable mobile app? 9 questions and a decision signal."
      : "Votre projet gagnerait-il à devenir une app mobile installable ? 9 questions et un signal de décision.",
    icon: Smartphone,
    href: "/outils/audit-pwa",
    tag: isEn ? "New" : "Nouveau",
  },
})

// Regroupement par décision à trancher — un intitulé par groupe, sous-grille
// bento dédiée. Ordre fixe (pas de réordonnancement par profil) : plus lisible
// et plus stable pour le SEO.
interface ToolGroup {
  index: string
  slug: string
  kicker: { fr: string; en: string }
  title: { fr: string; en: string }
  cards: string[]
}

const GROUPS: ToolGroup[] = [
  {
    index: "№ 01",
    slug: "choisir",
    kicker: { fr: "Choisir", en: "Choose" },
    title: { fr: "Choisir la bonne techno", en: "Choose the right tech" },
    cards: ["selecteur-techno", "nocode-saas-surmesure", "determiner-offre"],
  },
  {
    index: "№ 02",
    slug: "diagnostiquer",
    kicker: { fr: "Diagnostiquer", en: "Diagnose" },
    title: { fr: "Évaluer votre site actuel", en: "Assess your current site" },
    cards: ["reparer-refaire", "audit-ia", "audit-pwa"],
  },
  {
    index: "№ 03",
    slug: "visibilite-ia",
    kicker: { fr: "Visibilité IA", en: "AI visibility" },
    title: { fr: "Être trouvé par l'IA", en: "Get found by AI" },
    cards: ["visibilite-ia", "checklist-geo"],
  },
  {
    index: "№ 04",
    slug: "cadrer",
    kicker: { fr: "Avant de signer", en: "Before you commit" },
    title: { fr: "Cadrer et sécuriser le projet", en: "Scope and secure the project" },
    cards: ["decrypteur-devis", "prototype-ia", "cahier-des-charges"],
  },
]

function ToolCard({ card, isEn }: { card: BentoCard; isEn: boolean }) {
  const Icon = card.icon
  return (
    <div className="border-b border-l border-dark-gray">
      <Link
        href={card.href as Parameters<typeof Link>[0]["href"]}
        className="group flex min-h-[200px] flex-col justify-between p-7 transition-colors hover:bg-jet lg:p-8"
      >
        <div className="mb-5 flex items-start justify-between">
          <Icon
            size={18}
            className="mt-0.5 shrink-0 text-mid-gray transition-colors group-hover:text-accent-secondary"
          />
          {card.tag && (
            <span className="border border-accent-secondary px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-accent-secondary">
              {card.tag}
            </span>
          )}
        </div>

        <div>
          <h3 className="mb-2 text-base font-light leading-snug tracking-tight text-foreground">
            {card.title}
          </h3>
          <p className="mb-4 font-inter-tight text-[13px] leading-relaxed text-mid-gray">
            {card.description}
          </p>
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-accent-secondary">
            {isEn ? "Open" : "Ouvrir"}
            <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </div>
  )
}

function GroupNav({ locale, isEn }: { locale: Locale; isEn: boolean }) {
  const cards = buildCards(isEn)
  return (
    <nav aria-label={isEn ? "Tool families" : "Familles d'outils"}>
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray">
        {isEn ? "Four tool families" : "Quatre familles d'outils"}
      </p>
      <ul className="grid gap-px border border-dark-gray bg-dark-gray sm:grid-cols-2 lg:grid-cols-4">
        {GROUPS.map((group) => {
          const count = group.cards.filter((id) => cards[id]).length
          return (
            <li key={group.slug} className="flex">
              <a
                href={`#${group.slug}`}
                className="group flex h-full w-full flex-col justify-between gap-4 bg-jet p-4 no-underline transition-colors hover:bg-obsidian"
              >
                <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-accent-secondary">
                  <span>{group.index}</span>
                  <span className="h-px w-5 bg-accent-secondary/50" />
                  <span className="text-mid-gray">{group.kicker[locale]}</span>
                </span>
                <span className="text-base font-light leading-snug tracking-tight text-foreground">
                  {group.title[locale]}
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-mid-gray transition-colors group-hover:text-accent-secondary">
                  {count} {isEn ? (count > 1 ? "tools" : "tool") : count > 1 ? "outils" : "outil"}
                  <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default function OutilsBentoGrid() {
  const locale = useLocale() as Locale
  const isEn = locale === "en"
  const cards = buildCards(isEn)

  return (
    <div className="flex flex-col gap-14 lg:gap-20">
      {/* Header : mini-cartes de navigation, une par groupe (ancres vers les sections) */}
      <GroupNav locale={locale} isEn={isEn} />

      {GROUPS.map((group) => {
        const groupCards = group.cards.map((id) => cards[id]).filter(Boolean)
        if (groupCards.length === 0) return null
        return (
          <section key={group.index} id={group.slug} className="scroll-mt-24">
            {/* En-tête de groupe : index № + kicker mono vermillon + titre */}
            <div className="mb-8 flex flex-col gap-2">
              <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-accent-secondary">
                <span>{group.index}</span>
                <span className="h-px w-6 bg-accent-secondary/50" />
                <span className="text-mid-gray">{group.kicker[locale]}</span>
              </div>
              <h2 className="text-xl font-light tracking-tight text-foreground md:text-2xl">
                {group.title[locale]}
              </h2>
            </div>

            {/* Sous-grille bento : rails haut + droite portés par le cadre, chaque
                cellule ajoute son filet gauche + bas → cadre complet à 1 / 2 / 3 col. */}
            <div className="grid grid-cols-1 border-r border-t border-dark-gray sm:grid-cols-2 lg:grid-cols-3">
              {groupCards.map((card) => (
                <ToolCard key={card.id} card={card} isEn={isEn} />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
