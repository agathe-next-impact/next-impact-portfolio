import React from "react";
import { compileMDX } from "next-mdx-remote/rsc";
import { Callout } from "./mdx/callout";
import { ComparisonTable } from "./mdx/comparison-table";
import { StepByStep, Step } from "./mdx/step-by-step";
import { StatCard, StatGrid } from "./mdx/stat-card";
import { VideoInline } from "./mdx/video-inline";
import { Quiz } from "./mdx/quiz";
import { FlowDiagram, ArchitectureDiagram, HighlightBox } from "./mdx/infographic";
import { HeadlessDiagnostic } from "./headless-diagnostic";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\wÀ-ÖØ-öø-ÿ-]/g, "");
}

function extractText(children: React.ReactNode): string {
  if (typeof children === "string") return children;
  if (typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(extractText).join("");
  if (React.isValidElement(children) && children.props) {
    return extractText((children.props as { children?: React.ReactNode }).children);
  }
  return "";
}

function MdxH2({ children }: { children?: React.ReactNode }) {
  const text = extractText(children);
  const id = slugify(text);
  return (
    <>
      <div className="mt-12 mb-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange/40 to-transparent" />
        <div className="h-1.5 w-1.5 rounded-full bg-coral/30" />
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange/40 to-transparent" />
      </div>
      <h2 id={id}>{children}</h2>
    </>
  );
}

function MdxH3({ children }: { children?: React.ReactNode }) {
  const text = extractText(children);
  const id = slugify(text);
  return <h3 id={id}>{children}</h3>;
}

const mdxComponents = {
  h2: MdxH2,
  h3: MdxH3,
  Callout,
  ComparisonTable,
  StepByStep,
  Step,
  StatCard,
  StatGrid,
  VideoInline,
  Quiz,
  FlowDiagram,
  ArchitectureDiagram,
  HighlightBox,
  HeadlessDiagnostic,
};

interface MdxContentProps {
  source: string;
}

export async function MdxContent({ source }: MdxContentProps) {
  const { content } = await compileMDX({
    source,
    components: mdxComponents,
  });

  return (
    <div className="article-text text-white/80">
      {content}
    </div>
  );
}
