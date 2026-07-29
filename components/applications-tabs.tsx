"use client"

import { useState } from "react"
import Image from "next/image"

type Application = {
  key: string
  image: string
  title: string
  description: string
  examples: string[]
}

type ApplicationsTabsProps = {
  applications: Application[]
}

export function ApplicationsTabs({ applications }: ApplicationsTabsProps) {
  const [active, setActive] = useState(applications[0]?.key ?? "")
  const current = applications.find((a) => a.key === active) ?? applications[0]

  return (
    <div>
      <div
        style={{
          display: "flex",
          borderTop: "1px solid var(--ink)",
          borderBottom: "1px solid var(--rule)",
          marginBottom: 32,
          overflowX: "auto",
        }}
      >
        {applications.map((app, i) => (
          <button
            key={app.key}
            onClick={() => setActive(app.key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 20px",
              fontFamily: "var(--mono)",
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: active === app.key ? "var(--ink)" : "var(--muted-color)",
              border: "none",
              background: "none",
              cursor: "pointer",
              borderBottom: active === app.key ? "2px solid var(--accent-color)" : "2px solid transparent",
              marginBottom: -1,
              transition: "color 0.15s",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ color: active === app.key ? "var(--accent-color)" : "var(--muted-color)", fontSize: 10 }}>
              0{i + 1}
            </span>
            {app.title}
          </button>
        ))}
      </div>

      {current && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid var(--rule)" }}>
          <div style={{ overflow: "hidden", aspectRatio: "4/3" }}>
            <Image
              src={current.image}
              alt={current.title}
              width={600}
              height={450}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top left", display: "block" }}
            />
          </div>
          <div
            style={{
              borderLeft: "1px solid var(--rule)",
              padding: "32px 28px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div>
              <h3 className="ni-serif" style={{ fontSize: 26, marginBottom: 12 }}>
                {current.title}
              </h3>
              <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.6 }}>{current.description}</p>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 24 }}>
              {current.examples.map((ex) => (
                <span
                  key={ex}
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    border: "1px solid var(--rule-strong)",
                    padding: "3px 10px",
                    color: "var(--ink-2)",
                  }}
                >
                  {ex}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
