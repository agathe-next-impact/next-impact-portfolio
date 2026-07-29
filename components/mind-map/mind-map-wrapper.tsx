"use client"

import dynamic from "next/dynamic"

const MindMap = dynamic(() => import("@/components/mind-map/mind-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[calc(100vh-100px)] rounded-3xl bg-darkblue/60 backdrop-blur-md border border-lightblue/10 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-lightblue/20 border-t-orange rounded-full animate-spin" />
        <p className="text-sm text-white/40 font-googletexte">Chargement de la mind map…</p>
      </div>
    </div>
  ),
})

export default function MindMapWrapper() {
  return <MindMap />
}
