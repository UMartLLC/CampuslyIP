import * as React from "react"
// Imports the core, unstyled Checkbox components from Radix UI.
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
// Imports the Checkmark icon from lucide-react.
import { Check } from "lucide-react"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// 1. Checkbox Component
// -----------------------------------------------------------------------------

// The main Checkbox component, which serves as a styled wrapper around the Radix primitive.
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>, // Specifies the underlying Radix element type for the ref.
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> // Inherits all props from the Radix Checkbox.
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      // Base styling for the checkbox box:
      // - peer: Marks this element as a "peer" for easy styling of adjacent labels using peer-*.
      // - h-4 w-4 shrink-0: Sets fixed size and prevents shrinking in flex layouts.
      // - rounded-sm border border-primary: Defines shape and primary border color.
      // - ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2: Defines focus ring for accessibility.
      // - disabled:cursor-not-allowed disabled:opacity-50: Styles for the disabled state.
      // - data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground: Styles applied when the checkbox is checked (changing background and checkmark color).
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      // The indicator component only renders when the checkbox is checked.
      className={cn("flex items-center justify-center text-current")}
    >
      {/* The checkmark icon itself. */}
      <Check className="h-4 w-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

// -----------------------------------------------------------------------------
// 2. Export
// -----------------------------------------------------------------------------

export { Checkbox }
