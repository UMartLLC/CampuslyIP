"use client"

// Imports the GripVertical icon from lucide-react (used as a visual indicator on the handle).
import { GripVertical } from "lucide-react"
// Imports the core components from the 'react-resizable-panels' library.
import * as ResizablePrimitive from "react-resizable-panels"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// 1. ResizablePanelGroup Component (Root Container)
// -----------------------------------------------------------------------------

// The main container component that manages the resizing and layout of its child panels.
const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) => (
  <ResizablePrimitive.PanelGroup
    className={cn(
      // Base styling: ensures the group occupies full height/width.
      "flex h-full w-full",
      // Conditional styling: if the group direction is vertical, stacks children in a column.
      "data-[panel-group-direction=vertical]:flex-col",
      className
    )}
    {...props}
  />
)

// -----------------------------------------------------------------------------
// 2. ResizablePanel Component
// -----------------------------------------------------------------------------

// Alias for the core ResizablePanel component. These panels contain the content and are resizable.
const ResizablePanel = ResizablePrimitive.Panel

// -----------------------------------------------------------------------------
// 3. Resizable Handle Component
// -----------------------------------------------------------------------------

// The handle component used to drag and resize the panels.
const ResizableHandle = ({
  withHandle, // Custom prop to optionally render the visible GripVertical icon.
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean
}) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      // Base styling: Renders a thin line (w-px) with background.
      "relative flex w-px items-center justify-center bg-border",
      // Styling for the interactive, invisible target area (the 'after' pseudo-element):
      // - Creates a 4px wide target area around the handle line for easier clicking.
      "after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2",
      // Focus styling: Defines a visible focus ring for accessibility.
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1",
      // Conditional styling for Vertical Orientation:
      // - Changes the line to be horizontal (h-px w-full).
      // - Adjusts the interactive target area (after) to be horizontal as well.
      "data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0",
      // Conditional icon rotation: Rotates the child div (containing GripVertical) by 90 degrees in vertical mode.
      "[&[data-panel-group-direction=vertical]>div]:rotate-90",
      className
    )}
    {...props}
  >
    {/* Renders the visual grip icon if the 'withHandle' prop is true. */}
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
)

// -----------------------------------------------------------------------------
// 4. Exports
// -----------------------------------------------------------------------------

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
