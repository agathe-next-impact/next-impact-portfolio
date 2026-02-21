import Link from "next/link";
import {
  BookOpen,
  Search,
  Palette,
  Megaphone,
  Layers,
  Globe,
  PenTool,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

/* ─── Données catégories ──────────────────────────────────────────────────── */

interface CategoryMeta {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  articleCount: string;
}

const ALL_CATEGORIES: CategoryMeta[] = [
  {
    slug: "headless-cms",
    title: "Headless CMS",
    description: "Architecture découplée, API WordPress et Next.js.",
    icon: Layers,
    articleCount: "35 articles",
  },
  {
    slug: "design-ui-ux",
    title: "Design & UI/UX",
    description: "Identité visuelle, charte graphique et maquettes.",
    icon: Palette,
    articleCount: "20 articles",
  },
  {
    slug: "marketing-digital",
    title: "Marketing Digital",
    description: "Stratégie, marque et visibilité en ligne.",
    icon: Megaphone,
    articleCount: "12 articles",
  },
  {
    slug: "seo",
    title: "SEO",
    description: "Référencement, mots-clés et arborescence.",
    icon: Search,
    articleCount: "10 articles",
  },
  {
    slug: "projet-site-web",
    title: "Projet de site web",
    description: "Cahier des charges, pilotage et bonnes pratiques.",
    icon: PenTool,
    articleCount: "8 articles",
  },
  {
    slug: "wordpress",
    title: "WordPress",
    description: "Thèmes, plugins et bonnes pratiques.",
    icon: Globe,
    articleCount: "8 articles",
  },
];

/* ─── Relations entre catégories ──────────────────────────────────────────── */

const RELATED_CATEGORIES: Record<string, string[]> = {
  "headless-cms": ["wordpress", "seo", "projet-site-web"],
  wordpress: ["headless-cms", "design-ui-ux", "projet-site-web"],
  seo: ["marketing-digital", "headless-cms", "projet-site-web"],
  "design-ui-ux": ["projet-site-web", "marketing-digital", "wordpress"],
  "marketing-digital": ["seo", "design-ui-ux", "projet-site-web"],
  "projet-site-web": ["headless-cms", "design-ui-ux", "seo"],
  blog: ["headless-cms", "wordpress"],
};

/* ─── Composant : liens croisés sur pages catégorie ──────────────────────── */

interface CrossCategoryNavProps {
  currentCategory: string;
}

export function CrossCategoryNav({ currentCategory }: CrossCategoryNavProps) {
  const relatedSlugs = RELATED_CATEGORIES[currentCategory] || [];
  const relatedCategories = relatedSlugs
    .map((slug) => ALL_CATEGORIES.find((c) => c.slug === slug))
    .filter(Boolean) as CategoryMeta[];

  if (relatedCategories.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-lightblue/10">
      <h2 className="font-googletitre text-xl md:text-2xl font-medium text-white mb-2">
        Catégories associées
      </h2>
      <p className="text-sm text-white/60 font-googletexte mb-6">
        Continuez votre exploration avec des thématiques complémentaires.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedCategories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.slug}
              href={`/documentation/${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl p-5 border border-lightblue/10 bg-darkblue/40 backdrop-blur-sm hover:border-lightblue/30 hover:bg-darkblue/60 hover:shadow-xl hover:shadow-regularblue/10 transition-all duration-300"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lightblue/10 group-hover:bg-lightblue/20 transition-colors">
                  <Icon className="h-5 w-5 text-lightblue/80 group-hover:text-lightblue transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-googletitre text-lg font-medium text-white/90 group-hover:text-white transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-white/60 font-googletexte mt-1 line-clamp-2">
                    {cat.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm text-regularblue/80 font-googletexte mt-2 group-hover:text-regularblue transition-colors">
                    {cat.articleCount}
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ─── Composant : grille complète pour la page hub ────────────────────────── */

export function AllCategoriesGrid() {
  return (
    <section className="mt-12">
      <h2 className="font-googletitre text-xl md:text-2xl font-medium text-white mb-2">
        Explorer par thème
      </h2>
      <p className="text-sm text-white/60 font-googletexte mb-6">
        Tous nos guides et ressources, organisés par thématique.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {ALL_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.slug}
              href={`/documentation/${cat.slug}`}
              className="group relative overflow-hidden rounded-2xl p-5 border border-lightblue/10 bg-mediumblue/60 backdrop-blur-sm hover:border-lightblue/30 hover:bg-mediumblue/80 hover:shadow-xl hover:shadow-regularblue/10 transition-all duration-300"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-regularblue/10 group-hover:bg-regularblue/20 transition-colors">
                  <Icon className="h-5 w-5 text-regularblue/80 group-hover:text-regularblue transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-googletitre text-lg font-medium text-white/90 group-hover:text-white transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-white/60 font-googletexte mt-1 line-clamp-2">
                    {cat.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-lightblue/5">
                <span className="text-sm text-white/40 font-googletexte">
                  {cat.articleCount}
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-white/30 group-hover:text-white/60 group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
