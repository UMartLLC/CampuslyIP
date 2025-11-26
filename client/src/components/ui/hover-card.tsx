"use client"

import * as React from "react"
// Imports the core, unstyled Hover Card components from Radix UI.
import * as HoverCardPrimitive from "@radix-ui/react-hover-card"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// 1. HoverCard Root Component
// -----------------------------------------------------------------------------

// The root component that manages the open/closed state of the hover card.
const HoverCard = HoverCardPrimitive.Root

// -----------------------------------------------------------------------------
// 2. HoverCard Trigger Component
// -----------------------------------------------------------------------------

// The component that, when hovered over, causes the Hover Card to open.
const HoverCardTrigger = HoverCardPrimitive.Trigger

// -----------------------------------------------------------------------------
// 3. HoverCard Content Component
// -----------------------------------------------------------------------------

// The panel containing the content that appears upon hovering.
const HoverCardContent = React.forwardRef<
  React.ElementRef<typeof HoverCardPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof HoverCardPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPrimitive.Content
    ref={ref}
    // Alignment of the content relative to the trigger (default is center).
    align={align}
    // Distance (in pixels) the content is offset from the trigger component.
    sideOffset={sideOffset}
    className={cn(
      // Base styling: High z-index, fixed width, rounded border, popover colors, and shadow.
      "z-50 w-64 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none",
      // Radix data attributes trigger comprehensive opening/closing animations:
      // Includes fade, zoom, and slide effects based on which side of the trigger the content appears.
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      // Uses a CSS variable set by Radix to define the transform origin for animations.
      "origin-[--radix-hover-card-content-transform-origin]",
      className
    )}
    {...props}
  />
))
HoverCardContent.displayName = HoverCardPrimitive.Content.displayName

// -----------------------------------------------------------------------------
// 4. Exports
// -----------------------------------------------------------------------------

export { HoverCard, HoverCardTrigger, HoverCardContent }