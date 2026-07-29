"use client";

import { useEffect, useRef, useState } from "react";

interface StatCardProps {
  value: string;
  label: string;
  description?: string;
  accent?: "blue" | "orange" | "coral";
}

const accentColor: Record<"blue" | "orange" | "coral", string> = {
  blue: "var(--ink)",
  orange: "var(--accent-color)",
  coral: "var(--accent-color)",
};

export function StatCard({ value, label, description, accent = "blue" }: StatCardProps) {
  const color = accentColor[accent];
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        borderTop: `2px solid ${color}`,
        padding: "1.25rem",
        textAlign: "center",
        background: "var(--paper)",
        border: "1px solid var(--rule)",
        borderTopWidth: "2px",
        borderTopColor: color,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(1rem)",
        transition: "opacity 0.4s, transform 0.4s",
      }}
    >
      <p style={{
        fontFamily: "var(--font-serif)",
        fontSize: "2.25rem",
        fontWeight: 400,
        color,
        lineHeight: 1,
        marginBottom: "0.375rem",
      }}>
        {value}
      </p>
      <p style={{ fontSize: "0.875rem", color: "var(--ink)", fontWeight: 500, marginBottom: "0.25rem" }}>
        {label}
      </p>
      {description && (
        <p style={{ fontSize: "0.75rem", color: "var(--muted-color)", lineHeight: 1.5 }}>
          {description}
        </p>
      )}
    </div>
  );
}

interface StatGridProps {
  children: React.ReactNode;
}

export function StatGrid({ children }: StatGridProps) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))",
      gap: "1px",
      background: "var(--rule)",
      margin: "2rem 0",
    }}>
      {children}
    </div>
  );
}
