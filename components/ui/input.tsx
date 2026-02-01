import * as React from "react"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className="flex h-10 w-full rounded-full border-0 px-3 py-2 text-base focus-visible:outline-0 text-mediumblue disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pointer-events-auto"
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
