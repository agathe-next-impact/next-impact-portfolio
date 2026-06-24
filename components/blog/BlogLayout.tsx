import { ArrowLeft, Clock } from "lucide-react"
import { Link } from "@/i18n/navigation"
import type { BlogPost } from "@/lib/blog"
import { BlueprintSection, Separator } from "@/components/aspect/section"
import { Reveal } from "@/components/ui/reveal"
import { TranslationFallbackBanner } from "@/components/translation-fallback-banner"

interface BlogLayoutProps {
  post: BlogPost
  children: React.ReactNode
}

/**
 * Classes prose « blueprint » : corps lisible sur obsidian via sélecteurs
 * enfants Tailwind, 100 % en tokens sémantiques (aucune couleur en dur), donc
 * compatible avec la bascule de thème claire/sombre. Cible le HTML produit par
 * MDX (p, headings, listes, citations, code, tables, liens, images…).
 */
const prose = [
  // largeur : on prend toute la largeur du contenu de la section
  "w-full font-inter-tight text-base leading-relaxed text-foreground/90",
  // paragraphes
  "[&_p]:my-6 [&_p]:leading-relaxed [&_p]:text-foreground/90",
  "[&>p:first-child]:text-lg [&>p:first-child]:text-foreground",
  // titres Figtree, fins
  "[&_h2]:font-sans [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-light [&_h2]:tracking-tight [&_h2]:text-foreground md:[&_h2]:text-3xl",
  "[&_h3]:font-sans [&_h3]:mt-10 [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-light [&_h3]:tracking-tight [&_h3]:text-foreground",
  "[&_h4]:font-sans [&_h4]:mt-8 [&_h4]:mb-2 [&_h4]:text-lg [&_h4]:font-normal [&_h4]:text-foreground",
  // emphase : pas de gras dans le corps, on garde la couleur du texte
  "[&_strong]:font-normal [&_strong]:text-inherit [&_b]:font-normal [&_b]:text-inherit",
  // liens
  "[&_a]:text-accent-secondary [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-accent-secondary/40 hover:[&_a]:decoration-accent-secondary",
  // listes
  "[&_ul]:my-6 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:marker:text-accent-secondary",
  "[&_ol]:my-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:marker:text-foreground/70",
  "[&_li]:my-2 [&_li]:leading-relaxed [&_li]:text-foreground/90",
  // citations : filet gauche accent
  "[&_blockquote]:my-8 [&_blockquote]:border-l-2 [&_blockquote]:border-accent-secondary [&_blockquote]:pl-5 [&_blockquote]:italic [&_blockquote]:text-foreground/80",
  // code inline
  "[&_code]:rounded [&_code]:border [&_code]:border-dark-gray [&_code]:bg-jet [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_code]:text-foreground",
  // blocs de code
  "[&_pre]:my-8 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:border [&_pre]:border-dark-gray [&_pre]:bg-jet [&_pre]:p-5 [&_pre]:text-sm [&_pre]:leading-relaxed [&_pre]:text-foreground",
  "[&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit",
  // images
  "[&_img]:my-8 [&_img]:rounded-md [&_img]:border [&_img]:border-dark-gray",
  // filet horizontal
  "[&_hr]:my-12 [&_hr]:border-dark-gray",
  // tables
  "[&_table]:my-8 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm",
  "[&_th]:border-b [&_th]:border-dark-gray [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:font-mono [&_th]:text-xs [&_th]:uppercase [&_th]:tracking-wider [&_th]:text-foreground [&_th]:font-normal",
  "[&_td]:border-b [&_td]:border-dark-gray [&_td]:px-4 [&_td]:py-3 [&_td]:text-foreground/90",
  // médias intégrés : pleine largeur du contenu de la section
  "[&_.article-video]:relative [&_.article-video]:my-10 [&_.article-video]:block [&_.article-video]:w-full [&_.article-video]:max-w-none [&_.article-video]:aspect-video [&_.article-video]:overflow-hidden [&_.article-video]:bg-jet",
  "[&_.article-video>iframe]:absolute [&_.article-video>iframe]:inset-0 [&_.article-video>iframe]:h-full [&_.article-video>iframe]:w-full [&_.article-video>iframe]:border-0",
  "[&_.article-media]:my-10 [&_.article-media]:block [&_.article-media]:w-full [&_.article-media]:max-w-none",
].join(" ")

export function BlogLayout({ post, children }: BlogLayoutProps) {
  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : ""

  return (
    <>
      <TranslationFallbackBanner show={post.isFallback} />

      {/* En-tête d'article */}
      <BlueprintSection className="border-t border-dark-gray">
        <Reveal className="px-6 py-12 lg:px-8 lg:py-16">
          {/* Fil d'Ariane */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-mid-gray transition-colors hover:text-accent-secondary"
          >
            <ArrowLeft className="size-3.5" aria-hidden />
            Blog
          </Link>

          {/* Kicker mono : date + tags */}
          <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[11px] uppercase tracking-[0.12em] text-accent-secondary">
            {formattedDate && <time dateTime={post.date}>{formattedDate}</time>}
            {post.tags.length > 0 && (
              <>
                <span className="h-px w-6 bg-accent-secondary/50" aria-hidden />
                {post.tags.map((tag) => (
                  <span key={tag} className="text-mid-gray">
                    {tag}
                  </span>
                ))}
              </>
            )}
          </div>

          {/* Titre Figtree, fin */}
          <h1 className="mt-5 max-w-3xl text-3xl font-light leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          {/* Méta : auteur + temps de lecture */}
          {(post.author || post.readingTime > 0) && (
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] tracking-[0.06em] text-mid-gray">
              {post.author && <span>{post.author}</span>}
              {post.author && post.readingTime > 0 && (
                <span className="h-px w-4 bg-dark-gray" aria-hidden />
              )}
              {post.readingTime > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-3" aria-hidden />
                  {post.readingTime} min
                </span>
              )}
            </div>
          )}
        </Reveal>
      </BlueprintSection>

      {/* Corps de l'article */}
      <BlueprintSection tone="jet" className="border-t border-dark-gray">
        <Reveal className="px-6 py-12 lg:px-8 lg:py-16">
          <div data-article-content className={prose}>
            {children}
          </div>
        </Reveal>
      </BlueprintSection>

      <Separator />
    </>
  )
}
