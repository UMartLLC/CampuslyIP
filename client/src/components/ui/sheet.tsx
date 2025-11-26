"use client"

import * as React from "react"
// Imports the core, unstyled Dialog components from Radix UI, which are used as the base for the Sheet (sidebar).
import * as SheetPrimitive from "@radix-ui/react-dialog"
// Imports the core function 'cva' and the type definition 'VariantProps' for creating dynamic classes.
import { cva, type VariantProps } from "class-variance-authority"
// Imports the 'X' (close) icon from lucide-react.
import { X } from "lucide-react"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// 1. Root & Control Components
// -----------------------------------------------------------------------------

// Alias for the root dialog component, which manages the sheet's open/closed state.
const Sheet = SheetPrimitive.Root

// The component that, when interacted with, opens the sheet.
const SheetTrigger = SheetPrimitive.Trigger

// A button/element that closes the sheet when activated.
const SheetClose = SheetPrimitive.Close

// Component to ensure the sheet content is rendered outside the normal DOM flow (essential for modals/overlays).
const SheetPortal = SheetPrimitive.Portal

// -----------------------------------------------------------------------------
// 2. Sheet Overlay (The Backdrop)
// -----------------------------------------------------------------------------

// The backdrop component that covers the screen when the sheet is open.
const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    className={cn(
      // Fixed position, covers the entire viewport (inset-0), high z-index (z-50), dark background.
      "fixed inset-0 z-50 bg-black/80",
      // Radix data attributes trigger simple fade animations for opening and closing.
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

// -----------------------------------------------------------------------------
// 3. Sheet Variants (Styling Definition using cva)
// -----------------------------------------------------------------------------

// Defines the base styles and available side variants for the SheetContent component.
const sheetVariants = cva(
  // Base styling: fixed position, high z-index, spacing, background color, shadow, and transition settings.
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
  {
    variants: {
      // Defines positioning and slide animations based on the 'side' prop.
      side: {
        // Top sheet: positioned at the top, full width, slides in/out from the top.
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        // Bottom sheet: positioned at the bottom, full width, slides in/out from the bottom.
        bottom:
          "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        // Left sheet (sidebar): positioned on the left, full height, 75% width (max-w-sm on larger screens), slides in/out from the left.
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        // Right sheet (sidebar): positioned on the right, full height, 75% width (max-w-sm on larger screens), slides in/out from the right.
        right:
          "inset-y-0 right-0 h-full w-3/4  border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
      },
    },
    defaultVariants: {
      side: "right", // Default position is a right-side sidebar.
    },
  }
)

// -----------------------------------------------------------------------------
// 4. Sheet Content Props Interface
// -----------------------------------------------------------------------------

// Defines the props interface for SheetContent, merging Radix props with the cva variants.
interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

// -----------------------------------------------------------------------------
// 5. Sheet Content Component
// -----------------------------------------------------------------------------

// The main panel containing the sheet's content.
const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    {/* Renders the required Overlay backdrop. */}
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      // Merges the styles generated by cva (based on the 'side' prop) with any custom classes.
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      {/* The built-in close button (the 'X' icon). */}
      <SheetPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <X className="h-4 w-4" /> {/* X icon visible inside the button. */}
        <span className="sr-only">Close</span> {/* Hidden label for screen readers. */}
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

// -----------------------------------------------------------------------------
// 6. Sheet Header and Footer
// -----------------------------------------------------------------------------

// Wrapper for the sheet title and description.
const SheetHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      // Stacks children vertically and sets alignment.
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
SheetHeader.displayName = "SheetHeader"

// Wrapper for action buttons at the bottom of the sheet.
const SheetFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      // Stacks buttons vertically and reverses order on small screens, aligning horizontally to the right on larger screens.
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
SheetFooter.displayName = "SheetFooter"

// -----------------------------------------------------------------------------
// 7. Sheet Title and Description
// -----------------------------------------------------------------------------

// Component for the main heading of the sheet.
const SheetTitle = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold text-foreground", className)}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

// Component for the body text of the sheet.
const SheetDescription = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

// -----------------------------------------------------------------------------
// 8. Exports
// -----------------------------------------------------------------------------

export {
  Sheet,
  SheetPortal,
  SheetOverlay,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}