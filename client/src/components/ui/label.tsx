import * as React from "react"
// Imports the core, unstyled Label component from Radix UI.
import * as LabelPrimitive from "@radix-ui/react-label"
// Imports the core function 'cva' and the type definition 'VariantProps' from 
// 'class-variance-authority', used for defining component variants via Tailwind CSS classes.
import { cva, type VariantProps } from "class-variance-authority"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// 1. Label Variants (Styling Definition using cva)
// -----------------------------------------------------------------------------

// Defines the base styles for the Label component.
const labelVariants = cva(
  // Base styling for the label text: small text size, medium font weight, and standard line height.
  // Peer styling: Targets the label when its associated input field (the "peer") is disabled.
  // - peer-disabled:cursor-not-allowed: Changes the mouse cursor to indicate the label/field is inactive.
  // - peer-disabled:opacity-70: Reduces the opacity of the label when the peer input is disabled.
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

// -----------------------------------------------------------------------------
// 2. Label Component
// -----------------------------------------------------------------------------

// The main Label component, a styled wrapper around the Radix primitive.
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>, // Specifies the underlying Radix element type for the ref.
  // Inherits all props from Radix Label and merges the type for the variant props.
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    // Merges the base styles (from labelVariants) with any custom className provided by the user.
    className={cn(labelVariants(), className)}
    {...props}
  />
))
Label.displayName = LabelPrimitive.Root.displayName

// -----------------------------------------------------------------------------
// 3. Export
// -----------------------------------------------------------------------------

export { Label }
