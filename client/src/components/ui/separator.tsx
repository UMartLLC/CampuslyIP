import * as React from "react"
// Imports the core, unstyled Separator component (used for visual and semantic division) from Radix UI.
import * as SeparatorPrimitive from "@radix-ui/react-separator"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// 1. Separator Component
// -----------------------------------------------------------------------------

// The main Separator component, a styled wrapper around the Radix primitive.
const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>, // Specifies the underlying Radix element type for the ref.
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> // Inherits all props from the Radix Separator.
>(
  (
    { 
      className, 
      orientation = "horizontal", // Determines the axis of the separator (horizontal or vertical).
      decorative = true,          // Indicates if the separator is purely decorative (for accessibility/ARIA).
      ...props 
    },
    ref
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative} // Passed directly to Radix for ARIA attributes (aria-hidden=true if decorative).
      orientation={orientation} // Passed directly to Radix for internal layout and accessibility.
      className={cn(
        // Base styling: ensures the separator does not shrink and sets its color using the border token.
        "shrink-0 bg-border",
        // Conditional sizing: 
        // - If horizontal, sets a thin height (h-[1px]) and full width (w-full).
        // - If vertical, sets full height (h-full) and a thin width (w-[1px]).
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
)
Separator.displayName = SeparatorPrimitive.Root.displayName

// -----------------------------------------------------------------------------
// 2. Export
// -----------------------------------------------------------------------------

export { Separator }