import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full border border-lightblue/20 bg-white px-3 py-2 text-base placeholder:text-lightblue focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pointer-events-auto",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
