import { cn } from "@/lib/utils";

/**
 * BlueprintGrid — quadrillage technique très fin (traits 0.5px) masqué en fondu,
 * ponctué de points qui pulsent doucement. Épure « Serenity ». Sans hook.
 */
export function BlueprintGrid({
  className,
  size = 64,
}: {
  className?: string;
  size?: number;
}) {
  const dots = [
    { x: "18%", y: "22%" },
    { x: "82%", y: "26%" },
    { x: "50%", y: "60%" },
    { x: "22%", y: "78%" },
    { x: "80%", y: "76%" },
  ];

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <svg className="mask-fade-y absolute inset-0 h-full w-full" preserveAspectRatio="none">
        <defs>
          <pattern id="fine-grid" width={size} height={size} patternUnits="userSpaceOnUse">
            <path
              d={`M ${size} 0 L 0 0 0 ${size}`}
              fill="none"
              stroke="hsl(var(--dark-gray))"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#fine-grid)" opacity="0.4" />
        {dots.map((d, i) => (
          <circle
            key={i}
            cx={d.x}
            cy={d.y}
            r="1.5"
            fill="hsl(var(--accent-2))"
            className="animate-pulse-soft"
            style={{ animationDelay: `${i * 0.6}s`, filter: "drop-shadow(0 0 2.5px hsl(var(--accent-2) / 0.7))" }}
          />
        ))}
      </svg>
    </div>
  );
}
