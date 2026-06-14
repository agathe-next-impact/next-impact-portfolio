import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

// ── Tokens Blueprint (valeurs en dur : ImageResponse n'a pas accès aux variables CSS) ──
// Référence : .claude/DESIGN-SYSTEM.md §2 (thème sombre par défaut).
const C = {
  obsidian: "#050505", // fond de page (dark)
  grid: "#1b1b1b", // traits de grille discrets
  rail: "#232323", // rails dark-gray
  foreground: "#FFFFFF", // texte principal
  mid: "#8a8a8a", // texte atténué (mid-gray)
  faint: "#6f6f6f", // domaine / footer
  accent: "#687ADE", // indigo éclairci (accent primaire en sombre)
  accentSoft: "#8a93c9", // indigo désaturé pour l'eyebrow
  yellow: "#F2E57E", // accent secondaire (ponctuel)
  deep: "#021373", // indigo profond (carré de marque)
};

const SITE_DOMAIN = "next-impact.digital";

/**
 * Charge une police Google sous forme de TTF, sous-ensemblée au texte rendu
 * (technique standard next/og pour des polices dynamiques). Échec → null,
 * la carte se rend alors avec la police par défaut du moteur.
 */
async function loadGoogleFont(
  family: string,
  weight: number,
  text: string,
): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(
      family,
    )}:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await (await fetch(url)).text();
    const src = css.match(
      /src:\s*url\(([^)]+)\)\s*format\('(?:opentype|truetype)'\)/,
    );
    if (!src) return null;
    const res = await fetch(src[1]);
    if (!res.ok) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

function clamp(value: string | null, max: number): string {
  if (!value) return "";
  const v = value.trim();
  return v.length > max ? `${v.slice(0, max - 1).trimEnd()}…` : v;
}

function titleSize(len: number): number {
  if (len <= 24) return 68;
  if (len <= 40) return 58;
  if (len <= 64) return 48;
  return 40;
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const title = clamp(searchParams.get("title"), 96) || "Next Impact";
  const desc = clamp(searchParams.get("desc"), 150);
  const eyebrow = clamp(searchParams.get("tag"), 42).toUpperCase();

  // Sous-ensemble de glyphes à charger = tout le texte affiché.
  const fontText = `${title}${desc}${eyebrow}Next Impact${SITE_DOMAIN}№—↗`;
  const [regular, semibold] = await Promise.all([
    loadGoogleFont("Figtree", 400, fontText),
    loadGoogleFont("Figtree", 600, fontText),
  ]);

  const fonts = [
    regular && { name: "Figtree", data: regular, weight: 400 as const, style: "normal" as const },
    semibold && { name: "Figtree", data: semibold, weight: 600 as const, style: "normal" as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 400 | 600; style: "normal" }[];

  const fontFamily = fonts.length ? "Figtree" : "sans-serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          backgroundColor: C.obsidian,
          backgroundImage: `linear-gradient(to right, ${C.grid} 1px, transparent 1px), linear-gradient(to bottom, ${C.grid} 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          fontFamily,
          color: C.foreground,
        }}
      >
        {/* Halo d'accent discret (haut-droite) */}
        <div
          style={{
            position: "absolute",
            top: "-180px",
            right: "-120px",
            width: "560px",
            height: "560px",
            backgroundImage: `radial-gradient(circle, ${C.accent}26 0%, transparent 70%)`,
            display: "flex",
          }}
        />

        {/* Cadre intérieur : rails verticaux Blueprint */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            margin: "0 64px",
            padding: "56px 56px",
            borderLeft: `1px solid ${C.rail}`,
            borderRight: `1px solid ${C.rail}`,
          }}
        >
          {/* En-tête : marque + eyebrow */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  backgroundColor: C.deep,
                  border: `1px solid ${C.accent}`,
                  borderRadius: "5px",
                  display: "flex",
                }}
              />
              <span
                style={{
                  marginLeft: "16px",
                  fontSize: "26px",
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                }}
              >
                Next Impact
              </span>
            </div>
            {eyebrow ? (
              <span
                style={{
                  fontSize: "15px",
                  fontWeight: 400,
                  letterSpacing: "0.22em",
                  color: C.accentSoft,
                }}
              >
                {eyebrow}
              </span>
            ) : (
              <span style={{ fontSize: "22px", color: C.accentSoft }}>↗</span>
            )}
          </div>

          {/* Bloc central : titre + description */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: `${titleSize(title.length)}px`,
                fontWeight: 600,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                maxWidth: "920px",
              }}
            >
              {title}
            </div>
            {desc ? (
              <div
                style={{
                  display: "flex",
                  marginTop: "26px",
                  fontSize: "27px",
                  fontWeight: 400,
                  lineHeight: 1.35,
                  color: C.mid,
                  maxWidth: "860px",
                }}
              >
                {desc}
              </div>
            ) : null}
          </div>

          {/* Pied : domaine + filet + point jaune (accent ponctuel) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: "19px",
                color: C.faint,
                letterSpacing: "0.04em",
              }}
            >
              {SITE_DOMAIN}
            </span>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ width: "84px", height: "1px", backgroundColor: C.rail, display: "flex" }} />
              <div
                style={{
                  width: "9px",
                  height: "9px",
                  marginLeft: "14px",
                  borderRadius: "9px",
                  backgroundColor: C.yellow,
                  display: "flex",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      ...(fonts.length ? { fonts } : {}),
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable",
      },
    },
  );
}
