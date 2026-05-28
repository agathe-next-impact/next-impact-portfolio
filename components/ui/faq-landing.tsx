"use client"

import React, { useState } from "react"
import Image from "next/image"

type FaqItem = {
  question: string
  answer: string
}

type FaqLandingProps = {
  title?: string
  image?: string
  imageAlt?: string
  items: FaqItem[]
}

export const FaqLanding: React.FC<FaqLandingProps> = ({
  title = "Foire aux questions",
  image,
  imageAlt,
  items,
}) => {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="s">
      <div className="container">
        <div className="sec-head">
          <div className="sec-no">№ 05</div>
          <h2
            className="ni-serif"
            style={{ fontSize: "clamp(28px, 3.5vw, 52px)", lineHeight: 1.1, margin: 0 }}
          >
            {title}
          </h2>
          <div className="sec-meta">Documentation · Fig. 05</div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: image ? "1fr 2fr" : "1fr",
            gap: 48,
            marginTop: 40,
          }}
        >
          {image && (
            <div style={{ borderTop: "1px solid var(--rule)" }}>
              <Image
                src={image}
                alt={imageAlt || "FAQ"}
                width={300}
                height={400}
                style={{ width: "100%", height: "auto", objectFit: "cover", display: "block" }}
              />
            </div>
          )}

          <div>
            {items.map((item, i) => (
              <div
                key={i}
                style={{ borderTop: "1px solid var(--rule)", cursor: "pointer" }}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    padding: "20px 0",
                    gap: 16,
                  }}
                >
                  <div style={{ display: "flex", gap: 16, alignItems: "baseline" }}>
                    <span
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 10,
                        color: "var(--accent-color)",
                        letterSpacing: "0.08em",
                        flexShrink: 0,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3
                      className="ni-serif"
                      style={{ fontSize: 17, margin: 0, fontStyle: open === i ? "italic" : "normal" }}
                    >
                      {item.question}
                    </h3>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 16,
                      color: "var(--muted-color)",
                      flexShrink: 0,
                      transform: open === i ? "rotate(45deg)" : "none",
                      transition: "transform 0.2s",
                      display: "inline-block",
                    }}
                  >
                    +
                  </span>
                </div>
                {open === i && (
                  <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.7, paddingBottom: 20, margin: 0 }}>
                    {item.answer}
                  </p>
                )}
              </div>
            ))}
            <div style={{ borderTop: "1px solid var(--rule)" }} />
          </div>
        </div>
      </div>
    </section>
  )
}
