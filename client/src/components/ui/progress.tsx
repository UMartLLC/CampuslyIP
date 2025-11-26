"use client"

import * as React from "react"
// Imports the core, unstyled Progress components from Radix UI.
import * as ProgressPrimitive from "@radix-ui/react-progress"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// 1. Progress Component
// -----------------------------------------------------------------------------

// The main Progress component, a styled wrapper around the Radix primitive.
const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>, // Specifies the underlying Radix element type for the ref.
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> // Inherits all props from the Radix Progress component.
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    // Sets the current value, which is used internally by Radix for accessibility (aria-valuenow).
    value={value}
    className={cn(
      // Base styling for the track (the background bar):
      // - relative h-4 w-full overflow-hidden: Sets position, fixed height, full width, and hides content that extends beyond the track.
      // - rounded-full bg-secondary: Defines rounded shape and background color (secondary theme token).
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      // Styling for the indicator (the filled portion of the bar).
      className="h-full w-full flex-1 bg-primary transition-all"
      // Key styling for animation:
      // Uses the 'value' prop to calculate a negative X-translation. 
      // Example: If value is 50, it translates left by 50% (100 - 50), which makes the right half visible.
      // If value is 100, it translates left by 0%, making the whole bar visible.
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

// -----------------------------------------------------------------------------
// 2. Export
// -----------------------------------------------------------------------------

export { Progress }