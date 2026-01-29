/**
 * Composant pour visualiser les métadonnées de la page en développement
 * À utiliser uniquement en mode développement pour déboguer les métadonnées
 */

"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface MetaTag {
  name?: string;
  property?: string;
  content?: string;
  tag: string;
}

export function MetadataDebugger() {
  const pathname = usePathname();
  const [metadata, setMetadata] = useState<MetaTag[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Extraire toutes les balises meta de la page
    const metaTags = Array.from(document.querySelectorAll("meta"));
    const titleTag = document.querySelector("title");
    const canonicalTag = document.querySelector('link[rel="canonical"]');

    const metaData: MetaTag[] = [];

    if (titleTag) {
      metaData.push({
        tag: "title",
        content: titleTag.textContent || "",
      });
    }

    if (canonicalTag) {
      metaData.push({
        tag: "link[rel='canonical']",
        content: canonicalTag.getAttribute("href") || "",
      });
    }

    metaTags.forEach((tag) => {
      const name = tag.getAttribute("name");
      const property = tag.getAttribute("property");
      const content = tag.getAttribute("content");

      if ((name || property) && content) {
        metaData.push({
          name: name || undefined,
          property: property || undefined,
          content,
          tag: "meta",
        });
      }
    });

    setMetadata(metaData);
  }, [pathname]);

  // Ne rien afficher en production
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-[9999]"
      style={{ isolation: "isolate" }}
    >
      {/* Bouton pour ouvrir/fermer */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg font-medium text-sm"
        title="Afficher les métadonnées de la page"
      >
        🏷️ Metadata {isOpen ? "▼" : "▲"}
      </button>

      {/* Panel de métadonnées */}
      {isOpen && (
        <div className="absolute bottom-12 right-0 w-[600px] max-h-[600px] overflow-auto bg-gray-900 text-white rounded-lg shadow-2xl border border-gray-700">
          <div className="sticky top-0 bg-purple-600 px-4 py-3 flex justify-between items-center">
            <h3 className="font-bold text-sm">
              Métadonnées de la page - {pathname}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Titre */}
            {metadata
              .filter((m) => m.tag === "title")
              .map((m, i) => (
                <div key={i} className="border-b border-gray-700 pb-3">
                  <div className="text-xs text-purple-400 font-mono mb-1">
                    {"<title>"}
                  </div>
                  <div className="text-sm pl-4">{m.content}</div>
                </div>
              ))}

            {/* Canonical */}
            {metadata
              .filter((m) => m.tag === "link[rel='canonical']")
              .map((m, i) => (
                <div key={i} className="border-b border-gray-700 pb-3">
                  <div className="text-xs text-blue-400 font-mono mb-1">
                    {'<link rel="canonical">'}
                  </div>
                  <div className="text-sm pl-4 break-all">{m.content}</div>
                </div>
              ))}

            {/* Description */}
            {metadata
              .filter((m) => m.name === "description")
              .map((m, i) => (
                <div key={i} className="border-b border-gray-700 pb-3">
                  <div className="text-xs text-green-400 font-mono mb-1">
                    {'<meta name="description">'}
                  </div>
                  <div className="text-sm pl-4">{m.content}</div>
                  <div className="text-xs text-gray-500 mt-1 pl-4">
                    {m.content?.length} caractères
                  </div>
                </div>
              ))}

            {/* Keywords */}
            {metadata
              .filter((m) => m.name === "keywords")
              .map((m, i) => (
                <div key={i} className="border-b border-gray-700 pb-3">
                  <div className="text-xs text-yellow-400 font-mono mb-1">
                    {'<meta name="keywords">'}
                  </div>
                  <div className="text-sm pl-4">
                    {m.content?.split(",").map((kw, ki) => (
                      <span
                        key={ki}
                        className="inline-block bg-gray-800 px-2 py-1 rounded mr-2 mb-1 text-xs"
                      >
                        {kw.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

            {/* Open Graph */}
            <div className="border-b border-gray-700 pb-3">
              <div className="text-xs text-pink-400 font-bold mb-2">
                Open Graph (Facebook, LinkedIn, etc.)
              </div>
              {metadata
                .filter((m) => m.property?.startsWith("og:"))
                .map((m, i) => (
                  <div key={i} className="pl-4 mb-2">
                    <div className="text-xs text-pink-300 font-mono">
                      {m.property}
                    </div>
                    <div className="text-sm break-all text-gray-300">
                      {m.property === "og:image" ? (
                        <img
                          src={m.content}
                          alt="OG"
                          className="mt-1 max-w-full h-auto border border-gray-700"
                        />
                      ) : (
                        m.content
                      )}
                    </div>
                  </div>
                ))}
            </div>

            {/* Twitter */}
            <div className="border-b border-gray-700 pb-3">
              <div className="text-xs text-cyan-400 font-bold mb-2">
                Twitter Card
              </div>
              {metadata
                .filter((m) => m.name?.startsWith("twitter:"))
                .map((m, i) => (
                  <div key={i} className="pl-4 mb-2">
                    <div className="text-xs text-cyan-300 font-mono">
                      {m.name}
                    </div>
                    <div className="text-sm break-all text-gray-300">
                      {m.name === "twitter:image" ? (
                        <img
                          src={m.content}
                          alt="Twitter"
                          className="mt-1 max-w-full h-auto border border-gray-700"
                        />
                      ) : (
                        m.content
                      )}
                    </div>
                  </div>
                ))}
            </div>

            {/* Robots */}
            {metadata
              .filter((m) => m.name === "robots")
              .map((m, i) => (
                <div key={i} className="border-b border-gray-700 pb-3">
                  <div className="text-xs text-red-400 font-mono mb-1">
                    {'<meta name="robots">'}
                  </div>
                  <div className="text-sm pl-4">
                    {m.content?.split(",").map((rule, ri) => (
                      <span
                        key={ri}
                        className={`inline-block px-2 py-1 rounded mr-2 mb-1 text-xs ${
                          rule.trim().includes("noindex")
                            ? "bg-red-900 text-red-200"
                            : "bg-green-900 text-green-200"
                        }`}
                      >
                        {rule.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

            {/* Autres métadonnées */}
            <div>
              <div className="text-xs text-gray-400 font-bold mb-2">
                Autres métadonnées
              </div>
              {metadata
                .filter(
                  (m) =>
                    m.tag === "meta" &&
                    !m.name?.startsWith("twitter:") &&
                    !m.property?.startsWith("og:") &&
                    m.name !== "description" &&
                    m.name !== "keywords" &&
                    m.name !== "robots"
                )
                .map((m, i) => (
                  <div key={i} className="pl-4 mb-2 text-xs">
                    <span className="text-gray-500 font-mono">
                      {m.name || m.property}:
                    </span>
                    <span className="text-gray-300 ml-2">{m.content}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
