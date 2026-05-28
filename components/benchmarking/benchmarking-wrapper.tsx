"use client"

import dynamic from "next/dynamic"

const BenchmarkingTool = dynamic(() => import("./benchmarking-tool"), {
  loading: () => (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
      <div style={{
        width: 32, height: 32,
        border: "2px solid var(--rule)",
        borderTopColor: "var(--ink)",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
    </div>
  ),
  ssr: false,
})

export default BenchmarkingTool
