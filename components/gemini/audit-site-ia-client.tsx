"use client";
import PageLayout from "@/components/page-layout";
import dynamic from "next/dynamic";
import { BlueprintSection, Separator } from "@/components/aspect/section";
import { Reveal } from "@/components/ui/reveal";
import { Sonar } from "@/components/visuals/sonar";
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
**Mission :** Audit stratégique de l'URL {$url} pour déterminer la voie de modernisation la plus pertinente parmi 4 options :
- (A) Optimiser le WordPress existant,
- (B) Migrer vers WordPress Headless + Next.js,
- (C) Reconstruire en web app sur-mesure (Next.js + PostgreSQL),
- (D) Compléter par une app mobile / PWA.

**Synthèse globale des résultats**
*Insère une synthèse des résultats et de la recommandation sans évoquer l'identité issue du diagnostic.*
---

**Étape 1 : Diagnostic d'Identité & Stack actuelle (Scan Précis)**
*Effectue une analyse croisée des métadonnées puis du contenu visible (Header, Footer, page "À Propos").*

1. **Nature de l'organisation :** (Ex: Entreprise privée, Association, Collectivité, Institution publique, Startup, Indépendant/Freelance, ONG, etc.)
2. **Secteur d'activité :** (Ex: E-commerce B2C, SaaS B2B, Média, etc.)
3. **Proposition de valeur :** Quelle est la promesse principale faite au client ?
4. **Mission :** Cite un court extrait du site qui valide cette proposition.
5. **Cibles prioritaires :** Identifie les 2 profils d'utilisateurs les plus évidents.
6. **Stack technique actuelle détectée :** CMS / framework (WordPress + éventuel page builder type Elementor/Divi, Shopify, Wix, Webflow, Squarespace, Drupal, JAMstack, custom…), présence ou non d'e-commerce (WooCommerce, Shopify…), espace membre/login détecté, blog actif, ordre de grandeur du nombre de pages.
7. **Signaux d'usage mobile :** responsive observé, meta viewport, indices d'un usage mobile dominant (selon le secteur et la cible).

*Si le site est inaccessible, le contenu protégé, OU si tu n'as pas pu lire son contenu réel et que tu inférerais à partir de connaissances générales ou hypothèses sectorielles, réponds uniquement : "Accès bloqué : Diagnostic impossible." et arrête l'analyse. N'invente JAMAIS l'identité ou la stack du site.*

---

**Étape 2 : Analyse Stratégique (Format Markdown)**

### 1. Positionnement Actuel
*   **Perception de marque :** Le design et la navigation inspirent-ils confiance et modernité, ou montrent-ils des signes de retard technologique (lenteur, design daté) ?
*   **Friction UX majeure :** Quel est le principal obstacle visible dans le parcours utilisateur (ex: formulaire complexe, navigation peu claire, temps de chargement) ?
*   **Indice de modernité :** [Note sur 10] évaluant la performance et l'expérience globale par rapport aux standards actuels.

### 2. Verdict Stratégique : quelle voie de modernisation ?
*Choisis UNE voie prioritaire parmi A–E, en t'appuyant sur le diagnostic technique de l'étape 1.*

*   **Voie recommandée :** [A. Optimiser le WordPress existant / B. WordPress Headless + Next.js / C. Web app sur-mesure (Next.js + PostgreSQL) / D. App mobile ou PWA / E. Combinaison (préciser)]
*   **Critères de routage utilisés :**
    - Contenu éditorial fréquent + équipe non-tech → A ou B
    - Performance / SEO critique + besoin d'agilité marketing → B
    - Logique métier complexe, espace utilisateur, dashboards, données structurées → C
    - Usage mobile dominant, besoin de notifications ou d'offline → D
    - E-commerce avec >100 SKU → tu DOIS mentionner explicitement Shopify Hydrogen OU WooCommerce Headless dans la justification ci-dessous
*   **Justification (2 phrases max)** ancrée explicitement dans les signaux observés à l'étape 1. **Si le site est un e-commerce avec >100 SKU détectés à l'étape 1.6, ta justification DOIT nommer explicitement Shopify Hydrogen ou WooCommerce Headless comme variante e-commerce de la voie choisie.**

### 3. Indicateurs d'Impact Business
*   **Performance & SEO :** Quel serait l'impact de temps de chargement quasi-instantanés (Core Web Vitals optimaux) sur le classement Google et le taux de rebond ?
*   **Agilité marketing ou produit :** Selon la voie choisie, explique le principal gain opérationnel (ex: lancer des campagnes sans dépendre du back-end pour B, itérer rapidement sur le produit pour C, engagement mobile pour D).

### 4. Leviers de Croissance via la voie recommandée
*Identifie 3 fonctionnalités de 3 niveaux de complexité que la voie recommandée rendrait possibles.*
1. Rapide
2. Moyennement complexe
3. Très complexe

### 5. Stack recommandée — comparatif
*Présente toujours ce tableau, quelle que soit la voie recommandée. Sur la ligne recommandée, insère **✅** comme premier caractère de la première cellule (avant le nom de la stack).*

| Stack | Quand c'est pertinent | Coût indicatif | Time-to-launch |
|---|---|---|---|
| WordPress classique optimisé | Site vitrine ≤30 pages, équipe non-tech | € | 2-4 semaines |
| WordPress Headless + Next.js | Contenu éditorial + perf/SEO critique | €€ | 6-10 semaines |
| Web app sur-mesure (Next.js + PostgreSQL + Prisma) | Logique métier, dashboard, espace membre | €€€ | 3-6 mois |
| PWA (Next.js + Capacitor) | Mobile-first sans store natif | €€ | 6-10 semaines |
| App native (React Native / Expo) | Push, offline, hardware (caméra, GPS) | €€€ | 3-6 mois |

Conclus par une **recommandation finale en une phrase** rappelant la stack ✅ choisie.

---

**Instruction de sortie :** Réponds exclusivement en Markdown. La structure doit suivre les titres et les points de l'étape 2. Assure la capitalisation française du texte. N'introduis pas trop d'icônes.
`;


const system_instruction_en = `You are an expert in digital strategy and UX with strong technical-audit skills.
Your method is rigorous:
1. OBSERVATION: First extract factual data (metadata, legal structure, vocabulary used).
2. ANALYSIS: Cross-reference this data to establish a precise diagnosis of the organization's identity.
3. RECOMMENDATION: Provide strategic advice based on this evidence.
Your tone is direct, professional and factual.`;

const prompt_en = `
**Mission:** Strategic audit of the URL {$url} to determine the most relevant modernization path among 4 options:
- (A) Optimize the existing WordPress site,
- (B) Migrate to Headless WordPress + Next.js,
- (C) Rebuild as a custom web app (Next.js + PostgreSQL),
- (D) Complement with a mobile app / PWA.

**Overall summary of results**
*Insert a summary of the findings and recommendation without revealing the identity from the diagnosis.*
---

**Step 1: Identity & Current Stack Diagnosis (Precise Scan)**
*Perform a cross-analysis of metadata, then of visible content (Header, Footer, "About" page).*

1. **Nature of the organization:** (e.g. Private company, Association, Public authority, Public institution, Startup, Independent/Freelance, NGO, etc.)
2. **Industry:** (e.g. B2C E-commerce, B2B SaaS, Media, etc.)
3. **Value proposition:** What is the main promise made to the customer?
4. **Mission:** Quote a short excerpt from the site that validates this proposition.
5. **Priority targets:** Identify the 2 most obvious user profiles.
6. **Current technical stack detected:** CMS / framework (WordPress + possible page builder like Elementor/Divi, Shopify, Wix, Webflow, Squarespace, Drupal, JAMstack, custom…), presence or not of e-commerce (WooCommerce, Shopify…), member/login area detected, active blog, rough page count.
7. **Mobile usage signals:** responsive observed, viewport meta, indications of a mobile-dominant usage (based on sector and audience).

*If the site is inaccessible, the content is protected, OR if you could not read its actual content and would have to infer from general knowledge or sector assumptions, reply only: "Access blocked: Diagnosis impossible." and stop the analysis. NEVER invent the identity or stack of the site.*

---

**Step 2: Strategic Analysis (Markdown Format)**

### 1. Current Positioning
*   **Brand perception:** Do the design and navigation inspire confidence and modernity, or show signs of technological lag (slowness, dated design)?
*   **Major UX friction:** What is the main visible obstacle in the user journey (e.g. complex form, unclear navigation, load time)?
*   **Modernity index:** [Score out of 10] evaluating overall performance and experience versus current standards.

### 2. Strategic Verdict: which modernization path?
*Choose ONE priority path from A–E, based on the technical diagnosis from Step 1.*

*   **Recommended path:** [A. Optimize existing WordPress / B. Headless WordPress + Next.js / C. Custom web app (Next.js + PostgreSQL) / D. Mobile app or PWA / E. Combination (specify)]
*   **Routing criteria used:**
    - Frequent editorial content + non-technical team → A or B
    - Critical performance / SEO + marketing-agility needs → B
    - Complex business logic, user area, dashboards, structured data → C
    - Mobile-dominant usage, push notifications or offline needs → D
    - E-commerce with >100 SKUs → you MUST explicitly mention Shopify Hydrogen OR Headless WooCommerce in the justification below
*   **Justification (max 2 sentences)** anchored explicitly in the signals observed at Step 1. **If the site is an e-commerce with >100 SKUs detected in Step 1.6, your justification MUST explicitly name Shopify Hydrogen or Headless WooCommerce as the e-commerce variant of the chosen path.**

### 3. Business Impact Indicators
*   **Performance & SEO:** What would be the impact of near-instant load times (optimal Core Web Vitals) on Google ranking and bounce rate?
*   **Marketing or product agility:** Depending on the chosen path, explain the main operational gain (e.g. shipping campaigns without back-end dependency for B, fast product iteration for C, mobile engagement for D).

### 4. Growth Levers via the recommended path
*Identify 3 features at 3 complexity levels that the recommended path would make possible.*
1. Quick
2. Moderately complex
3. Highly complex

### 5. Recommended stack — comparison
*Always present this table, whatever the recommended path. On the recommended row, insert **✅** as the first character of the first cell (before the stack name).*

| Stack | When it fits | Indicative cost | Time-to-launch |
|---|---|---|---|
| Classic WordPress optimized | Showcase site ≤30 pages, non-tech team | € | 2-4 weeks |
| Headless WordPress + Next.js | Editorial content + critical perf/SEO | €€ | 6-10 weeks |
| Custom web app (Next.js + PostgreSQL + Prisma) | Business logic, dashboards, member area | €€€ | 3-6 months |
| PWA (Next.js + Capacitor) | Mobile-first without native store | €€ | 6-10 weeks |
| Native app (React Native / Expo) | Push, offline, hardware (camera, GPS) | €€€ | 3-6 months |

Conclude with a **final one-sentence recommendation** restating the ✅ chosen stack.

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
        titre={isEn ? "AI audit: which tech for your rebuild?" : "Audit IA : quelle techno pour votre refonte ?"}
        sousTitre={
          isEn
            ? "Test your site for a full report with personalized recommendations — optimized WordPress, Headless, custom web app or mobile/PWA."
            : "Testez votre site pour un rapport complet avec des recommandations personnalisées — WordPress optimisé, Headless, web app sur-mesure ou app mobile/PWA."
        }
      >
        {/* Lien de retour — kicker mono */}
        <BlueprintSection tone="obsidian" innerClassName="px-6 py-6 lg:px-8">
          <Link
            href="/outils"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-mid-gray transition-colors hover:text-accent-secondary"
          >
            <ArrowLeft size={12} />
            {isEn ? "Back to tools" : "Retour aux outils"}
          </Link>
        </BlueprintSection>
        <Separator />

        {/* Outil d'audit — panneau encadré avec backdrop « scan » Sonar discret */}
        <BlueprintSection
          tone="obsidian"
          ticks
          innerClassName="px-6 py-12 lg:px-8 lg:py-16"
          backdrop={
            <div className="absolute inset-0 opacity-[0.18] [mask-image:radial-gradient(120%_80%_at_50%_0%,black,transparent_70%)]">
              <Sonar />
            </div>
          }
        >
          <Reveal className="mx-auto max-w-2xl">
            <GeminiSearch
              onResult={() => {}}
              prompt={isEn ? prompt_en : prompt_fr}
              systemInstruction={isEn ? system_instruction_en : system_instruction_fr}
              defaultUrl={url}
            />
            <div className="mx-auto mt-12 grid max-w-md grid-cols-2">
              <div className="hidden flex-col items-center justify-center border border-dark-gray bg-jet/40 p-6 md:flex">
                <BrandLogo src="/img/logo-wordpress.webp" srcLight="/img/logo-wordpress-small.webp" alt="Logo WordPress" width={120} height={120} />
              </div>
              <div className="hidden flex-col items-center justify-center border border-l-0 border-dark-gray bg-jet/40 p-6 md:flex">
                <BrandLogo src="/img/logo-nextjs.webp" srcLight="/img/logo-nextjs.webp" alt="Logo Next.js" width={120} height={120} />
              </div>
            </div>
          </Reveal>
        </BlueprintSection>
      </PageLayout>
    </main>
  );
}
