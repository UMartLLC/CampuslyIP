import * as React from "react"
// Imports the core, unstyled Toast components (notifications) from Radix UI.
import * as ToastPrimitives from "@radix-ui/react-toast"
// Imports the core function 'cva' and the type definition 'VariantProps' for creating dynamic classes.
import { cva, type VariantProps } from "class-variance-authority"
// Imports the 'X' (close) icon from lucide-react.
import { X } from "lucide-react"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// 1. Toast Provider and Viewport
// -----------------------------------------------------------------------------

// The required root component that manages toast state and accessibility.
const ToastProvider = ToastPrimitives.Provider

// The ToastViewport defines the area where all toasts are displayed (usually a corner of the screen).
const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      // Base styling: fixed position, high z-index, takes full width, max height, column layout.
      "fixed top-0 z-[100] flex max-h-screen w-full",
      // Mobile positioning: stacks vertically from the bottom (flex-col-reverse ensures new toasts appear on top).
      "flex-col-reverse p-4",
      // Desktop positioning: fixed to the bottom-right, stacks vertically from the bottom (flex-col), maximum width limit.
      "sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

// -----------------------------------------------------------------------------
// 2. Toast Variants (Styling Definition using cva)
// -----------------------------------------------------------------------------

// Defines the base styles and available variants for the individual Toast component.
const toastVariants = cva(
  // Base styling: ensures the toast is interactive, relative position, flex layout, rounded border, and shadow.
   // Radix swipe animation classes: Uses CSS variables set by Radix for tracking swipe movement and applying translation.
    // data-[swipe=cancel]:translate-x-0: Resets position if swipe is canceled.
    // data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]: Translates to the final swipe-off position.
    // data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none: Tracks movement without smooth transition.
    // data-[state=open]:animate-in data-[state=closed]:animate-out: General animation hooks.
    // data-[state=closed]:slide-out-to-right-full: Slides out to the right when closed.
    // data-[state=open]:slide-in-from-top-full: Slides in from the top on mobile.
    // data-[state=open]:sm:slide-in-from-bottom-full: Slides in from the bottom on desktop (sm).
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        // Default style: Standard background, border, and text colors.
        default: "border bg-background text-foreground",
        // Destructive style: Red-focused colors for errors/alerts, adding the '.destructive' class for grouped styling of children.
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// -----------------------------------------------------------------------------
// 3. Toast Component (The Notification Box)
// -----------------------------------------------------------------------------

// The individual Toast component, a styled wrapper around the Radix primitive.
const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      // Merges the generated variant styles with any custom classes.
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

// -----------------------------------------------------------------------------
// 4. Toast Action
// -----------------------------------------------------------------------------

// A button component placed inside the toast for user interaction (e.g., "Undo").
const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      // Base styling: inline flex, fixed height, rounded border, secondary color on hover/focus.
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      // Group styling: Overrides colors specifically when the parent toast is marked with the '.destructive' class.
      "group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

// -----------------------------------------------------------------------------
// 5. Toast Close Button
// -----------------------------------------------------------------------------

// The small 'X' button used to manually dismiss the toast.
const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      // Base styling: absolute position, small size, translucent color, opacity transition.
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 transition-opacity",
      // State styling: Hides by default (opacity: 0), appears on focus or when the parent group is hovered.
      "opacity-0 hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100",
      // Group styling: Overrides colors for the destructive variant.
      "group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      className
    )}
    toast-close="" // Custom data attribute for potential external styling/selection.
    {...props}
  >
    <X className="h-4 w-4" /> {/* The X icon visible inside the button. */}
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

// -----------------------------------------------------------------------------
// 6. Toast Title and Description
// -----------------------------------------------------------------------------

// Component for the main heading of the toast.
const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

// Component for the secondary body text of the toast.
const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

// -----------------------------------------------------------------------------
// 7. Exports
// -----------------------------------------------------------------------------

// Type aliases for easier external use.
type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>
type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
