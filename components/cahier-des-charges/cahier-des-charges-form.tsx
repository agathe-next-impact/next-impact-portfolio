"use client";

import type React from "react";

import { useState } from "react";
import { DocumentPreview } from "@/components/cahier-des-charges/document-preview";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

type FormSection = {
  id: string;
  title: string;
  fields: FormField[];
};

type FormField = {
  id: string;
  label: string;
  type: "text" | "textarea" | "checkbox" | "checkboxGroup" | "radioGroup";
  options?: { id: string; label: string; description?: string }[];
  placeholder?: string;
};

// Collapsible section component
function CollapsibleSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ marginBottom: 0 }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          borderTop: "none",
          borderLeft: "none",
          borderRight: "none",
          borderBottom: "1px solid var(--rule)",
          padding: "16px 0",
          background: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <span
          style={{
            fontFamily: "var(--sans)",
            fontWeight: 600,
            fontSize: 15,
            color: "var(--ink)",
          }}
        >
          {title}
        </span>
        <span
          style={{
            fontFamily: "var(--mono)",
            fontSize: 18,
            color: "var(--muted-color)",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          {open ? "−" : "+"}
        </span>
      </button>
      {open && (
        <div style={{ paddingTop: 20, paddingBottom: 8 }}>{children}</div>
      )}
    </div>
  );
}

export function CahierDesChargesForm() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const formSections = isEn ? formSectionsEn : formSectionsFr;
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
    if (typeof v === "object" && v !== null)
      return Object.values(v).some((item: any) => item?.checked);
    return false;
  }).length;

  // Shared input style
  const inputStyle: React.CSSProperties = {
    border: "1px solid var(--rule)",
    background: "var(--paper)",
    color: "var(--ink)",
    fontFamily: "var(--sans)",
    padding: "10px 12px",
    fontSize: 14,
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
  };

  const textareaStyle: React.CSSProperties = {
    ...inputStyle,
    minHeight: 100,
    resize: "vertical",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "var(--sans)",
    fontSize: 13,
    fontWeight: 600,
    color: "var(--ink)",
    marginBottom: 6,
  };

  return (
    <section style={{ width: "100%", maxWidth: 900, margin: "0 auto" }}>
      {/* Tab navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: 32,
        }}
      >
        <div style={{ display: "flex" }}>
          <button
            type="button"
            onClick={() => handleTabChange("form")}
            style={{
              border: "1px solid var(--rule)",
              background: activeTab === "form" ? "var(--ink)" : "var(--paper)",
              color: activeTab === "form" ? "var(--paper)" : "var(--ink)",
              fontFamily: "var(--sans)",
              fontSize: 13,
              fontWeight: 600,
              padding: "10px 24px",
              cursor: "pointer",
              letterSpacing: "0.04em",
            }}
          >
            {isEn ? "Form" : "Formulaire"}
          </button>
          <button
            type="button"
            onClick={() => handleTabChange("preview")}
            style={{
              border: "1px solid var(--rule)",
              borderLeft: "none",
              background:
                activeTab === "preview" ? "var(--ink)" : "var(--paper)",
              color: activeTab === "preview" ? "var(--paper)" : "var(--ink)",
              fontFamily: "var(--sans)",
              fontSize: 13,
              fontWeight: 600,
              padding: "10px 24px",
              cursor: "pointer",
              letterSpacing: "0.04em",
            }}
          >
            {isEn ? "Preview" : "Aperçu"}
          </button>
        </div>
      </div>

      {/* Form tab */}
      {activeTab === "form" && (
        <div>
          {/* Progress indicator */}
          <div
            style={{
              border: "1px solid var(--rule)",
              padding: "12px 16px",
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "var(--paper)",
            }}
          >
            <p
              style={{
                fontFamily: "var(--sans)",
                fontSize: 13,
                color: "var(--muted-color)",
                margin: 0,
              }}
            >
              <span style={{ color: "var(--accent-color)", fontWeight: 700 }}>
                {filledCount}
              </span>{" "}
              {isEn
                ? `field${filledCount > 1 ? "s" : ""} filled`
                : `champ${filledCount > 1 ? "s" : ""} rempli${filledCount > 1 ? "s" : ""}`}
            </p>
            <button
              type="button"
              onClick={() => handleTabChange("preview")}
              style={{
                background: "none",
                border: "none",
                color: "var(--accent-color)",
                fontFamily: "var(--sans)",
                fontSize: 13,
                cursor: "pointer",
                padding: 0,
              }}
            >
              {isEn ? "View preview" : "Voir l'aperçu"}
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div
              style={{
                border: "1px solid var(--rule)",
                background: "var(--paper)",
                padding: 32,
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--serif)",
                  fontSize: 22,
                  fontWeight: 500,
                  color: "var(--ink)",
                  margin: "0 0 4px 0",
                }}
              >
                {isEn ? "Your project" : "Votre projet"}
              </h2>
              <p
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: 13,
                  color: "var(--muted-color)",
                  margin: "0 0 24px 0",
                }}
              >
                {isEn
                  ? "Fill out the sections below to generate your specifications document"
                  : "Remplissez les sections ci-dessous pour générer votre cahier des charges"}
              </p>

              {/* Accordion sections */}
              {formSections.map((section) => (
                <CollapsibleSection
                  key={section.id}
                  title={section.title}
                  defaultOpen={true}
                >
                  <div style={{ display: "grid", gap: 20 }}>
                    {section.fields.map((field) => (
                      <div key={field.id}>
                        {field.type === "radioGroup" ? (
                          <>
                            <label style={labelStyle}>{field.label}</label>
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns:
                                  "repeat(auto-fill, minmax(220px, 1fr))",
                                gap: 8,
                                paddingTop: 4,
                              }}
                            >
                              {field.options?.map((option) => {
                                const selected =
                                  formData[field.id] === option.id;
                                return (
                                  <button
                                    key={option.id}
                                    type="button"
                                    onClick={() =>
                                      handleInputChange(field.id, option.id)
                                    }
                                    style={{
                                      border: selected
                                        ? "1px solid var(--rule)"
                                        : "1px solid var(--rule)",
                                      borderLeft: selected
                                        ? "3px solid var(--accent-color)"
                                        : "1px solid var(--rule)",
                                      background: selected
                                        ? "var(--paper-2)"
                                        : "var(--paper)",
                                      padding: 16,
                                      textAlign: "left",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <p
                                      style={{
                                        fontFamily: "var(--sans)",
                                        fontSize: 13,
                                        fontWeight: 600,
                                        color: "var(--ink)",
                                        margin: "0 0 4px 0",
                                      }}
                                    >
                                      {option.label}
                                    </p>
                                    {option.description && (
                                      <p
                                        style={{
                                          fontFamily: "var(--sans)",
                                          fontSize: 12,
                                          color: "var(--muted-color)",
                                          margin: 0,
                                          lineHeight: 1.4,
                                        }}
                                      >
                                        {option.description}
                                      </p>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </>
                        ) : field.type === "checkboxGroup" ? (
                          <>
                            <label style={labelStyle}>{field.label}</label>
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns:
                                  "repeat(auto-fill, minmax(220px, 1fr))",
                                gap: 6,
                                paddingTop: 4,
                              }}
                            >
                              {field.options?.map((option) => {
                                const isChecked =
                                  formData[field.id]?.[option.id]?.checked ||
                                  false;
                                return (
                                  <label
                                    key={option.id}
                                    htmlFor={`${field.id}-${option.id}`}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: 10,
                                      border: "1px solid var(--rule)",
                                      padding: "10px 12px",
                                      background: isChecked
                                        ? "var(--paper-2)"
                                        : "var(--paper)",
                                      cursor: "pointer",
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      id={`${field.id}-${option.id}`}
                                      checked={isChecked}
                                      onChange={(e) =>
                                        handleCheckboxGroupChange(
                                          field.id,
                                          option.id,
                                          e.target.checked,
                                          option.label
                                        )
                                      }
                                      style={{
                                        accentColor: "var(--accent-color)",
                                        flexShrink: 0,
                                      }}
                                    />
                                    <span
                                      style={{
                                        fontFamily: "var(--sans)",
                                        fontSize: 13,
                                        color: "var(--ink-2)",
                                        lineHeight: 1.4,
                                      }}
                                    >
                                      {option.label}
                                    </span>
                                  </label>
                                );
                              })}
                            </div>
                          </>
                        ) : field.type === "checkbox" ? (
                          <label
                            htmlFor={field.id}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 10,
                              border: "1px solid var(--rule)",
                              padding: "10px 12px",
                              background: formData[field.id]
                                ? "var(--paper-2)"
                                : "var(--paper)",
                              cursor: "pointer",
                            }}
                          >
                            <input
                              type="checkbox"
                              id={field.id}
                              checked={formData[field.id] || false}
                              onChange={(e) =>
                                handleInputChange(field.id, e.target.checked)
                              }
                              style={{
                                accentColor: "var(--accent-color)",
                                flexShrink: 0,
                              }}
                            />
                            <span
                              style={{
                                fontFamily: "var(--sans)",
                                fontSize: 13,
                                color: "var(--ink-2)",
                                lineHeight: 1.4,
                              }}
                            >
                              {field.label}
                            </span>
                          </label>
                        ) : (
                          <>
                            <label htmlFor={field.id} style={labelStyle}>
                              {field.label}
                            </label>
                            {field.type === "textarea" ? (
                              <textarea
                                id={field.id}
                                placeholder={field.placeholder}
                                value={formData[field.id] || ""}
                                onChange={(e) =>
                                  handleInputChange(field.id, e.target.value)
                                }
                                style={textareaStyle}
                              />
                            ) : (
                              <input
                                type="text"
                                id={field.id}
                                placeholder={field.placeholder}
                                value={formData[field.id] || ""}
                                onChange={(e) =>
                                  handleInputChange(field.id, e.target.value)
                                }
                                style={inputStyle}
                              />
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>
              ))}

              {/* Separator */}
              <div
                style={{
                  borderTop: "1px solid var(--rule)",
                  margin: "24px 0",
                }}
              />

              <div style={{ display: "flex", justifyContent: "center" }}>
                <button
                  type="submit"
                  style={{
                    border: "1px solid var(--ink)",
                    background: "var(--ink)",
                    color: "var(--paper)",
                    fontFamily: "var(--mono)",
                    fontSize: 11,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    padding: "12px 32px",
                    cursor: "pointer",
                  }}
                >
                  {isEn ? "Preview the document" : "Voir l'aperçu du document"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Preview tab */}
      {activeTab === "preview" && (
        <div>
          <DocumentPreview formData={formData} />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 24,
            }}
          >
            <button
              type="button"
              onClick={() => handleTabChange("form")}
              style={{
                border: "1px solid var(--rule)",
                background: "var(--paper)",
                color: "var(--ink)",
                fontFamily: "var(--sans)",
                fontSize: 13,
                fontWeight: 600,
                padding: "10px 24px",
                cursor: "pointer",
                letterSpacing: "0.04em",
              }}
            >
              {isEn ? "Back to form" : "Retour au formulaire"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

const formSectionsFr: FormSection[] = [
  {
    id: "section-1",
    title: "1. Présentation Générale du Projet",
    fields: [
      {
        id: "project_type",
        label: "Type de projet",
        type: "radioGroup",
        options: [
          {
            id: "site-classique",
            label: "Site WordPress classique",
            description: "Vitrine, institutionnel ou refonte WordPress optimisée",
          },
          {
            id: "site-headless",
            label: "Site Headless WordPress + Next.js",
            description: "Performance maximale, SEO renforcé, plateforme éditoriale",
          },
          {
            id: "web-app",
            label: "Web app sur-mesure",
            description: "Marketplace, plateforme métier, configurateur (Next.js + PostgreSQL)",
          },
          {
            id: "app-mobile",
            label: "Application mobile (PWA)",
            description: "App installable sans store, géolocalisation, hors-ligne",
          },
        ],
      },
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
        placeholder: "Décrivez votre audience principale ou vos utilisateurs",
      },
      {
        id: "problematiques",
        label: "Problématiques identifiées (projet actuel ou nouveau besoin)",
        type: "textarea",
        placeholder: "Ex: Lenteur du site actuel, fonctionnalités manquantes, processus métier non outillé...",
      },
      {
        id: "objectifs_refonte",
        label: "Objectifs principaux du projet",
        type: "textarea",
        placeholder:
          "Ex: Améliorer l'expérience utilisateur, lancer un nouveau service, outiller une équipe métier...",
      },
      {
        id: "site_url",
        label: "URL du site actuel (si refonte)",
        type: "text",
        placeholder: "https://www.example.com",
      },
      {
        id: "site_creation_date",
        label: "Date de création du projet actuel (si refonte)",
        type: "text",
        placeholder: "Ex: Janvier 2018",
      },
      {
        id: "technologies_actuelles",
        label: "Technologies utilisées actuellement (si applicable)",
        type: "text",
        placeholder: "Ex: WordPress, PHP, MySQL, SaaS existant...",
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

const formSectionsEn: FormSection[] = [
  {
    id: "section-1",
    title: "1. Project Overview",
    fields: [
      {
        id: "project_type",
        label: "Type of project",
        type: "radioGroup",
        options: [
          {
            id: "site-classique",
            label: "Classic WordPress site",
            description: "Brochure, institutional or optimized WordPress rebuild",
          },
          {
            id: "site-headless",
            label: "Headless WordPress + Next.js site",
            description: "Maximum performance, stronger SEO, editorial platform",
          },
          {
            id: "web-app",
            label: "Custom web app",
            description: "Marketplace, business platform, configurator (Next.js + PostgreSQL)",
          },
          {
            id: "app-mobile",
            label: "Mobile application (PWA)",
            description: "Installable without store, geolocation, offline mode",
          },
        ],
      },
      { id: "organisation_name", label: "Organization name", type: "text", placeholder: "e.g. XYZ Company" },
      { id: "secteur_activite", label: "Industry", type: "text", placeholder: "e.g. Retail, Healthcare, Education…" },
      { id: "public_cible", label: "Target audience", type: "textarea", placeholder: "Describe your primary audience or users" },
      { id: "problematiques", label: "Issues identified (current project or new need)", type: "textarea", placeholder: "e.g. Slow current site, missing features, business process not tooled…" },
      { id: "objectifs_refonte", label: "Main project objectives", type: "textarea", placeholder: "e.g. Improve UX, launch a new service, equip a business team…" },
      { id: "site_url", label: "Current site URL (if rebuild)", type: "text", placeholder: "https://www.example.com" },
      { id: "site_creation_date", label: "Current project creation date (if rebuild)", type: "text", placeholder: "e.g. January 2018" },
      { id: "technologies_actuelles", label: "Current technologies (if applicable)", type: "text", placeholder: "e.g. WordPress, PHP, MySQL, existing SaaS…" },
    ],
  },
  {
    id: "section-2",
    title: "2. Functional Specifications",
    fields: [
      { id: "arborescence", label: "Proposed sitemap (main pages and sub-pages)", type: "textarea", placeholder: "Describe the structure of your site" },
      { id: "types_contenus", label: "Content types to plan for", type: "textarea", placeholder: "e.g. Articles, products, testimonials…" },
      {
        id: "fonctionnalites_standards",
        label: "Standard features",
        type: "checkboxGroup",
        options: [
          { id: "accueil", label: "Custom home page" },
          { id: "pages_contenu", label: "Standard content pages (who/what/why)" },
          { id: "blog", label: "News / blog" },
          { id: "contact", label: "Contact form(s)" },
          { id: "galerie", label: "Photo / video gallery" },
          { id: "faq", label: "FAQ" },
          { id: "plan_site", label: "Sitemap page" },
          { id: "mentions", label: "Legal notice and privacy policy" },
          { id: "recherche", label: "Internal search engine" },
          { id: "partage", label: "Social media sharing" },
          { id: "newsletter", label: "Newsletter signup" },
          { id: "carte", label: "Interactive map" },
          { id: "telechargement", label: "Document downloads" },
        ],
      },
      {
        id: "fonctionnalites_avancees",
        label: "Advanced features",
        type: "checkboxGroup",
        options: [
          { id: "espace_membres", label: "Member area / extranet" },
          { id: "reservation", label: "Booking / appointment system" },
          { id: "ecommerce", label: "E-commerce / online payment" },
          { id: "bdd", label: "Searchable database" },
          { id: "multilangues", label: "Multisite / multilingual" },
          { id: "applications", label: "Custom interactive applications" },
          { id: "chatbot", label: "Chatbot / virtual assistant" },
          { id: "personnalisation", label: "User personalization" },
          { id: "crm", label: "CRM / ERP integration" },
          { id: "dashboard", label: "Advanced dashboard / analytics" },
        ],
      },
      { id: "contraintes_techniques", label: "Specific technical constraints", type: "textarea", placeholder: "e.g. Compatibility with existing systems, specific security…" },
    ],
  },
  {
    id: "section-3",
    title: "3. Visual & Ergonomic Specifications",
    fields: [
      {
        id: "charte_graphique",
        label: "Brand guidelines",
        type: "checkboxGroup",
        options: [
          { id: "charte_existante", label: "Existing brand guidelines to follow" },
          { id: "nouvelle_charte", label: "New brand guidelines to create" },
        ],
      },
      { id: "inspirations", label: "Inspirations / references", type: "textarea", placeholder: "e.g. URLs of sites you like" },
      { id: "couleurs", label: "Primary colors", type: "text", placeholder: "e.g. Blue #0000FF, Red #FF0000" },
      { id: "typographies", label: "Typography", type: "text", placeholder: "e.g. Roboto, Open Sans, Montserrat" },
      { id: "ambiance", label: "Visual mood", type: "textarea", placeholder: "e.g. Modern, minimal, colorful, corporate…" },
      { id: "ux_priorites", label: "User experience priorities", type: "textarea", placeholder: "e.g. Simplicity, speed, accessibility…" },
      { id: "responsive", label: "Priority formats (desktop, tablet, mobile)", type: "text", placeholder: "e.g. Mobile-first, all formats equal…" },
      { id: "accessibilite", label: "Accessibility (RGAA, WCAG)", type: "text", placeholder: "e.g. RGAA 3, WCAG 2.1 AA" },
      { id: "navigation", label: "Desired navigation", type: "textarea", placeholder: "e.g. Dropdown menu, sidebar, breadcrumbs…" },
    ],
  },
  {
    id: "section-4",
    title: "4. Technical Specifications",
    fields: [
      { id: "cms_framework", label: "Preferred CMS / framework", type: "text", placeholder: "e.g. WordPress, Drupal, Next.js, Laravel…" },
      { id: "langages", label: "Programming languages", type: "text", placeholder: "e.g. PHP, JavaScript, Python…" },
      { id: "base_donnees", label: "Database", type: "text", placeholder: "e.g. MySQL, PostgreSQL, MongoDB…" },
      { id: "hebergement", label: "Hosting type considered", type: "text", placeholder: "e.g. Shared, VPS, Cloud…" },
      { id: "securite", label: "Expected security level", type: "textarea", placeholder: "e.g. HTTPS, two-factor authentication…" },
      { id: "performance", label: "Target load time", type: "text", placeholder: "e.g. < 2 seconds" },
      { id: "seo", label: "Specific SEO requirements", type: "textarea", placeholder: "e.g. Optimization for specific keywords, schema.org markup…" },
    ],
  },
  {
    id: "section-5",
    title: "5. Content Management",
    fields: [
      { id: "migration_volume", label: "Content volume to migrate", type: "text", placeholder: "e.g. 50 pages, 200 articles, 500 products…" },
      { id: "migration_types", label: "Content types to migrate", type: "textarea", placeholder: "e.g. Pages, articles, products, media…" },
      { id: "contenus_creer", label: "Content to create", type: "textarea", placeholder: "e.g. Presentation copy, product descriptions…" },
      { id: "profils_admin", label: "Required admin profiles", type: "textarea", placeholder: "e.g. Super admin, editor, contributor…" },
      { id: "formation_proposee", label: "Training offered for site management", type: "textarea", placeholder: "e.g. Video-call training, video tutorials…" },
      { id: "support_technique", label: "Technical support offered", type: "textarea", placeholder: "e.g. Hotline, online chat, email…" },
    ],
  },
  {
    id: "section-6",
    title: "6. Expected Deliverables",
    fields: [
      {
        id: "phases_projet",
        label: "Project phases",
        type: "checkboxGroup",
        options: [
          { id: "cadrage", label: "Scoping and detailed specifications" },
          { id: "conception", label: "UX/UI design" },
          { id: "developpement", label: "Development" },
          { id: "tests", label: "Testing and acceptance" },
          { id: "production", label: "Going live" },
          { id: "formation", label: "Training and documentation" },
          { id: "maintenance", label: "Maintenance and follow-up" },
        ],
      },
      { id: "methodologie", label: "Preferred methodology (agile, V-cycle, etc.)", type: "text", placeholder: "e.g. Agile Scrum, V-cycle, Kanban…" },
      { id: "garantie", label: "Expected warranty period", type: "text", placeholder: "e.g. 3 months, 6 months, 1 year…" },
    ],
  },
  {
    id: "section-7",
    title: "7. Schedule & Budget",
    fields: [
      { id: "date_demarrage", label: "Desired start date", type: "text", placeholder: "e.g. 2024-01-01" },
      { id: "date_mise_en_ligne", label: "Hard go-live date", type: "text", placeholder: "e.g. 2024-06-30" },
      { id: "budget_global", label: "Overall budget envelope", type: "text", placeholder: "e.g. €20,000" },
      { id: "budget_maintenance", label: "Annual maintenance budget", type: "text", placeholder: "e.g. €2,000/year" },
    ],
  },
  {
    id: "section-8",
    title: "8. Response Terms",
    fields: [
      { id: "criteres_techniques", label: "Technical selection criteria", type: "textarea", placeholder: "e.g. Technical expertise, methodology, references…" },
      { id: "criteres_financiers", label: "Financial selection criteria", type: "textarea", placeholder: "e.g. Price, payment terms…" },
      { id: "mode_reponse", label: "Preferred response format", type: "textarea", placeholder: "e.g. PDF, oral presentation, demo…" },
      { id: "date_limite", label: "Proposal submission deadline", type: "text", placeholder: "e.g. 2024-01-15" },
      { id: "contact_nom", label: "Contact for questions", type: "text", placeholder: "e.g. Jane Doe, Project Lead" },
      { id: "contact_email", label: "Contact email", type: "text", placeholder: "e.g. contact@example.com" },
    ],
  },
  {
    id: "section-9",
    title: "9. Appendices",
    fields: [
      {
        id: "documents_fournis",
        label: "Documents provided with this brief",
        type: "checkboxGroup",
        options: [
          { id: "charte", label: "Brand guidelines" },
          { id: "arborescence", label: "Detailed sitemap" },
          { id: "references", label: "Reference site examples" },
          { id: "statistiques", label: "Current site analytics" },
          { id: "exports", label: "Existing content exports" },
        ],
      },
      { id: "date_redaction", label: "Drafting date", type: "text", placeholder: "e.g. 2023-12-01" },
      { id: "version", label: "Version", type: "text", placeholder: "e.g. 1.0" },
      { id: "redacteur", label: "Author(s)", type: "text", placeholder: "e.g. Marie Martin, Marketing Director" },
    ],
  },
];
