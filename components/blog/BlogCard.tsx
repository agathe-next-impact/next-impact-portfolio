import { Link } from "@/i18n/navigation"
import { Clock } from "lucide-react"
import type { BlogPostMeta } from "@/lib/blog"

interface BlogCardProps {
  post: BlogPostMeta
  index?: number
}

export function BlogCard({ post, index = 0 }: BlogCardProps) {
  const formattedDate = post.date
    ? new Date(post.date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : ""

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="hover-row"
      style={{
        display: "block",
        borderTop: "1px solid var(--rule)",
        padding: "1.25rem 0",
        textDecoration: "none",
        color: "var(--ink)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
        <div style={{ flex: 1 }}>
          {formattedDate && (
            <span className="label" style={{ marginBottom: "0.5rem", display: "inline-block" }}>
              {formattedDate}
            </span>
          )}
          <h3 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.0625rem",
            fontWeight: 400,
            color: "var(--ink)",
            lineHeight: 1.3,
            marginBottom: "0.375rem",
          }}>
            {post.title}
          </h3>
          {post.excerpt && (
            <p style={{
              fontSize: "0.8125rem",
              color: "var(--muted-color)",
              lineHeight: 1.5,
              marginBottom: "0.375rem",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}>
              {post.excerpt}
            </p>
          )}
          {post.readingTime > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", color: "var(--muted-color)", fontSize: "0.6875rem" }}>
              <Clock style={{ width: "0.75rem", height: "0.75rem" }} />
              <span>{post.readingTime} min</span>
            </div>
          )}
        </div>
        <span className="annot" style={{ paddingTop: "0.125rem" }}>
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </Link>
  )
}
