"use client"

import * as React from "react"
// Imports the core, unstyled Tooltip components from Radix UI.
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// 1. Tooltip Provider
// -----------------------------------------------------------------------------

// The required root component that provides context and manages global behavior (e.g., delay).
const TooltipProvider = TooltipPrimitive.Provider

// -----------------------------------------------------------------------------
// 2. Tooltip Root Component
// -----------------------------------------------------------------------------

// The main component that manages the open/closed state of the tooltip.
const Tooltip = TooltipPrimitive.Root

// -----------------------------------------------------------------------------
// 3. Tooltip Trigger
// -----------------------------------------------------------------------------

// The component that, when hovered or focused, causes the tooltip to open.
const TooltipTrigger = TooltipPrimitive.Trigger

// -----------------------------------------------------------------------------
// 4. Tooltip Content
// -----------------------------------------------------------------------------

// The panel containing the text/content that appears.
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>, // Specifies the underlying Radix element type for the ref.
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> // Inherits all props from the Radix Content.
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    // Distance (in pixels) the content is offset from the trigger component.
    sideOffset={sideOffset}
    className={cn(
      // Base styling: High z-index, rounded border, popover colors, padding, small text size, and shadow.
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
      // Radix animation classes: Defines fade and zoom effects for opening.
      "animate-in fade-in-0 zoom-in-95",
      // Defines reverse animations for closing.
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
      // Defines slide animations based on which side the tooltip appears.
      "data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      // Uses a CSS variable set by Radix to define the transform origin for animations.
      "origin-[--radix-tooltip-content-transform-origin]",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

// -----------------------------------------------------------------------------
// 5. Exports
// -----------------------------------------------------------------------------

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }