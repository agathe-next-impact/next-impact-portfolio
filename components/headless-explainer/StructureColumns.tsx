import { cn } from "@/lib/utils"
import type { StructureGroup } from "@/lib/data/headless-explainer"

interface StructureColumnsProps {
  groups: StructureGroup[]
}

const colorMap = {
  teal: "border-teal-400",
  blue: "border-lightblue",
} as const

export default function StructureColumns({ groups }: StructureColumnsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {groups.map((group) => (
        <div key={group.label} className="rounded-xl border border-white/10 bg-darkblue/40 backdrop-blur-sm p-6">
          <h4 className="font-googletitre font-medium text-white text-lg mb-4">{group.label}</h4>
          <ul className="space-y-3">
            {group.items.map((item) => (
              <li
                key={item}
                className={cn(
                  "border-l-2 pl-4 py-1 text-white/70 font-googletexte text-sm",
                  colorMap[group.color]
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
