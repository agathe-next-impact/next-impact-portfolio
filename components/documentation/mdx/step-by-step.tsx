"use client";

import { ReactNode } from "react";

interface StepByStepProps {
  children: ReactNode;
}

export function StepByStep({ children }: StepByStepProps) {
  return (
    <div style={{ margin: "2rem 0" }}>
      {children}
    </div>
  );
}

interface StepProps {
  number: number;
  title: string;
  children: ReactNode;
}

export function Step({ number, title, children }: StepProps) {
  return (
    <div style={{
      position: "relative",
      paddingLeft: "3rem",
      paddingBottom: "1.75rem",
    }}>
      {/* Vertical rule line */}
      <div style={{
        position: "absolute",
        left: "0.9375rem",
        top: "2rem",
        bottom: 0,
        width: "1px",
        background: "var(--rule)",
      }} />

      {/* Number badge — carré Swiss */}
      <div style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: "1.875rem",
        height: "1.875rem",
        border: "1px solid var(--rule-strong)",
        background: "var(--paper)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-mono)",
        fontSize: "0.6875rem",
        color: "var(--muted-color)",
        letterSpacing: "0.04em",
      }}>
        {number != null ? String(number).padStart(2, "0") : "·"}
      </div>

      {/* Content */}
      <div>
        <h4 style={{
          fontFamily: "var(--font-serif)",
          fontSize: "1rem",
          fontWeight: 400,
          color: "var(--ink)",
          marginBottom: "0.5rem",
          marginTop: "0.25rem",
        }}>
          {title}
        </h4>
        <div style={{ fontSize: "0.875rem", color: "var(--muted-color)", lineHeight: 1.65 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
