import { BlogCard } from "./BlogCard"
import type { BlogPostMeta } from "@/lib/blog"

interface BlogIndexProps {
  posts: BlogPostMeta[]
}

export function BlogIndex({ posts }: BlogIndexProps) {
  return (
    <div className="relative z-10 min-h-screen">
      <div className="container px-4 md:px-6 py-8 md:py-12 lg:py-16 space-y-8">
        <div className="rounded-3xl bg-gradient-to-br from-mediumblue/90 via-mediumblue/80 to-darkblue/70 backdrop-blur-sm p-6 md:p-10 lg:p-12 border border-lightblue/10">
          <h1 className="font-googletitre text-3xl md:text-4xl lg:text-5xl tracking-tight font-medium text-white mb-3">
            Blog
          </h1>
          <p className="text-lg text-white/80 font-googletexte font-light max-w-2xl leading-relaxed">
            Notes, retours d&apos;expérience et coulisses de mes projets web.
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {posts.map((post, i) => (
              <BlogCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-lightblue/10 bg-darkblue/40 backdrop-blur-sm p-10 md:p-16 text-center">
            <p className="text-white/70 text-base font-googletexte">
              Le blog arrive bientôt.
            </p>
            <p className="mt-2 text-white/50 text-sm font-googletexte font-light">
              Les premiers articles sont en cours d&apos;écriture.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
