import { BlogCard } from "./BlogCard"
import PageLayout from "@/components/page-layout"
import type { BlogPostMeta } from "@/lib/blog"

interface BlogIndexProps {
  posts: BlogPostMeta[]
}

export function BlogIndex({ posts }: BlogIndexProps) {
  return (
    <PageLayout
      titre="Blog"
      sousTitre="Notes, retours d'expérience et coulisses de mes projets web."
    >
      <section className="s" style={{ borderTop: "1px solid var(--rule)" }}>
        <div className="container">
          {posts.length > 0 ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "0 4rem",
            }}>
              {posts.map((post, i) => (
                <BlogCard key={post.slug} post={post} index={i} />
              ))}
            </div>
          ) : (
            <div style={{
              borderTop: "1px solid var(--rule)",
              paddingTop: "3rem",
              paddingBottom: "3rem",
              textAlign: "center",
            }}>
              <p style={{ color: "var(--muted-color)", fontSize: "0.875rem" }}>
                Le blog arrive bientôt.
              </p>
              <p style={{ color: "var(--muted-color)", fontSize: "0.8125rem", marginTop: "0.5rem" }}>
                Les premiers articles sont en cours d&apos;écriture.
              </p>
            </div>
          )}
        </div>
      </section>
    </PageLayout>
  )
}
