import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { NextResponse } from "next/server";
import { getCaseStudies } from "@/lib/case-studies-data";

const baseUrl = "https://www.next-impact.digital";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type MarkdownEntry = {
  url: string;
  title: string;
  description: string;
  content: string;
  order: number;
};

function cleanMarkdown(content: string): string {
  return content
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function excerpt(content: string, maxLength = 2500): string {
  const cleaned = cleanMarkdown(content);
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength).trim()}...`;
}

function readDirectoryEntries(root: string, urlPrefix: string): MarkdownEntry[] {
  if (!fs.existsSync(root)) return [];

  const files = fs
    .readdirSync(root, { withFileTypes: true })
    .flatMap((entry) => {
      if (entry.isDirectory()) {
        return fs
          .readdirSync(path.join(root, entry.name))
          .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
          .map((file) => ({ category: entry.name, file }));
      }

      if (entry.isFile() && entry.name.endsWith(".mdx")) {
        return [{ category: "", file: entry.name }];
      }

      return [];
    });

  const entries = new Map<string, MarkdownEntry>();

  for (const item of files) {
    const filePath = item.category
      ? path.join(root, item.category, item.file)
      : path.join(root, item.file);
    const slug = item.file.replace(/\.mdx?$/, "");
    const key = item.category ? `${item.category}/${slug}` : slug;
    const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
    const previous = entries.get(key);
    const current = {
      url: item.category
        ? `${baseUrl}/${urlPrefix}/${item.category}/${slug}`
        : `${baseUrl}/${urlPrefix}/${slug}`,
      title: data.title || slug.replace(/-/g, " "),
      description: data.description || data.excerpt || "",
      content: excerpt(content),
      order: typeof data.order === "number" ? data.order : 99,
    };

    if (!previous || item.file.endsWith(".mdx")) entries.set(key, current);
  }

  return [...entries.values()].sort((a, b) => a.url.localeCompare(b.url) || a.order - b.order);
}

export async function GET() {
  const docs = readDirectoryEntries(
    path.join(process.cwd(), "content", "documentation"),
    "documentation",
  );
  const blogPosts = readDirectoryEntries(path.join(process.cwd(), "content", "blog"), "blog");
  const caseStudies = getCaseStudies("fr");

  const caseStudiesSection = caseStudies
    .map(
      (study) => `## ${study.title}

URL: ${baseUrl}/etudes-de-cas/${study.slug}
Client: ${study.clientName}
Technologies: ${study.technologies.join(", ")}
Description: ${study.description}
Results: ${study.results.join(" | ")}
`,
    )
    .join("\n");

  const markdownEntries = [...blogPosts, ...docs]
    .map(
      (entry) => `## ${entry.title}

URL: ${entry.url}
Description: ${entry.description}

${entry.content}
`,
    )
    .join("\n");

  const content = `# Next Impact - extended LLM context

> Extended Markdown context for agents that need to understand Next Impact, its services, case studies and educational resources.

## Entity Summary

Next Impact is a web technology advisory and implementation offer in France led by Agathe Karinthi-Martin. Its core positioning: AI can code fast, but small teams still need to decide what to build, with which technology, and how far to go. Next Impact helps choose between WordPress, no-code, AI coding, SaaS, Headless, custom development or not building at all. Core expertise: technology choice, architecture, maintainability, technical debt, data, SEO, security, WordPress, WordPress headless, Next.js, React, TypeScript, PostgreSQL, PWA and project scoping.

## Offer Architecture

- Web & AI Tech diagnostic: first direction before building.
- Web tech choice with AI (€150): settle the right technology for a project fast, in 30 min — review of existing setup and needs; the only tier credited to a project signed within 30 days.
- AI project architecture advice (€490): audit and scope the architecture — one-hour call plus specifications and technical requirements.
- AI build pack (€1,900): leave with everything needed to develop — two one-hour calls plus specs and a pack of prompts and agents (Claude Code or Codex).
- Fractional tech direction (€750/month): monthly retainer for ongoing steering — arbitration, quote reviews and a living roadmap, no time commitment.
- Tech watch: a free newsletter "Quelle techno pour mon site web a l'heure de l'IA ?" (monthly digest + weekly focus, on LinkedIn) and Sentinelle (€19/month), the personalized watch on the client's own site or app — targeted alerts, two letters a month and decision support (maintain, rebuild or create).
- Implementation: build only when the solution is clear and justified.
- WordPress support: fix, stabilize or decide whether rebuilding is justified.

## Key URLs

- Home: ${baseUrl}/
- Tech advice: ${baseUrl}/conseil
- Solutions web: ${baseUrl}/solutions-web
- Case studies: ${baseUrl}/etudes-de-cas
- Tech watch (free newsletter + Sentinelle): ${baseUrl}/veille
- Sentinelle (personalized site watch): ${baseUrl}/sentinelle
- Documentation (decision hub "Which web tech?"): ${baseUrl}/documentation
- Be found in the AI era (SEO & GEO section): ${baseUrl}/documentation/etre-trouve
- Contact: ${baseUrl}/contact
- Sitemap: ${baseUrl}/sitemap.xml

# Case Studies

${caseStudiesSection}

# Resources and Articles

${markdownEntries}
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
