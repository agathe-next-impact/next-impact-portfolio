import { cn } from "@/lib/utils"
import type { ProjectItem } from "@/lib/data/headless-explainer"

interface ProjectGridProps {
  items: ProjectItem[]
}

const statusConfig = {
  ideal: { label: "Ideal", className: "bg-green-500/20 text-green-400 border-green-500/30" },
  evaluate: { label: "A evaluer", className: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  avoid: { label: "A eviter", className: "bg-red-500/20 text-red-400 border-red-500/30" },
} as const

export default function ProjectGrid({ items }: ProjectGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((item) => {
        const config = statusConfig[item.status]
        return (
          <div
            key={item.label}
            className="rounded-xl border border-white/10 bg-darkblue/40 backdrop-blur-sm p-5"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h4 className="font-googletitre font-medium text-white text-lg">{item.label}</h4>
              <span
                className={cn(
                  "shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold",
                  config.className
                )}
              >
                {config.label}
              </span>
            </div>
            <p className="text-white/60 font-googletexte text-sm">{item.description}</p>
          </div>
        )
      })}
    </div>
  )
}
