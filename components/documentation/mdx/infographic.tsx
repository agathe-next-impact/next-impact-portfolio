"use client";

import { ReactNode } from "react";
import { ArrowRight, ArrowDown } from "lucide-react";

/* ─── Flow Diagram ─────────────────────────────────────────────────────────── */

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

export function FlowDiagram({ nodes, direction = "horizontal", accent = "blue" }: FlowDiagramProps) {
  if (!nodes || !Array.isArray(nodes)) return null;

  const accentColor = accent === "orange" ? "var(--accent-color)" : "var(--ink)";
  const isHorizontal = direction === "horizontal";
  const Arrow = isHorizontal ? ArrowRight : ArrowDown;

  return (
    <div style={{
      margin: "2rem 0",
      display: "flex",
      alignItems: "center",
      gap: "0.75rem",
      flexWrap: "wrap",
      justifyContent: "center",
      flexDirection: isHorizontal ? undefined : "column",
    }}>
      {nodes.map((node, i) => (
        <div key={i} style={{ display: "contents" }}>
          <div style={{
            border: "1px solid var(--rule)",
            padding: "0.75rem 1rem",
            textAlign: "center",
            minWidth: "7rem",
            background: "var(--paper-2)",
          }}>
            {node.icon && <span style={{ fontSize: "1.25rem", display: "block", marginBottom: "0.25rem" }}>{node.icon}</span>}
            <p style={{
              fontSize: "0.875rem",
              color: accentColor,
              fontFamily: "var(--font-mono)",
              fontWeight: 500,
              letterSpacing: "0.02em",
            }}>
              {node.label}
            </p>
            {node.description && (
              <p style={{ fontSize: "0.75rem", color: "var(--muted-color)", marginTop: "0.25rem", lineHeight: 1.4 }}>
                {node.description}
              </p>
            )}
          </div>
          {i < nodes.length - 1 && (
            <Arrow style={{ width: "1rem", height: "1rem", color: "var(--muted-color)", flexShrink: 0 }} />
          )}
        </div>
      ))}
    </div>
  );
}

/* ─── Architecture Diagram ─────────────────────────────────────────────────── */

interface ArchLayer {
  label: string;
  items: string[];
  color?: "blue" | "orange" | "dark";
}

interface ArchitectureDiagramProps {
  layers: ArchLayer[];
  title?: string;
}

const layerAccent: Record<"blue" | "orange" | "dark", string> = {
  blue: "var(--ink)",
  orange: "var(--accent-color)",
  dark: "var(--ink-2)",
};

export function ArchitectureDiagram({ layers, title }: ArchitectureDiagramProps) {
  if (!layers || !Array.isArray(layers)) return null;

  return (
    <div style={{
      margin: "2rem 0",
      border: "1px solid var(--rule)",
      background: "var(--paper-2)",
      padding: "1.25rem 1.5rem",
    }}>
      {title && (
        <p style={{
          textAlign: "center",
          fontFamily: "var(--font-mono)",
          fontSize: "0.6875rem",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--muted-color)",
          marginBottom: "1rem",
        }}>
          {title}
        </p>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        {layers.map((layer, i) => {
          const accent = layerAccent[layer.color || "blue"];
          return (
            <div key={i}>
              <div style={{
                border: "1px solid var(--rule)",
                borderLeft: `3px solid ${accent}`,
                padding: "0.75rem 1rem",
                background: "var(--paper)",
              }}>
                <p style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.5625rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--muted-color)",
                  marginBottom: "0.5rem",
                }}>
                  {layer.label}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
                  {layer.items.map((item, j) => (
                    <span key={j} style={{
                      border: "1px solid var(--rule)",
                      padding: "0.25rem 0.625rem",
                      fontSize: "0.75rem",
                      color: "var(--ink-2)",
                      background: "var(--paper-2)",
                      fontFamily: "var(--font-mono)",
                    }}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              {i < layers.length - 1 && (
                <div style={{ display: "flex", justifyContent: "center", padding: "0.25rem 0" }}>
                  <ArrowDown style={{ width: "0.875rem", height: "0.875rem", color: "var(--muted-color)" }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Highlight Box ─────────────────────────────────────────────────────────── */

interface HighlightBoxProps {
  title?: string;
  children: ReactNode;
  accent?: "blue" | "orange";
}

export function HighlightBox({ title, children, accent = "blue" }: HighlightBoxProps) {
  const borderColor = accent === "orange" ? "var(--accent-color)" : "var(--ink-2)";

  return (
    <div style={{
      margin: "2rem 0",
      padding: "1.25rem 1.5rem",
      background: "var(--paper-2)",
      borderLeft: `3px solid ${borderColor}`,
    }}>
      {title && (
        <p style={{
          fontFamily: "var(--font-serif)",
          fontSize: "1rem",
          fontWeight: 400,
          color: borderColor,
          marginBottom: "0.75rem",
        }}>
          {title}
        </p>
      )}
      <div style={{
        fontSize: "0.875rem",
        color: "var(--ink-2)",
        lineHeight: 1.65,
      }}>
        {children}
      </div>
    </div>
  );
}
