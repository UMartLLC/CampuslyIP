import * as React from "react"
// Import the core, unstyled AlertDialog components from Radix UI.
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"
// Import utility function for generating button styles based on component library variants.
import { buttonVariants } from "@/components/ui/button"

// -----------------------------------------------------------------------------
// 1. Root Components
// -----------------------------------------------------------------------------

// The root component that manages the open/closed state of the dialog.
const AlertDialog = AlertDialogPrimitive.Root

// The component that triggers the dialog to open (usually a Button).
const AlertDialogTrigger = AlertDialogPrimitive.Trigger

// The portal component ensures the dialog content is rendered outside the normal DOM flow
// (e.g., directly under the body tag) for correct layering and accessibility.
const AlertDialogPortal = AlertDialogPrimitive.Portal

// -----------------------------------------------------------------------------
// 2. AlertDialog Overlay
// -----------------------------------------------------------------------------

// The overlay component, typically a darkened backdrop that covers the entire screen.
const AlertDialogOverlay = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    className={cn(
      // Fixed position, covers the entire viewport (inset-0), high z-index (z-50).
      "fixed inset-0 z-50 bg-black/80",
      // Radix data attributes trigger fade animations for opening and closing.
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
    ref={ref}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

// -----------------------------------------------------------------------------
// 3. AlertDialog Content
// -----------------------------------------------------------------------------

// AlertDialogContent contains the actual modal structure, title, and buttons.
const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  // The content must be rendered inside a Portal and include the Overlay.
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        // Centers the modal using fixed position and transform.
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200",
        // Comprehensive Radix animations combining fade, zoom, and slide effects.
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

// -----------------------------------------------------------------------------
// 4. Header, Footer, Title, Description Components
// -----------------------------------------------------------------------------

// Wrapper for the title and description, applying default alignment and spacing.
const AlertDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      // Stacks content vertically (flex-col) and sets text alignment.
      "flex flex-col space-y-2 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

// Wrapper for action buttons, controlling their layout, especially on small screens.
const AlertDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      // Reverses button order on small screens (Cancel button first) and aligns to the right on large screens.
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

// Component for the main heading of the dialog (uses Radix primitive).
const AlertDialogTitle = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

// Component for the body text of the dialog (uses Radix primitive).
const AlertDialogDescription = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

// -----------------------------------------------------------------------------
// 5. Action Buttons
// -----------------------------------------------------------------------------

// The affirmative action button (e.g., "Continue," "Delete").
const AlertDialogAction = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    // Applies default primary button styles using the imported buttonVariants function.
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

// The dismissive action button (e.g., "Cancel").
const AlertDialogCancel = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      // Applies outline button styles.
      buttonVariants({ variant: "outline" }),
      // Adds margin to the top on small screens to separate it from the action button.
      "mt-2 sm:mt-0",
      className
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

// -----------------------------------------------------------------------------
// 6. Exports
// -----------------------------------------------------------------------------

export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}
