import * as React from "react"
// Imports the Slot component from Radix UI. Slot allows a component to inherit the DOM element and props of its children.
// This is used here to allow the Button component to render as a different element (e.g., a router Link) while keeping button styling.
import { Slot } from "@radix-ui/react-slot"
// Imports the core function 'cva' and the type definition 'VariantProps' from 
// 'class-variance-authority', used for defining component variants via Tailwind CSS classes.
import { cva, type VariantProps } from "class-variance-authority"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// 1. Button Variants (Styling Definition using cva)
// -----------------------------------------------------------------------------

// Defines the base styles and available variants and sizes for the Button component.
const buttonVariants = cva(
  // Base classes applied to all buttons:
  // - inline-flex items-center justify-center gap-2: Sets up a centered inline flex container with spacing.
  // - whitespace-nowrap: Prevents text from wrapping.
  // - rounded-md text-sm font-medium: Standard button shape and typography.
  // - focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring: Defines focus ring for accessibility.
  // - disabled:pointer-events-none disabled:opacity-50: Styles for disabled state.
  // - [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0: Ensures SVG icons inside buttons are styled correctly and non-interactive.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0" +
  // Custom classes (likely from global CSS) for lift on hover and a smaller press effect on active.
  " hover-elevate active-elevate-2",
  {
    variants: {
      // Defines different color and border styles based on the 'variant' prop.
      variant: {
        // Default (Primary) style: Solid background with explicit border color for consistency.
        default:
          "bg-primary text-primary-foreground border border-primary-border",
        // Destructive style: Red background for actions like deletion, with explicit border color.
        destructive:
          "bg-destructive text-destructive-foreground border border-destructive-border",
        // Outline style: Transparent background, using a custom CSS variable for the border color, with shadow/active styles.
        outline:
          // Shows the background color of whatever card / sidebar / accent background it is inside of.
          // Inherits the current text color.
          " border [border-color:var(--button-outline)]  shadow-xs active:shadow-none ",
        // Secondary style: Alternative solid color, with explicit border color.
        secondary: "border bg-secondary text-secondary-foreground border border-secondary-border ",
        // Ghost style: Transparent background, but maintains a transparent border to prevent layout shift 
        // if the variant is switched to one with a visible border (like 'outline').
        ghost: "border border-transparent",
      },
      // Defines height and padding based on the 'size' prop.
      size: {
        // Heights are set as "min" heights, because sometimes Ai will place large amount of content
        // inside buttons. With a min-height they will look appropriate with small amounts of content,
        // but will expand to fit large amounts of content.
        default: "min-h-9 px-4 py-2",
        sm: "min-h-8 rounded-md px-3 text-xs",
        lg: "min-h-10 rounded-md px-8",
        // Icon size is a square, fixed height/width.
        icon: "h-9 w-9",
      },
    },
    // Sets the default values for the component if props are omitted.
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

// -----------------------------------------------------------------------------
// 2. Button Props Interface
// -----------------------------------------------------------------------------

// Defines the TypeScript interface for the Button component's props.
export interface ButtonProps
  // Inherits standard HTML button attributes (e.g., onClick, disabled, type).
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    // Merges the variant and size types defined by cva.
    VariantProps<typeof buttonVariants> {
  // Optional prop that dictates whether the component should render as its child (using Slot).
  asChild?: boolean
}

// -----------------------------------------------------------------------------
// 3. Button Component
// -----------------------------------------------------------------------------

// The main functional component for the Button.
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Selects the component to render: Slot if asChild is true, otherwise a standard <button> element.
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        // Merges the generated variant/size styles with any custom classes.
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

// -----------------------------------------------------------------------------
// 4. Exports
// -----------------------------------------------------------------------------

// Exports the Button component and the buttonVariants function (e.g., for styling other components).
export { Button, buttonVariants }