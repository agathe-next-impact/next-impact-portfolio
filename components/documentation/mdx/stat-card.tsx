"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  value: string;
  label: string;
  description?: string;
  accent?: "blue" | "orange" | "coral";
}

const accentStyles = {
  blue: { bg: "bg-regularblue/5", border: "border-regularblue/20", value: "text-regularblue" },
  orange: { bg: "bg-orange/5", border: "border-orange/20", value: "text-orange" },
  coral: { bg: "bg-coral/5", border: "border-coral/20", value: "text-coral" },
};

export function StatCard({ value, label, description, accent = "blue" }: StatCardProps) {
  const style = accentStyles[accent];
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
      className={cn(
        "rounded-2xl border p-5 text-center transition-all duration-500",
        style.bg, style.border,
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <p className={cn("text-3xl font-googletitre font-bold mb-1", style.value)}>
        {value}
      </p>
      <p className="text-sm font-googletexte font-medium text-darkblue mb-1">
        {label}
      </p>
      {description && (
        <p className="text-xs font-googletexte text-mediumblue/80">
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
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-8">
      {children}
    </div>
  );
}
