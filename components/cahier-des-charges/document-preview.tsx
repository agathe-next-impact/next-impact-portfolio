"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { ContactFormModal } from "./ContactFormModal" // Assure-toi que ce composant existe et est importé


interface DocumentPreviewProps {
  formData: Record<string, any>
}

export function DocumentPreview({ formData }: DocumentPreviewProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [showContactForm, setShowContactForm] = useState(false) // Ajout de l'état

  useEffect(() => {
    // Simuler un temps de chargement pour l'effet visuel
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  // Fonction pour vérifier si une section a des données
  const hasSectionData = (sectionId: string): boolean => {
    switch (sectionId) {
      case "section-1":
        return !!(
          formData.organisation_name ||
          formData.secteur_activite ||
          formData.public_cible ||
          formData.problematiques ||
          formData.objectifs_refonte ||
          formData.site_url ||
          formData.site_creation_date ||
          formData.technologies_actuelles
        );
      case "section-2":
        return !!(
          formData.arborescence ||
          formData.types_contenus ||
          formData.fonctionnalites_standards ||
          formData.fonctionnalites_avancees ||
          formData.contraintes_techniques
        )
      // Ajouter d'autres sections selon besoin
      default:
        return false
    }
  }

  // Rendu du contenu de prévisualisation
  const renderPreviewContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6 p-6">
          <Skeleton className="h-12 w-3/4 bg-lightblue/10" />
          <Skeleton className="h-8 w-1/2 bg-lightblue/10" />
          <div className="space-y-4 mt-8">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
          <div className="space-y-4 mt-8">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>
      )
    }

    return (
      <div className="w-full p-6 space-y-8 rounded-2xl">
        {/* Page de couverture */}
        <div className="bg-lightblue/10 p-8 border-t-8 border-regularblue mb-12">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold text-mediumblue">CAHIER DES CHARGES</h1>
            <h2 className="text-xl text-regularblue font-medium">Création / Refonte de site web</h2>
            

            <div className="mt-12 space-y-4 text-left max-w-md mx-auto">
              <div className="flex">
                <span className="font-googletitre text-mediumblue w-40">Organisation:</span>
                <span className="text-sm text-regularblue/80">{formData.organisation_name || "Non spécifié"}</span>
              </div>
              <div className="flex">
                <span className="font-googletitre text-mediumblue w-40">Secteur d'activité:</span>
                <span className="text-sm text-regularblue/80">{formData.secteur_activite || "Non spécifié"}</span>
              </div>
              <div className="flex">
                <span className="font-googletitre text-mediumblue w-40">Date de rédaction:</span>
                <span className="text-sm text-regularblue/80">{formData.date_redaction || new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex">
                <span className="font-googletitre text-mediumblue w-40">Rédacteur:</span>
                <span className="text-sm text-regularblue/80">{formData.redacteur || "Non spécifié"}</span>
              </div>
            </div>

            <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-mediumblue">
              Document confidentiel
            </div>
          </div>
        </div>

       
        <div className="mb-12">
          <h2 className="text-xl font-bold text-blue-800 text-center mb-4">TABLE DES MATIÈRES</h2>
          <div className="border-t border-b py-4">
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-mediumblue">1. PRÉSENTATION GÉNÉRALE DU PROJET</span>
              </li>
              <li className="flex justify-between">
                <span className="text-mediumblue">2. SPÉCIFICATIONS FONCTIONNELLES</span>
              </li>
              <li className="flex justify-between">
                <span className="text-mediumblue">3. SPÉCIFICATIONS GRAPHIQUES ET ERGONOMIQUES</span>
              </li>
              <li className="flex justify-between">
                <span className="text-mediumblue">4. SPÉCIFICATIONS TECHNIQUES</span>
              </li>
              <li className="flex justify-between">
                <span className="text-mediumblue">5. GESTION DE CONTENU</span>
              </li>
              <li className="flex justify-between">
                <span className="text-mediumblue">6. PRESTATIONS ATTENDUES</span>
              </li>
              <li className="flex justify-between">
                <span className="text-mediumblue">7. PLANNING ET BUDGET</span>
              </li>
              <li className="flex justify-between">
                <span>8. MODALITÉS DE RÉPONSE</span>
              </li>
              <li className="flex justify-between">
                <span className="text-mediumblue">9. ANNEXES</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Section 1 */}
        <div className="mb-10">
          <div className="bg-lightblue/10 text-white py-2 px-4 rounded-xl mb-4">         
            <h2 className="text-lg font-bold text-regularblue">1. PRÉSENTATION GÉNÉRALE DU PROJET</h2>
          </div>

          <div className="ml-4 space-y-6">
            <div>
              <h3 className="text-blue-800 font-semibold mb-2 border-b border-lightblue/50 inline-block">1.1 Contexte</h3>
              <div className="ml-4 space-y-6 mt-3">
                <div>
                  <span className="font-semibold text-mediumblue">Nom de l'organisation: </span>
                  <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.organisation_name || "Non spécifié"}</span>
                </div>
                <div>
                  <span className="font-semibold text-mediumblue">Secteur d'activité: </span>
                  <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.secteur_activite || "Non spécifié"}</span>
                </div>
                <div>
                  <span className="font-semibold text-mediumblue">Public cible: </span>
                  <div className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded mt-1">{formData.public_cible || "Non spécifié"}</div>
                </div>
                <div>
                  <span className="font-semibold text-mediumblue">Problématiques identifiées: </span>
                  <div className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded mt-1">{formData.problematiques || "Non spécifié"}</div>
                </div>
                <div>
                  <span className="font-semibold text-mediumblue">Objectifs principaux: </span>
                  <div className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded mt-1">
                    {formData.objectifs_refonte || "Non spécifié"}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-blue-800 font-semibold mb-2 border-b border-lightblue/50 inline-block">
                1.2 Description du site existant
              </h3>
              <div className="ml-4 space-y-6 mt-3">
                <div>
                  <span className="font-semibold text-mediumblue">URL du site actuel: </span>
                  <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.site_url || "Non spécifié"}</span>
                </div>
                <div>
                  <span className="font-semibold text-mediumblue">Date de création: </span>
                  <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.site_creation_date || "Non spécifié"}</span>
                </div>
                <div>
                  <span className="font-semibold text-mediumblue">Technologies utilisées: </span>
                  <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">
                    {formData.technologies_actuelles || "Non spécifié"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="mb-10">
          <div className="bg-lightblue/10 text-white py-2 px-4 rounded-xl mb-4">
            <h2 className="text-lg font-bold text-regularblue">2. SPÉCIFICATIONS FONCTIONNELLES</h2>
          </div>

          <div className="ml-4 space-y-6">
            <div>
              <h3 className="text-blue-800 font-semibold mb-2 border-b border-lightblue/50 inline-block">
                2.1 Architecture de l'information
              </h3>
              <div className="ml-4 space-y-6 mt-3">
                <div>
                  <span className="font-semibold text-mediumblue">Arborescence proposée: </span>
                  <div className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded mt-1">{formData.arborescence || "Non spécifié"}</div>
                </div>
                <div>
                  <span className="font-semibold text-mediumblue">Types de contenus: </span>
                  <div className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded mt-1">{formData.types_contenus || "Non spécifié"}</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-blue-800 font-semibold mb-2 border-b border-lightblue/50 inline-block">
                2.2 Fonctionnalités standards
              </h3>
              <div className="ml-4 mt-3 bg-lightblue/5 text-mediumblue/90 p-3 rounded">
              {formData.fonctionnalites_standards ? (
                <ul className="grid grid-cols-2 gap-2">
                  {Object.entries(formData.fonctionnalites_standards).map(([key, value]) => (
                    <li key={key} className="flex items-center">
                      <div
                        className={`w-4 h-4 mr-2 rounded-sm ${
                          value.checked ? "bg-regularblue" : "border border-gray-300"
                        }`}
                      >
                        {value.checked && <span className="text-white text-xs flex justify-center">✓</span>}
                      </div>
                      {value.label}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-gray-">Aucune fonctionnalité standard sélectionnée</span>
              )}
              </div>
            </div>
            <div>
              <h3 className="text-blue-800 font-semibold mb-2 border-b border-lightblue/50 inline-block">
                2.3 Fonctionnalités avancées
              </h3>
              <div className="ml-4 mt-3 bg-lightblue/5 text-mediumblue/90 p-3 rounded">
                {formData.fonctionnalites_avancees ? (
                  <ul className="grid grid-cols-2 gap-2">
                    {Object.entries(formData.fonctionnalites_avancees).map(([key, checked]) => (
                      <li key={key} className="flex items-center">
                        <div
                          className={`w-4 h-4 mr-2 rounded-sm ${checked ? "bg-regularblue" : "border border-gray-300"}`}
                        >
                          {Boolean(checked) && <span className="text-white text-xs flex justify-center">✓</span>}
                        </div>
                        {key}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-mediumblue">Aucune fonctionnalité avancée sélectionnée</span>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-blue-800 font-semibold mb-2 border-b border-lightblue/50 inline-block">
                2.4 Contraintes techniques
              </h3>
              <div className="ml-4 space-y-6 mt-3">
                <div>
                  <span className="font-semibold text-mediumblue">Contraintes techniques: </span>
                  <div className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded mt-1">{formData.contraintes_techniques || "Non spécifié"}</div>
                </div>
              </div>
              </div>
          </div>
        </div>

        {/* Section 3 */}
        <div className="mb-10">
          <div className="bg-lightblue/10 text-white py-2 px-4 rounded-xl mb-4">
            <h2 className="text-lg font-bold text-regularblue">3. SPÉCIFICATIONS GRAPHIQUES ET ERGONOMIQUES</h2>
          </div>
          <div className="ml-4 space-y-6">
            <div>
              <h3 className="text-blue-800 font-semibold mb-2 border-b border-lightblue/50 inline-block">
                3.1 Charte graphique
              </h3>
              <div className="ml-4 space-y-6 mt-3">
              <div className="ml-4 mt-3 bg-lightblue/5 text-mediumblue/90 p-3 rounded">
              {formData.charte_graphique ? (
                <ul className="grid grid-cols-2 gap-2">
                  {Object.entries(formData.charte_graphique).map(([key, value]) => (
                    <li key={key} className="flex items-center">
                      <div
                        className={`w-4 h-4 mr-2 rounded-sm ${
                          value.checked ? "bg-regularblue" : "border border-gray-300"
                        }`}
                      >
                        {value.checked && <span className="text-white text-xs flex justify-center">✓</span>}
                      </div>
                      {value.label}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-mediumblue">Aucune information sur la charte graphique</span>
              )}
              </div>
                <div>
                  <span className="font-semibold text-mediumblue">Sites d'inspiration : </span> 
                  <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.inspirations || "Non spécifié"}</span>
                </div>
500
                <div>
                  <span className="font-semibold text-mediumblue">Couleurs principales: </span>
                  <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.couleurs_principales || "Non spécifié"}</span>
                </div>
                <div>
                  <span className="font-semibold text-mediumblue">Typographie: </span>
                  <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.typographie || "Non spécifié"}</span>
                </div>
                <div>
                  <span className="font-semibold text-mediumblue">Ambiance : </span>
                  <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.ambiance || "Non spécifié"}</span>
                </div>
                <div>
                  <span className="font-semibold text-mediumblue">Priorité UX : </span>
                  <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.ux_priorites || "Non spécifié"}</span>
                </div>
                <div>
                  <span className="font-semibold text-mediumblue">Responsive : </span>
                  <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.responsive || "Non spécifié"}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-blue-800 font-semibold mb-2 border-b border-lightblue/50 inline-block">
                3.2 Ergonomie
              </h3>
              <div className="ml-4 space-y-6 mt-3">
                <div>
                  <span className="font-semibold text-mediumblue">Accessibilité: </span>
                  <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.accessibilite || "Non spécifié"}</span>
                </div>
                <div>
                  <span className="font-semibold text-mediumblue">Navigation: </span>
                  <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.navigation || "Non spécifié"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>  
          
        {/* Section 4 */}
        <div className="mb-10">
          <div className="bg-lightblue/10 text-white py-2 px-4 rounded-xl mb-4">
            <h2 className="text-lg font-bold text-regularblue">4. SPÉCIFICATIONS TECHNIQUES</h2>
          </div>

          <div>
            <h3 className="text-blue-800 font-semibold mb-2 border-b border-lightblue/50 inline-block">
              4.1 Outils et Technologies
            </h3>
            <div className="ml-4 space-y-6 mt-3">
              <div>
                <span className="font-semibold text-mediumblue">Type de CMS ou Framework: </span>
                <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.cms_framework || "Non spécifié"}</span>
              </div>
              <div>
                <span className="font-semibold text-mediumblue">Langages de programmation : </span>
                <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.langages || "Non spécifié"}</span>
              </div>
              <div>
                <span className="font-semibold text-mediumblue">Base de données : </span>
                <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.base_donnees || "Non spécifié"}</span>
              </div>
            </div>

            <h3 className="text-blue-800 font-semibold mb-2 border-b border-lightblue/50 inline-block">
              4.2 Hébergement
            </h3>
            <div className="ml-4 space-y-6 mt-3">
              <div>
                <span className="font-semibold text-mediumblue">Type d'hébergement: </span>
                <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.type_hebergement || "Non spécifié"}</span>
              </div>
            </div>

            <h3 className="text-blue-800 font-semibold mb-2 border-b border-lightblue/50 inline-block">
              4.3 Sécurité
            </h3>
            <div className="ml-4 space-y-6 mt-3">
              <div>
                <span className="font-semibold text-mediumblue">Protocoles de sécurité: </span>
                <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.protocoles_securite || "Non spécifié"}</span>
              </div>
            </div>

            <h3 className="text-blue-800 font-semibold mb-2 border-b border-lightblue/50 inline-block">
              4.4 Performance et SEO
            </h3>
            <div className="ml-4 space-y-6 mt-3">
              <div>
                <span className="font-semibold text-mediumblue">Temps de chargement : </span>
                <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.performance || "Non spécifié"}</span>
              </div>
              <div>
                <span className="font-semibold text-mediumblue">Exigeances SEO spécifiques : </span>
                <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.seo || "Non spécifié"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5 */}
        <div className="mb-10">
          <div className="bg-lightblue/10 text-white py-2 px-4 rounded-xl mb-4">
            <h2 className="text-lg font-bold text-regularblue">5. GESTION DE CONTENU</h2>
          </div>

          <div className="ml-4 space-y-6">
            <div>
              <h3 className="text-blue-800 font-semibold mb-2 border-b border-lightblue/50 inline-block">
                5.1 Contenus
              </h3>
              <div className="ml-4 space-y-6 mt-3">
                <div>
                  <span className="font-semibold text-mediumblue">Contenus à migrer : </span>
                  <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.migration_volume || "Non spécifié"}</span>
                </div>
                <div>
                  <span className="font-semibold text-mediumblue">Type de migration : </span>
                  <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.migration_types || "Non spécifié"}</span>
                </div>
                <div>
                  <span className="font-semibold text-mediumblue">Contenus à créer : </span>
                  <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.contenus_creer || "Non spécifié"}</span>
                </div>
                <div>
                  <span className="font-semibold text-mediumblue">Profils des administrateurs : </span>
                  <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.profils_admin || "Non spécifié"}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-blue-800 font-semibold mb-2 border-b border-lightblue/50 inline-block">
                5.2 Formation et support
              </h3>
              <div className="ml-4 space-y-6 mt-3">
                <div>
                  <span className="font-semibold text-mediumblue">Formation proposée: </span>
                  <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.formation_proposee || "Non spécifié"}</span>
                </div>
                <div>
                  <span className="font-semibold text-mediumblue">Support technique: </span>
                  <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.support_technique || "Non spécifié"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 6 */}
        <div className="mb-10">
          <div className="bg-lightblue/10 text-white py-2 px-4 rounded-xl mb-4">
            <h2 className="text-lg font-bold text-regularblue">6. PRESTATIONS ATTENDUES</h2>
          </div>

          <div className="ml-4 space-y-6">
            <div>
              <h3 className="text-blue-800 font-semibold mb-2 border-b border-lightblue/50 inline-block">
                6.1 Prestations de gestion de projet
              </h3>
              <div className="ml-4 space-y-6 mt-3">
                
              {formData.phases_projet ? (
                <ul className="grid grid-cols-2 gap-2">
                  {Object.entries(formData.phases_projet).map(([key, value]) => (
                    <li key={key} className="flex items-center">
                      <div
                        className={`w-4 h-4 mr-2 rounded-sm ${
                          value.checked ? "bg-regularblue" : "border border-gray-300"
                        }`}
                      >
                        {value.checked && <span className="text-white text-xs flex justify-center">✓</span>}
                      </div>
                      {value.label}
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-mediumblue">Aucune information sur la gestion du projet</span>
              )}
                <div>
                  <span className="font-semibold text-mediumblue">Méthodologie : </span>
                  <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.methodologie || "Non spécifié"}</span>
                </div>
                <div>
                  <span className="font-semibold text-mediumblue">Garantie : </span>
                  <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.garantie || "Non spécifié"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 7 */}
        <div className="mb-10">
          <div className="bg-lightblue/10 text-white py-2 px-4 rounded-xl mb-4">
            <h2 className="text-lg font-bold text-regularblue">7. PLANNING ET BUDGET</h2>
          </div>

          <div className="ml-4 space-y-6">
            <div>
              <h3 className="text-blue-800 font-semibold mb-2 border-b border-lightblue/50 inline-block">
                7.1 Planning
              </h3>
              <div className="ml-4 space-y-6 mt-3">
                <div>
                  <span className="font-semibold text-mediumblue">Date de démarrage : </span>
                  <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.date_demarrage || "Non spécifié"}</span>
                </div>
                <div>
                  <span className="font-semibold text-mediumblue">Date de mise en ligne: </span>
                  <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.date_mise_en_ligne || "Non spécifié"}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-blue-800 font-semibold mb-2 border-b border-lightblue/50 inline-block">
                7.2 Budget
              </h3>
              <div className="ml-4 space-y-6 mt-3">
                <div>
                  <span className="font-semibold text-mediumblue">Budget global : </span>
                  <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.budget_global || "Non spécifié"}</span>
                </div>
                <div>
                  <span className="font-semibold text-mediumblue">Budget de maintenance : </span>
                  <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.budget_maintenance || "Non spécifié"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 8 */}
        <div className="mb-10">
          <div className="bg-lightblue/10 text-white py-2 px-4 rounded-xl mb-4">
            <h2 className="text-lg font-bold text-regularblue">8. MODALITÉS DE RÉPONSE</h2>
          </div>

          <div className="ml-4 space-y-6">
            <div>
              <h3 className="text-blue-800 font-semibold mb-2 border-b border-lightblue/50 inline-block">
                8.1 Modalités de réponse
              </h3>
              <div className="ml-4 space-y-6 mt-3">
                <div>
                  <span className="font-semibold text-mediumblue">Date limite de réponse: </span>
                  <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.date_limite || "Non spécifié"}</span>
                </div>
                <div>
                  <span className="font-semibold text-mediumblue">Mode de réponse: </span>
                  <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.mode_reponse || "Non spécifié"}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-blue-800 font-semibold mb-2 border-b border-lightblue/50 inline-block">
                8.2 Critères de sélection
              </h3>
              <div className="ml-4 space-y-6 mt-3">
                <div>
                  <span className="font-semibold text-mediumblue">Critères techniques: </span>
                  <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.criteres_techniques || "Non spécifié"}</span>
                </div>
                <div>
                  <span className="font-semibold text-mediumblue">Critères financiers: </span>
                  <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.criteres_financiers || "Non spécifié"}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-blue-800 font-semibold mb-2 border-b border-lightblue/50 inline-block">
                8.2 Contact
              </h3>
              <div className="ml-4 space-y-6 mt-3">
                <div>
                  <span className="font-semibold text-mediumblue">Personne référente : </span>
                  <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.contact_nom || "Non spécifié"}</span>
                </div>
                <div>
                  <span className="font-semibold text-mediumblue">Adresse email de la personne référente : </span>
                  <span className="bg-lightblue/5 text-mediumblue/90 px-2 py-1 rounded">{formData.contact_email || "Non spécifié"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 9 */}
        <div className="mb-10">
          <div className="bg-lightblue/10 text-white py-2 px-4 rounde rounded-xl mb-4">
            <h2 className="text-lg font-bold text-regularblue">9. ANNEXES</h2>
          </div>

          <div className="ml-4 space-y-6">
            <div>
              <h3 className="text-blue-800 font-semibold mb-2 border-b border-lightblue/50 inline-block">
                9.1 Annexes
              </h3>
              <div className="ml-4 space-y-6 mt-3">
                {formData.documents_fournis ? (
                  <ul className="grid grid-cols-2 gap-2">
                    {Object.entries(formData.documents_fournis).map(([key, value]) => (
                      <li key={key} className="flex items-center">
                        <div
                          className={`w-4 h-4 mr-2 rounded-sm ${
                            value.checked ? "bg-regularblue" : "border border-gray-300"
                          }`}
                        >
                          {value.checked && <span className="text-white text-xs flex justify-center">✓</span>}
                        </div>
                        {value.label}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-mediumblue">Aucune information sur la gestion du projet</span>
                )}
              </div>
            </div>
          </div>
        </div>

              

        {/* Pied de page */}
        <div className="border-t pt-4 mt-12 flex justify-between text-sm text-mediumblue">
          <div>{formData.organisation_name || "Cahier des charges"}</div>
          <div>{formData.redacteur || "Rédigé par"}</div>
          <div>{formData.date_redaction || new Date().toLocaleDateString()}</div>
          <div>Version: {formData.version || "1.0"}</div>
        </div>

      </div>
    );
  };

  return (
    <Card className="border-2 border-lightblue/20 rounded-2xl">
      <div className="bg-lightblue/20 p-4 border-b border-lightblue/20 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-blue-800">Prévisualisation du document</h3>
        <button
          className="bg-regularblue hover:bg-regularblue/80 text-white text-base font-regular px-4 py-2 rounded-full transition"
          onClick={() => setShowContactForm(true)}
        >
          Envoyer pour devis
        </button>
        {showContactForm && (
          <ContactFormModal
            formData={formData}
            onClose={() => setShowContactForm(false)}
          />
        )}
      </div>


      <ScrollArea className="h-[800px]">
        <div className="bg-white mx-auto my-6 px-24" style={{ minHeight: "297mm" }}>
          {renderPreviewContent()}
        </div>
      </ScrollArea>
    </Card>
  );
}