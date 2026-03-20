import { cn } from "@/lib/utils"

interface TimelineStepProps {
  step: number
  label: string
  description: string
  isLast?: boolean
}

export default function TimelineStep({ step, label, description, isLast = false }: TimelineStepProps) {
  return (
    <div className="relative flex gap-4">
      {/* Connector + circle */}
      <div className="flex flex-col items-center">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lightblue/20 border border-lightblue/40 text-lightblue font-googletitre font-medium text-sm">
          {step}
        </div>
        {!isLast && (
          <div className="w-px flex-1 border-l-2 border-dashed border-white/20 my-2" />
        )}
      </div>

      {/* Content */}
      <div className={cn("pb-8", isLast && "pb-0")}>
        <p className="font-googletitre font-medium text-white text-base">{label}</p>
        <p className="text-white/60 font-googletexte text-sm mt-1">{description}</p>
      </div>
    </div>
  )
}
