"use client"

import * as React from "react"
// Imports the core, unstyled Dialog components (Modal) from Radix UI.
import * as DialogPrimitive from "@radix-ui/react-dialog"
// Imports the 'X' (close) icon from lucide-react.
import { X } from "lucide-react"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// 1. Root Components
// -----------------------------------------------------------------------------

// The root component that manages the open/closed state of the dialog.
const Dialog = DialogPrimitive.Root

// The component that, when interacted with (e.g., clicked), opens the dialog.
const DialogTrigger = DialogPrimitive.Trigger

// Component to ensure the dialog content is rendered outside the normal DOM flow (e.g., under the body tag).
const DialogPortal = DialogPrimitive.Portal

// A button/element that closes the dialog when activated.
const DialogClose = DialogPrimitive.Close

// -----------------------------------------------------------------------------
// 2. Dialog Overlay (The Backdrop)
// -----------------------------------------------------------------------------

// The overlay component, typically a darkened backdrop that covers the entire screen.
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      // Fixed position, covers the entire viewport (inset-0), high z-index (z-50), dark background.
      "fixed inset-0 z-50 bg-black/80",
      // Radix data attributes trigger simple fade animations for opening and closing.
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

// -----------------------------------------------------------------------------
// 3. Dialog Content (The Modal Box)
// -----------------------------------------------------------------------------

// DialogContent contains the modal structure, title, description, and the close button.
const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  // The content must be rendered inside a Portal and includes the Overlay for the backdrop.
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        // Centering: Fixed position, high z-index, centers using translate-x/y on the screen.
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200",
        // Comprehensive Radix animations combining fade, zoom, and slide effects for a dynamic entrance/exit.
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      {/* The built-in close button (the 'X' icon). */}
      <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        {/* X icon visible inside the button. */}
        <X className="h-4 w-4" />
        {/* sr-only hides the text visually but makes it available to screen readers for accessibility. */}
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

// -----------------------------------------------------------------------------
// 4. Dialog Header
// -----------------------------------------------------------------------------

// Wrapper for the dialog title and description.
const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      // Stacks children vertically (flex-col) and sets alignment.
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

// -----------------------------------------------------------------------------
// 5. Dialog Footer
// -----------------------------------------------------------------------------

// Wrapper for dialog action buttons.
const DialogFooter = ({
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
DialogFooter.displayName = "DialogFooter"

// -----------------------------------------------------------------------------
// 6. Dialog Title and Description
// -----------------------------------------------------------------------------

// Component for the main heading of the dialog (uses Radix primitive).
const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      // Typography styles: large text, bold font, tight line height and tracking.
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

// Component for the body text of the dialog (uses Radix primitive).
const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

// -----------------------------------------------------------------------------
// 7. Exports
// -----------------------------------------------------------------------------

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}