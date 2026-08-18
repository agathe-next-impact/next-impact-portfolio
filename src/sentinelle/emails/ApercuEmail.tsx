import { Hr, Link, Section, Text } from "@react-email/components";
import type { ApercuStatut, ScanApercuThemes } from "@sentinelle/types";
import { APERCU_THEMES } from "@sentinelle/apercu/dossier";
import { Layout } from "./Layout";
import { COLORS, FONTS, styles } from "./theme";

// ─────────────────────────────────────────────────────────────────────────────
// Gabarit HÉRITÉ de la lettre-échantillon (cinq thèmes + cap, une passe sans
// outils). Depuis le 2026-08-18 (seconde itération), les nouveaux scans
// produisent un vrai numéro rendu par `NewsletterEmail` en mode échantillon —
// ce gabarit ne sert plus qu'à afficher et envoyer les aperçus déjà en base.
//
// Les aperçus antérieurs à l'habillage n'ont ni titre, ni chapeau, ni site en
// une phrase, ni clôture : chaque partie manquante disparaît, le titre a un
// repli — le gabarit ne doit jamais faire échouer un vieux rapport.
// ─────────────────────────────────────────────────────────────────────────────

/** Forme héritée (cinq thèmes) — les scans d'avant le pipeline complet. */
export type ApercuDone = ScanApercuThemes;

export interface ApercuEmailProps {
  apercu: ApercuDone;
  siteUrl: string;
  /** Date de génération de l'échantillon — jamais une date d'envoi. */
  genereLe: Date;
  /**
   * Adresse du rapport en ligne (`/scan/[id]`). Renseignée quand la lettre
   * part par e-mail : le rapport porte les composants détectés et le parcours
   * d'abonnement, l'e-mail doit y ramener. Absente dans l'iframe du rapport —
   * un lien vers la page qu'on est en train de lire n'aiderait personne.
   */
  rapportUrl?: string;
}

const STATUT_STYLE: Record<ApercuStatut, { label: string; color: string }> = {
  agir: { label: "Agir", color: "#ff8a7a" },
  surveiller: { label: "Surveiller", color: "#f5c451" },
  rien_a_signaler: { label: "Rien à signaler", color: "#7fd8a4" },
  non_observable: { label: "Non observable", color: COLORS.faint },
};

const CAP_LABEL: Record<ApercuDone["cap"]["scenario"], string> = {
  consolider: "Consolider",
  evoluer: "Faire évoluer",
  refondre: "Refondre",
};

const THEME_LABELS = new Map<string, string>(
  APERCU_THEMES.map((theme) => [theme.slug, theme.label]),
);

function paragraphes(texte: string): string[] {
  return texte
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
}

function Prose({ texte }: { texte: string }) {
  return (
    <>
      {paragraphes(texte).map((paragraph, index) => (
        <Text key={index} style={styles.paragraph}>
          {paragraph}
        </Text>
      ))}
    </>
  );
}

function host(siteUrl: string): string {
  return siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function ApercuEmail({ apercu, siteUrl, genereLe, rapportUrl }: ApercuEmailProps) {
  const titre = apercu.titre ?? `Ce que Sentinelle surveillerait pour ${host(siteUrl)}`;
  const aAgir = apercu.themes.filter((theme) => theme.statut === "agir").length;

  return (
    <Layout
      preview={
        aAgir > 0
          ? `${aAgir} thème(s) appellent une action. ${titre}`
          : `Échantillon de votre veille personnalisée — ${host(siteUrl)}`
      }
      kicker="Lettre de veille · échantillon"
      sentAt={genereLe}
      siteUrl={siteUrl}
      reason={
        "Vous lisez un échantillon généré à partir d'une analyse externe publique " +
        "de votre site. Rien n'a été envoyé et votre site n'est pas sous " +
        "surveillance — c'est la démonstration de ce que l'abonnement Sentinelle " +
        "vous livrerait."
      }
    >
      <Section style={styles.section}>
        <Text style={styles.h1}>{titre}</Text>
        <Text style={{ ...styles.footer, fontStyle: "italic", margin: "0 0 20px" }}>
          Échantillon généré automatiquement à partir d&apos;une analyse externe —
          éléments publics uniquement, non relu.
        </Text>
        {apercu.chapeau && <Prose texte={apercu.chapeau} />}
      </Section>

      {apercu.siteEnUnePhrase && (
        <>
          <Hr style={styles.rule} />
          <Section style={styles.section}>
            <Text style={styles.label}>Votre site en une phrase</Text>
            <Section style={styles.panel}>
              <Text
                style={{
                  ...styles.paragraph,
                  color: COLORS.fg,
                  fontFamily: FONTS.title,
                  fontSize: "17px",
                  margin: 0,
                }}
              >
                {apercu.siteEnUnePhrase}
              </Text>
            </Section>
          </Section>
        </>
      )}

      <Hr style={styles.rule} />

      <Section style={styles.section}>
        <Text style={{ ...styles.label, color: COLORS.accent, margin: "0 0 6px" }}>
          Votre site lu par les cinq grands thèmes
        </Text>
        <Text
          style={{ ...styles.muted, fontStyle: "italic", color: COLORS.fgSoft, margin: "0 0 18px" }}
        >
          La lettre de l&apos;abonnement lit votre site par cinq axes ;
          l&apos;échantillon les regroupe en cinq thèmes.
        </Text>

        {apercu.themes.map((theme) => {
          const statut = STATUT_STYLE[theme.statut] ?? STATUT_STYLE.non_observable;
          return (
            <Section key={theme.theme} style={{ margin: "0 0 26px" }}>
              <Text style={{ ...styles.label, margin: "0 0 8px" }}>
                {THEME_LABELS.get(theme.theme) ?? theme.theme}
              </Text>
              <Prose texte={theme.texte} />
              <Text style={{ ...styles.muted, color: statut.color, margin: 0 }}>
                ● {statut.label}
              </Text>
            </Section>
          );
        })}
      </Section>

      <Hr style={styles.rule} />

      <Section style={styles.section}>
        <Text style={styles.label}>Le cap</Text>
        <Section style={styles.panel}>
          <Text
            style={{
              ...styles.paragraph,
              color: COLORS.fg,
              fontFamily: FONTS.title,
              fontSize: "16px",
              margin: "0 0 6px",
            }}
          >
            {CAP_LABEL[apercu.cap.scenario]}
          </Text>
          <Text style={{ ...styles.muted, margin: 0 }}>{apercu.cap.texte}</Text>
        </Section>
      </Section>

      <Hr style={styles.rule} />

      <Section style={styles.section}>
        <Text style={styles.label}>Ce que la lettre de l&apos;abonnement ajoute</Text>
        <Text style={{ ...styles.muted, margin: 0 }}>
          Douze axes de lecture au lieu de cinq thèmes, l&apos;actualité de la
          période collectée et sourcée à chaque numéro, un échéancier à six mois,
          trois questions à poser à votre prestataire, les sources — et une
          relecture humaine avant chaque envoi. Cet échantillon, lui, est généré
          automatiquement et n&apos;est pas relu.
        </Text>
        {rapportUrl && (
          <Text style={{ ...styles.muted, margin: "14px 0 0" }}>
            Le rapport complet — composants détectés et activation de la
            surveillance — reste en ligne :{" "}
            <Link href={rapportUrl} style={styles.link}>
              revoir votre rapport
            </Link>
            .
          </Text>
        )}
      </Section>

      {apercu.ligneCloture && (
        <>
          <Hr style={styles.rule} />
          <Section style={styles.section}>
            <Text style={{ ...styles.footer, fontStyle: "italic", margin: 0 }}>
              {apercu.ligneCloture}
            </Text>
          </Section>
        </>
      )}
    </Layout>
  );
}

export default ApercuEmail;
