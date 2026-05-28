import React from 'react'
import Image from 'next/image'

interface CardProps {
  imageUrl: string
  title: string
  text: string
}

const LandingCard: React.FC<CardProps> = ({ imageUrl, title, text }) => {
  return (
    <div
      style={{
        borderTop: "1px solid var(--rule)",
        paddingTop: 24,
        paddingBottom: 24,
      }}
    >
      <div style={{ overflow: "hidden", marginBottom: 16, aspectRatio: "16/9" }}>
        <Image
          src={imageUrl}
          alt={title}
          width={480}
          height={270}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
        />
      </div>
      <h3 className="ni-serif" style={{ fontSize: 18, marginBottom: 8, margin: "0 0 8px" }}>
        {title}
      </h3>
      <p style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.6, margin: 0 }}>
        {text}
      </p>
    </div>
  )
}

export default LandingCard
