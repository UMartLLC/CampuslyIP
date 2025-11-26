import * as React from "react"
// Imports the core, unstyled Slider components (range input) from Radix UI.
import * as SliderPrimitive from "@radix-ui/react-slider"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// 1. Slider Component
// -----------------------------------------------------------------------------

// The main Slider component, a styled wrapper around the Radix primitive.
const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>, // Specifies the underlying Radix element type for the ref.
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> // Inherits all props from the Radix Slider.
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      // Base styling for the root track container:
      // - relative flex w-full: Sets position and layout.
      // - touch-none select-none: Prevents touch-based scrolling/selection conflicts on mobile.
      // - items-center: Vertically centers the track and thumb.
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    {/* The Track component is the static background bar. */}
    <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
      {/* The Range component is the filled part of the track, indicating the current value. */}
      <SliderPrimitive.Range className="absolute h-full bg-primary" />
    </SliderPrimitive.Track>
    {/* The Thumb component is the draggable handle. */}
    <SliderPrimitive.Thumb 
      className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors 
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
                 disabled:pointer-events-none disabled:opacity-50" 
    />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

// -----------------------------------------------------------------------------
// 2. Export
// -----------------------------------------------------------------------------

export { Slider }
