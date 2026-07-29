import { cn } from "@/lib/utils"

interface TimelineStepProps {
  step: number
  label: string
  description: string
  isLast?: boolean
}

export default function TimelineStep({ step, label, description, isLast = false }: TimelineStepProps) {
  return (
    <div className="relative flex gap-6">
      {/* Connecteur + pastille */}
      <div className="flex flex-col items-center">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-accent-secondary/40 bg-accent-secondary/10 font-mono text-sm text-accent-secondary">
          {step}
        </div>
        {!isLast && <div className="my-2 w-px flex-1 border-l border-dashed border-dark-gray" />}
      </div>

      {/* Contenu */}
      <div className={cn("pb-8", isLast && "pb-0")}>
        <p className="text-lg font-light tracking-tight text-foreground">{label}</p>
        <p className="mt-1 font-inter-tight text-sm leading-relaxed text-mid-gray">{description}</p>
      </div>
    </div>
  )
}
