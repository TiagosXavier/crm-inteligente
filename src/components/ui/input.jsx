import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * @param {Object} props
 * @param {string} [props.className]
 * @param {string} [props.type]
 * @param {string} [props.id]
 * @param {string} [props.value]
 * @param {string} [props.placeholder]
 * @param {(e: any) => void} [props.onChange]
 * @param {(e: any) => void} [props.onKeyDown]
 */
const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input }
