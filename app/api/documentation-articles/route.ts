import { NextResponse } from "next/server";
import { getAllArticles } from "@/lib/markdown";

export async function GET() {
  const articles = getAllArticles().map(({ slug, title, description, category }) => ({
    slug,
    title,
    description,
    category,
  }));
  return NextResponse.json(articles);
}
