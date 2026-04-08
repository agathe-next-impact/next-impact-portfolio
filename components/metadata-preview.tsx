/**
 * Composant de prévisualisation des métadonnées
 * Affiche un aperçu de comment la page apparaîtra dans Google, Facebook, Twitter
 */

"use client";

import { useState } from "react";
import Image from "next/image";

interface MetadataPreviewProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  siteName?: string;
}

export function MetadataPreview({
  title,
  description,
  url,
  image = "/img/avatar.webp",
  siteName = "Next Impact",
}: MetadataPreviewProps) {
  const [activeTab, setActiveTab] = useState<"google" | "facebook" | "twitter">(
    "google"
  );

  // Nettoyer l'URL pour l'affichage
  const displayUrl = url.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const domain = displayUrl.split("/")[0];

  return (
    <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800 ">
      {/* Tabs */}
      <div className="flex border-b bg-gray-50 dark:bg-gray-900">
        <button
          onClick={() => setActiveTab("google")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition ${
            activeTab === "google"
              ? "bg-white dark:bg-gray-800 text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
            </svg>
            Google
          </span>
        </button>
        <button
          onClick={() => setActiveTab("facebook")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition ${
            activeTab === "facebook"
              ? "bg-white dark:bg-gray-800 text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            Facebook
          </span>
        </button>
        <button
          onClick={() => setActiveTab("twitter")}
          className={`flex-1 px-4 py-3 text-sm font-medium transition ${
            activeTab === "twitter"
              ? "bg-white dark:bg-gray-800 text-blue-600 border-b-2 border-blue-600"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          }`}
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
            </svg>
            Twitter
          </span>
        </button>
      </div>

      {/* Preview Content */}
      <div className="p-6">
        {/* Google Preview */}
        {activeTab === "google" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-xs">🌐</span>
              </div>
              <div>
                <div className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                  {domain}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {displayUrl}
                </div>
              </div>
            </div>
            <h3 className="text-xl text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {description}
            </p>
          </div>
        )}

        {/* Facebook Preview */}
        {activeTab === "facebook" && (
          <div className="border rounded-lg overflow-hidden bg-white dark:bg-gray-900">
            {image && (
              <div className="relative w-full aspect-[1.91/1] bg-gray-200 dark:bg-gray-700">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
            <div className="p-3 bg-gray-50 dark:bg-gray-800 border-t">
              <div className="text-xs text-gray-500 dark:text-gray-400 uppercase mb-1">
                {domain}
              </div>
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
                {title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {description}
              </p>
            </div>
          </div>
        )}

        {/* Twitter Preview */}
        {activeTab === "twitter" && (
          <div className="border rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
            {image && (
              <div className="relative w-full aspect-[2/1] bg-gray-200 dark:bg-gray-700">
                <Image
                  src={image}
                  alt={title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}
            <div className="p-3 border-t">
              <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1 line-clamp-2">
                {title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                {description}
              </p>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{domain}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info footer */}
      <div className="px-6 py-3 bg-gray-50 dark:bg-gray-900 border-t text-xs text-gray-600 dark:text-gray-400">
        💡 Aperçu indicatif - Les plateformes peuvent afficher différemment
      </div>
    </div>
  );
}

/**
 * Formulaire de test pour prévisualiser les métadonnées
 */
export function MetadataPreviewTool() {
  const [formData, setFormData] = useState({
    title: "Développeur WordPress Freelance | Next Impact",
    description:
      "Développeur WordPress freelance spécialisé en sites web corporate et applications web Headless. Création, refonte, audit et conseil pour des projets sur-mesure.",
    url: "https://next-impact.digital",
    image: "/img/avatar.webp",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">
          Prévisualisation des Métadonnées
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Visualisez comment votre page apparaîtra sur Google, Facebook et
          Twitter
        </p>
      </div>

      {/* Formulaire */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Titre <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900"
            maxLength={60}
          />
          <div className="text-xs text-gray-500 mt-1">
            {formData.title.length}/60 caractères
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900"
            maxLength={160}
          />
          <div className="text-xs text-gray-500 mt-1">
            {formData.description.length}/160 caractères
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            URL <span className="text-red-500">*</span>
          </label>
          <input
            type="url"
            name="url"
            value={formData.url}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            URL Image (1200x630px recommandé)
          </label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900"
          />
        </div>
      </div>

      {/* Prévisualisation */}
      <MetadataPreview
        title={formData.title}
        description={formData.description}
        url={formData.url}
        image={formData.image}
      />
    </div>
  );
}
