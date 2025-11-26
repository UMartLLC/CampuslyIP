"use client"

import * as React from "react"
// Imports the core, unstyled Toggle Group components from Radix UI.
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group"
// Imports the VariantProps type used for defining styling variations.
import { type VariantProps } from "class-variance-authority"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"
// Imports the styling definitions (variants) for individual toggle buttons.
import { toggleVariants } from "@/components/ui/toggle"

// -----------------------------------------------------------------------------
// 1. Toggle Group Context
// -----------------------------------------------------------------------------

// Creates a React Context to share the 'variant' and 'size' styling props
// down to individual ToggleGroupItem components. This ensures all items
// within the group inherit the same visual style unless overridden.
const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "default",
  variant: "default",
})

// -----------------------------------------------------------------------------
// 2. ToggleGroup Root Component
// -----------------------------------------------------------------------------

// The root component that manages the group state (e.g., single or multiple selections).
const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>, // Specifies the underlying Radix element type for the ref.
  // Inherits Radix props and merges styling variant props.
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <ToggleGroupPrimitive.Root
    ref={ref}
    // Base styling: ensures flex layout, centers items, and adds spacing between items.
    className={cn("flex items-center justify-center gap-1", className)}
    {...props}
  >
    {/* Provides the inherited styling props (variant and size) to all children via context. */}
    <ToggleGroupContext.Provider value={{ variant, size }}>
      {children}
    </ToggleGroupContext.Provider>
  </ToggleGroupPrimitive.Root>
))

ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName

// -----------------------------------------------------------------------------
// 3. ToggleGroupItem Component
// -----------------------------------------------------------------------------

// An individual button/item within the ToggleGroup.
const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>, // Specifies the underlying Radix element type for the ref.
  // Inherits Radix props and merges styling variant props (allowing override).
  React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Item> &
    VariantProps<typeof toggleVariants>
>(({ className, children, variant, size, ...props }, ref) => {
  // Accesses the styling props inherited from the parent ToggleGroup.
  const context = React.useContext(ToggleGroupContext)

  return (
    <ToggleGroupPrimitive.Item
      ref={ref}
      className={cn(
        // Applies styling from toggleVariants:
        // Prioritizes the individual item's prop (variant/size) if provided, 
        // otherwise falls back to the context value inherited from the ToggleGroup.
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        className
      )}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  )
})

ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName

// -----------------------------------------------------------------------------
// 4. Exports
// -----------------------------------------------------------------------------

export { ToggleGroup, ToggleGroupItem }