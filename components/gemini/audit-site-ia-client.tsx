"use client";
import PageLayout from "@/components/page-layout";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

const GeminiSearch = dynamic(() => import("@/components/gemini/gemini-search"), { ssr: false });

// Prompt et instruction identiques à ClientGeminiBlock
const system_instruction = `Tu es un expert en stratégie digitale et UX avec une forte compétence en audit technique.
Ta méthode est rigoureuse :
1. OBSERVATION : Tu extrais d'abord les données factuelles (métadonnées, structure légale, vocabulaire utilisé).
2. ANALYSE : Tu croises ces données pour établir un diagnostic précis de l'identité de l'organisation.
3. RECOMMANDATION : Tu fournis des conseils stratégiques basés sur ces preuves.
Ton ton est direct, professionnel et factuel.`;
const prompt = `
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

export default function AuditSiteIaClient() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url") || undefined;

  return (
    <main>
      <PageLayout 
        titre="Faut-il migrer en Headless ?"
        sousTitre="Testez votre site WordPress pour un rapport complet avec des recommandations personnalisées pour une migration en WordPress headless."
      >
        <div className="relative md:max-w-5xl my-8 md:my-16 mx-4 md:mx-auto bg-white/10 backdrop-blur-md border p-2 md:p-12 border-1 border-white/10 rounded-2xl">
        <GeminiSearch
          onResult={() => {}}
          prompt={prompt}
          systemInstruction={system_instruction}
          defaultUrl={url}
        />
        <div className="mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
            <div
              className="hidden md:flex flex-col items-center justify-center gap-3 backdrop-blur-sm rounded-xl px-4 py-4 border border-white/20 hover:bg-white/15 transition-all hover:scale-105"
            >
              <div className="w-40 h-40 rounded-lg flex items-center justify-center">
                <Image src="/img/logo-wordpress-blanc.webp" alt="Logo WordPress" width={120} height={120} />
              </div>
            </div>
            <div
              className="hidden md:flex flex-col items-center justify-center gap-3 backdrop-blur-sm rounded-xl px-4 py-4 border border-white/20 hover:bg-white/15 transition-all hover:scale-105"
            >
              <div className="w-40 h-40 rounded-lg flex items-center justify-center">
                <Image src="/img/logo-nextjs-blanc.webp" alt="Logo Next.js" width={120} height={120} />
              </div>
            </div>
            <div
              className="hidden md:flex flex-col items-center justify-center gap-3 backdrop-blur-sm rounded-xl px-4 py-4 border border-white/20 hover:bg-white/15 transition-all hover:scale-105"
            >
              <div className="w-40 h-40 rounded-lg flex items-center justify-center">
                <Image src="/img/logo-astro-blanc.webp" alt="Logo Astro" width={120} height={120} />
              </div>
            </div>
        </div>
        </div>
      </PageLayout>
    </main>
  );
}
