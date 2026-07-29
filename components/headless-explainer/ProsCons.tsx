"use client"

import { useEffect, useRef, useState } from "react"
import type { ProItem, ConItem } from "@/lib/data/headless-explainer"
import { useLocale } from "next-intl"
import type { Locale } from "@/i18n/routing"

interface ProsConsProps {
  pros: ProItem[]
  cons: ConItem[]
}

function ScoreBar({ label, score }: ProItem) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.3 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-inter-tight text-foreground/80">{label}</span>
        <span className="font-mono text-xs text-accent-secondary">{score}</span>
      </div>
      <div className="h-1.5 overflow-hidden bg-dark-gray">
        <div
          className="h-full bg-accent-secondary motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out"
          style={{ width: visible ? `${score}%` : "0%" }}
        />
      </div>
    </div>
  )
}

export default function ProsCons({ pros, cons }: ProsConsProps) {
  const locale = useLocale() as Locale
  const isEn = locale === "en"
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      {/* Avantages */}
      <div className="border-b border-dark-gray p-6 md:border-b-0 md:border-r">
        <h4 className="mb-5 font-mono text-[10px] uppercase tracking-[0.12em] text-accent-secondary">
          {isEn ? "Benefits" : "Avantages"}
        </h4>
        <div className="space-y-4">
          {pros.map((pro) => (
            <ScoreBar key={pro.label} {...pro} />
          ))}
        </div>
      </div>

      {/* Limites */}
      <div className="bg-jet p-6">
        <h4 className="mb-5 font-mono text-[10px] uppercase tracking-[0.12em] text-mid-gray">
          {isEn ? "Limits" : "Limites"}
        </h4>
        <div className="space-y-3">
          {cons.map((con) => (
            <div key={con.label} className="border-l border-dark-gray py-1 pl-4">
              <p className="text-sm font-light tracking-tight text-foreground">{con.label}</p>
              <p className="mt-1 font-inter-tight text-sm leading-relaxed text-mid-gray">{con.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
