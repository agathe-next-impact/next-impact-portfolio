"use client";
import { Shield, TrendingUp, Zap } from "lucide-react";
import dynamic from "next/dynamic";

const GeminiSearch = dynamic(() => import("@/components/gemini/gemini-search"));

export default function ClientGeminiBlock() {
  // L'instruction système définit le "rôle" et le contexte global.
  // Elle doit être passée séparément du prompt dans l'appel API.
  const system_instruction = `Tu es un expert en stratégie digitale et UX avec une forte compétence en audit technique.
Ta méthode est rigoureuse :
1. OBSERVATION : Tu extrais d'abord les données factuelles (métadonnées, structure légale, vocabulaire utilisé).
2. ANALYSE : Tu croises ces données pour établir un diagnostic précis de l'identité de l'organisation.
3. RECOMMANDATION : Tu fournis des conseils stratégiques basés sur ces preuves.
Ton ton est direct, professionnel et factuel.`;

  // Le prompt se concentre sur les tâches à accomplir.
  const prompt = `
**Mission :** Audit stratégique de l'URL {$url} pour évaluer la pertinence d'une migration vers une architecture Headless.

🛑 **PROCÉDURE ANTI-HALLUCINATION OBLIGATOIRE :**

**Étape A : Extraction des métadonnées (exécution prioritaire)**
1. Extrais EXACTEMENT le contenu des balises suivantes de la homepage :
   - <title> : [copie exacte ou "Non détecté"]
   - <meta name="description"> : [copie exacte ou "Non détecté"]
   - <meta property="og:title"> : [copie exacte ou "Non détecté"]
   - <meta property="og:description"> : [copie exacte ou "Non détecté"]
2. Inspecte le footer pour identifier le statut juridique (SARL, SAS, Association loi 1901, ONG, Fondation, Service Public, etc.)
3. Scan du header/navigation : recherche des termes explicites (Boutique, Agence, Média, Ministère, Université, Observatoire, Think Tank, etc.)

**Étape B : Validation croisée**
- Confronte les 3 sources (métadonnées + footer + navigation)
- Si divergence entre sources : indique "⚠️ Incohérence détectée" et cite chaque source avec son contenu exact
- Si aucune information claire : écris "Non déterminé (absence de données)" au lieu d'inventer

**🎯 GRILLE DE DÉTECTION SECTEUR (exécution obligatoire) :**
Recherche ces MOTS-CLÉS EXACTS (et leurs VARIANTES) dans title/meta/navigation/footer :

**E-commerce** : "boutique", "shop", "e-shop", "e-commerce", "panier", "acheter", "ajouter au panier", "commander", "commande", "produits", "livraison", "expédition", "prix €", "prix", "stock", "catalogue", "vente en ligne"
**SaaS/Software** : "plateforme", "solution", "logiciel", "software", "application", "app", "API", "dashboard", "tableau de bord", "abonnement", "subscription", "démo", "demo", "essai gratuit", "free trial", "pricing", "tarifs", "SaaS"
**Agence/Conseil** : "agence" + ("web"|"digitale"|"communication"|"créative"|"marketing"), "studio créatif", "cabinet conseil", "expertise", "accompagnement", "nos clients", "portfolio", "réalisations", "projets", "cas clients", "nos services" + design/développement
**Média/Presse** : "actualités", "news", "articles", "journal", "magazine", "édition", "rédaction", "journaliste", "reporter", "abonnez-vous", "newsletter", "dernières nouvelles", "info", "presse"
**Association/ONG** : "association", "loi 1901", "association loi", "ONG", "adhérer", "adhésion", "faire un don", "donner", "donation", "bénévoles", "volontaires", "mission sociale", "but non lucratif", "non-profit", "collectif", "mouvement citoyen"
**Think Tank/Recherche** : "think tank", "think and do tank", "études", "publications", "recherche", "research", "observatoire", "analyses", "policy", "rapport", "policy paper", "working paper", "centre de recherche", "institut", "laboratoire d'idées"
**Institution/Gov** : "ministère", "ministre", "gouvernement", "gouvernemental", "public", "administration", "service public", "légifrance", "république", "état", "collectivité", "préfecture", "mairie", "conseil régional", "agence publique"
**Éducation** : "formation", "formations", "université", "école", "institut", "cours", "étudiants", "élèves", "diplôme", "certification", "certifié", "apprentissage", "enseignement", "pédagogie", "campus", "académie"
**Industrie/B2B** : "fabricant", "fabrication", "industriel", "industrie", "manufacture", "fournisseur", "grossiste", "devis", "sur mesure", "capacité production", "usine", "production", "B2B", "professionnel", "distributeur"

⚠️ **RÈGLES DE DÉSAMBIGUÏSATION :**
- "Agence" SEUL → Vérifier contexte : si + "web"/"digitale"/"communication" → Agence/Conseil, si + "publique"/"gouvernement" → Institution
- "Studio" SEUL → Vérifier : si + "créatif"/"design"/"graphique" → Agence, sinon "Non déterminé"
- "Plateforme" SEUL → Insuffisant, chercher "abonnement"/"SaaS"/"API" pour confirmer
- "Services" SEUL → Trop générique, ignorer

SCORING :
- 3+ mots-clés d'un secteur → Confiance 90%
- 2 mots-clés → Confiance 70%
- 1 mot-clé OU déduction visuelle → Confiance <50% → "Non déterminé"
- Mots-clés de 2 secteurs différents → Indiquer "Secteur hybride : [Secteur1] + [Secteur2]"

**Étape C : Règles strictes**
- NE JAMAIS réécrire, paraphraser ou deviner les métadonnées
- NE JAMAIS qualifier par défaut une entité d'"entreprise" sans preuve explicite
- NE PAS utiliser d'informations externes (SERP, mémoire de conversations précédentes)
- TOUJOURS citer la source exacte entre crochets : [title], [footer], [nav], [meta-description]

**Seuil de confiance :**
- Si confiance < 80% sur la nature/secteur : écrire "Non déterminé (données insuffisantes)"
- Si contradiction entre sources : lister toutes les hypothèses avec leur source
- EXEMPLES D'ERREURS À ÉVITER :
  ❌ "Entreprise" quand footer dit "Association loi 1901"
  ❌ "E-commerce" quand c'est un site vitrine institutionnel
  ❌ "Agence" quand c'est un Think Tank

---

**Étape 1 : Diagnostic d'Identité (Scan Précis)**

⚠️ **[SECTION INTERNE - NE PAS AFFICHER DANS LA RÉPONSE]**
Métadonnées extraites (pour validation uniquement) :
- Title : [copie exacte]
- Meta-description : [copie exacte]
- Statut juridique (footer) : [extrait exact ou "Non détecté"]
- Type identifié (navigation/header) : [termes clés trouvés]
**[FIN SECTION INTERNE]**

### Votre organisation
1.  **Nature de l'entité :** [Association / Entreprise / Think Tank / ONG / Institution / Service Public / Non déterminé] — Source : [title/footer/nav]
2.  **Secteur d'activité :** [Secteur identifié] — Mots-clés détectés : "[mot1]", "[mot2]", "[mot3]" — Score confiance : [X]%
3.  **Proposition de valeur :** Quelle est la promesse principale faite au client ? — Extrait exact : "[citation courte du site]"
4.  **Mission :** Cite un court extrait du site qui valide cette proposition.
5.  **Cibles prioritaires :** Identifie les 2 profils d'utilisateurs les plus évidents.

*Si le site est inaccessible ou le contenu protégé, réponds uniquement : "Accès bloqué : Diagnostic impossible." et arrête l'analyse.*

---

**Étape 2 : Analyse Stratégique (Format Markdown)**

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
      <div className="w-[70%] mx-auto mt-8 mb-16 bg-white/5 backdrop-blur-md border border-white/10 pt-12 md:pt-20 rounded-2xl relative">
        <div className="relative max-w-2xl mx-auto px-4 md:px-6">
                <span className="text-white/90 text-lg">Testez gratuitement en 10 secondes si votre site WordPress est prêt pour une migration headless grâce à notre audit IA.</span>
                <GeminiSearch onResult={() => {}} prompt={prompt} systemInstruction={system_instruction} />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-20">
                    {[
                      { icon: Zap, text: "3x plus rapide", color: "#F29F05" },
                      { icon: Shield, text: "Sécurité renforcée", color: "rgba(14,14,12,0.3)" },
                      { icon: TrendingUp, text: "SEO optimisé", color: "#FF6B6B" },
                    ].map((benefit, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center gap-3 backdrop-blur-sm rounded-xl px-4 py-4 border border-white/20 hover:bg-white/15 transition-all hover:scale-105"
                      >
                        <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                          <benefit.icon className="h-5 w-5" style={{ color: benefit.color }} />
                        </div>
                        <span className="text-sm font-semibold text-white text-center">{benefit.text}</span>
                      </div>
                    ))}
            </div>
        </div>
      </div>
    </>
  );
}
