import * as React from "react"
// Imports the core, unstyled Toggle component (a two-state button) from Radix UI.
import * as TogglePrimitive from "@radix-ui/react-toggle"
// Imports the core function 'cva' and the type definition 'VariantProps' for creating dynamic classes.
import { cva, type VariantProps } from "class-variance-authority"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// 1. Toggle Variants (Styling Definition using cva)
// -----------------------------------------------------------------------------

// Defines the base styles and available variants and sizes for the Toggle component.
const toggleVariants = cva(
  // Base classes applied to all toggle buttons:
  // - inline-flex items-center justify-center: Sets up an inline flex container to center content.
  // - rounded-md text-sm font-medium: Standard button shape and typography.
  // - ring-offset-background transition-colors: Prepares for focus ring offset and smooth color changes.
  // - hover:bg-muted hover:text-muted-foreground: Defines hover state styling.
  // - focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2: Defines focus ring for accessibility.
  // - disabled:pointer-events-none disabled:opacity-50: Styles for the disabled state.
  // - data-[state=on]:bg-accent data-[state=on]:text-accent-foreground: Styles applied when the toggle state is 'on' (active/pressed).
  // - [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0: Ensures nested SVG icons are styled correctly.
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 gap-2",
  {
    variants: {
      // Defines color and background styles based on the 'variant' prop.
      variant: {
        // Default style: Transparent background.
        default: "bg-transparent",
        // Outline style: Visible border, transparent background, with hover coloring.
        outline:
          "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      // Defines height and padding based on the 'size' prop.
      size: {
        default: "h-10 px-3 min-w-10",
        sm: "h-9 px-2.5 min-w-9",
        lg: "h-11 px-5 min-w-11",
      },
    },
    // Sets the default values for the component if props are omitted.
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// -----------------------------------------------------------------------------
// 2. Toggle Component
// -----------------------------------------------------------------------------

// The main Toggle component, a styled wrapper around the Radix primitive.
const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>, // Specifies the underlying Radix element type for the ref.
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants> // Inherits Radix props and merges styling variant props.
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    // Merges the generated variant/size styles with any custom classes.
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

// -----------------------------------------------------------------------------
// 3. Exports
// -----------------------------------------------------------------------------

// Exports the Toggle component and the toggleVariants function (e.g., for use in ToggleGroupItem).
export { Toggle, toggleVariants }