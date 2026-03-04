import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MdxGallery } from "@/components/documentation/mdx-gallery";
import { SpringLab } from "@/components/documentation/spring-lab";
import { ContrastChecker } from "@/components/documentation/contrast-checker";
import { LiveButtonPlayground } from "@/components/documentation/live-button-playground";
import { ConditionalContent } from "@/components/documentation/conditional-content";
import { TypographyShowcase } from "@/components/documentation/typography-showcase";
import { ColorPaletteShowcase } from "@/components/documentation/color-palette-showcase";
import { VideoGallery } from "@/components/documentation/video-gallery";
import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, VideoObjectJsonLd } from "@/components/json-ld";

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata({
    title: "Playground | Comprendre",
    description:
      "Explorez le design system, visionnez les démos et testez les composants en temps réel. " +
      "Typographie, couleurs, animations et composants UI Next Impact.",
    path: "/documentation/playground",
    keywords: ["playground", "design system", "composants UI", "démos"],
  });
}

export default function PlaygroundPage() {
  const breadcrumbItems = [
    { name: "Accueil", url: "/" },
    { name: "Comprendre", url: "/documentation" },
    { name: "Playground", url: "/documentation/playground" },
  ];

  return (
    <div className="relative min-h-screen">
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <VideoObjectJsonLd
        name="Billeterie événementielle — WordPress Headless Next.js"
        description="Présentation complète d'une plateforme de billeterie propulsée par WordPress Headless et Next.js."
        thumbnailUrl="https://img.youtube.com/vi/I1qi5o31Lnk/maxresdefault.jpg"
        uploadDate="2024-06-01"
        contentUrl="https://youtu.be/I1qi5o31Lnk"
        embedUrl="https://www.youtube.com/embed/I1qi5o31Lnk"
      />
      <VideoObjectJsonLd
        name="Comme des Fous — Média participatif WordPress Headless"
        description="Le média participatif Comme des Fous, propulsé par WordPress Headless et Next.js."
        thumbnailUrl="https://img.youtube.com/vi/6vUSbG6F50w/maxresdefault.jpg"
        uploadDate="2024-06-01"
        contentUrl="https://youtu.be/6vUSbG6F50w"
        embedUrl="https://www.youtube.com/embed/6vUSbG6F50w"
      />
      <VideoObjectJsonLd
        name="Les Doléances — Plateforme citoyenne WordPress Headless"
        description="Un site de promotion des doléances citoyennes avec WordPress Headless et Next.js."
        thumbnailUrl="https://img.youtube.com/vi/_OjiGiOWJus/maxresdefault.jpg"
        uploadDate="2024-06-01"
        contentUrl="https://youtu.be/_OjiGiOWJus"
        embedUrl="https://www.youtube.com/embed/_OjiGiOWJus"
      />
      <VideoObjectJsonLd
        name="États Généraux Communaux — WordPress Headless Next.js"
        description="Plateforme pour les États Généraux Communaux utilisant WordPress Headless et Next.js."
        thumbnailUrl="https://img.youtube.com/vi/dJIndpLBm7o/maxresdefault.jpg"
        uploadDate="2024-06-01"
        contentUrl="https://youtu.be/dJIndpLBm7o"
        embedUrl="https://www.youtube.com/embed/dJIndpLBm7o"
      />
      <VideoObjectJsonLd
        name="Comme des Fous — Jeux en ligne WordPress Headless"
        description="Section de jeux en ligne intégrée au site Comme des Fous, développée en headless."
        thumbnailUrl="https://img.youtube.com/vi/SIj61ECS1Mo/maxresdefault.jpg"
        uploadDate="2024-06-01"
        contentUrl="https://youtu.be/SIj61ECS1Mo"
        embedUrl="https://www.youtube.com/embed/SIj61ECS1Mo"
      />
      <main className="flex-1">
        <section className="w-full py-8 md:py-12 lg:py-16">
          <div className="container px-4 md:px-6">
            {/* Header */}
            <div className="mb-10">
              <Link
                href="/documentation"
                className="inline-flex items-center gap-2 rounded-full bg-mediumblue/60 backdrop-blur-sm px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-mediumblue/80 transition-colors border border-lightblue/10 mb-6"
              >
                <ArrowLeft className="h-4 w-4" />
                Comprendre
              </Link>
              <h1 className="font-googletitre text-3xl sm:text-4xl md:text-5xl font-medium text-white tracking-tight">
                Playground
              </h1>
              <p className="mt-3 text-lg text-white/80 font-googletexte max-w-2xl">
                Explorez le design system, visionnez les démos et testez les
                composants en temps réel.
              </p>
            </div>

            <div className="space-y-10">
              {/* 1. MDX Component Gallery */}
              <MdxGallery />

              {/* 2. Spring Animation Lab */}
              <SpringLab />

              {/* 3. Contrast Checker */}
              <ContrastChecker />

              {/* 4. Button playground */}
              <LiveButtonPlayground />

              {/* 5. Typography */}
              <TypographyShowcase />

              {/* 6. Color palette */}
              <ColorPaletteShowcase />

              {/* 7. Profile-aware content demo */}
              <ConditionalContent
                simple={
                  <div className="rounded-3xl border border-lightblue/10 bg-mediumblue/80 backdrop-blur-sm p-6 md:p-8">
                    <h3 className="font-googletitre text-xl text-white font-medium mb-4">
                      Comment fonctionne le headless ?
                    </h3>
                    <p className="text-white/80 font-googletexte leading-relaxed">
                      Votre site WordPress envoie le contenu via une API. Le
                      frontend (Next.js) récupère ce contenu et l&apos;affiche
                      avec un design moderne et performant.
                    </p>
                  </div>
                }
                advanced={
                  <div className="rounded-3xl border border-lightblue/10 bg-mediumblue/80 backdrop-blur-sm p-6 md:p-8">
                    <h3 className="font-googletitre text-xl text-white font-medium mb-4">
                      Architecture technique headless
                    </h3>
                    <p className="text-white/80 font-googletexte mb-4">
                      L&apos;API REST de WordPress expose les endpoints
                      suivants :
                    </p>
                    <pre className="rounded-2xl bg-darkblue/60 border border-lightblue/10 p-5 text-sm text-extralightblue/80 font-mono overflow-x-auto">
                      <code>{`GET /wp-json/wp/v2/posts
GET /wp-json/wp/v2/pages?per_page=100
GET /wp-json/wp/v2/media?parent=<id>

// Fetch avec Next.js
const res = await fetch(
  'https://votre-site.com/wp-json/wp/v2/posts'
);
const posts = await res.json();`}</code>
                    </pre>
                  </div>
                }
              />

              {/* 8. Video demos */}
              <VideoGallery />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
