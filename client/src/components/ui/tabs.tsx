import * as React from "react"
// Imports the core, unstyled Tabs components from Radix UI.
import * as TabsPrimitive from "@radix-ui/react-tabs"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// 1. Tabs Root Component
// -----------------------------------------------------------------------------

// The root component that manages the state (which tab is active) for the entire tab structure.
const Tabs = TabsPrimitive.Root

// -----------------------------------------------------------------------------
// 2. Tabs List Component
// -----------------------------------------------------------------------------

// Container for the list of clickable tab triggers. Renders the bar surrounding the triggers.
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>, // Specifies the underlying Radix element type for the ref.
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> // Inherits all props from the Radix TabsList.
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      // Base styling: inline flex layout, fixed height, centers items.
      "inline-flex h-10 items-center justify-center",
      // Styling for the bar/track: sets background to muted color and text color to muted foreground.
      "rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

// -----------------------------------------------------------------------------
// 3. Tabs Trigger Component (The Tab Button)
// -----------------------------------------------------------------------------

// The individual clickable tab button that selects the corresponding content panel.
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      // Base styling: inline flex, prevents text wrapping, rounded corners, padding, small text size, medium font.
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all",
      // Focus/Accessibility styling: defines focus ring and styles for the disabled state.
      "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      // Active state styling: When data-state=active, changes background/text color and applies a shadow, making it pop out from the list.
      "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

// -----------------------------------------------------------------------------
// 4. Tabs Content Component (The Panel)
// -----------------------------------------------------------------------------

// The panel that displays the content corresponding to the currently active tab trigger.
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      // Base styling: adds top margin for separation from the trigger list.
      "mt-2",
      // Focus/Accessibility styling: defines focus ring when content is focused.
      "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

// -----------------------------------------------------------------------------
// 5. Exports
// -----------------------------------------------------------------------------

export { Tabs, TabsList, TabsTrigger, TabsContent }