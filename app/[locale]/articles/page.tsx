import { getArticles } from "@/lib/articles"
import { ArticlesIndex } from "@/components/articles/ArticlesIndex"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { generatePageMetadata } from "@/lib/metadata"
import type { Locale } from "@/i18n/routing"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "articlesPage" })
  return generatePageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    path: "/articles",
    locale,
  })
}

export default async function ArticlesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>
}) {
  const { locale } = await params
  const articles = await getArticles(locale)

  return <ArticlesIndex articles={articles} />
}
