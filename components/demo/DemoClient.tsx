"use client";

import { Link } from "@/i18n/navigation";
import PageLayout from "@/components/page-layout";
import { YoutubePlayer } from "@/components/youtube-player";
import { ArrowRight } from "lucide-react";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

function isYoutubeShort(url: string) {
  return /youtube\.com\/shorts\//.test(url);
}

const mainVideoFr = {
  title: "Panorama Pub — Marketplace B2B Next.js + PostgreSQL",
  url: "https://youtu.be/9fMaBL1amYk",
};
const mainVideoEn = {
  title: "Panorama Pub — B2B marketplace, Next.js + PostgreSQL",
  url: "https://youtu.be/9fMaBL1amYk",
};

const demoVideosFr = [
  {
    title: "App mobile (PWA)",
    url: "https://youtube.com/shorts/_kt_wA4zT68",
    projectLink: "/etudes-de-cas/hermitage-jeu-de-piste",
    projectName: "Hermitage — Jeu de piste mobile (PWA)",
    projectDescription:
      "Application mobile installable sans store, géolocalisée et fonctionnant hors-ligne. Next.js + service worker, persistance locale.",
  },
  {
    title: "Extension applicative",
    url: "https://youtu.be/KU5K44bU9NM",
    projectLink: "/etudes-de-cas/comme-des-fous-jeux",
    projectName: "Comme des Fous — Section jeux en ligne",
    projectDescription:
      "Une zone applicative (jeux interactifs) intégrée au site Headless du média Comme des Fous : extension web app sur socle WordPress + Next.js.",
  },
  {
    title: "Site vitrine Headless",
    url: "https://youtu.be/8aVVoDFakCY",
    projectLink: "/etudes-de-cas/cafe-citoyen",
    projectName: "Café citoyen — Site vitrine Headless",
    projectDescription:
      "Vitrine moderne d'une association culturelle, propulsée en WordPress Headless + Next.js. Performance, événements, prise de contact.",
  },
  {
    title: "Site média Headless",
    url: "https://youtu.be/6vUSbG6F50w",
    projectLink: "/etudes-de-cas/comme-des-fous",
    projectName: "Comme des Fous — Média participatif",
    projectDescription:
      "Le site du média participatif Comme des Fous, en WordPress Headless + Next.js : performance éditoriale, expérience lecteur fluide.",
  },
  {
    title: "Démo billetterie Headless",
    url: "https://youtu.be/I1qi5o31Lnk",
    projectLink: "/etudes-de-cas/next-event",
    projectName: "Next Event — Démo billetterie WordPress Headless",
    projectDescription:
      "Démonstration d'un site WordPress Headless avec Next.js : billetterie événementielle, agenda et expérience utilisateur soignée.",
  },
  {
    title: "Plateforme citoyenne",
    url: "https://youtu.be/dJIndpLBm7o",
    projectLink: "/etudes-de-cas/les-etats-generaux-communaux",
    projectName: "États Généraux Communaux — Plateforme citoyenne",
    projectDescription:
      "Une plateforme de mobilisation citoyenne en WordPress Headless + Next.js : sécurité critique, carte interactive des groupes locaux.",
  },
  {
    title: "Site de mobilisation",
    url: "https://youtu.be/_OjiGiOWJus",
    projectLink: "/etudes-de-cas/doleances",
    projectName: "Les Doléances — Site de mobilisation",
    projectDescription:
      "Une vitrine pour mettre en lumière les doléances citoyennes de 2018-2019, en WordPress Headless + Next.js.",
  },
];

const demoVideosEn = [
  {
    title: "Mobile app (PWA)",
    url: "https://youtube.com/shorts/_kt_wA4zT68",
    projectLink: "/etudes-de-cas/hermitage-jeu-de-piste",
    projectName: "Hermitage — Mobile treasure hunt (PWA)",
    projectDescription:
      "A mobile app installable without app stores, geolocated and working offline. Next.js + service worker, local persistence.",
  },
  {
    title: "Applicative extension",
    url: "https://youtu.be/KU5K44bU9NM",
    projectLink: "/etudes-de-cas/comme-des-fous-jeux",
    projectName: "Comme des Fous — Online games section",
    projectDescription:
      "An applicative zone (interactive games) embedded in the Headless media Comme des Fous: a web-app extension on top of a WordPress + Next.js foundation.",
  },
  {
    title: "Headless brochure site",
    url: "https://youtu.be/8aVVoDFakCY",
    projectLink: "/etudes-de-cas/cafe-citoyen",
    projectName: "Café citoyen — Headless brochure site",
    projectDescription:
      "A modern brochure site for a cultural association, powered by Headless WordPress + Next.js. Performance, events, contact.",
  },
  {
    title: "Headless media site",
    url: "https://youtu.be/6vUSbG6F50w",
    projectLink: "/etudes-de-cas/comme-des-fous",
    projectName: "Comme des Fous — Participatory media",
    projectDescription:
      "The participatory media Comme des Fous, on Headless WordPress + Next.js: editorial performance, smooth reader experience.",
  },
  {
    title: "Headless ticketing demo",
    url: "https://youtu.be/I1qi5o31Lnk",
    projectLink: "/etudes-de-cas/next-event",
    projectName: "Next Event — Headless WordPress ticketing demo",
    projectDescription:
      "Demo of a Headless WordPress site with Next.js: event ticketing, agenda and polished user experience.",
  },
  {
    title: "Citizen platform",
    url: "https://youtu.be/dJIndpLBm7o",
    projectLink: "/etudes-de-cas/les-etats-generaux-communaux",
    projectName: "États Généraux Communaux — Citizen platform",
    projectDescription:
      "A citizen mobilization platform on Headless WordPress + Next.js: critical security, interactive map of local groups.",
  },
  {
    title: "Advocacy site",
    url: "https://youtu.be/_OjiGiOWJus",
    projectLink: "/etudes-de-cas/doleances",
    projectName: "Les Doléances — Advocacy site",
    projectDescription:
      "A showcase highlighting the 2018-2019 citizen grievances, built on Headless WordPress + Next.js.",
  },
];

export default function DemoClient() {
  const locale = useLocale() as Locale;
  const isEn = locale === "en";
  const mainVideo = isEn ? mainVideoEn : mainVideoFr;
  const demoVideos = isEn ? demoVideosEn : demoVideosFr;

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
            ? "From a Next.js + PostgreSQL B2B marketplace to a mobile PWA and Headless WordPress sites: see Next Impact projects in action."
            : "De la marketplace B2B Next.js + PostgreSQL au jeu de piste mobile PWA en passant par les sites Headless WordPress : les réalisations Next Impact en action."
        }
      >
        <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
          <div className="container">
            {/* Main video */}
            <div style={{ marginBottom: 64, border: "1px solid var(--rule)" }}>
              <YoutubePlayer
                url={mainVideo.url}
                title={mainVideo.title}
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
                  {isEn
                    ? "Panorama Pub — B2B marketplace shipped in 2 months"
                    : "Panorama Pub — Marketplace B2B livrée en 2 mois"}
                </h2>
                <p style={{ fontSize: 14, color: "var(--ink-2)" }}>
                  {isEn
                    ? "Custom web app · Next.js + PostgreSQL + Vercel"
                    : "Web app sur-mesure · Next.js + PostgreSQL + Vercel"}
                </p>
              </div>
              <div
                style={{
                  padding: "20px 32px",
                  borderTop: "1px solid var(--rule)",
                  display: "flex",
                  justifyContent: "center",
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
              </div>
            </div>

            {/* Demo videos */}
            <div style={{ borderTop: "1px solid var(--rule)" }}>
              {demoVideos.map((video, idx) => {
                const isShort = isYoutubeShort(video.url);
                return (
                  <div
                    key={idx}
                    style={{
                      display: "grid",
                      gridTemplateColumns: isShort ? "1fr 2fr" : "3fr 2fr",
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
                        padding: isShort ? 24 : 0,
                      }}
                    >
                      <div
                        style={
                          isShort
                            ? { width: "100%", maxWidth: 240, margin: "0 auto" }
                            : { width: "100%" }
                        }
                      >
                        <YoutubePlayer
                          url={video.url}
                          title={video.title}
                          aspect={isShort ? "short" : "video"}
                          compact
                          label={
                            isShort
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
                        {video.projectName}
                      </h3>
                      <p
                        style={{
                          fontSize: 14,
                          color: "var(--ink-2)",
                          lineHeight: 1.6,
                          marginBottom: 20,
                        }}
                      >
                        {video.projectDescription}
                      </p>
                      {video.projectLink && (
                        <Link
                          href={video.projectLink}
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
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </PageLayout>
    </main>
  );
}
