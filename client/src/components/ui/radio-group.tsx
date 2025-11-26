import * as React from "react"
// Imports the core, unstyled Radio Group components from Radix UI.
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
// Imports the Circle icon (used as the radio button indicator).
import { Circle } from "lucide-react"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// 1. RadioGroup Root Component
// -----------------------------------------------------------------------------

// The main container component that manages the state (which item is selected).
const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>, // Specifies the underlying Radix element type for the ref.
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> // Inherits all props from the Radix RadioGroup.
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      // Base styling: ensures children are laid out in a grid with a small gap.
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

// -----------------------------------------------------------------------------
// 2. RadioGroup Item Component (The individual radio button)
// -----------------------------------------------------------------------------

// Component for an individual selectable radio option within the group.
const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        // Base styling for the outer circle:
        // - aspect-square h-4 w-4 rounded-full: Sets fixed size and perfect circular shape.
        // - border border-primary text-primary: Defines border and primary color for the text/indicator.
        // - ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2: Defines focus ring for accessibility.
        // - disabled:cursor-not-allowed disabled:opacity-50: Styles for the disabled state.
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        {/* The indicator (the inner dot) is only visible when the item is checked. */}
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

// -----------------------------------------------------------------------------
// 3. Exports
// -----------------------------------------------------------------------------

export { RadioGroup, RadioGroupItem }