import * as React from "react"
// Imports the core function 'cva' and the type definition 'VariantProps' from 
// 'class-variance-authority', used for defining component variants via Tailwind CSS classes.
import { cva, type VariantProps } from "class-variance-authority"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// 1. Badge Variants (Styling Definition using cva)
// -----------------------------------------------------------------------------

// Defines the base styles and available variants for the Badge component.
const badgeVariants = cva(
  // Base classes applied to all badges:
  // - whitespace-nowrap: Ensures the text inside the badge does not wrap onto multiple lines.
  // - inline-flex items-center: Sets up an inline flex container to center text and icons.
  // - rounded-md border: Standard border and rounding.
  // - px-2.5 py-0.5 text-xs font-semibold: Sets padding, small text size, and bold font weight.
  // - transition-colors: Enables smooth color changes on focus/hover.
  // - focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2: Defines focus ring for accessibility.
  // - hover-elevate: A custom class (likely defined in global CSS) to provide a lift effect on hover.
  "whitespace-nowrap inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2" +
  " hover-elevate " ,
  {
    // Defines different visual styles based on the 'variant' prop.
    variants: {
      variant: {
        // Default style: Primary background color with foreground text, and a small shadow.
        default:
          "border-transparent bg-primary text-primary-foreground shadow-xs",
        // Secondary style: Secondary background color with foreground text.
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        // Destructive style: Typically red/error color scheme with foreground text and a small shadow.
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-xs",
        // Outline style: Only border visible, using a custom CSS variable for the border color.
        outline: " border [border-color:var(--badge-outline)] shadow-xs",
      },
    },
    // Sets the default variant to be used if the 'variant' prop is not specified.
    defaultVariants: {
      variant: "default",
    },
  },
)

// -----------------------------------------------------------------------------
// 2. Badge Props Interface
// -----------------------------------------------------------------------------

// Defines the TypeScript interface for the Badge component's props.
export interface BadgeProps
  // Inherits standard HTML div attributes (e.g., onClick, id, style).
  extends React.HTMLAttributes<HTMLDivElement>,
    // Merges the variant types defined by cva (e.g., variant: 'default' | 'secondary' | 'outline').
    VariantProps<typeof badgeVariants> {}

// -----------------------------------------------------------------------------
// 3. Badge Component
// -----------------------------------------------------------------------------

// The main functional component for the Badge.
function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    // Renders a div element.
    <div 
      // Merges the base and variant styles (from badgeVariants) with any custom className provided by the user.
      className={cn(badgeVariants({ variant }), className)} 
      {...props} 
    />
  );
}

// -----------------------------------------------------------------------------
// 4. Exports
// -----------------------------------------------------------------------------

// Exports the Badge component and the badgeVariants function for external use (e.g., styling other components).
export { Badge, badgeVariants }