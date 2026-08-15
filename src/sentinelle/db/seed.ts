import { inArray, sql } from "drizzle-orm";
import { db } from "./client";
import { clients, stackItems } from "./schema";
import type { Confidence, NewStackItem, StackItemSource, StackItemType } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Quatre clients de démonstration — la preuve de l'agnosticité.
//
// Ce n'est pas un accessoire de test. Une définition de fini qui ne vérifie
// qu'un WordPress ne prouve rien d'une promesse « toute technologie » : il faut
// quatre stacks qui n'ont rien en commun, et une collecte qui trouve quelque
// chose de pertinent pour chacune.
//
//   1. WordPress + WooCommerce   → extensions, thème, PHP, Apache, jQuery ancien
//   2. Drupal                     → CMS non-WordPress, Packagist, nginx
//   3. Next.js + npm              → aucun CMS, dépendances de paquets
//   4. Site sans CMS              → nginx + PHP hors support, rien d'autre
//
// Adresses en `.invalid` (RFC 2606) : aucune ne peut recevoir d'e-mail, même le
// jour où un envoi partirait par erreur sur la base de démonstration.
//
//   npm run db:seed            crée ou met à jour les quatre fiches
//   npm run db:seed -- --clean supprime les quatre fiches et tout ce qui pend
// ─────────────────────────────────────────────────────────────────────────────

interface SeedComponent {
  slug: string;
  label: string;
  type: StackItemType;
  ecosystem: string | null;
  version: string | null;
  source?: StackItemSource;
  versionConfidence?: Confidence;
}

interface SeedClient {
  email: string;
  name: string;
  company: string;
  siteUrl: string;
  sector: string;
  notes: string;
  stack: SeedComponent[];
}

export const SEED_CLIENTS: SeedClient[] = [
  {
    email: "demo-wordpress@sentinelle.invalid",
    name: "Démo WordPress",
    company: "Agence Perrin Immobilier",
    siteUrl: "https://demo-wordpress.sentinelle.invalid",
    sector: "Agence immobilière, 12 salariés",
    notes:
      "Site vitrine avec boutique de goodies. Personne en interne pour les mises à jour ; l'ancien prestataire ne répond plus.",
    stack: [
      { slug: "wordpress", label: "WordPress", type: "cms", ecosystem: "wordpress", version: "6.4.3" },
      { slug: "woocommerce", label: "WooCommerce", type: "ecommerce", ecosystem: "wordpress", version: "8.6.1" },
      { slug: "contact-form-7", label: "Contact Form 7", type: "cms_plugin", ecosystem: "wordpress", version: "5.9.3" },
      { slug: "elementor", label: "Elementor", type: "cms_plugin", ecosystem: "wordpress", version: "3.19.4" },
      { slug: "astra", label: "Astra", type: "cms_theme", ecosystem: "wordpress", version: "4.6.2" },
      { slug: "php", label: "PHP", type: "runtime", ecosystem: "endoflife", version: "8.1.27" },
      { slug: "apache", label: "Apache HTTP Server", type: "server", ecosystem: "endoflife", version: "2.4.57" },
      // Version lue dans un `?ver=` : présence certaine, version probable. C'est
      // le cas qui doit produire un orange et jamais un rouge.
      {
        slug: "jquery",
        label: "jQuery",
        type: "js_library",
        ecosystem: "npm",
        version: "1.12.4",
        versionConfidence: "medium",
      },
    ],
  },
  {
    email: "demo-drupal@sentinelle.invalid",
    name: "Démo Drupal",
    company: "Communauté de communes du Cézallier",
    siteUrl: "https://demo-drupal.sentinelle.invalid",
    sector: "Collectivité territoriale, 40 agents",
    notes:
      "Site institutionnel refait en 2022. Marché de maintenance échu, plus de prestataire attitré.",
    stack: [
      {
        slug: "drupal",
        label: "Drupal",
        type: "cms",
        ecosystem: "drupal",
        version: "10.1.5",
        source: "declared",
      },
      { slug: "php", label: "PHP", type: "runtime", ecosystem: "endoflife", version: "8.2.15", source: "declared" },
      { slug: "nginx", label: "nginx", type: "server", ecosystem: "endoflife", version: "1.24.0" },
    ],
  },
  {
    email: "demo-nextjs@sentinelle.invalid",
    name: "Démo Next.js",
    company: "Studio Lignes",
    siteUrl: "https://demo-nextjs.sentinelle.invalid",
    sector: "Studio de design, 6 salariés",
    notes: "Site sur mesure, déployé sur Vercel. Aucune équipe technique interne depuis le départ du développeur.",
    stack: [
      { slug: "next", label: "Next.js", type: "framework", ecosystem: "npm", version: "14.1.0", source: "declared" },
      { slug: "react", label: "React", type: "js_library", ecosystem: "npm", version: "18.2.0", source: "declared" },
      { slug: "nodejs", label: "Node.js", type: "runtime", ecosystem: "endoflife", version: "20.11.0", source: "declared" },
      // Sans catalogue de veille : doit ressortir dans le journal du plan, pas
      // dans une erreur.
      { slug: "vercel", label: "Vercel", type: "hosting", ecosystem: null, version: null },
    ],
  },
  {
    email: "demo-sans-cms@sentinelle.invalid",
    name: "Démo sans CMS",
    company: "Cabinet Vidal & Associés",
    siteUrl: "https://demo-sans-cms.sentinelle.invalid",
    sector: "Cabinet d'expertise comptable, 25 salariés",
    notes:
      "Site statique livré en 2019, hébergé sur un serveur mutualisé. Personne ne sait qui administre la machine.",
    stack: [
      { slug: "nginx", label: "nginx", type: "server", ecosystem: "endoflife", version: "1.18.0", source: "declared" },
      { slug: "php", label: "PHP", type: "runtime", ecosystem: "endoflife", version: "7.4.33", source: "declared" },
      { slug: "bootstrap", label: "Bootstrap", type: "js_library", ecosystem: "npm", version: "4.6.0" },
    ],
  },
];

const EMAILS = SEED_CLIENTS.map((client) => client.email);

export async function seed(): Promise<void> {
  for (const definition of SEED_CLIENTS) {
    const [row] = await db()
      .insert(clients)
      .values({
        email: definition.email,
        name: definition.name,
        company: definition.company,
        siteUrl: definition.siteUrl,
        sector: definition.sector,
        notes: definition.notes,
        plan: "veille",
        active: true,
      })
      .onConflictDoUpdate({
        target: clients.email,
        set: {
          name: sql`excluded.name`,
          company: sql`excluded.company`,
          siteUrl: sql`excluded.site_url`,
          sector: sql`excluded.sector`,
          notes: sql`excluded.notes`,
          active: true,
          deactivatedAt: null,
        },
      })
      .returning({ id: clients.id });

    const values: NewStackItem[] = definition.stack.map((component) => ({
      clientId: row.id,
      slug: component.slug,
      label: component.label,
      type: component.type,
      ecosystem: component.ecosystem,
      version: component.version,
      source: component.source ?? "scanned",
      meta: { versionConfidence: component.versionConfidence ?? "high" },
      watchEnabled: true,
    }));

    await db()
      .insert(stackItems)
      .values(values)
      .onConflictDoUpdate({
        target: [stackItems.clientId, stackItems.slug, stackItems.type],
        set: {
          version: sql`excluded.version`,
          ecosystem: sql`excluded.ecosystem`,
          label: sql`excluded.label`,
          meta: sql`excluded.meta`,
          source: sql`excluded.source`,
        },
      });

    console.info(
      `[seed] ${definition.company} — ${values.length} composants (${definition.email})`,
    );
  }
}

/** Supprime les fiches de démonstration. La cascade emporte stack, alertes, numéros. */
export async function clean(): Promise<void> {
  const removed = await db()
    .delete(clients)
    .where(inArray(clients.email, EMAILS))
    .returning({ email: clients.email });

  for (const row of removed) console.info(`[seed] supprimé : ${row.email}`);
  if (removed.length === 0) console.info("[seed] rien à supprimer");
}

/** Les fiches de démonstration sont-elles présentes ? */
export async function seededClientIds(): Promise<string[]> {
  const rows = await db()
    .select({ id: clients.id })
    .from(clients)
    .where(inArray(clients.email, EMAILS));

  return rows.map((row) => row.id);
}

// Exécution directe : `npm run db:seed [-- --clean]`.
//
// Pas de `await` de haut niveau : le package.json du dépôt est en CommonJS, où
// il ne compile pas. Une promesse chaînée fait le même travail.
if (process.argv[1]?.replace(/\\/g, "/").endsWith("src/sentinelle/db/seed.ts")) {
  try {
    process.loadEnvFile(".env.local");
  } catch {
    // Absent en CI et sur Vercel, qui passent les variables autrement.
  }

  const action = process.argv.includes("--clean") ? clean : seed;
  action()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("[seed] échec :", error);
      process.exit(1);
    });
}
