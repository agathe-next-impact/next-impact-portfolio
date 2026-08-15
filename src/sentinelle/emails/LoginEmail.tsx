import { Link, Section, Text } from "@react-email/components";
import { Layout } from "./Layout";
import { styles } from "./theme";

// ─────────────────────────────────────────────────────────────────────────────
// Gabarit du lien de connexion.
//
// Le message le plus court du produit, et volontairement : quelqu'un qui vient
// de demander un lien veut un lien, pas une lettre. Deux phrases utiles — la
// durée de validité, et la conduite à tenir si la demande ne vient pas de lui.
// ─────────────────────────────────────────────────────────────────────────────

export interface LoginEmailProps {
  loginUrl: string;
  /** Minutes de validité — affichées, jamais déduites par le lecteur. */
  validityMinutes: number;
  sentAt: Date;
}

export function LoginEmail({ loginUrl, validityMinutes, sentAt }: LoginEmailProps) {
  return (
    <Layout preview="Votre lien de connexion à Sentinelle." kicker="Connexion" sentAt={sentAt}>
      <Section style={styles.section}>
        <Text style={styles.h1}>Votre lien de connexion</Text>

        <Text style={styles.paragraph}>
          Cliquez pour ouvrir votre espace. Ce lien ne fonctionne qu&apos;une fois et
          expire dans {validityMinutes} minutes.
        </Text>

        <Link href={loginUrl} style={styles.button}>
          Ouvrir mon espace
        </Link>

        <Text style={{ ...styles.footer, margin: "22px 0 0" }}>
          Si vous n&apos;avez rien demandé, ignorez ce message : sans clic, ce lien
          expire tout seul et personne n&apos;accède à quoi que ce soit.
        </Text>
      </Section>
    </Layout>
  );
}

export default LoginEmail;
