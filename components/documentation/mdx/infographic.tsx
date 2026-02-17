"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight, ArrowDown } from "lucide-react";

/* ─── Flow Diagram ─── */
interface FlowNode {
  label: string;
  description?: string;
  icon?: string;
}

interface FlowDiagramProps {
  nodes: FlowNode[];
  direction?: "horizontal" | "vertical";
  accent?: "blue" | "orange";
}

const flowAccents = {
  blue: { nodeBg: "bg-regularblue/10", nodeBorder: "border-regularblue/20", text: "text-regularblue", arrow: "text-regularblue/80" },
  orange: { nodeBg: "bg-orange/10", nodeBorder: "border-orange/20", text: "text-orange", arrow: "text-orange/40" },
};

export function FlowDiagram({ nodes, direction = "horizontal", accent = "blue" }: FlowDiagramProps) {
  if (!nodes || !Array.isArray(nodes)) return null;
  const style = flowAccents[accent];
  const isHorizontal = direction === "horizontal";
  const Arrow = isHorizontal ? ArrowRight : ArrowDown;

  return (
    <div className={cn(
      "my-8 flex items-center gap-3 flex-wrap justify-center",
      !isHorizontal && "flex-col"
    )}>
      {nodes.map((node, i) => (
        <div key={i} className={cn("contents")}>
          <div className={cn(
            "rounded-2xl border p-4 text-center min-w-[120px] max-w-[200px]",
            style.nodeBg, style.nodeBorder
          )}>
            {node.icon && <span className="text-2xl mb-1 block">{node.icon}</span>}
            <p className={cn("text-sm font-googletitre font-medium", style.text)}>{node.label}</p>
            {node.description && (
              <p className="text-xs font-googletexte text-mediumblue/80 mt-1">{node.description}</p>
            )}
          </div>
          {i < nodes.length - 1 && (
            <Arrow className={cn("h-5 w-5 shrink-0", style.arrow)} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Architecture Diagram ─── */
interface ArchLayer {
  label: string;
  items: string[];
  color?: "blue" | "orange" | "dark";
}

interface ArchitectureDiagramProps {
  layers: ArchLayer[];
  title?: string;
}

const layerColors = {
  blue: { bg: "bg-regularblue/10", border: "border-regularblue/20", badge: "bg-regularblue/20 text-regularblue" },
  orange: { bg: "bg-orange/10", border: "border-orange/20", badge: "bg-orange/20 text-orange" },
  dark: { bg: "bg-darkblue/5", border: "border-darkblue/10", badge: "bg-darkblue/10 text-darkblue" },
};

export function ArchitectureDiagram({ layers, title }: ArchitectureDiagramProps) {
  if (!layers || !Array.isArray(layers)) return null;
  return (
    <div className="my-8 rounded-2xl border border-extralightblue bg-extralightblue/20 p-6">
      {title && (
        <p className="text-center font-googletitre font-medium text-darkblue text-sm mb-5">{title}</p>
      )}
      <div className="space-y-3">
        {layers.map((layer, i) => {
          const style = layerColors[layer.color || "blue"];
          return (
            <div key={i}>
              <div className={cn("rounded-xl border p-4", style.bg, style.border)}>
                <p className="text-xs font-googletexte font-medium text-mediumblue/80 uppercase tracking-wider mb-2">
                  {layer.label}
                </p>
                <div className="flex flex-wrap gap-2">
                  {layer.items.map((item, j) => (
                    <span key={j} className={cn("rounded-full px-3 py-1 text-xs font-googletexte font-medium", style.badge)}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              {i < layers.length - 1 && (
                <div className="flex justify-center py-1">
                  <ArrowDown className="h-4 w-4 text-mediumblue/80" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Highlight Box ─── */
interface HighlightBoxProps {
  title?: string;
  children: ReactNode;
  accent?: "blue" | "orange";
}

export function HighlightBox({ title, children, accent = "blue" }: HighlightBoxProps) {
  const isOrange = accent === "orange";
  return (
    <div className={cn(
      "my-8 rounded-2xl p-6 border",
      isOrange ? "bg-orange/5 border-orange/20" : "bg-regularblue/5 border-regularblue/20"
    )}>
      {title && (
        <p className={cn(
          "font-googletitre font-medium text-base mb-3",
          isOrange ? "text-orange" : "text-regularblue"
        )}>
          {title}
        </p>
      )}
      <div className="text-mediumblue/80 text-sm font-googletexte [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:space-y-1 [&>ul]:pl-4 [&>ul]:list-disc [&>ul_li]:text-sm">
        {children}
      </div>
    </div>
  );
}
