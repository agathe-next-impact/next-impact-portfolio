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
        <span className="text-white/80 font-googletexte">{label}</span>
        <span className="text-lightblue font-googletitre font-medium">{score}</span>
      </div>
      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-lightblue to-regularblue motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out"
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Pros */}
      <div className="rounded-xl border border-white/10 bg-darkblue/40 backdrop-blur-sm p-6">
        <h4 className="font-googletitre font-medium text-green-400 text-base mb-5">
          {isEn ? "Benefits" : "Avantages"}
        </h4>
        <div className="space-y-4">
          {pros.map((pro) => (
            <ScoreBar key={pro.label} {...pro} />
          ))}
        </div>
      </div>

      {/* Cons */}
      <div className="rounded-xl border border-white/10 bg-red-500/5 backdrop-blur-sm p-6">
        <h4 className="font-googletitre font-medium text-red-400 text-base mb-5">
          {isEn ? "Limits" : "Limites"}
        </h4>
        <div className="space-y-4">
          {cons.map((con) => (
            <div key={con.label} className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
              <p className="font-googletitre font-medium text-white text-sm">{con.label}</p>
              <p className="text-white/60 font-googletexte text-sm mt-1">{con.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
