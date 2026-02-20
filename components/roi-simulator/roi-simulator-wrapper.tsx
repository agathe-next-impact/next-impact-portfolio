"use client"

import dynamic from "next/dynamic"

const ROISimulator = dynamic(() => import("./roi-simulator"), {
  loading: () => (
    <div className="flex justify-center items-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-regularblue"></div>
    </div>
  ),
  ssr: false,
})

export default ROISimulator
