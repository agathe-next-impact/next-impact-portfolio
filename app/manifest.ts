import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Next Impact — WordPress Headless & Next.js",
    short_name: "Next Impact",
    description:
      "Studio freelance spécialisé WordPress Headless et Next.js. Prestataire TIH : 30 % déductible AGEFIPH.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#d83a1a",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
