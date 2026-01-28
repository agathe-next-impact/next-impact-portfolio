import dynamic from "next/dynamic";
import Image from "next/image";
import { useScroll } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowDownLeft,
  ArrowLeftRightIcon,
  ArrowRightLeftIcon,
  ArrowRightSquare,
  LucideArrowUpRight,
  PresentationIcon,
} from "lucide-react";
import AiAuditBannerSVG from "./AiAuditBannerSVG";

export default function Hero() {
  const { scrollY } = useScroll();
  const GeminiSearch = dynamic(() => import("@/components/gemini/gemini-search"), { ssr: false });
  
  // Prompt et instruction identiques à ClientGeminiBlock
  const system_instruction = `Tu es un expert en stratégie digitale et UX. Ton analyse est factuelle, basée sur les standards technologiques et marketing actuels. Tu fournis des recommandations claires et justifiées pour un public de décideurs (CEO, CTO).`;
  const prompt = `
  **Mission :** Audit stratégique de l'URL **{$url}** pour évaluer la pertinence d'une migration vers une architecture Headless.
  
  ---
  
  Étape 1 : ### **Votre organisation**
  *Effectue une analyse croisée du contenu visible (Header, Footer, Page "À Propos").*
  
  1.  **Secteur d'activité :** (Ex: E-commerce B2C, SaaS B2B, Média, etc.)
  2.  **Proposition de valeur :** Quelle est la promesse principale faite au client ?
  3.  **Mission :** Cite un court extrait du site qui valide cette proposition.
  4.  **Cibles prioritaires :** Identifie les 2 profils d'utilisateurs les plus évidents.
  *Si le site est inaccessible ou le contenu protégé, réponds uniquement : "Accès bloqué : Diagnostic impossible." et arrête l'analyse.*
  
  ---
  
  Étape 2 : ### **Analyse Stratégique et recommandations** 
  
  * **Conseil Principal :** Recommande si une migration vers une architecture Headless est pertinente ou non, avec une justification concise.
  * **Résumé :** Fournis un bref résumé des points clés de l'analyse.
  
  ### 1. Positionnement Actuel
  *   **Perception de marque :** Le design et la navigation du site inspirent-ils confiance et modernité, ou montrent-ils des signes de retard technologique (lenteur, design daté) ?
  *   **Friction UX Majeure :** Quel est le principal obstacle visible dans le parcours utilisateur (ex: formulaire complexe, navigation peu claire, temps de chargement) ?
  *   **Indice de modernité :** [Note sur 10] évaluant la performance et l'expérience globale par rapport aux standards actuels.
  
  ### 2. Pertinence d'une Migration Headless
  *   **Verdict Stratégique :** [Accélérer / Maintenir / Pivoter]. Justifie en une phrase.
  *   **Enjeu de Différenciation :** Comment le Headless peut-il transformer l'expérience (ex: ultra-rapide, personnalisée) pour créer un avantage concurrentiel ?
  *   **Justification Business :** Quels sont les arguments clés (ROI potentiel) justifiant l'investissement face aux gains attendus en performance, SEO et agilité marketing ?
  
  ### 3. Indicateurs d'Impact Business
  *   **Performance & SEO :** Quel serait l'impact de temps de chargement quasi-instantanés (Core Web Vitals optimaux) sur le classement Google et le taux de rebond ?
  *   **Agilité Marketing :** Explique comment le Headless permettrait aux équipes de lancer plus rapidement des campagnes ou de nouveaux contenus sans dépendre du back-end.
  
  ### 4. Leviers de Croissance via Headless
  *Identifie 3 fonctionnalités innovantes ou à haute valeur ajoutée que le Headless rendrait possibles.*
  1.  (Ex: Configurateur de produit 3D)
  2.  (Ex: Portail client personnalisé et immersif)
  3.  (Ex: Intégration d'une IA de recommandation)
  
  ---
  
  **Instruction de sortie :** Réponds exclusivement en Markdown. La structure doit suivre les titres et les points de l'étape 2.
  `;

  return (
    <>
      <main className="h-screen flex items-center relative overflow-hidden">

        <div className="container flex flex-col lg:flex-row justify-between lg:justify-evenly items-end gap-12 lg:gap-24 px-4 md:px-6 relative">
          {/* Text Content */}
          <div className="flex flex-col lg:col-span-7 bg-white/10 backdrop-blur-md border border-white/10 p-6 md:p-10 rounded-2xl mt-12 lg:mt-0">
            <div className="mb-1 text-3xl lg:text-4xl text-white/80 font-googletexte">
              Développeuse 
            </div>
            <div className="mt-2 text-4xl lg:text-5xl text-lightyellow font-googletitre font-medium">
              WordPress Headless
            </div>            
            <div className="mt-5 flex items-center justify-start gap-4">
              <Image
                src="/img/logo-wordpress-blanc.webp"
                alt="Logo WordPress"
                width={45}
                height={60}
              />
              <Image
                src="/img/logo-nextjs-blanc.webp"
                alt="Logo Next.js"
                width={80}
                height={80}
              />
              <Image
                src="/img/logo-astro-blanc.webp"
                alt="Logo Astro"
                width={90}
                height={80}
                className="mt-1.5"
              />
            </div>
            <p className="mt-16 font-googletexte md:text-xl text-white/80 max-w-xl">
              Pour un WordPress ultra-rapide, moderne et flexible grâce au
              headless CMS.
            </p>


            <p className="mt-4 mb-4 font-googletitre font-semibold text-white text-lg">Prêt à passer en headless ?</p>
            <div className="flex flex-col sm:flex-row content-start justify-start gap-4">
              <Button className="mx-0 inline-flex bg-coral py-1 px-6 rounded-2xl shadow-lg hover:bg-coral/80 transition duration-300 ease-in">
                <Link
                  href="/demo"
                  className="gap-2 text-darkblue font-googletitre font-semibold text-lg"
                >
                  Démo
                </Link>
                <LucideArrowUpRight className="w-8 h-8 text-darkblue" />
              </Button>
              <Button className="mx-0 inline-flex bg-lightyellow py-1 px-6 rounded-2xl shadow-lg hover:bg-lightyellow/80 transition duration-300 ease-in">
                <Link
                  href="#audit"
                  className="gap-2 text-darkblue font-googletitre font-semibold text-lg"
                >
                  Tester votre site 
                </Link>
                <LucideArrowUpRight className="w-8 h-8 text-darkblue" />
              </Button>
            </div>


          </div>

          {/* Hero Image */}
          <div className="relative lg:col-span-5">
            <div className="relative rounded-xl overflow-hidden aspect-square max-w-md mx-auto">
              {/* Placeholder for profile image - replace with actual image */}
              <div className="bg-gradient-to-br from-brand-400/80 to-brand-600/80 w-full h-full flex items-center justify-center">
                <Image
                  src="/img/avatar.webp" // Replace with your image path
                  alt="Profile"
                  className="bg-white object-cover w-full h-full rounded-xl"
                  width={500} // Adjust width as needed
                  height={500} // Adjust height as needed
                />
              </div>

              {/* Floating badges */}
              <div className="absolute left-6 top-6 bg-extralightblue py-2 px-4 rounded-full shadow-lg flex items-center gap-2 animate-float">
                <span className="h-3 w-3 bg-green-500 rounded-full"></span>
                <span className="text-sm font-medium text-black">
                  Disponible
                </span>
              </div>

              <div className="absolute right-4 bottom-12 bg-extralightblue py-2 px-4 rounded-full shadow-lg animate-float-delayed">
                <span className="text-sm font-medium text-black">
                  8+ ans d'expérience
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/*Gemini Search Section */}
      <section id="audit" className="bg-white/5 w-full mx-auto flex flex-col backdrop-blur-xl border-y border-white/10 px-4 md:px-6 py-16 md:py-32 relative">

          <h2 className="font-googletitre text-white text-4xl md:text-5xl font-medium flex items-end justify-center gap-4 z-10">
            Faut-il migrer en headless ?
          </h2>
        <div className="w-full max-w-full mx-auto xl:max-w-5xl flex flex-col relative md:px-20 md:mt-8 xl:mt-0 xl:px-0">
          <div className="text-left font-googletexte text-2xl lg:text-3xl text-darkblue font-regular mt-1 xxl:mt-24 lg:pt-6 z-10">
            <span className="text-4xl md:text-5xl font-googletitre text-lightyellow font-medium">
              Audit gratuit 
            </span>
            {" "}
            <span className="text-white/70">
             en 10 secondes
            </span>
            <p className="text-white/70 text-lg md:text-xl mt-2 md:mb-8">
              Analysez votre site WordPress et recevez un rapport complet avec des recommandations personnalisées pour une migration en headless CMS.
            </p>
          </div>
          <div style={{
          position: "absolute",
          top: 140,
          left: 0,
          width: "70vw",
          height: "100vh",
          zIndex: 0,
          overflow: "hidden",
          opacity: 0.4,
        }}
        className="md:top-[-120px]">
            <AiAuditBannerSVG />
          </div>
          <div className="w-full max-w-6xl mx-auto relative h-full overflow-hidden">
            <div className="relative z-10">
              <GeminiSearch 
                systemInstruction={system_instruction}
                prompt={prompt}
                onResult={() => {}}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
