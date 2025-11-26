import * as React from "react"
// Imports the core, unstyled Scroll Area components from Radix UI.
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// 1. ScrollArea Root Component
// -----------------------------------------------------------------------------

// The main container component that wraps the scrollable content.
// It acts as a styled wrapper around the Radix ScrollArea.Root.
const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>, // Specifies the underlying Radix element type for the ref.
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> // Inherits all props from the Radix ScrollArea.
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    // Base styling: ensures content is hidden if it exceeds boundaries, and sets relative positioning.
    className={cn("relative overflow-hidden", className)}
    // Radix requires 'type="always"' or similar, but the default 'hover' or 'scroll' behavior is usually handled by the primitive itself.
    {...props}
  >
    {/* Viewport is the area where the scrollable content lives. */}
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    {/* Renders the custom styled scrollbar. */}
    <ScrollBar />
    {/* Radix component that handles the corner where vertical and horizontal scrollbars meet (if both are present). */}
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
))
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

// -----------------------------------------------------------------------------
// 2. ScrollBar Component (Styled Scrollbar Track and Thumb)
// -----------------------------------------------------------------------------

// The ScrollBar component wraps the Radix ScrollAreaScrollbar and Thumb, providing custom styling.
const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>, // Specifies the underlying Radix element type for the ref.
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation} // Passes the orientation prop to Radix for correct behavior.
    className={cn(
      // Base styling for the scrollbar track: ensures touch support is disabled and smooth color transitions.
      "flex touch-none select-none transition-colors",
      // Conditional styling for Vertical Scrollbar: sets height to full, narrow width (w-2.5), adds transparent border/padding.
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      // Conditional styling for Horizontal Scrollbar: sets height to narrow (h-2.5), stack children vertically, adds transparent border/padding.
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    {/* The ScrollAreaThumb is the draggable handle of the scrollbar. */}
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
))
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

// -----------------------------------------------------------------------------
// 3. Exports
// -----------------------------------------------------------------------------

export { ScrollArea, ScrollBar }
