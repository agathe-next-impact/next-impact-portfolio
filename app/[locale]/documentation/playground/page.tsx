import { Link } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";
import { MdxGallery } from "@/components/documentation/mdx-gallery";
import { SpringLab } from "@/components/documentation/spring-lab";
import { LiveButtonPlayground } from "@/components/documentation/live-button-playground";
import { ConditionalContent } from "@/components/documentation/conditional-content";
import { TypographyShowcase } from "@/components/documentation/typography-showcase";
import { VideoGallery } from "@/components/documentation/video-gallery";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { generatePageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd, VideoObjectJsonLd } from "@/components/json-ld";
import type { Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return generatePageMetadata({
    title: locale === "en" ? "Playground | Learn" : "Playground | Comprendre",
    description:
      locale === "en"
        ? "Explore the design system, watch demos and test components in real time. Typography, colors, animations and Next Impact UI components."
        : "Explorez le design system, visionnez les démos et testez les composants en temps réel. Typographie, couleurs, animations et composants UI Next Impact.",
    path: "/documentation/playground",
    keywords:
      locale === "en"
        ? ["playground", "design system", "UI components", "demos"]
        : ["playground", "design system", "composants UI", "démos"],
    locale,
  });
}

export default async function PlaygroundPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "documentationPage" });
  const breadcrumbItems = [
    { name: t("breadcrumbHome"), url: "/" },
    { name: t("breadcrumbDocs"), url: "/documentation" },
    { name: "Playground", url: "/documentation/playground" },
  ];

  return (
    <div style={{ minHeight: "100vh" }}>
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
      <section className="s">
        <div className="container">
          {/* Back link */}
          <div style={{ marginBottom: "2rem" }}>
            <Link
              href="/documentation"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
                fontSize: "0.8125rem",
                color: "var(--muted-color)",
                textDecoration: "none",
              }}
            >
              <ArrowLeft className="h-4 w-4" />
              {t("breadcrumbDocs")}
            </Link>
          </div>

          {/* Header */}
          <div style={{ borderTop: "2px solid var(--ink)", paddingTop: "2.5rem", marginBottom: "3rem" }}>
            <h1 style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 400,
              color: "var(--ink)",
              marginBottom: "0.75rem",
            }}>
              Playground
            </h1>
            <p style={{ fontSize: "1.0625rem", color: "var(--muted-color)", maxWidth: "52ch", lineHeight: 1.6 }}>
              {locale === "en"
                ? "Explore the design system, watch demos and test components in real time."
                : "Explorez le design system, visionnez les démos et testez les composants en temps réel."}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
            <MdxGallery />
            <SpringLab />
            <LiveButtonPlayground />
            <TypographyShowcase />
            <ConditionalContent
              simple={
                <div style={{ border: "1px solid var(--rule)", borderLeft: "3px solid var(--rule-strong)", background: "var(--paper-2)", padding: "1.5rem 2rem" }}>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.125rem", fontWeight: 400, color: "var(--ink)", marginBottom: "0.75rem" }}>
                    Comment fonctionne le headless ?
                  </h3>
                  <p style={{ fontSize: "0.9375rem", color: "var(--muted-color)", lineHeight: 1.65 }}>
                    Votre site WordPress envoie le contenu via une API. Le
                    frontend (Next.js) récupère ce contenu et l&apos;affiche
                    avec un design moderne et performant.
                  </p>
                </div>
              }
              advanced={
                <div style={{ border: "1px solid var(--rule)", borderLeft: "3px solid var(--ink)", background: "var(--paper-2)", padding: "1.5rem 2rem" }}>
                  <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.125rem", fontWeight: 400, color: "var(--ink)", marginBottom: "0.75rem" }}>
                    Architecture technique headless
                  </h3>
                  <p style={{ fontSize: "0.9375rem", color: "var(--muted-color)", marginBottom: "1rem" }}>
                    L&apos;API REST de WordPress expose les endpoints suivants :
                  </p>
                  <pre style={{ background: "var(--paper)", border: "1px solid var(--rule)", padding: "1rem", fontSize: "0.8125rem", fontFamily: "var(--font-mono)", color: "var(--ink-2)", overflowX: "auto", lineHeight: 1.6 }}>
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
            <VideoGallery />
          </div>
        </div>
      </section>
    </div>
  );
}
