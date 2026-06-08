import { cn } from "@/lib/utils"
import type { StructureGroup } from "@/lib/data/headless-explainer"

interface StructureColumnsProps {
  groups: StructureGroup[]
}

// Distinction des deux groupes par l'intensité de l'accent (plein vs atténué).
const colorMap = {
  teal: "border-accent-secondary/40",
  blue: "border-accent-secondary",
} as const

export default function StructureColumns({ groups }: StructureColumnsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      {groups.map((group, i) => (
        <div
          key={group.label}
          className={cn(
            "border-b border-dark-gray p-6",
            i < groups.length - 1 && "md:border-b-0 md:border-r",
          )}
        >
          <h4 className="mb-4 text-lg font-light tracking-tight text-foreground">{group.label}</h4>
          <ul className="space-y-3">
            {group.items.map((item) => (
              <li
                key={item}
                className={cn(
                  "border-l-2 py-1 pl-4 font-inter-tight text-sm leading-relaxed text-mid-gray",
                  colorMap[group.color],
                )}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
