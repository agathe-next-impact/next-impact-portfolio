import { Hr, Link, Section, Text } from "@react-email/components";
import { Layout } from "./Layout";
import { COLORS, FONTS, styles } from "./theme";

// ─────────────────────────────────────────────────────────────────────────────
// Gabarit de bienvenue — le premier message qu'un abonné reçoit.
//
// Il a un seul travail : montrer que la surveillance a déjà commencé, puis
// demander la seule chose que la machine ne peut pas trouver seule. D'où
// l'ordre : ce qui est DÉJÀ suivi (preuve), ce qui manque (raison), le lien
// pour compléter (action). Une page d'accueil chaleureuse et vide produirait
// l'effet inverse — quelqu'un qui vient de payer veut voir que ça tourne.
//
// Rien n'est promis ici que le produit ne tienne : le compte des composants
// vient de la fiche réelle, pas d'une formule.
// ─────────────────────────────────────────────────────────────────────────────

export interface WelcomeEmailProps {
  name: string;
  siteUrl: string;
  /** Composants déjà en fiche, tels qu'ils s'affichent dans l'espace. */
  components: Array<{ label: string; version: string | null }>;
  /** Combien de composants sont réellement suivis par une source de veille. */
  watchedCount: number;
  /** Lien de connexion à usage unique — quinze minutes. */
  loginUrl: string;
  /** Racine de l'espace, pour le repli quand le lien a expiré. */
  espaceUrl: string;
  sentAt: Date;
}

export function WelcomeEmail({
  name,
  siteUrl,
  components,
  watchedCount,
  loginUrl,
  espaceUrl,
  sentAt,
}: WelcomeEmailProps) {
  const firstName = name.trim().split(/\s+/)[0] || name;
  const shown = components.slice(0, 12);
  const remaining = components.length - shown.length;

  return (
    <Layout
      preview={
        components.length > 0
          ? `${components.length} composants déjà en surveillance sur votre site.`
          : "Votre surveillance est ouverte — il reste à compléter votre fiche."
      }
      kicker="Bienvenue"
      sentAt={sentAt}
      siteUrl={siteUrl}
    >
      <Section style={styles.section}>
        <Text style={styles.h1}>La surveillance de votre site a commencé.</Text>

        <Text style={styles.paragraph}>
          Bonjour {firstName}, merci pour votre confiance. J&apos;ai analysé{" "}
          {siteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")} et votre fiche est déjà
          ouverte.
        </Text>

        <Text style={styles.paragraph}>
          À partir de maintenant, je reçois chaque jour les publications de failles et les
          fins de support des composants ci-dessous. Quand l&apos;une vous concerne
          vraiment, vous recevez une alerte — relue par moi avant de partir, jamais
          envoyée automatiquement. Et le 1er et le 15 de chaque mois, un point d&apos;une
          page sur l&apos;état de votre site.
        </Text>
      </Section>

      {components.length > 0 && (
        <>
          <Hr style={styles.rule} />
          <Section style={styles.section}>
            <Text style={styles.label}>
              Déjà en fiche · {components.length} composant{components.length > 1 ? "s" : ""}
            </Text>
            <Section style={styles.panel}>
              {shown.map((component) => (
                <Text
                  key={component.label}
                  style={{ ...styles.muted, color: COLORS.fgSoft, margin: "0 0 6px" }}
                >
                  {component.label}
                  {component.version ? ` · ${component.version}` : ""}
                </Text>
              ))}
              {remaining > 0 && (
                <Text style={{ ...styles.muted, margin: "10px 0 0" }}>
                  et {remaining} autre{remaining > 1 ? "s" : ""}, visible
                  {remaining > 1 ? "s" : ""} dans votre espace.
                </Text>
              )}
            </Section>
            <Text style={{ ...styles.muted, margin: "12px 0 0" }}>
              {watchedCount} de ces composants {watchedCount > 1 ? "sont suivis" : "est suivi"}{" "}
              par une source de veille automatique. Les autres restent affichés : je les
              regarde à la main, mais aucun catalogue public ne les couvre.
            </Text>
          </Section>
        </>
      )}

      <Hr style={styles.rule} />

      <Section style={styles.section}>
        <Text style={styles.label}>Ce qu&apos;il reste à faire — cinq minutes</Text>
        <Text style={styles.paragraph}>
          Une analyse depuis l&apos;extérieur voit ce que votre site sert aux visiteurs,
          soit une bonne moitié de ce qu&apos;il contient. Ce qui lui échappe : les
          extensions qui ne se chargent qu&apos;en administration, votre version exacte de
          PHP, votre hébergeur, les services tiers branchés dessus. Ce sont souvent
          celles-là qui prennent du retard.
        </Text>
        <Text style={styles.paragraph}>
          Complétez votre fiche depuis votre espace : la surveillance passe alors de
          partielle à exacte.
        </Text>

        <Link href={loginUrl} style={styles.button}>
          Compléter ma fiche
        </Link>

        <Text style={{ ...styles.footer, margin: "18px 0 0" }}>
          Ce lien vous connecte sans mot de passe et ne vaut que quinze minutes. Passé ce
          délai, demandez-en un nouveau depuis{" "}
          <Link href={espaceUrl} style={{ ...styles.link, fontFamily: FONTS.body }}>
            votre espace
          </Link>
          .
        </Text>
      </Section>
    </Layout>
  );
}

export default WelcomeEmail;
