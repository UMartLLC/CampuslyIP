import * as React from "react"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// 1. Textarea Component
// -----------------------------------------------------------------------------

// The main Textarea component, a styled wrapper around a standard HTML <textarea> element.
const Textarea = React.forwardRef<
  HTMLTextAreaElement, // Specifies the underlying HTML element type (textarea).
  React.ComponentProps<"textarea"> // Inherits standard HTML textarea attributes.
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        // Base styling for the textarea field:
        // - flex min-h-[80px] w-full: Sets display, a minimum height of 80px (to ensure multiline), and full width.
        // - rounded-md border border-input bg-background: Defines shape, border, and background using theme tokens.
        // - px-3 py-2 text-base ring-offset-background: Sets padding, text size, and prepares for focus ring offset.
        
        // State styling:
        // - placeholder:text-muted-foreground: Styles the placeholder text.
        // - focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2: Defines the focus ring for accessibility.
        // - disabled:cursor-not-allowed disabled:opacity-50: Styles for the disabled state.
        // - md:text-sm: Sets the text size to be slightly smaller on medium screens and up.
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref} // Forwards the ref to the underlying HTMLTextAreaElement.
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

// -----------------------------------------------------------------------------
// 2. Export
// -----------------------------------------------------------------------------

export { Textarea }