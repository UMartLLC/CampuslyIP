import * as React from "react"
// Import the core, unstyled Accordion components from Radix UI.
import * as AccordionPrimitive from "@radix-ui/react-accordion"
// Import the ChevronDown icon from lucide-react, used as the visual indicator for open/close state.
import { ChevronDown } from "lucide-react"

// Utility function (cn is short for 'classnames') used to conditionally merge Tailwind CSS classes.
// This is typically imported from a project-specific utility file (like '@/lib/utils').
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// 1. Accordion Root Component
// -----------------------------------------------------------------------------

// The root component wrapping all accordion items. It manages the state for the entire component.
const Accordion = AccordionPrimitive.Root

// -----------------------------------------------------------------------------
// 2. Accordion Item Component
// -----------------------------------------------------------------------------

// AccordionItem is a container for one collapsible section (Trigger + Content).
const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    // Adds a bottom border for visual separation between items.
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

// -----------------------------------------------------------------------------
// 3. Accordion Trigger Component (The Header)
// -----------------------------------------------------------------------------

// AccordionTrigger is the visible, clickable header that toggles the content panel.
const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  // Radix requires the Trigger to be wrapped in a Header for correct ARIA accessibility attributes.
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        // Base styles: takes full width, centers items, adds padding, medium font weight.
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline",
        // Conditional styling: When the data-state attribute on the trigger is 'open',
        // it selects the descendant SVG element (the ChevronDown) and rotates it 180 degrees.
        "[&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {/* Renders the user's title/label content */}
      {children}
      {/* The rotating icon used as the open/close indicator */}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

// -----------------------------------------------------------------------------
// 4. Accordion Content Component
// -----------------------------------------------------------------------------

// AccordionContent is the collapsible panel that holds the actual text/content.
const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    // Base styles: Hides overflow and applies CSS animations based on data-state attribute.
    // data-[state=closed] and data-[state=open] hooks trigger custom Tailwind animations.
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    {/* Inner div to apply vertical padding (pb-4 pt-0) to the content itself. 
        This is done inside the Content primitive to ensure the height transition works correctly. */}
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))

AccordionContent.displayName = AccordionPrimitive.Content.displayName

// -----------------------------------------------------------------------------
// 5. Exports
// -----------------------------------------------------------------------------

// Export all component parts for consumption in other files.
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
