import { getArticles } from "@/lib/articles"
import { ArticlesIndex } from "@/components/articles/ArticlesIndex"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Articles & Comparatifs | Next Impact Digital",
  description:
    "Analyses, comparatifs et retours d'expérience sur WordPress Headless, le ROI web et les solutions TIH/AGEFIPH.",
}

export default async function ArticlesPage() {
  const articles = await getArticles()

  return <ArticlesIndex articles={articles} />
}
