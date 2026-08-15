import { Hr, Section, Text } from "@react-email/components";
import type { DraftedAlert } from "@sentinelle/types";
import { Layout } from "./Layout";
import { COLORS, FONTS, styles, VERDICT_STYLE } from "./theme";

// ─────────────────────────────────────────────────────────────────────────────
// Gabarit d'une alerte.
//
// L'ordre des blocs est celui de la lecture d'un dirigeant pressé, et il est le
// même que celui du prompt système : de quoi il s'agit → ce que ça change pour
// LUI → ce qu'il fait, avec l'effort que ça demande. Le composant concerné vient
// en dernier : c'est la pièce justificative, pas le sujet.
//
// Le gabarit n'écrit rien de son propre chef. Tout ce qui est affiché vient du
// texte relu par un humain (règle 4) ; les seules chaînes en dur ici sont des
// intitulés de section.
// ─────────────────────────────────────────────────────────────────────────────

export interface AlertEmailProps {
  content: DraftedAlert;
  /** Composant concerné, tel qu'il figure dans la fiche du client. */
  component: { label: string; version: string | null };
  siteUrl?: string | null;
  sentAt: Date;
}

export function AlertEmail({ content, component, siteUrl, sentAt }: AlertEmailProps) {
  const verdict = VERDICT_STYLE[content.verdict];

  // Le corps arrive en texte libre : les sauts de ligne doubles font des
  // paragraphes, comme partout ailleurs. Sans ça, un texte en trois temps
  // arriverait en un seul pavé.
  const paragraphs = content.body
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <Layout
      preview={content.whatItChanges.trim() || content.title}
      kicker="Alerte de veille"
      sentAt={sentAt}
      siteUrl={siteUrl}
    >
      <Section style={styles.section}>
        <Text style={{ ...styles.label, color: verdict.color, margin: "0 0 14px" }}>
          ● {verdict.label}
        </Text>

        <Text style={styles.h1}>{content.title}</Text>

        {paragraphs.map((paragraph, index) => (
          <Text key={index} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}
      </Section>

      {content.whatItChanges.trim() !== "" && (
        <>
          <Hr style={styles.rule} />
          <Section style={styles.section}>
            <Text style={styles.label}>Ce que ça change pour vous</Text>
            <Text style={{ ...styles.paragraph, margin: 0 }}>{content.whatItChanges}</Text>
          </Section>
        </>
      )}

      <Hr style={styles.rule} />

      <Section style={styles.section}>
        <Text style={styles.label}>Action recommandée</Text>
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
            {content.recommendedAction}
          </Text>

          {(content.effortEstimate.trim() !== "" || content.diyPossible) && (
            <Text style={{ ...styles.muted, margin: "12px 0 0" }}>
              {content.diyPossible
                ? "Faisable de votre côté"
                : "À faire faire — je peux m'en charger"}
              {content.effortEstimate.trim() !== "" ? ` · ${content.effortEstimate}` : ""}
            </Text>
          )}
        </Section>
      </Section>

      <Hr style={styles.rule} />

      <Section style={styles.section}>
        <Text style={styles.label}>Composant concerné</Text>
        <Text style={{ ...styles.muted, margin: 0 }}>
          {component.label}
          {component.version ? ` · version ${component.version}` : " · version inconnue"}
        </Text>
      </Section>
    </Layout>
  );
}

export default AlertEmail;
