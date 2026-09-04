"use client";

import { Link } from "@/i18n/navigation";
import PageLayout from "@/components/page-layout";
import { YoutubePlayer } from "@/components/youtube-player";
import { ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

/** Projection légère d'une étude de cas vidéo, calculée côté serveur. */
export type DemoVideo = {
  slug: string;
  videoId: string;
  isShort: boolean;
  title: string;
  description: string;
};

export default function DemoClient({
  featured,
  videos,
}: {
  featured: DemoVideo;
  videos: DemoVideo[];
}) {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";

  return (
    <main>
      <PageLayout
        titre={
          isEn
            ? "Demos — Websites, web apps and mobile applications"
            : "Démos — Sites web, web apps et applications mobiles"
        }
        sousTitre={
          isEn
            ? "From Réseauteurs, France's national networking platform, to Headless WordPress sites and mobile PWAs: every Next Impact project in action, from newest to oldest."
            : "De Réseauteurs, la plateforme nationale du networking, aux sites WordPress Headless en passant par les apps mobiles PWA : les réalisations Next Impact en action, des plus récentes aux plus anciennes."
        }
      >
        <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
          <div className="container">
            {/* Étude de cas mise en avant */}
            <div style={{ marginBottom: 64, border: "1px solid var(--rule)" }}>
              <YoutubePlayer
                videoId={featured.videoId}
                title={featured.title}
                aspect={featured.isShort ? "short" : "video"}
                label={isEn ? "Featured project" : "Projet phare"}
              />
              <div
                style={{
                  padding: "24px 32px",
                  borderTop: "1px solid var(--rule)",
                  background: "var(--paper-2)",
                }}
              >
                <h2
                  className="ni-serif"
                  style={{ fontSize: "clamp(18px, 2vw, 24px)", color: "var(--ink)", marginBottom: 6 }}
                >
                  {featured.title}
                </h2>
                <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.6 }}>
                  {featured.description}
                </p>
              </div>
              <div
                style={{
                  padding: "20px 32px",
                  borderTop: "1px solid var(--rule)",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 24,
                }}
              >
                <a
                  href="https://calendar.app.google/Cw7TGQBzeZ1szKU86"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn primary"
                >
                  {isEn ? "Book a video call" : "Réserver une visio"}
                </a>
                <Link
                  href={`/etudes-de-cas/${featured.slug}`}
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--accent-color)",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                  }}
                >
                  {isEn ? "View the case study" : "Voir l'étude de cas"}
                  <ArrowRight size={10} />
                </Link>
              </div>
            </div>

            {/* Réalisations en vidéo, des plus récentes aux plus anciennes */}
            <div style={{ borderTop: "1px solid var(--rule)" }}>
              {videos.map((video) => (
                <div
                  key={video.slug}
                  style={{
                    display: "grid",
                    gridTemplateColumns: video.isShort ? "1fr 2fr" : "3fr 2fr",
                    borderBottom: "1px solid var(--rule)",
                  }}
                >
                  {/* Video column */}
                  <div
                    style={{
                      background: "#000",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: video.isShort ? 24 : 0,
                    }}
                  >
                    <div
                      style={
                        video.isShort
                          ? { width: "100%", maxWidth: 240, margin: "0 auto" }
                          : { width: "100%" }
                      }
                    >
                      <YoutubePlayer
                        videoId={video.videoId}
                        title={video.title}
                        aspect={video.isShort ? "short" : "video"}
                        compact
                        label={
                          video.isShort
                            ? isEn
                              ? "Mobile demo"
                              : "Demo mobile"
                            : isEn
                              ? "Project demo"
                              : "Demo projet"
                        }
                      />
                    </div>
                  </div>

                  {/* Info column */}
                  <div
                    style={{
                      padding: "32px",
                      background: "var(--paper-2)",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      borderLeft: "1px solid var(--rule)",
                    }}
                  >
                    <h3
                      className="ni-serif"
                      style={{
                        fontSize: "clamp(16px, 1.5vw, 20px)",
                        color: "var(--ink)",
                        marginBottom: 12,
                      }}
                    >
                      {video.title}
                    </h3>
                    <p
                      style={{
                        fontSize: 14,
                        color: "var(--ink-2)",
                        lineHeight: 1.6,
                        marginBottom: 20,
                      }}
                    >
                      {video.description}
                    </p>
                    <Link
                      href={`/etudes-de-cas/${video.slug}`}
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 10,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--accent-color)",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      {isEn ? "View project" : "Voir le projet"}
                      <ArrowRight size={10} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </PageLayout>
    </main>
  );
}
