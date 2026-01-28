import Link from "next/link"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { MarkdownContent } from "@/components/documentation/markdown-content"
import { getArticleBySlug, getArticlesByCategory } from "@/lib/markdown"
import TableOfContentsPopup from "@/components/documentation/table-of-content-popup"
import ShareSocial from "@/components/share-social"
import { Metadata } from "next";

// meta données dynamiques pour la page d'étude de cas
export async function generateMetadata(props: { params: Promise<{ category: string; slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const post = getArticleBySlug(params.category, params.slug);
  if (!post) {
    return {
      title: "Article introuvable",
      description: "L'article demandé n'existe pas.",
    };
  }

  return {
    title: `${post.title} | Next Impact`,
    description: post.description,
    openGraph: {
      title: `${post.title} | Next Impact`,
      description: post.description,
      url: `https://next-impact.digital/documentation/${post.category}/${post.slug}`,
      type: "article",
      images: [
        {
          url: "https://next-impact.digital/img/avatar.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
  };
}


interface ArticlePageProps {
  params: Promise<{
    category: string
    slug: string
  }>
}

 
export function generateTableOfContents(content: string) {
  if (!content || typeof content !== "string") {
    return []; // Return an empty array if content is invalid
  }

  const toc: { id: string; text: string; level: number }[] = [];

  // Use a regular expression to find Markdown headings (##, ###, etc.)
  const headingRegex = /^(#{2,6})\s+(.*)$/gm;
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const [_, hashes, text] = match;
    const level = hashes.length; // The heading level is determined by the number of #
    const id = text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\wÀ-ÖØ-öø-ÿ-]/g, ""); // Allow special French characters and remove others

    if (level === 2 || level === 3) {
      toc.push({ id, text, level });
    }
  }

  return toc;
}

export default async function ArticlePage(props: ArticlePageProps) {
    const params = await props.params;
    const article = getArticleBySlug(params.category, params.slug)
    const relatedArticles = (getArticlesByCategory(params.category))
      .filter((a) => a.slug !== params.slug)
      .slice(0, 2)

    const tableOfContents = article?.content ? generateTableOfContents(article.content) : [] // Safely generate TOC


    return (
      <div className="flex flex-col min-h-screen"> 
        <main className="flex-1">
          <div className="container px-4 py-12 md:px-6 md:py-16 lg:py-24 flex">
            <div className="flex-1 mx-full">
            <div className="flex items-center gap-2 mb-8">
              <Link href="/documentation" className="text-sm text-regularblue hover:text-regularblue/80">
                Documentation
              </Link>
              <span className="text-regularblue text-xs">/</span>
              <Link
                href={`/documentation/${article.category}`}
                className="text-sm text-regularblue hover:text-regularblue/80"
              >
                {article.category.charAt(0).toUpperCase() + article.category.slice(1).replace(/-/g, " ")}
              </Link>
              <span className="text-regularblue text-xs">/</span>
              <span className="font-googletitre text-regularblue text-xs font-medium">{article.title}</span>
              </div>
            <div className="flex justify-between items-center mb-6">

              <div className="flex gap-2">
                <ShareSocial url={`/documentation/${article.category}/${article.slug}`} />
              </div>
              </div>
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl tracking-tight font-medium mb-4">{article.title}</h1>
                <p className="text-lg text-mediumblue font-light">{article.description}</p>
                <div className="flex items-center gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <div>
                      <Image 
                        src="/img/logo-small.png"
                        alt="Logo"
                        width={22}
                        height={22}
                        className="object-contain"
                      />

                    </div>

                  </div>
                  <span className="text-sm text-ligthblue">
                    Mise à jour : {typeof article.date === "string" ? article.date : "Recently"}
                  </span>
                </div>
            </div>
            <Separator className="my-6" />
            <div className="grid grid-cols-1 lg:grid-cols-4 mt-8">
              <aside className="col-span-1 hidden lg:block sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto pr-4">
              <TableOfContentsPopup tableOfContents={tableOfContents} />
              </aside>
          <div className="col-span-3 grow flex flex-col">      
            <div className="lg:w-10/12 w-full mx-auto pb-12">
            <MarkdownContent content={article.content} />
            </div>
            <Separator />
            {relatedArticles.length > 0 && (
              <div className="space-y-4 mt-12">
                <h3 className="text-xl font-bold text-regularblue">Articles en lien</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {relatedArticles.map((relatedArticle) => (
                    <Link
                      key={relatedArticle.slug}
                      href={`/documentation/${relatedArticle.category}/${relatedArticle.slug}`}
                      className="group rounded-lg border p-4 hover:border-lightblue/20 transition-colors hover:bg-extralightblue/5"
                    >
                      <h4 className="font-medium text-regularblue hover:text-regularblue/80">{relatedArticle.title}</h4>
                      <p className="text-sm text-mediumblue">{relatedArticle.description}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
          </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
}