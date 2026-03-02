import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Next Impact — WordPress Headless & Next.js",
    short_name: "Next Impact",
    description:
      "Développeur freelance spécialisé WordPress Headless, Next.js & Astro.",
    start_url: "/",
    display: "standalone",
    background_color: "#1A1A2E",
    theme_color: "#6C63FF",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
