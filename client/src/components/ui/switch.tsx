import * as React from "react"
// Imports the core, unstyled Switch components (toggle control) from Radix UI.
import * as SwitchPrimitives from "@radix-ui/react-switch"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// 1. Switch Component
// -----------------------------------------------------------------------------

// The main Switch component, a styled wrapper around the Radix primitive.
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>, // Specifies the underlying Radix element type for the ref.
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> // Inherits all props from the Radix Switch.
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      // Base styling for the track (the background bar):
      // - peer: Marks this element as a "peer" for styling adjacent elements (like labels).
      // - inline-flex h-6 w-11 shrink-0 cursor-pointer items-center: Sets layout, size (h-6 w-11), shape, and cursor.
      // - border-2 border-transparent transition-colors: Defines border and smooth color transition.
      // - focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background: Defines focus ring for accessibility.
      // - disabled:cursor-not-allowed disabled:opacity-50: Styles for the disabled state.
      // - data-[state=checked]:bg-primary data-[state=unchecked]:bg-input: Sets background color based on the checked state (primary when checked, input color when unchecked).
      "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      // The thumb is the draggable circle/handle inside the track.
      className={cn(
        // Base styling: ensures the handle is non-interactive, block display, fixed size (h-5 w-5), round shape, background, and shadow.
        "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform",
        // Animation: Controls the horizontal movement (translation) of the thumb based on the checked state.
        "data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
      )}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

// -----------------------------------------------------------------------------
// 2. Export
// -----------------------------------------------------------------------------

export { Switch }