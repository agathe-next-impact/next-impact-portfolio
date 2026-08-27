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

Next Impact is a WordPress redesign studio in France led by Agathe Karinthi-Martin. Its core positioning: an aging WordPress site can become fast and modern again without rebuilding everything; the real question is what you keep and what you change. Three trajectories (consolidate: optimized WordPress; decouple: headless WordPress, recommended; rebuild: web app), fixed price and timeline, performance measured before and after. AI is a method argument (the human frames, AI executes), not the pitch. Core expertise: WordPress, WordPress headless, Next.js, React, TypeScript, PostgreSQL, PWA, technical debt, SEO and project scoping.

## Offer Architecture

- Free 2-minute site diagnostic: see what slows the site down and which trajectory (consolidate, decouple, rebuild) fits.
- Redesign advisory call (€150): one hour on a call, a written opinion within 48h: stay, decouple or rebuild, and why. Deducted from the quote if a project starts within 30 days.
- Audit + roadmap (€650): audit report (performance, security, technical debt, plugins, hosting), costed recommendations and a step-by-step roadmap. The document serves even if the work goes to someone else.
- Optimized WordPress redesign (from €2,250): theme, plugins and optimization of the existing site, without changing the publishing tool.
- Headless WordPress redesign (from €4,000): WordPress back office kept, modern front end: editors publish as before, visitors see a fast site. Recommended trajectory.
- Web app redesign (from €6,500): web and/or mobile platform when the site has become a working tool.
- Tech watch: a free newsletter "Quelle techno pour mon site web a l'heure de l'IA ?" (monthly digest + weekly focus, on Substack) and Sentinelle (€19/month), the personalized watch on the client's own site or app: targeted alerts, two letters a month and decision support (maintain, rebuild or create).
- Implementation: build only when the solution is clear and justified.

## Key URLs

- Home: ${baseUrl}/
- Tech advice: ${baseUrl}/conseil
- Solutions web (three redesign trajectories): ${baseUrl}/solutions-web
- Headless WordPress pillar page: ${baseUrl}/wordpress-headless
- Free 2-minute site diagnostic: ${baseUrl}/audit-site-web
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
