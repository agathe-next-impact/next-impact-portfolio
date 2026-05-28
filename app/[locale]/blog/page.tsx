import { getBlogPosts } from "@/lib/blog"
import { BlogIndex } from "@/components/blog/BlogIndex"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { generatePageMetadata } from "@/lib/metadata"
import type { Locale } from "@/i18n/routing"
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/json-ld"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "blogPage" })
  return generatePageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/blog",
    locale,
  })
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const posts = await getBlogPosts(locale)
  const t = await getTranslations({ locale, namespace: "blogPage" })
  const breadcrumbItems = [
    { name: locale === "en" ? "Home" : "Accueil", url: "/" },
    { name: "Blog", url: "/blog" },
  ]

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      <CollectionPageJsonLd
        name={t("metaTitle")}
        description={t("metaDescription")}
        url="/blog"
        items={posts.map((p) => ({
          name: p.title,
          url: `/blog/${p.slug}`,
          description: p.excerpt || p.title,
        }))}
      />
      <BlogIndex posts={posts} />
    </>
  )
}
