import * as React from "react"
// Imports the core, unstyled Popover components from Radix UI.
import * as PopoverPrimitive from "@radix-ui/react-popover"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// 1. Popover Root Component
// -----------------------------------------------------------------------------

// The root component that manages the open/closed state of the popover.
const Popover = PopoverPrimitive.Root

// -----------------------------------------------------------------------------
// 2. Popover Trigger Component
// -----------------------------------------------------------------------------

// The component that, when interacted with (e.g., clicked), opens the popover.
const PopoverTrigger = PopoverPrimitive.Trigger

// -----------------------------------------------------------------------------
// 3. Popover Content Component
// -----------------------------------------------------------------------------

// The panel containing the content that appears when triggered.
const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      // Alignment of the content relative to the trigger (default is center).
      align={align}
      // Distance (in pixels) the content is offset from the trigger component.
      sideOffset={sideOffset}
      className={cn(
        // Base styling: High z-index, fixed width, rounded border, popover colors, and shadow.
        "z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
        // Radix data attributes trigger comprehensive opening/closing animations:
        // Includes fade, zoom, and slide effects based on which side of the trigger the content appears.
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        // Uses a CSS variable set by Radix to define the transform origin for animations.
        "origin-[--radix-popover-content-transform-origin]",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

// -----------------------------------------------------------------------------
// 4. Exports
// -----------------------------------------------------------------------------

export { Popover, PopoverTrigger, PopoverContent }