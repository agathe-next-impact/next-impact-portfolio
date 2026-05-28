"use client";

import { useState } from "react";
import { VideoEmbed } from "@/components/documentation/video-embed";
import { useDocumentationMode } from "@/contexts/documentation-mode-context";
import { PROFILES } from "@/lib/documentation-profiles";
import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";
import {
  MousePointerClick,
  Layers,
  ArrowRight,
  Code,
  Globe,
  Smartphone,
  PlayCircle,
} from "lucide-react";
import { Link } from "@/i18n/navigation";

// ─── Video data ────────────────────────────────────────────────────────────

const VIDEOS_FR = {
  plateforme: {
    url: "https://youtu.be/I1qi5o31Lnk",
    title: "Billeterie événementielle — WordPress Headless Next.js",
  },
  cdf: {
    url: "https://youtu.be/6vUSbG6F50w",
    title: "Comme des Fous — Média participatif headless",
  },
  doleances: {
    url: "https://youtu.be/_OjiGiOWJus",
    title: "Doléances — Promotion citoyenne headless",
  },
  egc: {
    url: "https://youtu.be/dJIndpLBm7o",
    title: "États Généraux Communaux — Plateforme headless",
  },
};

const VIDEOS_EN = {
  plateforme: {
    url: "https://youtu.be/I1qi5o31Lnk",
    title: "Event ticketing — Headless WordPress + Next.js",
  },
  cdf: {
    url: "https://youtu.be/6vUSbG6F50w",
    title: "Comme des Fous — Headless participatory media",
  },
  doleances: {
    url: "https://youtu.be/_OjiGiOWJus",
    title: "Doléances — Headless citizen platform",
  },
  egc: {
    url: "https://youtu.be/dJIndpLBm7o",
    title: "États Généraux Communaux — Headless platform",
  },
};

// ─── Mini button playground ────────────────────────────────────────────────

type SwissVariant = "primary" | "secondary" | "outline";

function MiniButtonPlayground({ isEn }: { isEn: boolean }) {
  const [active, setActive] = useState<SwissVariant>("primary");
  const variants: { label: string; value: SwissVariant }[] = [
    { label: isEn ? "Primary" : "Primaire", value: "primary" },
    { label: isEn ? "Secondary" : "Secondaire", value: "secondary" },
    { label: isEn ? "Outline" : "Contour", value: "outline" },
  ];

  return (
    <div>
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "var(--paper-2)",
        border: "1px solid var(--rule)",
        padding: "1.5rem",
        minHeight: "6rem",
      }}>
        {active === "primary" && (
          <button className="btn primary">{isEn ? "Click me" : "Cliquez-moi"}</button>
        )}
        {active === "secondary" && (
          <button className="btn" style={{ background: "var(--paper-2)", border: "1px solid var(--rule-strong)" }}>
            {isEn ? "Click me" : "Cliquez-moi"}
          </button>
        )}
        {active === "outline" && (
          <button className="btn" style={{ background: "transparent", border: "1px solid var(--rule)" }}>
            {isEn ? "Click me" : "Cliquez-moi"}
          </button>
        )}
      </div>
      <div style={{ display: "flex", gap: "0.25rem", marginTop: "0.5rem" }}>
        {variants.map(v => (
          <button
            key={v.value}
            onClick={() => setActive(v.value)}
            style={{
              padding: "0.375rem 0.75rem",
              fontSize: "0.625rem",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              border: "1px solid var(--rule)",
              background: active === v.value ? "var(--ink)" : "var(--paper)",
              color: active === v.value ? "white" : "var(--muted-color)",
              cursor: "pointer",
              transition: "background 0.15s, color 0.15s",
            }}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Architecture visuelle ─────────────────────────────────────────────────

function HeadlessArchitectureVisual({ isEn }: { isEn: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", padding: "1rem 0" }}>
      {[
        { Icon: Layers, label: "WordPress" },
        { Icon: Code, label: "Next.js" },
        { Icon: Globe, label: isEn ? "Your visitors" : "Vos visiteurs" },
      ].map(({ Icon, label }, i) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.25rem" }}>
            <div style={{ border: "1px solid var(--rule)", padding: "0.5rem" }}>
              <Icon size={14} strokeWidth={1.5} style={{ color: "var(--muted-color)", display: "block" }} />
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.5rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted-color)" }}>
              {label}
            </span>
          </div>
          {i < 2 && <div style={{ width: "1rem", height: "1px", background: "var(--rule)" }} />}
        </div>
      ))}
    </div>
  );
}

// ─── Code snippet ──────────────────────────────────────────────────────────

function CodeSnippet({ isEn }: { isEn: boolean }) {
  const code = isEn
    ? `// Fetch WordPress via REST API
const res = await fetch(
  'https://cms.example.com/wp-json/wp/v2/posts'
);
const posts = await res.json();

// Next.js rendering with ISR
export const revalidate = 3600;`
    : `// Fetch WordPress via API REST
const res = await fetch(
  'https://cms.example.com/wp-json/wp/v2/posts'
);
const posts = await res.json();

// Rendu Next.js avec ISR
export const revalidate = 3600;`;

  return (
    <pre style={{
      background: "var(--paper-2)",
      border: "1px solid var(--rule)",
      padding: "1rem",
      fontSize: "0.75rem",
      color: "var(--ink-2)",
      fontFamily: "var(--font-mono)",
      overflowX: "auto",
      lineHeight: 1.6,
      margin: 0,
    }}>
      <code>{code}</code>
    </pre>
  );
}

// ─── Demo card ─────────────────────────────────────────────────────────────

interface DemoCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

function DemoCard({ icon, title, children, className, style: extraStyle }: DemoCardProps) {
  return (
    <div
      className={className}
      style={{
        background: "var(--paper)",
        padding: "1.5rem",
        ...extraStyle,
      }}
    >
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.625rem",
        marginBottom: "1rem",
        paddingBottom: "0.75rem",
        borderBottom: "1px solid var(--rule)",
      }}>
        {icon}
        <h3 style={{
          fontFamily: "var(--font-serif)",
          fontSize: "1.0625rem",
          fontWeight: 400,
          color: "var(--ink)",
          margin: 0,
        }}>
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
}

// ─── Main export ───────────────────────────────────────────────────────────

export function DemoShowcase() {
  const { profileId } = useDocumentationMode();
  const profile = profileId ? PROFILES[profileId] : null;
  const locale = useLocale() as Locale;
  const isEn = locale === "en";

  return (
    <section style={{ marginTop: "3rem", borderTop: "1px solid var(--rule)", paddingTop: "2.5rem" }}>
      {/* Section header */}
      <div style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        marginBottom: "1.5rem",
        flexWrap: "wrap",
        gap: "1rem",
      }}>
        <div>
          <h2 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
            fontWeight: 400,
            color: "var(--ink)",
            marginBottom: "0.25rem",
          }}>
            {profileId
              ? isEn ? "Interactive demo" : "Démo interactive"
              : isEn ? "See it in action" : "Voir en action"}
          </h2>
          <p style={{ fontSize: "0.875rem", color: "var(--muted-color)" }}>
            {profileId
              ? isEn
                ? `Videos and components for your ${profile?.label} profile.`
                : `Vidéos et composants adaptés à votre profil ${profile?.label}.`
              : isEn
                ? "Real project videos and interactive components."
                : "Vidéos de projets réels et composants interactifs."}
          </p>
        </div>
      </div>

      {/* Profile-contextual demos */}
      {!profileId && <DefaultDemos isEn={isEn} />}
      {profileId === "decideur" && <DecideurDemos isEn={isEn} />}
      {profileId === "utilisateur" && <UtilisateurDemos isEn={isEn} />}
      {profileId === "developpeur" && <DeveloppeurDemos isEn={isEn} />}
    </section>
  );
}

// ─── Demo layouts per profile ──────────────────────────────────────────────

function DefaultDemos({ isEn }: { isEn: boolean }) {
  const VIDEOS = isEn ? VIDEOS_EN : VIDEOS_FR;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--rule)", border: "1px solid var(--rule)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "var(--rule)" }}>
        <DemoCard
          icon={<PlayCircle size={16} strokeWidth={1.5} style={{ color: "var(--muted-color)" }} />}
          title={isEn ? "Headless WordPress in action" : "WordPress Headless en action"}
        >
          <VideoEmbed url={VIDEOS.plateforme.url} title={VIDEOS.plateforme.title} />
        </DemoCard>

        <DemoCard
          icon={<Layers size={16} strokeWidth={1.5} style={{ color: "var(--muted-color)" }} />}
          title={isEn ? "Headless architecture" : "Architecture headless"}
        >
          <HeadlessArchitectureVisual isEn={isEn} />
          <p style={{ fontSize: "0.75rem", color: "var(--muted-color)", marginTop: "0.75rem", lineHeight: 1.5 }}>
            {isEn
              ? "WordPress handles content, Next.js handles rendering."
              : "WordPress gère le contenu, Next.js gère l'affichage."}
          </p>
        </DemoCard>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "var(--rule)" }}>
        {[VIDEOS.cdf, VIDEOS.doleances, VIDEOS.egc].map((video) => (
          <DemoCard
            key={video.url}
            icon={<PlayCircle size={14} strokeWidth={1.5} style={{ color: "var(--muted-color)" }} />}
            title={video.title}
          >
            <VideoEmbed url={video.url} title={video.title} compact />
          </DemoCard>
        ))}
      </div>
    </div>
  );
}

function DecideurDemos({ isEn }: { isEn: boolean }) {
  const VIDEOS = isEn ? VIDEOS_EN : VIDEOS_FR;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--rule)", border: "1px solid var(--rule)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "1px", background: "var(--rule)" }}>
        <DemoCard
          icon={<PlayCircle size={16} strokeWidth={1.5} style={{ color: "var(--muted-color)" }} />}
          title={isEn ? "Production platform" : "Plateforme en production"}
        >
          <VideoEmbed url={VIDEOS.plateforme.url} title={VIDEOS.plateforme.title} />
          <p style={{ fontSize: "0.75rem", color: "var(--muted-color)", marginTop: "0.75rem", lineHeight: 1.5 }}>
            {isEn
              ? "Event ticketing platform powered by Headless WordPress + Next.js."
              : "Billeterie événementielle propulsée par WordPress Headless + Next.js."}
          </p>
        </DemoCard>

        <DemoCard
          icon={<Globe size={16} strokeWidth={1.5} style={{ color: "var(--muted-color)" }} />}
          title={isEn ? "Why it changes everything" : "Pourquoi ça change tout"}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1rem" }}>
            {(isEn
              ? [
                  { value: "2×", label: "faster than a standard site" },
                  { value: "100", label: "achievable Lighthouse score" },
                  { value: "0", label: "frontend plugins to maintain" },
                ]
              : [
                  { value: "2×", label: "plus rapide qu'un site classique" },
                  { value: "100", label: "score Lighthouse accessible" },
                  { value: "0", label: "plugin frontend à maintenir" },
                ]
            ).map((stat) => (
              <div key={stat.label} style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
                <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", color: "var(--accent-color)", lineHeight: 1 }}>
                  {stat.value}
                </span>
                <span style={{ fontSize: "0.75rem", color: "var(--muted-color)" }}>{stat.label}</span>
              </div>
            ))}
          </div>
          <HeadlessArchitectureVisual isEn={isEn} />
        </DemoCard>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "var(--rule)" }}>
        <DemoCard icon={<PlayCircle size={14} strokeWidth={1.5} style={{ color: "var(--muted-color)" }} />} title={VIDEOS.cdf.title}>
          <VideoEmbed url={VIDEOS.cdf.url} title={VIDEOS.cdf.title} compact />
        </DemoCard>
        <DemoCard icon={<PlayCircle size={14} strokeWidth={1.5} style={{ color: "var(--muted-color)" }} />} title={VIDEOS.egc.title}>
          <VideoEmbed url={VIDEOS.egc.url} title={VIDEOS.egc.title} compact />
        </DemoCard>
      </div>
    </div>
  );
}

function UtilisateurDemos({ isEn }: { isEn: boolean }) {
  const VIDEOS = isEn ? VIDEOS_EN : VIDEOS_FR;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--rule)", border: "1px solid var(--rule)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "var(--rule)" }}>
        <DemoCard
          icon={<PlayCircle size={16} strokeWidth={1.5} style={{ color: "var(--muted-color)" }} />}
          title={isEn ? "Managing content in headless" : "Gérer du contenu en headless"}
        >
          <VideoEmbed url={VIDEOS.cdf.url} title={VIDEOS.cdf.title} />
          <p style={{ fontSize: "0.75rem", color: "var(--muted-color)", marginTop: "0.75rem", lineHeight: 1.5 }}>
            {isEn
              ? "You publish in WordPress as usual. The site updates automatically."
              : "Vous publiez sur WordPress comme d'habitude. Le site se met à jour automatiquement."}
          </p>
        </DemoCard>

        <DemoCard
          icon={<MousePointerClick size={16} strokeWidth={1.5} style={{ color: "var(--muted-color)" }} />}
          title={isEn ? "Test the components" : "Testez les composants"}
        >
          <MiniButtonPlayground isEn={isEn} />
          <div style={{ marginTop: "1rem" }}>
            <HeadlessArchitectureVisual isEn={isEn} />
          </div>
        </DemoCard>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "var(--rule)" }}>
        <DemoCard icon={<PlayCircle size={14} strokeWidth={1.5} style={{ color: "var(--muted-color)" }} />} title={VIDEOS.plateforme.title}>
          <VideoEmbed url={VIDEOS.plateforme.url} title={VIDEOS.plateforme.title} compact />
        </DemoCard>
        <DemoCard icon={<PlayCircle size={14} strokeWidth={1.5} style={{ color: "var(--muted-color)" }} />} title={VIDEOS.doleances.title}>
          <VideoEmbed url={VIDEOS.doleances.url} title={VIDEOS.doleances.title} compact />
        </DemoCard>
      </div>
    </div>
  );
}

function DeveloppeurDemos({ isEn }: { isEn: boolean }) {
  const VIDEOS = isEn ? VIDEOS_EN : VIDEOS_FR;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--rule)", border: "1px solid var(--rule)" }}>
      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: "1px", background: "var(--rule)" }}>
        <DemoCard
          icon={<PlayCircle size={16} strokeWidth={1.5} style={{ color: "var(--muted-color)" }} />}
          title={isEn ? "Production architecture" : "Architecture en production"}
        >
          <VideoEmbed url={VIDEOS.plateforme.url} title={VIDEOS.plateforme.title} />
          <p style={{ fontSize: "0.75rem", color: "var(--muted-color)", marginTop: "0.75rem", lineHeight: 1.5 }}>
            {isEn
              ? "Next.js App Router, ISR, WordPress REST API — full stack in production."
              : "Next.js App Router, ISR, API REST WordPress — stack complet en prod."}
          </p>
        </DemoCard>

        <DemoCard
          icon={<Code size={16} strokeWidth={1.5} style={{ color: "var(--muted-color)" }} />}
          title="REST API & ISR"
        >
          <CodeSnippet isEn={isEn} />
          <p style={{ fontSize: "0.75rem", color: "var(--muted-color)", marginTop: "0.75rem", lineHeight: 1.5 }}>
            {isEn ? (
              <>WordPress exposes data via <code style={{ fontFamily: "var(--font-mono)", color: "var(--accent-color)" }}>wp-json/wp/v2</code>. Next.js regenerates pages in the background.</>
            ) : (
              <>WordPress expose les données via <code style={{ fontFamily: "var(--font-mono)", color: "var(--accent-color)" }}>wp-json/wp/v2</code>. Next.js régénère les pages en arrière-plan.</>
            )}
          </p>
          <div style={{ marginTop: "0.75rem" }}>
            <MiniButtonPlayground isEn={isEn} />
          </div>
        </DemoCard>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", background: "var(--rule)" }}>
        {[VIDEOS.cdf, VIDEOS.doleances, VIDEOS.egc].map((video) => (
          <DemoCard key={video.url} icon={<PlayCircle size={14} strokeWidth={1.5} style={{ color: "var(--muted-color)" }} />} title={video.title}>
            <VideoEmbed url={video.url} title={video.title} compact />
          </DemoCard>
        ))}
      </div>
    </div>
  );
}
