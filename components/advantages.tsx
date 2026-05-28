"use client"

import { useState } from "react"
import Image from "next/image"

const FEATURES = [
  {
    id: "analytics",
    title: "Admin de WordPress",
    description: "En conservant WordPress comme outil d'administration, votre site web reste facilement administrable.",
    image: "/img/desktop-screen-wordpress.jpg",
    no: "01",
  },
  {
    id: "automation",
    title: "Interface au design moderne",
    description: "Des front-end adaptés aux exigences du web moderne et de vos visiteurs développées sur-mesure avec les dernières technologies.",
    image: "/img/beautiful-ui.jpg",
    no: "02",
  },
  {
    id: "collaboration",
    title: "Fonctionnalités puissantes",
    description: "Des fonctionnalités développées sur vos besoins, ni plus ni moins.",
    image: "/img/functionnalities.jpg",
    no: "03",
  },
]

export default function Advantages() {
  const [selected, setSelected] = useState(FEATURES[0].id)
  const current = FEATURES.find((f) => f.id === selected) ?? FEATURES[0]

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>
      <div>
        {FEATURES.map((feature) => (
          <button
            key={feature.id}
            onClick={() => setSelected(feature.id)}
            style={{
              width: "100%",
              textAlign: "left",
              display: "grid",
              gridTemplateColumns: "40px 1fr 16px",
              gap: 16,
              padding: selected === feature.id ? "20px 0 20px 16px" : "20px 0",
              borderBottom: "1px solid var(--rule)",
              borderLeft: selected === feature.id ? "3px solid var(--accent-color)" : "3px solid transparent",
              background: selected === feature.id ? "var(--paper-2)" : "transparent",
              cursor: "pointer",
              transition: "all 0.15s",
              boxSizing: "border-box",
            }}
          >
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                color: selected === feature.id ? "var(--accent-color)" : "var(--muted-color)",
                letterSpacing: "0.08em",
                paddingTop: 2,
              }}
            >
              {feature.no}
            </span>
            <div>
              <div
                className="ni-serif"
                style={{
                  fontSize: 18,
                  marginBottom: 4,
                  color: "var(--ink)",
                }}
              >
                {feature.title}
              </div>
              <p style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.5, margin: 0 }}>
                {feature.description}
              </p>
            </div>
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 14,
                color: "var(--accent-color)",
                alignSelf: "center",
                opacity: selected === feature.id ? 1 : 0,
              }}
            >
              →
            </span>
          </button>
        ))}
        <div style={{ borderBottom: "1px solid var(--rule)" }} />
      </div>

      <div style={{ position: "sticky", top: 80 }}>
        <div style={{ aspectRatio: "4/3", overflow: "hidden", borderTop: "1px solid var(--rule)" }}>
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
            borderTop: "1px solid var(--rule)",
            padding: "16px 0",
          }}
        >
          <div className="ni-serif" style={{ fontSize: 16, marginBottom: 4 }}>{current.title}</div>
          <p style={{ fontSize: 13, color: "var(--ink-2)", margin: 0 }}>{current.description}</p>
        </div>
      </div>
    </div>
  )
}
