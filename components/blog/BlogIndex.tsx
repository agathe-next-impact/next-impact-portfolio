import { BlogCard } from "./BlogCard"
import type { BlogPostMeta } from "@/lib/blog"

interface BlogIndexProps {
  posts: BlogPostMeta[]
}

export function BlogIndex({ posts }: BlogIndexProps) {
  return (
    <section className="s">
      <div className="container">
        <div className="sec-head">
          <span className="sec-no">01</span>
          <h1>Blog</h1>
          <p className="sec-meta">
            Notes, retours d&apos;expérience et coulisses de mes projets web.
          </p>
        </div>

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
  )
}
