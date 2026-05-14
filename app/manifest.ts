import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Next Impact — Création Site web | Web & Mobile App",
    short_name: "Next Impact",
    description:
      "Création de sites web et d'applications (web & mobile) sur-mesure : WordPress, Headless WordPress + Next.js, web app et PWA.",
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
