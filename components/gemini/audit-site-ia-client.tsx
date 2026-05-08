"use client";
import PageLayout from "@/components/page-layout";
import dynamic from "next/dynamic";
import Image from "next/image";
import { BrandLogo } from "@/components/brand-logo";
import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

const GeminiSearch = dynamic(() => import("@/components/gemini/gemini-search"), { ssr: false });

// Prompt et instruction identiques à ClientGeminiBlock
const system_instruction_fr = `Tu es un expert en stratégie digitale et UX avec une forte compétence en audit technique.
Ta méthode est rigoureuse :
1. OBSERVATION : Tu extrais d'abord les données factuelles (métadonnées, structure légale, vocabulaire utilisé).
2. ANALYSE : Tu croises ces données pour établir un diagnostic précis de l'identité de l'organisation.
3. RECOMMANDATION : Tu fournis des conseils stratégiques basés sur ces preuves.
Ton ton est direct, professionnel et factuel.`;
const prompt_fr = `
**Mission :** Audit stratégique de l'URL {$url} pour évaluer la pertinence d'une migration vers une architecture Headless.

**Synthèse globale des résultats
*Insère une synthèse des résultats et de la recommandation sans évoquer l'identité issue du diagnostic*
---

**Étape 1 : Diagnostic d'Identité (Scan Précis)**
*Effectue une analyse croisée des metadonnées et dans un deuxième temps du contenu visible (Header, Footer, Page "À Propos").*

1.  **Nature de l'organisation :** (Ex: Entreprise privée, Association, Collectivité, Institution publique, Startup, Indépendant/Freelance, ONG, etc.)
2.  **Secteur d'activité :** (Ex: E-commerce B2C, SaaS B2B, Média, etc.)
3.  **Proposition de valeur :** Quelle est la promesse principale faite au client ?
3.  **Mission :** Cite un court extrait du site qui valide cette proposition.
4.  **Cibles prioritaires :** Identifie les 2 profils d'utilisateurs les plus évidents.
*Si le site est inaccessible ou le contenu protégé, réponds uniquement : "Accès bloqué : Diagnostic impossible." et arrête l'analyse.*

---

**Étape 2 : Analyse Stratégique (Format Markdown)**

### 1. Positionnement Actuel
*   **Perception de marque :** Le design et la navigation du site inspirent-ils confiance et modernité, ou montrent-ils des signes de retard technologique (lenteur, design daté) ?
*   **Friction UX Majeure :** Quel est le principal obstacle visible dans le parcours utilisateur (ex: formulaire complexe, navigation peu claire, temps de chargement) ?
*   **Indice de modernité :** [Note sur 10] évaluant la performance et l'expérience globale par rapport aux standards actuels.

### 2. Pertinence d'une Migration WordPress Headless
*   **Verdict Stratégique :** [Migrer rapidement / Maintenir WordPress monolithique / Migrer progressivement]. Justifie en une phrase.
*   **Enjeu de Différenciation :** Comment le Headless peut-il transformer l'expérience (ex: ultra-rapide, personnalisée) pour créer un avantage concurrentiel ?
*   **Justification Business :** Quels sont les arguments clés (ROI potentiel) justifiant l'investissement face aux gains attendus en performance, SEO et agilité marketing ?

### 3. Indicateurs d'Impact Business
*   **Performance & SEO :** Quel serait l'impact de temps de chargement quasi-instantanés (Core Web Vitals optimaux) sur le classement Google et le taux de rebond ?
*   **Agilité Marketing :** Explique comment le Headless permettrait aux équipes de lancer plus rapidement des campagnes ou de nouveaux contenus sans dépendre du back-end.

### 4. Leviers de Croissance via Headless
*Identifie 3 fonctionnalités de 3 niveaux de complexité que le Headless rendrait possibles.*
1. Rapide
2. Moyennement complexe
3. Très complexe

### 5. Stack recommandée (uniquement si migration recommandée et sur WordPress Headless)

Comparatif des stacks : WordPress monolithique, WP Astro, WP Next.js
Recommandation de stack
---

**Instruction de sortie :** Réponds exclusivement en Markdown. La structure doit suivre les titres et les points de l'étape 2. Assure la capitalisation française du texte. Et n'introduit pas trop d'icones
`;


const system_instruction_en = `You are an expert in digital strategy and UX with strong technical-audit skills.
Your method is rigorous:
1. OBSERVATION: First extract factual data (metadata, legal structure, vocabulary used).
2. ANALYSIS: Cross-reference this data to establish a precise diagnosis of the organization's identity.
3. RECOMMENDATION: Provide strategic advice based on this evidence.
Your tone is direct, professional and factual.`;

const prompt_en = `
**Mission:** Strategic audit of the URL {$url} to evaluate the relevance of migrating to a Headless architecture.

**Overall summary of results
*Insert a summary of the findings and recommendation without revealing the identity from the diagnosis*
---

**Step 1: Identity Diagnosis (Precise Scan)**
*Perform a cross-analysis of metadata and then of visible content (Header, Footer, "About" page).*

1.  **Nature of the organization:** (e.g. Private company, Association, Public authority, Public institution, Startup, Independent/Freelance, NGO, etc.)
2.  **Industry:** (e.g. B2C E-commerce, B2B SaaS, Media, etc.)
3.  **Value proposition:** What is the main promise made to the customer?
3.  **Mission:** Quote a short excerpt from the site that validates this proposition.
4.  **Priority targets:** Identify the 2 most obvious user profiles.
*If the site is inaccessible or the content is protected, reply only: "Access blocked: Diagnosis impossible." and stop the analysis.*

---

**Step 2: Strategic Analysis (Markdown Format)**

### 1. Current Positioning
*   **Brand perception:** Do the design and navigation inspire confidence and modernity, or show signs of technological lag (slowness, dated design)?
*   **Major UX friction:** What is the main visible obstacle in the user journey (e.g. complex form, unclear navigation, load time)?
*   **Modernity index:** [Score out of 10] evaluating overall performance and experience versus current standards.

### 2. Relevance of a Headless WordPress Migration
*   **Strategic verdict:** [Migrate quickly / Maintain monolithic WordPress / Migrate progressively]. Justify in one sentence.
*   **Differentiation lever:** How can Headless transform the experience (e.g. ultra-fast, personalized) to create a competitive edge?
*   **Business justification:** What are the key arguments (potential ROI) justifying the investment vs. the expected gains in performance, SEO and marketing agility?

### 3. Business Impact Indicators
*   **Performance & SEO:** What would be the impact of near-instant load times (optimal Core Web Vitals) on Google ranking and bounce rate?
*   **Marketing agility:** Explain how Headless would let teams launch campaigns or new content faster without depending on the back end.

### 4. Growth Levers via Headless
*Identify 3 features at 3 complexity levels that Headless would make possible.*
1. Quick
2. Moderately complex
3. Highly complex

### 5. Recommended stack (only if migration is recommended and on Headless WordPress)

Stack comparison: monolithic WordPress, WP Astro, WP Next.js
Stack recommendation
---

**Output instruction:** Reply exclusively in Markdown. The structure must follow the headings and bullets from Step 2. Use proper English capitalization. Do not introduce too many icons.
`;

export default function AuditSiteIaClient() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url") || undefined;
  const locale = useLocale() as Locale;
  const isEn = locale === "en";

  return (
    <main>
      <PageLayout
        titre={isEn ? "Should you migrate to Headless?" : "Faut-il migrer en Headless ?"}
        sousTitre={
          isEn
            ? "Test your WordPress site to get a complete report with personalized recommendations for a Headless WordPress migration."
            : "Testez votre site WordPress pour un rapport complet avec des recommandations personnalisées pour une migration en WordPress headless."
        }
      >
        <div className="container px-4 md:px-6">
          <Link
            href="/outils"
            className="inline-flex items-center gap-1.5 text-sm text-extralightblue/60 hover:text-white transition mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {isEn ? "Back to tools" : "Retour aux outils"}
          </Link>
        </div>
        <div className="relative md:max-w-5xl my-8 md:my-16 mx-4 md:mx-auto bg-mediumblue/60 backdrop-blur-md border p-2 md:p-12 border-1 border-white/10 rounded-2xl">
        <GeminiSearch
          onResult={() => {}}
          prompt={isEn ? prompt_en : prompt_fr}
          systemInstruction={isEn ? system_instruction_en : system_instruction_fr}
          defaultUrl={url}
        />
        <div className="mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
            <div
              className="hidden md:flex flex-col items-center justify-center gap-3 backdrop-blur-sm rounded-xl px-4 py-4 border border-white/20 hover:bg-white/15 transition-all hover:scale-105"
            >
              <div className="w-40 h-40 rounded-lg flex items-center justify-center">
                <BrandLogo src="/img/logo-wordpress-blanc.webp" srcLight="/img/logo-wordpress-small.webp" alt="Logo WordPress" width={120} height={120} />
              </div>
            </div>
            <div
              className="hidden md:flex flex-col items-center justify-center gap-3 backdrop-blur-sm rounded-xl px-4 py-4 border border-white/20 hover:bg-white/15 transition-all hover:scale-105"
            >
              <div className="w-40 h-40 rounded-lg flex items-center justify-center">
                <BrandLogo src="/img/logo-nextjs-blanc.webp" srcLight="/img/logo-nextjs.webp" alt="Logo Next.js" width={120} height={120} />
              </div>
            </div>
            <div
              className="hidden md:flex flex-col items-center justify-center gap-3 backdrop-blur-sm rounded-xl px-4 py-4 border border-white/20 hover:bg-white/15 transition-all hover:scale-105"
            >
              <div className="w-40 h-40 rounded-lg flex items-center justify-center">
                <BrandLogo src="/img/logo-astro-blanc.webp" srcLight="/img/logo-astro.webp" alt="Logo Astro" width={120} height={120} />
              </div>
            </div>
        </div>
        </div>
      </PageLayout>
    </main>
  );
}
