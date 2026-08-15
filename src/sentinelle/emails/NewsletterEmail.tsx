import { Hr, Section, Text } from "@react-email/components";
import type { NewsletterBlocks } from "@sentinelle/newsletter/blocks";
import { Layout } from "./Layout";
import { COLORS, FONTS, styles } from "./theme";

// ─────────────────────────────────────────────────────────────────────────────
// Gabarit d'un numéro de la lettre bimensuelle.
//
// Cinq blocs, dans l'ordre de lecture : ce que vous avez → ce qui a changé →
// ce que ça dit → ce que je recommande → ce qui arrive. Les trois premiers et le
// dernier sont des faits ; seuls « la veille » et « la recommandation » sont
// rédigés — et relus.
//
// Un numéro calme reste un numéro : le bloc « ce qui a changé » affiche
// explicitement « rien depuis le dernier envoi » plutôt que de disparaître.
// C'est ce que l'abonnement finance, et le taire donnerait l'impression que
// personne n'a regardé.
// ─────────────────────────────────────────────────────────────────────────────

export interface NewsletterEmailProps {
  blocks: NewsletterBlocks;
  siteUrl?: string | null;
}

function paragraphes(texte: string): string[] {
  return texte
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);
}

function jourFr(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  }).format(new Date(iso));
}

export function NewsletterEmail({ blocks, siteUrl }: NewsletterEmailProps) {
  const issue = new Date(blocks.issueDate);
  const rienDeNeuf =
    blocks.delta.alerts.length === 0 && blocks.delta.newComponents.length === 0;

  return (
    <Layout
      preview={
        rienDeNeuf
          ? "Rien à signaler depuis le dernier numéro."
          : `${blocks.delta.alerts.length} alerte(s) envoyée(s) depuis le dernier numéro.`
      }
      kicker={`Numéro du ${jourFr(blocks.issueDate)}`}
      sentAt={issue}
      siteUrl={siteUrl}
    >
      <Section style={styles.section}>
        <Text style={styles.label}>1 · Votre site, tel qu'il est suivi</Text>
        {blocks.health.components.map((component) => (
          <Text key={component.label} style={{ ...styles.muted, margin: "0 0 4px" }}>
            <span style={{ color: COLORS.fgSoft }}>{component.label}</span>
            {component.version ? ` ${component.version}` : " — version inconnue"}
            {component.openAlerts > 0 ? ` · ${component.openAlerts} point(s) ouvert(s)` : ""}
          </Text>
        ))}
        {blocks.health.components.length === 0 && (
          <Text style={{ ...styles.muted, margin: 0 }}>
            Aucun composant suivi pour l'instant — la fiche reste à compléter.
          </Text>
        )}
        {blocks.health.withoutVersion > 0 && (
          <Text style={{ ...styles.footer, margin: "12px 0 0" }}>
            {blocks.health.withoutVersion} composant(s) sans version connue : la
            surveillance y est partielle tant que la version n'est pas renseignée.
          </Text>
        )}
      </Section>

      <Hr style={styles.rule} />

      <Section style={styles.section}>
        <Text style={styles.label}>
          2 · Ce qui a changé
          {blocks.delta.since ? ` depuis le ${jourFr(blocks.delta.since)}` : ""}
        </Text>

        {blocks.delta.alerts.map((alert) => (
          <Text key={`${alert.at}-${alert.title}`} style={{ ...styles.paragraph, margin: "0 0 8px" }}>
            {alert.title}
          </Text>
        ))}

        {blocks.delta.newComponents.length > 0 && (
          <Text style={{ ...styles.muted, margin: "12px 0 0" }}>
            Nouveaux composants détectés :{" "}
            {blocks.delta.newComponents
              .map((component) =>
                component.version ? `${component.label} ${component.version}` : component.label,
              )
              .join(", ")}
            .
          </Text>
        )}

        {rienDeNeuf && (
          <Text style={{ ...styles.paragraph, margin: 0 }}>
            Rien depuis le dernier numéro : aucune alerte n'a eu à vous être
            envoyée, et aucun composant nouveau n'est apparu.
          </Text>
        )}
      </Section>

      {blocks.watch.trim() !== "" && (
        <>
          <Hr style={styles.rule} />
          <Section style={styles.section}>
            <Text style={styles.label}>3 · La veille du moment</Text>
            {paragraphes(blocks.watch).map((paragraph, index) => (
              <Text key={index} style={styles.paragraph}>
                {paragraph}
              </Text>
            ))}
          </Section>
        </>
      )}

      {blocks.reco.trim() !== "" && (
        <>
          <Hr style={styles.rule} />
          <Section style={styles.section}>
            <Text style={styles.label}>4 · La recommandation du numéro</Text>
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
                {blocks.reco}
              </Text>
            </Section>
          </Section>
        </>
      )}

      {blocks.radar.length > 0 && (
        <>
          <Hr style={styles.rule} />
          <Section style={styles.section}>
            <Text style={styles.label}>5 · Radar · fins de support à six mois</Text>
            {blocks.radar.map((entry) => (
              <Text key={`${entry.label}-${entry.endsOn}`} style={{ ...styles.muted, margin: "0 0 6px" }}>
                <span style={{ color: COLORS.fgSoft }}>{entry.label}</span>
                {entry.version ? ` ${entry.version}` : ""} — jusqu'au {jourFr(entry.endsOn)} (
                {entry.daysLeft} jours)
              </Text>
            ))}
            <Text style={{ ...styles.footer, margin: "12px 0 0" }}>
              Rien à faire dans l'immédiat : ces échéances sont annoncées pour
              qu'elles ne vous surprennent pas.
            </Text>
          </Section>
        </>
      )}
    </Layout>
  );
}

export default NewsletterEmail;
