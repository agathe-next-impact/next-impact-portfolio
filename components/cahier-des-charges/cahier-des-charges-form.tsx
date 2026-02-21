"use client";

import type React from "react";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentPreview } from "@/components/cahier-des-charges/document-preview";
import { FileText, Eye, ArrowRight } from "lucide-react";

type FormSection = {
  id: string;
  title: string;
  fields: FormField[];
};

type FormField = {
  id: string;
  label: string;
  type: "text" | "textarea" | "checkbox" | "checkboxGroup";
  options?: { id: string; label: string }[];
  placeholder?: string;
};

export function CahierDesChargesForm() {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [activeTab, setActiveTab] = useState<string>("form");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleInputChange = (id: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleCheckboxGroupChange = (
    groupId: string,
    itemId: string,
    checked: boolean,
    label: string
  ) => {
    setFormData((prev) => {
      const currentGroup = prev[groupId] || {};
      return {
        ...prev,
        [groupId]: {
          ...currentGroup,
          [itemId]: checked
            ? { checked: true, label }
            : { checked: false, label },
        },
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleTabChange("preview");
  };

  const filledCount = Object.values(formData).filter((v) => {
    if (typeof v === "string") return v.trim().length > 0;
    if (typeof v === "boolean") return v;
    if (typeof v === "object" && v !== null) return Object.values(v).some((item: any) => item?.checked);
    return false;
  }).length;

  return (
    <section className="w-full max-w-6xl mx-auto">
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        {/* Tab navigation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex justify-center mb-8"
        >
          <TabsList className="flex bg-white/10 backdrop-blur-sm p-1 rounded-full gap-1">
            <TabsTrigger value="form" className="rounded-full data-[state=active]:bg-background/10 whitespace-nowrap shrink-0 text-xs md:text-sm flex items-center gap-2">
              <FileText className="h-4 w-4 mr-4"  />
              Formulaire
            </TabsTrigger>
            <TabsTrigger value="preview" className="rounded-full data-[state=active]:bg-background/10 whitespace-nowrap shrink-0 text-xs md:text-sm flex items-center gap-2">
              <Eye className="h-4 w-4 mr-4" />
              Apercu
            </TabsTrigger>
          </TabsList>
        </motion.div>

        <TabsContent value="form">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Progress indicator */}
            <div className="rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 mb-6 flex items-center justify-between">
              <p className="text-sm text-white/60 font-googletexte">
                <span className="text-lightyellow font-bold">{filledCount}</span> champ{filledCount > 1 ? "s" : ""} rempli{filledCount > 1 ? "s" : ""}
              </p>
              <Button
                onClick={() => handleTabChange("preview")}
                variant="ghost"
                className="gap-2 text-sm text-white/60 hover:text-white hover:bg-white/10 rounded-full"
              >
                Voir l&apos;apercu
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="rounded-2xl border border-white/10 bg-mediumblue/60 backdrop-blur-xl p-4 md:p-8">
                <h2 className="text-white font-googletitre text-2xl font-medium mb-1">
                  Votre projet
                </h2>
                <p className="text-white/60 font-googletexte text-sm mb-6">
                  Remplissez les sections ci-dessous pour générer votre cahier des charges
                </p>

                <Accordion
                  type="multiple"
                  defaultValue={formSections.length > 0 ? [formSections[0].id] : []}
                  className="w-full"
                >
                  {formSections.map((section) => (
                    <AccordionItem key={section.id} value={section.id}>
                      <AccordionTrigger className="text-lg md:text-xl font-semibold font-googletitre">
                        {section.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid gap-6">
                          {section.fields.map((field) => (
                            <div key={field.id} className="space-y-2">
                              {field.type === "checkboxGroup" ? (
                                <>
                                  <Label className="text-sm font-semibold text-white/80 font-googletitre">
                                    {field.label}
                                  </Label>
                                  <div className="grid gap-3 pt-2 sm:grid-cols-2">
                                    {field.options?.map((option) => (
                                      <div
                                        key={option.id}
                                        className="flex items-start space-x-2.5 p-2.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                                        onClick={() =>
                                          handleCheckboxGroupChange(
                                            field.id,
                                            option.id,
                                            !(formData[field.id]?.[option.id]?.checked),
                                            option.label
                                          )
                                        }
                                      >
                                        <Checkbox
                                          id={`${field.id}-${option.id}`}
                                          checked={
                                            formData[field.id]?.[option.id]
                                              ?.checked || false
                                          }
                                          onCheckedChange={(checked) =>
                                            handleCheckboxGroupChange(
                                              field.id,
                                              option.id,
                                              checked as boolean,
                                              option.label
                                            )
                                          }
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                        <Label
                                          htmlFor={`${field.id}-${option.id}`}
                                          className="text-sm text-white/70 font-googletexte font-normal leading-tight cursor-pointer"
                                        >
                                          {option.label}
                                        </Label>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              ) : field.type === "checkbox" ? (
                                <div className="flex items-start space-x-2.5 p-2.5 rounded-lg hover:bg-white/5 transition-colors">
                                  <Checkbox
                                    id={field.id}
                                    checked={formData[field.id] || false}
                                    onCheckedChange={(checked) =>
                                      handleInputChange(
                                        field.id,
                                        checked as boolean
                                      )
                                    }
                                  />
                                  <Label
                                    htmlFor={field.id}
                                    className="text-sm text-white/70 font-googletexte font-normal leading-tight cursor-pointer"
                                  >
                                    {field.label}
                                  </Label>
                                </div>
                              ) : (
                                <>
                                  <Label
                                    htmlFor={field.id}
                                    className="text-sm font-semibold text-white/80 font-googletitre"
                                  >
                                    {field.label}
                                  </Label>
                                  {field.type === "textarea" ? (
                                    <Textarea
                                      id={field.id}
                                      placeholder={field.placeholder}
                                      value={formData[field.id] || ""}
                                      onChange={(e) =>
                                        handleInputChange(
                                          field.id,
                                          e.target.value
                                        )
                                      }
                                      className="min-h-[100px] bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-lightblue/40 rounded-xl"
                                    />
                                  ) : (
                                    <Input
                                      id={field.id}
                                      placeholder={field.placeholder}
                                      value={formData[field.id] || ""}
                                      onChange={(e) =>
                                        handleInputChange(
                                          field.id,
                                          e.target.value
                                        )
                                      }
                                      className="bg-white/10 border-white/20 text-white placeholder:text-white/30 focus-visible:ring-lightblue/40 h-11 rounded-xl"
                                    />
                                  )}
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>

                <Separator className="bg-white/10 my-6" />

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    type="submit"
                    className="gap-2 rounded-full text-white bg-coral hover:bg-coral/90 font-googletitre font-bold shadow px-8"
                  >
                    <Eye className="w-4 h-4" />
                    Voir l&apos;apercu du document
                  </Button>
                </div>
              </div>
            </form>
          </motion.div>
        </TabsContent>

        <TabsContent value="preview">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <DocumentPreview formData={formData} />

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                onClick={() => handleTabChange("form")}
                variant="ghost"
                className="gap-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 border border-white/20 font-googletitre"
              >
                <FileText className="w-4 h-4" />
                Retour au formulaire
              </Button>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </section>
  );
}

const formSections: FormSection[] = [
  {
    id: "section-1",
    title: "1. Présentation Générale du Projet",
    fields: [
      {
        id: "organisation_name",
        label: "Nom de l'organisation",
        type: "text",
        placeholder: "Ex: Entreprise XYZ",
      },
      {
        id: "secteur_activite",
        label: "Secteur d'activité",
        type: "text",
        placeholder: "Ex: Commerce, Santé, Éducation...",
      },
      {
        id: "public_cible",
        label: "Public cible",
        type: "textarea",
        placeholder: "Décrivez votre audience principale",
      },
      {
        id: "problematiques",
        label: "Problématiques identifiées avec le site actuel",
        type: "textarea",
        placeholder: "Ex: Lenteur, design obsolète, non responsive...",
      },
      {
        id: "objectifs_refonte",
        label: "Objectifs principaux de la refonte",
        type: "textarea",
        placeholder:
          "Ex: Améliorer l'expérience utilisateur, augmenter les conversions...",
      },
      {
        id: "site_url",
        label: "URL du site actuel",
        type: "text",
        placeholder: "https://www.example.com",
      },
      {
        id: "site_creation_date",
        label: "Date de création du site actuel",
        type: "text",
        placeholder: "Ex: Janvier 2018",
      },
      {
        id: "technologies_actuelles",
        label: "Technologies utilisées actuellement",
        type: "text",
        placeholder: "Ex: WordPress, PHP, MySQL...",
      },
    ],
  },
  {
    id: "section-2",
    title: "2. Spécifications Fonctionnelles",
    fields: [
      {
        id: "arborescence",
        label: "Arborescence proposée (pages principales et sous-pages)",
        type: "textarea",
        placeholder: "Décrivez la structure de votre site",
      },
      {
        id: "types_contenus",
        label: "Types de contenus à prévoir",
        type: "textarea",
        placeholder: "Ex: Articles, produits, témoignages...",
      },
      {
        id: "fonctionnalites_standards",
        label: "Fonctionnalités standards",
        type: "checkboxGroup",
        options: [
          { id: "accueil", label: "Page d'accueil personnalisée" },
          {
            id: "pages_contenu",
            label: "Pages de contenu standard (qui/quoi/pourquoi)",
          },
          { id: "blog", label: "Actualités/Blog" },
          { id: "contact", label: "Formulaire(s) de contact" },
          { id: "galerie", label: "Galerie photos/vidéos" },
          { id: "faq", label: "FAQ" },
          { id: "plan_site", label: "Page plan du site" },
          {
            id: "mentions",
            label: "Mentions légales et politique de confidentialité",
          },
          { id: "recherche", label: "Moteur de recherche interne" },
          { id: "partage", label: "Partage sur réseaux sociaux" },
          { id: "newsletter", label: "Newsletter/inscription" },
          { id: "carte", label: "Carte interactive" },
          { id: "telechargement", label: "Téléchargement de documents" },
        ],
      },
      {
        id: "fonctionnalites_avancees",
        label: "Fonctionnalités avancées",
        type: "checkboxGroup",
        options: [
          { id: "espace_membres", label: "Espace membres/extranet" },
          {
            id: "reservation",
            label: "Système de réservation/prise de rendez-vous",
          },
          { id: "ecommerce", label: "E-commerce/paiement en ligne" },
          { id: "bdd", label: "Base de données consultable" },
          { id: "multilangues", label: "Multisites/multilangues" },
          {
            id: "applications",
            label: "Applications interactives personnalisées",
          },
          { id: "chatbot", label: "Chatbot/assistant virtuel" },
          { id: "personnalisation", label: "Personnalisation utilisateur" },
          { id: "crm", label: "Intégration CRM/ERP" },
          { id: "dashboard", label: "Tableau de bord/statistiques avancées" },
        ],
      },
      {
        id: "contraintes_techniques",
        label: "Contraintes techniques spécifiques",
        type: "textarea",
        placeholder:
          "Ex: Compatibilité avec systèmes existants, sécurité spécifique...",
      },
    ],
  },
  {
    id: "section-3",
    title: "3. Spécifications Graphiques et Ergonomiques",
    fields: [
      {
        id: "charte_graphique",
        label: "Création de charte graphique",
        type: "checkboxGroup",
        options: [
          {
            id: "charte_existante",
            label: "Charte graphique existante à respecter",
          },
          { id: "nouvelle_charte", label: "Nouvelle charte graphique à créer" },
        ],
      },
      {
        id: "inspirations",
        label: "Inspirations/références",
        type: "textarea",
        placeholder: "Ex: URLs de sites que vous appréciez",
      },
      {
        id: "couleurs",
        label: "Couleurs principales",
        type: "text",
        placeholder: "Ex: Bleu #0000FF, Rouge #FF0000",
      },
      {
        id: "typographies",
        label: "Typographies",
        type: "text",
        placeholder: "Ex: Roboto, Open Sans, Montserrat",
      },
      {
        id: "ambiance",
        label: "Ambiance visuelle recherchée",
        type: "textarea",
        placeholder: "Ex: Moderne, épurée, colorée, corporate...",
      },
      {
        id: "ux_priorites",
        label: "Expérience utilisateur priorisée",
        type: "textarea",
        placeholder: "Ex: Simplicité, rapidité, accessibilité...",
      },
      {
        id: "responsive",
        label: "Formats prioritaires (desktop, tablette, mobile)",
        type: "text",
        placeholder: "Ex: Mobile-first, tous formats équivalents...",
      },
      {
        id: "accessibilite",
        label: "Accessibilité (RGAA, WCAG)",
        type: "text",
        placeholder: "Ex: RGAA 3, WCAG 2.1 AA",
      },
      {
        id: "navigation",
        label: "Navigation souhaitée",
        type: "textarea",
        placeholder: "Ex: Menu déroulant, barre latérale, fil d'Ariane...",
      },
    ],
  },
  {
    id: "section-4",
    title: "4. Spécifications Techniques",
    fields: [
      {
        id: "cms_framework",
        label: "CMS/Framework préféré",
        type: "text",
        placeholder: "Ex: WordPress, Drupal, Next.js, Laravel...",
      },
      {
        id: "langages",
        label: "Langages de programmation",
        type: "text",
        placeholder: "Ex: PHP, JavaScript, Python...",
      },
      {
        id: "base_donnees",
        label: "Base de données",
        type: "text",
        placeholder: "Ex: MySQL, PostgreSQL, MongoDB...",
      },
      {
        id: "hebergement",
        label: "Type d'hébergement envisagé",
        type: "text",
        placeholder: "Ex: Mutualisé, VPS, Cloud...",
      },
      {
        id: "securite",
        label: "Niveau de sécurité attendu",
        type: "textarea",
        placeholder: "Ex: HTTPS, authentification à deux facteurs...",
      },
      {
        id: "performance",
        label: "Temps de chargement cible",
        type: "text",
        placeholder: "Ex: < 2 secondes",
      },
      {
        id: "seo",
        label: "Exigences SEO spécifiques",
        type: "textarea",
        placeholder:
          "Ex: Optimisation pour mots-clés spécifiques, balisage schema.org...",
      },
    ],
  },
  {
    id: "section-5",
    title: "5. Gestion de Contenu",
    fields: [
      {
        id: "migration_volume",
        label: "Volume de contenu à migrer",
        type: "text",
        placeholder: "Ex: 50 pages, 200 articles, 500 produits...",
      },
      {
        id: "migration_types",
        label: "Types de contenus à migrer",
        type: "textarea",
        placeholder: "Ex: Pages, articles, produits, médias...",
      },
      {
        id: "contenus_creer",
        label: "Contenus à créer",
        type: "textarea",
        placeholder: "Ex: Textes de présentation, descriptions produits...",
      },
      {
        id: "profils_admin",
        label: "Profils administrateurs nécessaires",
        type: "textarea",
        placeholder: "Ex: Super admin, éditeur, contributeur...",
      },
      {
        id: "formation_proposee",
        label: "Formation proposée pour la gestion du site",
        type: "textarea",
        placeholder: "Ex: Formation en visio, tutoriels vidéo...",
      },
      {
        id: "support_technique",
        label: "Support technique proposé",
        type: "textarea",
        placeholder: "Ex: Hotline, chat en ligne, email...",
      },
    ],
  },
  {
    id: "section-6",
    title: "6. Prestations Attendues",
    fields: [
      {
        id: "phases_projet",
        label: "Phases du projet",
        type: "checkboxGroup",
        options: [
          { id: "cadrage", label: "Cadrage et spécifications détaillées" },
          { id: "conception", label: "Conception UX/UI" },
          { id: "developpement", label: "Développement" },
          { id: "tests", label: "Tests et recette" },
          { id: "production", label: "Mise en production" },
          { id: "formation", label: "Formation et documentation" },
          { id: "maintenance", label: "Maintenance et suivi" },
        ],
      },
      {
        id: "methodologie",
        label: "Méthodologie souhaitée (agile, cycle en V, etc.)",
        type: "text",
        placeholder: "Ex: Agile Scrum, Cycle en V, Kanban...",
      },
      {
        id: "garantie",
        label: "Période de garantie attendue",
        type: "text",
        placeholder: "Ex: 3 mois, 6 mois, 1 an...",
      },
    ],
  },
  {
    id: "section-7",
    title: "7. Planning et Budget",
    fields: [
      {
        id: "date_demarrage",
        label: "Date souhaitée de démarrage",
        type: "text",
        placeholder: "Ex: 01/01/2024",
      },
      {
        id: "date_mise_en_ligne",
        label: "Date impérative de mise en ligne",
        type: "text",
        placeholder: "Ex: 30/06/2024",
      },
      {
        id: "budget_global",
        label: "Enveloppe budgétaire globale",
        type: "text",
        placeholder: "Ex: 20 000 €",
      },
      {
        id: "budget_maintenance",
        label: "Budget maintenance annuelle",
        type: "text",
        placeholder: "Ex: 2 000 €/an",
      },
    ],
  },
  {
    id: "section-8",
    title: "8. Modalités de Réponse",
    fields: [
      {
        id: "criteres_techniques",
        label: "Critères techniques de sélection",
        type: "textarea",
        placeholder: "Ex: Expertise technique, méthodologie, références...",
      },
      {
        id: "criteres_financiers",
        label: "Critères financiers de sélection",
        type: "textarea",
        placeholder: "Ex: Prix, modalités de paiement...",
      },
      {
        id: "mode_reponse",
        label: "Mode de réponse souhaité",
        type: "textarea",
        placeholder: "Ex: PDF, présentation orale, démonstration...",
      },
      {
        id: "date_limite",
        label: "Date limite de remise des propositions",
        type: "text",
        placeholder: "Ex: 15/01/2024",
      },
      {
        id: "contact_nom",
        label: "Personne(s) à contacter pour questions",
        type: "text",
        placeholder: "Ex: Jean Dupont, Responsable Projet",
      },
      {
        id: "contact_email",
        label: "Adresse email de contact",
        type: "text",
        placeholder: "Ex: contact@example.com",
      },
    ],
  },
  {
    id: "section-9",
    title: "9. Annexes",
    fields: [
      {
        id: "documents_fournis",
        label: "Documents fournis avec ce cahier des charges",
        type: "checkboxGroup",
        options: [
          { id: "charte", label: "Charte graphique" },
          { id: "arborescence", label: "Arborescence détaillée" },
          { id: "references", label: "Exemples de sites de référence" },
          { id: "statistiques", label: "Statistiques du site actuel" },
          { id: "exports", label: "Exports de contenus existants" },
        ],
      },
      {
        id: "date_redaction",
        label: "Date de rédaction",
        type: "text",
        placeholder: "Ex: 01/12/2023",
      },
      {
        id: "version",
        label: "Version",
        type: "text",
        placeholder: "Ex: 1.0",
      },
      {
        id: "redacteur",
        label: "Rédacteur(s)",
        type: "text",
        placeholder: "Ex: Marie Martin, Directrice Marketing",
      },
    ],
  },
];
