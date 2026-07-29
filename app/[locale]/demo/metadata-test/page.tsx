/**
 * Page de démonstration du système de gestion des métadonnées
 * Accessible uniquement en mode développement
 */

import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { MetadataPreviewTool } from "@/components/metadata-preview";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    title: locale === "en" ? "Metadata test tool" : "Outil de test des métadonnées",
    description:
      locale === "en"
        ? "Development tool to test and preview your page metadata"
        : "Outil de développement pour tester et prévisualiser les métadonnées de vos pages",
    path: "/demo/metadata-test",
    noindex: true,
    locale,
  });
}

export default function MetadataTestPage() {
  return (
    <div className="relative z-10 min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">
            🏷️ Système de Gestion des Métadonnées
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">
            Testez et prévisualisez vos métadonnées pour Google, Facebook et
            Twitter
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/demo/metadata-test"
              className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700"
            >
              Tester les métadonnées
            </Link>
            <a
              href="https://search.google.com/test/rich-results"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Rich Results Test
            </a>
            <a
              href="https://validator.schema.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Schema Validator
            </a>
          </div>
        </div>

        {/* Preview Tool */}
        <MetadataPreviewTool />

        {/* Documentation rapide */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg border p-6">
            <h2 className="text-2xl font-bold mb-4">📚 Documentation</h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  🚀 Démarrage Rapide
                </h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded p-4 overflow-x-auto">
                  <pre className="text-sm">
                    <code>{`import { generatePageMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Titre de ma page",
    description: "Description de ma page",
    path: "/ma-page",
    keywords: ["mot-clé 1", "mot-clé 2"],
  });
}`}</code>
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">
                  📖 Documentation Complète
                </h3>
                <ul className="space-y-2 list-disc list-inside text-gray-700 dark:text-gray-300">
                  <li>
                    <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                      lib/README_METADATA.md
                    </code>{" "}
                    - Vue d'ensemble et guide principal
                  </li>
                  <li>
                    <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                      lib/METADATA_USAGE.md
                    </code>{" "}
                    - Guide d'utilisation des métadonnées
                  </li>
                  <li>
                    <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                      lib/JSON_LD_USAGE.md
                    </code>{" "}
                    - Guide des données structurées
                  </li>
                  <li>
                    <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                      lib/METADATA_TEMPLATES.md
                    </code>{" "}
                    - Templates prêts à l'emploi
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">
                  🛠️ Outils Disponibles
                </h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li>
                    🔍 <strong>Debugger intégré</strong> - Bouton en bas à
                    droite de chaque page (dev uniquement)
                  </li>
                  <li>
                    📊 <strong>Script d'analyse</strong> -{" "}
                    <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                      node scripts/check-metadata-migration.js
                    </code>
                  </li>
                  <li>
                    👁️ <strong>Prévisualisation</strong> - Cet outil sur cette
                    page
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">
                  ✅ Métadonnées Prédéfinies
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                    pageMetadata.home()
                  </code>
                  <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                    pageMetadata.services()
                  </code>
                  <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                    pageMetadata.audit()
                  </code>
                  <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                    pageMetadata.contact()
                  </code>
                  <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                    pageMetadata.caseStudies()
                  </code>
                  <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">
                    pageMetadata.documentation()
                  </code>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">🎯 Bonnes Pratiques</h3>
                <ul className="space-y-1 list-disc list-inside text-gray-700 dark:text-gray-300 text-sm">
                  <li>Titres uniques de 50-60 caractères max</li>
                  <li>Descriptions de 150-160 caractères</li>
                  <li>Images OpenGraph 1200x630px</li>
                  <li>Mots-clés pertinents et ciblés</li>
                  <li>URLs canoniques pour éviter le duplicate content</li>
                  <li>Tester avec Rich Results Test avant publication</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Note de développement */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ <strong>Note :</strong> Cette page est uniquement destinée au
              développement. En production, ajoutez{" "}
              <code className="bg-yellow-100 dark:bg-yellow-900 px-2 py-1 rounded">
                noindex: true
              </code>{" "}
              aux métadonnées ou supprimez cette route.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
