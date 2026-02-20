"use client"

import dynamic from "next/dynamic"

const BenchmarkingTool = dynamic(() => import("./benchmarking-tool"), {
  loading: () => (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-regularblue"></div>
    </div>
  ),
  ssr: false,
})

export default BenchmarkingTool
