"use client";

import React from "react";

interface PageLayoutProps {
  titre: string
  sousTitre?: string
  children?: React.ReactNode
  secNo?: string
}

const PageLayout: React.FC<PageLayoutProps> = ({ titre, sousTitre, children, secNo = "№ 01" }) => (
  <div>
    <section className="s" style={{ borderTop: "none" }}>
      <div className="container">
        <div className="sec-head">
          <div className="sec-no">{secNo}</div>
          <h1
            className="ni-serif"
            style={{ fontSize: "clamp(32px, 4vw, 64px)", lineHeight: 1.05, margin: 0 }}
          >
            {titre}
          </h1>
        </div>
        {sousTitre && (
          <p style={{ fontSize: 15, color: "var(--ink-2)", maxWidth: 520, marginBottom: 0 }}>{sousTitre}</p>
        )}
      </div>
    </section>
    <div>
      {children}
    </div>
  </div>
);

export default PageLayout;
