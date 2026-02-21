"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { ContactFormModal } from "./ContactFormModal"
import { Send, FileText } from "lucide-react"

interface DocumentPreviewProps {
  formData: Record<string, any>
}

function PreviewField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <span className="font-semibold text-white/80 font-googletitre text-sm">{label} </span>
      <span className="text-white/60 font-googletexte text-sm bg-white/5 px-2 py-0.5 rounded inline-block mt-0.5">
        {value || "Non spécifié"}
      </span>
    </div>
  )
}

function CheckboxList({ data, fallback }: { data: Record<string, any> | undefined; fallback: string }) {
  if (!data) {
    return <span className="text-white/40 text-sm font-googletexte">{fallback}</span>
  }
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {Object.entries(data).map(([key, value]: [string, any]) => (
        <li key={key} className="flex items-center gap-2">
          <div
            className={`w-4 h-4 rounded-sm flex items-center justify-center shrink-0 ${
              value?.checked ? "bg-lightyellow" : "border border-white/20"
            }`}
          >
            {value?.checked && <span className="text-darkblue text-xs font-bold">&#10003;</span>}
          </div>
          <span className="text-white/60 text-sm font-googletexte">{value?.label || key}</span>
        </li>
      ))}
    </ul>
  )
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="bg-white/5 border border-white/10 py-2.5 px-4 rounded-xl mb-4">
      <h2 className="text-base font-bold text-white font-googletitre">{title}</h2>
    </div>
  )
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-lightyellow/80 font-semibold font-googletitre text-sm mb-3 border-b border-white/10 pb-1 inline-block">
        {title}
      </h3>
      <div className="ml-2 md:ml-4 space-y-4 mt-2">
        {children}
      </div>
    </div>
  )
}

export function DocumentPreview({ formData }: DocumentPreviewProps) {
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
        <div className="space-y-6 p-6">
          <Skeleton className="h-12 w-3/4 bg-white/10" />
          <Skeleton className="h-8 w-1/2 bg-white/10" />
          <div className="space-y-4 mt-8">
            <Skeleton className="h-6 w-full bg-white/5" />
            <Skeleton className="h-6 w-full bg-white/5" />
            <Skeleton className="h-6 w-3/4 bg-white/5" />
          </div>
          <div className="space-y-4 mt-8">
            <Skeleton className="h-6 w-full bg-white/5" />
            <Skeleton className="h-6 w-full bg-white/5" />
            <Skeleton className="h-6 w-3/4 bg-white/5" />
          </div>
        </div>
      )
    }

    return (
      <div className="w-full space-y-8">
        {/* Page de couverture */}
        <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl border-t-4 border-t-lightyellow">
          <div className="text-center space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white font-googletitre">CAHIER DES CHARGES</h1>
            <h2 className="text-lg text-white/70 font-medium font-googletexte">Création / Refonte de site web</h2>

            <div className="mt-8 space-y-3 text-left max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row sm:gap-2">
                <span className="font-googletitre text-white/80 font-semibold text-sm sm:w-40 shrink-0">Organisation :</span>
                <span className="text-sm text-white/60 font-googletexte">{formData.organisation_name || "Non spécifié"}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-2">
                <span className="font-googletitre text-white/80 font-semibold text-sm sm:w-40 shrink-0">Secteur :</span>
                <span className="text-sm text-white/60 font-googletexte">{formData.secteur_activite || "Non spécifié"}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-2">
                <span className="font-googletitre text-white/80 font-semibold text-sm sm:w-40 shrink-0">Date :</span>
                <span className="text-sm text-white/60 font-googletexte">{formData.date_redaction || new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:gap-2">
                <span className="font-googletitre text-white/80 font-semibold text-sm sm:w-40 shrink-0">Rédacteur :</span>
                <span className="text-sm text-white/60 font-googletexte">{formData.redacteur || "Non spécifié"}</span>
              </div>
            </div>

            <p className="text-xs text-white/30 mt-6 font-googletexte">Document confidentiel</p>
          </div>
        </div>

        {/* Table des matières */}
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 md:p-6">
          <h2 className="text-base font-bold text-white text-center mb-4 font-googletitre">TABLE DES MATIÈRES</h2>
          <ul className="space-y-2">
            {[
              "1. Présentation générale du projet",
              "2. Spécifications fonctionnelles",
              "3. Spécifications graphiques et ergonomiques",
              "4. Spécifications techniques",
              "5. Gestion de contenu",
              "6. Prestations attendues",
              "7. Planning et budget",
              "8. Modalités de réponse",
              "9. Annexes",
            ].map((item) => (
              <li key={item} className="text-sm text-white/60 font-googletexte py-1 border-b border-white/5 last:border-0">
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Section 1 */}
        <div>
          <SectionHeader title="1. PRÉSENTATION GÉNÉRALE DU PROJET" />
          <div className="ml-2 md:ml-4 space-y-6">
            <SubSection title="1.1 Contexte">
              <PreviewField label="Nom de l'organisation :" value={formData.organisation_name} />
              <PreviewField label="Secteur d'activité :" value={formData.secteur_activite} />
              <PreviewField label="Public cible :" value={formData.public_cible} />
              <PreviewField label="Problématiques identifiées :" value={formData.problematiques} />
              <PreviewField label="Objectifs principaux :" value={formData.objectifs_refonte} />
            </SubSection>
            <SubSection title="1.2 Description du site existant">
              <PreviewField label="URL du site actuel :" value={formData.site_url} />
              <PreviewField label="Date de création :" value={formData.site_creation_date} />
              <PreviewField label="Technologies utilisées :" value={formData.technologies_actuelles} />
            </SubSection>
          </div>
        </div>

        {/* Section 2 */}
        <div>
          <SectionHeader title="2. SPÉCIFICATIONS FONCTIONNELLES" />
          <div className="ml-2 md:ml-4 space-y-6">
            <SubSection title="2.1 Architecture de l'information">
              <PreviewField label="Arborescence proposée :" value={formData.arborescence} />
              <PreviewField label="Types de contenus :" value={formData.types_contenus} />
            </SubSection>
            <SubSection title="2.2 Fonctionnalités standards">
              <div className="bg-white/5 rounded-xl p-3 md:p-4">
                <CheckboxList data={formData.fonctionnalites_standards} fallback="Aucune fonctionnalité standard sélectionnée" />
              </div>
            </SubSection>
            <SubSection title="2.3 Fonctionnalités avancées">
              <div className="bg-white/5 rounded-xl p-3 md:p-4">
                <CheckboxList data={formData.fonctionnalites_avancees} fallback="Aucune fonctionnalité avancée sélectionnée" />
              </div>
            </SubSection>
            <SubSection title="2.4 Contraintes techniques">
              <PreviewField label="Contraintes techniques :" value={formData.contraintes_techniques} />
            </SubSection>
          </div>
        </div>

        {/* Section 3 */}
        <div>
          <SectionHeader title="3. SPÉCIFICATIONS GRAPHIQUES ET ERGONOMIQUES" />
          <div className="ml-2 md:ml-4 space-y-6">
            <SubSection title="3.1 Charte graphique">
              <div className="bg-white/5 rounded-xl p-3 md:p-4">
                <CheckboxList data={formData.charte_graphique} fallback="Aucune information sur la charte graphique" />
              </div>
              <PreviewField label="Sites d'inspiration :" value={formData.inspirations} />
              <PreviewField label="Couleurs principales :" value={formData.couleurs} />
              <PreviewField label="Typographie :" value={formData.typographies} />
              <PreviewField label="Ambiance :" value={formData.ambiance} />
              <PreviewField label="Priorité UX :" value={formData.ux_priorites} />
              <PreviewField label="Responsive :" value={formData.responsive} />
            </SubSection>
            <SubSection title="3.2 Ergonomie">
              <PreviewField label="Accessibilité :" value={formData.accessibilite} />
              <PreviewField label="Navigation :" value={formData.navigation} />
            </SubSection>
          </div>
        </div>

        {/* Section 4 */}
        <div>
          <SectionHeader title="4. SPÉCIFICATIONS TECHNIQUES" />
          <div className="ml-2 md:ml-4 space-y-6">
            <SubSection title="4.1 Outils et Technologies">
              <PreviewField label="CMS ou Framework :" value={formData.cms_framework} />
              <PreviewField label="Langages de programmation :" value={formData.langages} />
              <PreviewField label="Base de données :" value={formData.base_donnees} />
            </SubSection>
            <SubSection title="4.2 Hébergement">
              <PreviewField label="Type d'hébergement :" value={formData.hebergement} />
            </SubSection>
            <SubSection title="4.3 Sécurité">
              <PreviewField label="Niveau de sécurité :" value={formData.securite} />
            </SubSection>
            <SubSection title="4.4 Performance et SEO">
              <PreviewField label="Temps de chargement cible :" value={formData.performance} />
              <PreviewField label="Exigences SEO :" value={formData.seo} />
            </SubSection>
          </div>
        </div>

        {/* Section 5 */}
        <div>
          <SectionHeader title="5. GESTION DE CONTENU" />
          <div className="ml-2 md:ml-4 space-y-6">
            <SubSection title="5.1 Contenus">
              <PreviewField label="Volume à migrer :" value={formData.migration_volume} />
              <PreviewField label="Types de migration :" value={formData.migration_types} />
              <PreviewField label="Contenus à créer :" value={formData.contenus_creer} />
              <PreviewField label="Profils administrateurs :" value={formData.profils_admin} />
            </SubSection>
            <SubSection title="5.2 Formation et support">
              <PreviewField label="Formation proposée :" value={formData.formation_proposee} />
              <PreviewField label="Support technique :" value={formData.support_technique} />
            </SubSection>
          </div>
        </div>

        {/* Section 6 */}
        <div>
          <SectionHeader title="6. PRESTATIONS ATTENDUES" />
          <div className="ml-2 md:ml-4 space-y-6">
            <SubSection title="6.1 Phases du projet">
              <div className="bg-white/5 rounded-xl p-3 md:p-4">
                <CheckboxList data={formData.phases_projet} fallback="Aucune phase sélectionnée" />
              </div>
              <PreviewField label="Méthodologie :" value={formData.methodologie} />
              <PreviewField label="Garantie :" value={formData.garantie} />
            </SubSection>
          </div>
        </div>

        {/* Section 7 */}
        <div>
          <SectionHeader title="7. PLANNING ET BUDGET" />
          <div className="ml-2 md:ml-4 space-y-6">
            <SubSection title="7.1 Planning">
              <PreviewField label="Date de démarrage :" value={formData.date_demarrage} />
              <PreviewField label="Date de mise en ligne :" value={formData.date_mise_en_ligne} />
            </SubSection>
            <SubSection title="7.2 Budget">
              <PreviewField label="Budget global :" value={formData.budget_global} />
              <PreviewField label="Budget maintenance :" value={formData.budget_maintenance} />
            </SubSection>
          </div>
        </div>

        {/* Section 8 */}
        <div>
          <SectionHeader title="8. MODALITÉS DE RÉPONSE" />
          <div className="ml-2 md:ml-4 space-y-6">
            <SubSection title="8.1 Modalités">
              <PreviewField label="Date limite :" value={formData.date_limite} />
              <PreviewField label="Mode de réponse :" value={formData.mode_reponse} />
            </SubSection>
            <SubSection title="8.2 Critères de sélection">
              <PreviewField label="Critères techniques :" value={formData.criteres_techniques} />
              <PreviewField label="Critères financiers :" value={formData.criteres_financiers} />
            </SubSection>
            <SubSection title="8.3 Contact">
              <PreviewField label="Personne référente :" value={formData.contact_nom} />
              <PreviewField label="Email :" value={formData.contact_email} />
            </SubSection>
          </div>
        </div>

        {/* Section 9 */}
        <div>
          <SectionHeader title="9. ANNEXES" />
          <div className="ml-2 md:ml-4 space-y-6">
            <SubSection title="9.1 Documents fournis">
              <div className="bg-white/5 rounded-xl p-3 md:p-4">
                <CheckboxList data={formData.documents_fournis} fallback="Aucun document annexe" />
              </div>
            </SubSection>
          </div>
        </div>

        {/* Pied de page */}
        <div className="border-t border-white/10 pt-4 mt-8 flex flex-col sm:flex-row justify-between gap-2 text-xs text-white/40 font-googletexte">
          <span>{formData.organisation_name || "Cahier des charges"}</span>
          <span>{formData.redacteur || "Rédigé par"}</span>
          <span>{formData.date_redaction || new Date().toLocaleDateString()}</span>
          <span>Version : {formData.version || "1.0"}</span>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="rounded-2xl border border-white/10 bg-mediumblue/60 backdrop-blur-xl overflow-hidden">
        {/* Header bar */}
        <div className="bg-white/5 border-b border-white/10 p-4 md:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-lightyellow" />
            <h3 className="text-base font-semibold text-white font-googletitre">Apercu du document</h3>
          </div>
          <button
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-lg font-bold bg-lightyellow text-darkblue hover:shadow-[0_0_20px_rgba(255,107,107,0.45)] transition-all duration-300 shadow font-googletitre"
            onClick={() => setShowContactForm(true)}
          >
            <Send className="w-4 h-4" />
            Envoyer pour devis
          </button>
          {showContactForm && (
            <ContactFormModal
              formData={formData}
              onClose={() => setShowContactForm(false)}
            />
          )}
        </div>

        {/* Document content */}
        <div className="p-4 md:p-8 max-h-[800px] overflow-y-auto">
          {renderPreviewContent()}
        </div>
      </div>
    </motion.div>
  )
}
