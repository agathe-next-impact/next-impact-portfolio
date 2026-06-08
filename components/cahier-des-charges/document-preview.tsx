"use client"

import { useState, useEffect } from "react"
import { ContactFormModal } from "./ContactFormModal"
import { Send, FileText } from "lucide-react"
import { useLocale } from "next-intl"
import { cn } from "@/lib/utils"
import type { Locale } from "@/i18n/routing"

interface DocumentPreviewProps {
  formData: Record<string, any>
}

type Strings = {
  notSpecified: string
  documentTitle: string
  subtitle: string
  organization: string
  industry: string
  date: string
  author: string
  confidential: string
  toc: string
  tocItems: string[]
  sectionTitles: string[]
  section1: { sub1: string; sub2: string; projectType: string; projectTypeLabels: Record<string, string>; orgName: string; industry: string; targetAudience: string; issues: string; objectives: string; siteUrl: string; siteCreationDate: string; technologies: string }
  section2: { sub1: string; sub2: string; sub3: string; sub4: string; sitemap: string; contentTypes: string; standardEmpty: string; advancedEmpty: string; constraints: string }
  section3: { sub1: string; sub2: string; brandEmpty: string; inspirations: string; colors: string; typography: string; mood: string; uxPriorities: string; responsive: string; accessibility: string; navigation: string }
  section4: { sub1: string; sub2: string; sub3: string; sub4: string; cms: string; languages: string; database: string; hosting: string; security: string; loadTime: string; seo: string }
  section5: { sub1: string; sub2: string; volume: string; types: string; toCreate: string; admins: string; training: string; support: string }
  section6: { sub1: string; phasesEmpty: string; methodology: string; warranty: string }
  section7: { sub1: string; sub2: string; startDate: string; goLiveDate: string; budget: string; maintenance: string }
  section8: { sub1: string; sub2: string; sub3: string; deadline: string; responseMode: string; technicalCriteria: string; financialCriteria: string; contactName: string; email: string }
  section9: { sub1: string; documentsEmpty: string }
  preview: string
  send: string
  defaultDocTitle: string
  defaultAuthor: string
  versionLabel: string
}

const STRINGS_FR: Strings = {
  notSpecified: "Non spécifié",
  documentTitle: "CAHIER DES CHARGES",
  subtitle: "Création / Refonte de site web",
  organization: "Organisation :",
  industry: "Secteur :",
  date: "Date :",
  author: "Rédacteur :",
  confidential: "Document confidentiel",
  toc: "TABLE DES MATIÈRES",
  tocItems: [
    "1. Présentation générale du projet",
    "2. Spécifications fonctionnelles",
    "3. Spécifications graphiques et ergonomiques",
    "4. Spécifications techniques",
    "5. Gestion de contenu",
    "6. Prestations attendues",
    "7. Planning et budget",
    "8. Modalités de réponse",
    "9. Annexes",
  ],
  sectionTitles: [
    "1. PRÉSENTATION GÉNÉRALE DU PROJET",
    "2. SPÉCIFICATIONS FONCTIONNELLES",
    "3. SPÉCIFICATIONS GRAPHIQUES ET ERGONOMIQUES",
    "4. SPÉCIFICATIONS TECHNIQUES",
    "5. GESTION DE CONTENU",
    "6. PRESTATIONS ATTENDUES",
    "7. PLANNING ET BUDGET",
    "8. MODALITÉS DE RÉPONSE",
    "9. ANNEXES",
  ],
  section1: {
    sub1: "1.1 Contexte",
    sub2: "1.2 Description du projet existant",
    projectType: "Type de projet :",
    projectTypeLabels: {
      "site-classique": "Site WordPress classique",
      "site-headless": "Site Headless WordPress + Next.js",
      "web-app": "Web app sur-mesure",
      "app-mobile": "Application mobile (PWA)",
    },
    orgName: "Nom de l'organisation :",
    industry: "Secteur d'activité :",
    targetAudience: "Public cible :",
    issues: "Problématiques identifiées :",
    objectives: "Objectifs principaux :",
    siteUrl: "URL du site actuel :",
    siteCreationDate: "Date de création :",
    technologies: "Technologies utilisées :",
  },
  section2: {
    sub1: "2.1 Architecture de l'information",
    sub2: "2.2 Fonctionnalités standards",
    sub3: "2.3 Fonctionnalités avancées",
    sub4: "2.4 Contraintes techniques",
    sitemap: "Arborescence proposée :",
    contentTypes: "Types de contenus :",
    standardEmpty: "Aucune fonctionnalité standard sélectionnée",
    advancedEmpty: "Aucune fonctionnalité avancée sélectionnée",
    constraints: "Contraintes techniques :",
  },
  section3: {
    sub1: "3.1 Charte graphique",
    sub2: "3.2 Ergonomie",
    brandEmpty: "Aucune information sur la charte graphique",
    inspirations: "Sites d'inspiration :",
    colors: "Couleurs principales :",
    typography: "Typographie :",
    mood: "Ambiance :",
    uxPriorities: "Priorité UX :",
    responsive: "Responsive :",
    accessibility: "Accessibilité :",
    navigation: "Navigation :",
  },
  section4: {
    sub1: "4.1 Outils et Technologies",
    sub2: "4.2 Hébergement",
    sub3: "4.3 Sécurité",
    sub4: "4.4 Performance et SEO",
    cms: "CMS ou Framework :",
    languages: "Langages de programmation :",
    database: "Base de données :",
    hosting: "Type d'hébergement :",
    security: "Niveau de sécurité :",
    loadTime: "Temps de chargement cible :",
    seo: "Exigences SEO :",
  },
  section5: {
    sub1: "5.1 Contenus",
    sub2: "5.2 Formation et support",
    volume: "Volume à migrer :",
    types: "Types de migration :",
    toCreate: "Contenus à créer :",
    admins: "Profils administrateurs :",
    training: "Formation proposée :",
    support: "Support technique :",
  },
  section6: {
    sub1: "6.1 Phases du projet",
    phasesEmpty: "Aucune phase sélectionnée",
    methodology: "Méthodologie :",
    warranty: "Garantie :",
  },
  section7: {
    sub1: "7.1 Planning",
    sub2: "7.2 Budget",
    startDate: "Date de démarrage :",
    goLiveDate: "Date de mise en ligne :",
    budget: "Budget global :",
    maintenance: "Budget maintenance :",
  },
  section8: {
    sub1: "8.1 Modalités",
    sub2: "8.2 Critères de sélection",
    sub3: "8.3 Contact",
    deadline: "Date limite :",
    responseMode: "Mode de réponse :",
    technicalCriteria: "Critères techniques :",
    financialCriteria: "Critères financiers :",
    contactName: "Personne référente :",
    email: "Email :",
  },
  section9: {
    sub1: "9.1 Documents fournis",
    documentsEmpty: "Aucun document annexe",
  },
  preview: "Apercu du document",
  send: "Envoyer pour devis",
  defaultDocTitle: "Cahier des charges",
  defaultAuthor: "Rédigé par",
  versionLabel: "Version :",
}

const STRINGS_EN: Strings = {
  notSpecified: "Not specified",
  documentTitle: "PROJECT SPECIFICATIONS",
  subtitle: "Website build / redesign",
  organization: "Organization:",
  industry: "Industry:",
  date: "Date:",
  author: "Author:",
  confidential: "Confidential document",
  toc: "TABLE OF CONTENTS",
  tocItems: [
    "1. Project overview",
    "2. Functional specifications",
    "3. Visual & ergonomic specifications",
    "4. Technical specifications",
    "5. Content management",
    "6. Expected deliverables",
    "7. Schedule & budget",
    "8. Response terms",
    "9. Appendices",
  ],
  sectionTitles: [
    "1. PROJECT OVERVIEW",
    "2. FUNCTIONAL SPECIFICATIONS",
    "3. VISUAL & ERGONOMIC SPECIFICATIONS",
    "4. TECHNICAL SPECIFICATIONS",
    "5. CONTENT MANAGEMENT",
    "6. EXPECTED DELIVERABLES",
    "7. SCHEDULE & BUDGET",
    "8. RESPONSE TERMS",
    "9. APPENDICES",
  ],
  section1: {
    sub1: "1.1 Context",
    sub2: "1.2 Existing project description",
    projectType: "Type of project:",
    projectTypeLabels: {
      "site-classique": "Classic WordPress site",
      "site-headless": "Headless WordPress + Next.js site",
      "web-app": "Custom web app",
      "app-mobile": "Mobile application (PWA)",
    },
    orgName: "Organization name:",
    industry: "Industry:",
    targetAudience: "Target audience:",
    issues: "Identified issues:",
    objectives: "Main objectives:",
    siteUrl: "Current site URL:",
    siteCreationDate: "Creation date:",
    technologies: "Technologies used:",
  },
  section2: {
    sub1: "2.1 Information architecture",
    sub2: "2.2 Standard features",
    sub3: "2.3 Advanced features",
    sub4: "2.4 Technical constraints",
    sitemap: "Proposed sitemap:",
    contentTypes: "Content types:",
    standardEmpty: "No standard feature selected",
    advancedEmpty: "No advanced feature selected",
    constraints: "Technical constraints:",
  },
  section3: {
    sub1: "3.1 Brand guidelines",
    sub2: "3.2 Ergonomics",
    brandEmpty: "No brand guidelines info",
    inspirations: "Inspiration sites:",
    colors: "Primary colors:",
    typography: "Typography:",
    mood: "Mood:",
    uxPriorities: "UX priority:",
    responsive: "Responsive:",
    accessibility: "Accessibility:",
    navigation: "Navigation:",
  },
  section4: {
    sub1: "4.1 Tools & technologies",
    sub2: "4.2 Hosting",
    sub3: "4.3 Security",
    sub4: "4.4 Performance & SEO",
    cms: "CMS or framework:",
    languages: "Programming languages:",
    database: "Database:",
    hosting: "Hosting type:",
    security: "Security level:",
    loadTime: "Target load time:",
    seo: "SEO requirements:",
  },
  section5: {
    sub1: "5.1 Content",
    sub2: "5.2 Training & support",
    volume: "Volume to migrate:",
    types: "Migration types:",
    toCreate: "Content to create:",
    admins: "Admin profiles:",
    training: "Training offered:",
    support: "Technical support:",
  },
  section6: {
    sub1: "6.1 Project phases",
    phasesEmpty: "No phase selected",
    methodology: "Methodology:",
    warranty: "Warranty:",
  },
  section7: {
    sub1: "7.1 Schedule",
    sub2: "7.2 Budget",
    startDate: "Start date:",
    goLiveDate: "Go-live date:",
    budget: "Overall budget:",
    maintenance: "Maintenance budget:",
  },
  section8: {
    sub1: "8.1 Terms",
    sub2: "8.2 Selection criteria",
    sub3: "8.3 Contact",
    deadline: "Deadline:",
    responseMode: "Response format:",
    technicalCriteria: "Technical criteria:",
    financialCriteria: "Financial criteria:",
    contactName: "Contact person:",
    email: "Email:",
  },
  section9: {
    sub1: "9.1 Provided documents",
    documentsEmpty: "No appended document",
  },
  preview: "Document preview",
  send: "Send for quote",
  defaultDocTitle: "Project specifications",
  defaultAuthor: "Written by",
  versionLabel: "Version:",
}

function PreviewField({ label, value, fallback }: { label: string; value?: string; fallback: string }) {
  return (
    <div className="mb-1.5">
      <span className="text-[13px] font-semibold text-foreground">{label} </span>
      <span className="font-inter-tight text-[13px] text-mid-gray">
        {value || fallback}
      </span>
    </div>
  )
}

function CheckboxList({ data, fallback }: { data: Record<string, any> | undefined; fallback: string }) {
  if (!data) {
    return <span className="font-inter-tight text-[13px] text-mid-gray">{fallback}</span>
  }
  return (
    <ul className="m-0 list-none p-0">
      {Object.entries(data).map(([key, value]: [string, any]) => (
        <li key={key} className="mb-1.5 flex items-center gap-2">
          <span className={value?.checked ? "text-accent-secondary" : "text-mid-gray"}>•</span>
          <span
            className={cn(
              "font-inter-tight text-[13px]",
              value?.checked ? "text-foreground" : "text-mid-gray",
            )}
          >
            {value?.label || key}
          </span>
        </li>
      ))}
    </ul>
  )
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-4 border-b border-foreground/80 py-2">
      <h2 className="m-0 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground">
        {title}
      </h2>
    </div>
  )
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h3 className="m-0 border-b border-dark-gray pb-1 font-mono text-[10px] font-medium uppercase tracking-[0.1em] text-accent-secondary">
        {title}
      </h3>
      <div className="mt-3 flex flex-col gap-1.5">
        {children}
      </div>
    </div>
  )
}

export function DocumentPreview({ formData }: DocumentPreviewProps) {
  const locale = useLocale() as Locale
  const t = locale === "en" ? STRINGS_EN : STRINGS_FR
  const [isLoading, setIsLoading] = useState(true)
  const [showContactForm, setShowContactForm] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  const renderPreviewContent = () => {
    if (isLoading) {
      return (
        <div className="p-6">
          <div className="mb-2 h-12 animate-pulse bg-obsidian" />
          <div className="mb-2 h-8 w-1/2 animate-pulse bg-obsidian" />
          <div className="mt-8">
            <div className="mb-2 h-6 animate-pulse bg-obsidian" />
            <div className="mb-2 h-6 animate-pulse bg-obsidian" />
            <div className="mb-2 h-6 w-3/4 animate-pulse bg-obsidian" />
          </div>
          <div className="mt-8">
            <div className="mb-2 h-6 animate-pulse bg-obsidian" />
            <div className="mb-2 h-6 animate-pulse bg-obsidian" />
            <div className="mb-2 h-6 w-3/4 animate-pulse bg-obsidian" />
          </div>
        </div>
      )
    }

    return (
      <div className="flex w-full flex-col gap-8">
        {/* Cover */}
        <div className="border border-dark-gray border-t-2 border-t-accent-secondary bg-obsidian p-8">
          <div className="text-center">
            <h1 className="m-0 text-2xl font-light tracking-tight text-foreground md:text-[28px]">
              {t.documentTitle}
            </h1>
            <h2 className="mt-2 font-inter-tight text-[15px] font-normal text-mid-gray">
              {t.subtitle}
            </h2>

            <div className="mx-auto mt-8 flex max-w-[400px] flex-col gap-2.5 text-left">
              <div className="flex gap-2">
                <span className="w-[140px] flex-shrink-0 text-[13px] font-semibold text-foreground">{t.organization}</span>
                <span className="font-inter-tight text-[13px] text-mid-gray">{formData.organisation_name || t.notSpecified}</span>
              </div>
              <div className="flex gap-2">
                <span className="w-[140px] flex-shrink-0 text-[13px] font-semibold text-foreground">{t.industry}</span>
                <span className="font-inter-tight text-[13px] text-mid-gray">{formData.secteur_activite || t.notSpecified}</span>
              </div>
              <div className="flex gap-2">
                <span className="w-[140px] flex-shrink-0 text-[13px] font-semibold text-foreground">{t.date}</span>
                <span className="font-inter-tight text-[13px] text-mid-gray">{formData.date_redaction || new Date().toLocaleDateString(locale === "en" ? "en-US" : "fr-FR")}</span>
              </div>
              <div className="flex gap-2">
                <span className="w-[140px] flex-shrink-0 text-[13px] font-semibold text-foreground">{t.author}</span>
                <span className="font-inter-tight text-[13px] text-mid-gray">{formData.redacteur || t.notSpecified}</span>
              </div>
            </div>

            <p className="mb-0 mt-6 font-mono text-[11px] uppercase tracking-[0.08em] text-mid-gray">{t.confidential}</p>
          </div>
        </div>

        {/* TOC */}
        <div className="border border-dark-gray bg-obsidian p-6">
          <h2 className="m-0 mb-4 text-center font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground">
            {t.toc}
          </h2>
          <ul className="m-0 list-none p-0">
            {t.tocItems.map((item) => (
              <li key={item} className="border-b border-dark-gray py-1.5 font-inter-tight text-[13px] text-mid-gray">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Section 1 */}
        <div>
          <SectionHeader title={t.sectionTitles[0]} />
          <div className="ml-4 flex flex-col gap-5">
            <SubSection title={t.section1.sub1}>
              <PreviewField
                label={t.section1.projectType}
                value={formData.project_type ? t.section1.projectTypeLabels[formData.project_type] : undefined}
                fallback={t.notSpecified}
              />
              <PreviewField label={t.section1.orgName} value={formData.organisation_name} fallback={t.notSpecified} />
              <PreviewField label={t.section1.industry} value={formData.secteur_activite} fallback={t.notSpecified} />
              <PreviewField label={t.section1.targetAudience} value={formData.public_cible} fallback={t.notSpecified} />
              <PreviewField label={t.section1.issues} value={formData.problematiques} fallback={t.notSpecified} />
              <PreviewField label={t.section1.objectives} value={formData.objectifs_refonte} fallback={t.notSpecified} />
            </SubSection>
            <SubSection title={t.section1.sub2}>
              <PreviewField label={t.section1.siteUrl} value={formData.site_url} fallback={t.notSpecified} />
              <PreviewField label={t.section1.siteCreationDate} value={formData.site_creation_date} fallback={t.notSpecified} />
              <PreviewField label={t.section1.technologies} value={formData.technologies_actuelles} fallback={t.notSpecified} />
            </SubSection>
          </div>
        </div>

        {/* Section 2 */}
        <div>
          <SectionHeader title={t.sectionTitles[1]} />
          <div className="ml-4 flex flex-col gap-5">
            <SubSection title={t.section2.sub1}>
              <PreviewField label={t.section2.sitemap} value={formData.arborescence} fallback={t.notSpecified} />
              <PreviewField label={t.section2.contentTypes} value={formData.types_contenus} fallback={t.notSpecified} />
            </SubSection>
            <SubSection title={t.section2.sub2}>
              <div className="border border-dark-gray bg-obsidian p-4">
                <CheckboxList data={formData.fonctionnalites_standards} fallback={t.section2.standardEmpty} />
              </div>
            </SubSection>
            <SubSection title={t.section2.sub3}>
              <div className="border border-dark-gray bg-obsidian p-4">
                <CheckboxList data={formData.fonctionnalites_avancees} fallback={t.section2.advancedEmpty} />
              </div>
            </SubSection>
            <SubSection title={t.section2.sub4}>
              <PreviewField label={t.section2.constraints} value={formData.contraintes_techniques} fallback={t.notSpecified} />
            </SubSection>
          </div>
        </div>

        {/* Section 3 */}
        <div>
          <SectionHeader title={t.sectionTitles[2]} />
          <div className="ml-4 flex flex-col gap-5">
            <SubSection title={t.section3.sub1}>
              <div className="border border-dark-gray bg-obsidian p-4">
                <CheckboxList data={formData.charte_graphique} fallback={t.section3.brandEmpty} />
              </div>
              <PreviewField label={t.section3.inspirations} value={formData.inspirations} fallback={t.notSpecified} />
              <PreviewField label={t.section3.colors} value={formData.couleurs} fallback={t.notSpecified} />
              <PreviewField label={t.section3.typography} value={formData.typographies} fallback={t.notSpecified} />
              <PreviewField label={t.section3.mood} value={formData.ambiance} fallback={t.notSpecified} />
              <PreviewField label={t.section3.uxPriorities} value={formData.ux_priorites} fallback={t.notSpecified} />
              <PreviewField label={t.section3.responsive} value={formData.responsive} fallback={t.notSpecified} />
            </SubSection>
            <SubSection title={t.section3.sub2}>
              <PreviewField label={t.section3.accessibility} value={formData.accessibilite} fallback={t.notSpecified} />
              <PreviewField label={t.section3.navigation} value={formData.navigation} fallback={t.notSpecified} />
            </SubSection>
          </div>
        </div>

        {/* Section 4 */}
        <div>
          <SectionHeader title={t.sectionTitles[3]} />
          <div className="ml-4 flex flex-col gap-5">
            <SubSection title={t.section4.sub1}>
              <PreviewField label={t.section4.cms} value={formData.cms_framework} fallback={t.notSpecified} />
              <PreviewField label={t.section4.languages} value={formData.langages} fallback={t.notSpecified} />
              <PreviewField label={t.section4.database} value={formData.base_donnees} fallback={t.notSpecified} />
            </SubSection>
            <SubSection title={t.section4.sub2}>
              <PreviewField label={t.section4.hosting} value={formData.hebergement} fallback={t.notSpecified} />
            </SubSection>
            <SubSection title={t.section4.sub3}>
              <PreviewField label={t.section4.security} value={formData.securite} fallback={t.notSpecified} />
            </SubSection>
            <SubSection title={t.section4.sub4}>
              <PreviewField label={t.section4.loadTime} value={formData.performance} fallback={t.notSpecified} />
              <PreviewField label={t.section4.seo} value={formData.seo} fallback={t.notSpecified} />
            </SubSection>
          </div>
        </div>

        {/* Section 5 */}
        <div>
          <SectionHeader title={t.sectionTitles[4]} />
          <div className="ml-4 flex flex-col gap-5">
            <SubSection title={t.section5.sub1}>
              <PreviewField label={t.section5.volume} value={formData.migration_volume} fallback={t.notSpecified} />
              <PreviewField label={t.section5.types} value={formData.migration_types} fallback={t.notSpecified} />
              <PreviewField label={t.section5.toCreate} value={formData.contenus_creer} fallback={t.notSpecified} />
              <PreviewField label={t.section5.admins} value={formData.profils_admin} fallback={t.notSpecified} />
            </SubSection>
            <SubSection title={t.section5.sub2}>
              <PreviewField label={t.section5.training} value={formData.formation_proposee} fallback={t.notSpecified} />
              <PreviewField label={t.section5.support} value={formData.support_technique} fallback={t.notSpecified} />
            </SubSection>
          </div>
        </div>

        {/* Section 6 */}
        <div>
          <SectionHeader title={t.sectionTitles[5]} />
          <div className="ml-4 flex flex-col gap-5">
            <SubSection title={t.section6.sub1}>
              <div className="border border-dark-gray bg-obsidian p-4">
                <CheckboxList data={formData.phases_projet} fallback={t.section6.phasesEmpty} />
              </div>
              <PreviewField label={t.section6.methodology} value={formData.methodologie} fallback={t.notSpecified} />
              <PreviewField label={t.section6.warranty} value={formData.garantie} fallback={t.notSpecified} />
            </SubSection>
          </div>
        </div>

        {/* Section 7 */}
        <div>
          <SectionHeader title={t.sectionTitles[6]} />
          <div className="ml-4 flex flex-col gap-5">
            <SubSection title={t.section7.sub1}>
              <PreviewField label={t.section7.startDate} value={formData.date_demarrage} fallback={t.notSpecified} />
              <PreviewField label={t.section7.goLiveDate} value={formData.date_mise_en_ligne} fallback={t.notSpecified} />
            </SubSection>
            <SubSection title={t.section7.sub2}>
              <PreviewField label={t.section7.budget} value={formData.budget_global} fallback={t.notSpecified} />
              <PreviewField label={t.section7.maintenance} value={formData.budget_maintenance} fallback={t.notSpecified} />
            </SubSection>
          </div>
        </div>

        {/* Section 8 */}
        <div>
          <SectionHeader title={t.sectionTitles[7]} />
          <div className="ml-4 flex flex-col gap-5">
            <SubSection title={t.section8.sub1}>
              <PreviewField label={t.section8.deadline} value={formData.date_limite} fallback={t.notSpecified} />
              <PreviewField label={t.section8.responseMode} value={formData.mode_reponse} fallback={t.notSpecified} />
            </SubSection>
            <SubSection title={t.section8.sub2}>
              <PreviewField label={t.section8.technicalCriteria} value={formData.criteres_techniques} fallback={t.notSpecified} />
              <PreviewField label={t.section8.financialCriteria} value={formData.criteres_financiers} fallback={t.notSpecified} />
            </SubSection>
            <SubSection title={t.section8.sub3}>
              <PreviewField label={t.section8.contactName} value={formData.contact_nom} fallback={t.notSpecified} />
              <PreviewField label={t.section8.email} value={formData.contact_email} fallback={t.notSpecified} />
            </SubSection>
          </div>
        </div>

        {/* Section 9 */}
        <div>
          <SectionHeader title={t.sectionTitles[8]} />
          <div className="ml-4 flex flex-col gap-5">
            <SubSection title={t.section9.sub1}>
              <div className="border border-dark-gray bg-obsidian p-4">
                <CheckboxList data={formData.documents_fournis} fallback={t.section9.documentsEmpty} />
              </div>
            </SubSection>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-2 flex flex-wrap justify-between gap-2 border-t border-dark-gray pt-4 font-mono text-[11px] text-mid-gray">
          <span>{formData.organisation_name || t.defaultDocTitle}</span>
          <span>{formData.redacteur || t.defaultAuthor}</span>
          <span>{formData.date_redaction || new Date().toLocaleDateString(locale === "en" ? "en-US" : "fr-FR")}</span>
          <span>{t.versionLabel} {formData.version || "1.0"}</span>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="overflow-hidden border border-dark-gray bg-jet">
        {/* Header bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dark-gray bg-obsidian px-6 py-4">
          <div className="flex items-center gap-2">
            <FileText className="h-[18px] w-[18px] text-mid-gray" />
            <h3 className="m-0 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-foreground">
              {t.preview}
            </h3>
          </div>
          <button
            className="inline-flex items-center gap-2 border border-charcoal bg-vermilion px-6 py-3 font-mono text-[11px] uppercase tracking-[0.08em] text-white transition-colors hover:bg-vermilion-bright"
            onClick={() => setShowContactForm(true)}
          >
            <Send className="h-3.5 w-3.5" />
            {t.send}
          </button>
          {showContactForm && (
            <ContactFormModal
              formData={formData}
              onClose={() => setShowContactForm(false)}
            />
          )}
        </div>

        {/* Document content */}
        <div className="max-h-[800px] overflow-y-auto p-6 md:p-8">
          {renderPreviewContent()}
        </div>
      </div>
    </div>
  )
}
