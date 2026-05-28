"use client"

import { useState, useEffect } from "react"
import { ContactFormModal } from "./ContactFormModal"
import { Send, FileText } from "lucide-react"
import { useLocale } from "next-intl"
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
    <div style={{ marginBottom: 6 }}>
      <span style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: 13, color: "var(--ink)" }}>{label} </span>
      <span style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-2)" }}>
        {value || fallback}
      </span>
    </div>
  )
}

function CheckboxList({ data, fallback }: { data: Record<string, any> | undefined; fallback: string }) {
  if (!data) {
    return <span style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--muted-color)" }}>{fallback}</span>
  }
  return (
    <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
      {Object.entries(data).map(([key, value]: [string, any]) => (
        <li key={key} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 13, color: value?.checked ? "var(--ink)" : "var(--muted-color)" }}>
            {value?.checked ? "•" : "•"}
          </span>
          <span style={{
            fontFamily: "var(--sans)",
            fontSize: 13,
            color: value?.checked ? "var(--ink)" : "var(--muted-color)",
          }}>
            {value?.label || key}
          </span>
        </li>
      ))}
    </ul>
  )
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div style={{ borderBottom: "2px solid var(--ink)", padding: "8px 0", marginBottom: 16 }}>
      <h2 style={{
        fontFamily: "var(--mono)",
        fontSize: 11,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "var(--ink)",
        margin: 0,
        fontWeight: 700,
      }}>
        {title}
      </h2>
    </div>
  )
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h3 style={{
        fontFamily: "var(--mono)",
        fontSize: 10,
        color: "var(--accent-color)",
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        borderBottom: "1px solid var(--rule)",
        paddingBottom: 4,
        marginBottom: 12,
        margin: 0,
        marginTop: 0,
        fontWeight: 600,
      }}>
        {title}
      </h3>
      <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
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
        <div style={{ padding: 24 }}>
          <div style={{ background: "var(--paper-2)", height: 48, marginBottom: 8 }} />
          <div style={{ background: "var(--paper-2)", height: 32, marginBottom: 8, width: "50%" }} />
          <div style={{ marginTop: 32 }}>
            <div style={{ background: "var(--paper-2)", height: 24, marginBottom: 8 }} />
            <div style={{ background: "var(--paper-2)", height: 24, marginBottom: 8 }} />
            <div style={{ background: "var(--paper-2)", height: 24, marginBottom: 8, width: "75%" }} />
          </div>
          <div style={{ marginTop: 32 }}>
            <div style={{ background: "var(--paper-2)", height: 24, marginBottom: 8 }} />
            <div style={{ background: "var(--paper-2)", height: 24, marginBottom: 8 }} />
            <div style={{ background: "var(--paper-2)", height: 24, marginBottom: 8, width: "75%" }} />
          </div>
        </div>
      )
    }

    return (
      <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 32 }}>
        {/* Cover */}
        <div style={{
          border: "1px solid var(--rule)",
          borderTop: "3px solid var(--accent-color)",
          background: "var(--paper)",
          padding: 32,
        }}>
          <div style={{ textAlign: "center" }}>
            <h1 style={{
              fontFamily: "var(--serif)",
              fontSize: 28,
              color: "var(--ink)",
              margin: 0,
              fontWeight: 700,
            }}>
              {t.documentTitle}
            </h1>
            <h2 style={{
              fontFamily: "var(--sans)",
              fontSize: 15,
              color: "var(--ink-2)",
              margin: "8px 0 0 0",
              fontWeight: 400,
            }}>
              {t.subtitle}
            </h2>

            <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 10, maxWidth: 400, marginLeft: "auto", marginRight: "auto", textAlign: "left" }}>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: 13, color: "var(--ink)", minWidth: 140, flexShrink: 0 }}>{t.organization}</span>
                <span style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-2)" }}>{formData.organisation_name || t.notSpecified}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: 13, color: "var(--ink)", minWidth: 140, flexShrink: 0 }}>{t.industry}</span>
                <span style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-2)" }}>{formData.secteur_activite || t.notSpecified}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: 13, color: "var(--ink)", minWidth: 140, flexShrink: 0 }}>{t.date}</span>
                <span style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-2)" }}>{formData.date_redaction || new Date().toLocaleDateString(locale === "en" ? "en-US" : "fr-FR")}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ fontFamily: "var(--sans)", fontWeight: 700, fontSize: 13, color: "var(--ink)", minWidth: 140, flexShrink: 0 }}>{t.author}</span>
                <span style={{ fontFamily: "var(--sans)", fontSize: 13, color: "var(--ink-2)" }}>{formData.redacteur || t.notSpecified}</span>
              </div>
            </div>

            <p style={{ fontFamily: "var(--sans)", fontSize: 11, color: "var(--muted-color)", marginTop: 24, marginBottom: 0 }}>{t.confidential}</p>
          </div>
        </div>

        {/* TOC */}
        <div style={{
          border: "1px solid var(--rule)",
          padding: 24,
          background: "var(--paper-2)",
        }}>
          <h2 style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--ink)",
            margin: 0,
            marginBottom: 16,
            textAlign: "center",
            fontWeight: 700,
          }}>
            {t.toc}
          </h2>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {t.tocItems.map((item) => (
              <li key={item} style={{
                fontFamily: "var(--sans)",
                fontSize: 13,
                color: "var(--ink-2)",
                borderBottom: "1px solid var(--rule)",
                padding: "6px 0",
              }}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Section 1 */}
        <div>
          <SectionHeader title={t.sectionTitles[0]} />
          <div style={{ marginLeft: 16, display: "flex", flexDirection: "column", gap: 20 }}>
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
          <div style={{ marginLeft: 16, display: "flex", flexDirection: "column", gap: 20 }}>
            <SubSection title={t.section2.sub1}>
              <PreviewField label={t.section2.sitemap} value={formData.arborescence} fallback={t.notSpecified} />
              <PreviewField label={t.section2.contentTypes} value={formData.types_contenus} fallback={t.notSpecified} />
            </SubSection>
            <SubSection title={t.section2.sub2}>
              <div style={{ background: "var(--paper-2)", padding: 16 }}>
                <CheckboxList data={formData.fonctionnalites_standards} fallback={t.section2.standardEmpty} />
              </div>
            </SubSection>
            <SubSection title={t.section2.sub3}>
              <div style={{ background: "var(--paper-2)", padding: 16 }}>
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
          <div style={{ marginLeft: 16, display: "flex", flexDirection: "column", gap: 20 }}>
            <SubSection title={t.section3.sub1}>
              <div style={{ background: "var(--paper-2)", padding: 16 }}>
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
          <div style={{ marginLeft: 16, display: "flex", flexDirection: "column", gap: 20 }}>
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
          <div style={{ marginLeft: 16, display: "flex", flexDirection: "column", gap: 20 }}>
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
          <div style={{ marginLeft: 16, display: "flex", flexDirection: "column", gap: 20 }}>
            <SubSection title={t.section6.sub1}>
              <div style={{ background: "var(--paper-2)", padding: 16 }}>
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
          <div style={{ marginLeft: 16, display: "flex", flexDirection: "column", gap: 20 }}>
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
          <div style={{ marginLeft: 16, display: "flex", flexDirection: "column", gap: 20 }}>
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
          <div style={{ marginLeft: 16, display: "flex", flexDirection: "column", gap: 20 }}>
            <SubSection title={t.section9.sub1}>
              <div style={{ background: "var(--paper-2)", padding: 16 }}>
                <CheckboxList data={formData.documents_fournis} fallback={t.section9.documentsEmpty} />
              </div>
            </SubSection>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          borderTop: "1px solid var(--rule)",
          paddingTop: 16,
          marginTop: 8,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 8,
          fontFamily: "var(--sans)",
          fontSize: 11,
          color: "var(--muted-color)",
        }}>
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
      <div style={{
        border: "1px solid var(--rule)",
        background: "var(--paper)",
        overflow: "hidden",
      }}>
        {/* Header bar */}
        <div style={{
          background: "var(--paper-2)",
          borderBottom: "1px solid var(--rule)",
          padding: "16px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FileText style={{ width: 18, height: 18, color: "var(--ink-2)" }} />
            <h3 style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--ink)",
              margin: 0,
              fontWeight: 600,
            }}>
              {t.preview}
            </h3>
          </div>
          <button
            style={{
              border: "1px solid var(--ink)",
              background: "var(--ink)",
              color: "var(--paper)",
              fontFamily: "var(--mono)",
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "12px 24px",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
            }}
            onClick={() => setShowContactForm(true)}
          >
            <Send style={{ width: 14, height: 14 }} />
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
        <div style={{ padding: 32, maxHeight: 800, overflowY: "auto" }}>
          {renderPreviewContent()}
        </div>
      </div>
    </div>
  )
}
