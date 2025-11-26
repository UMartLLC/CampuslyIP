import * as React from "react"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// 1. Input Component
// -----------------------------------------------------------------------------

// The main Input component, a styled wrapper around a standard HTML <input> element.
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  // Component props include the className, the input type, and all other standard input props.
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type} // Pass the input type (e.g., "text", "email", "password").
        className={cn(
          // Base styling for the input field:
          // - flex h-9 w-full: Sets display, fixed height (h-9 to match buttons), and full width.
          // - rounded-md border border-input bg-background: Defines shape, border, and background using theme tokens.
          // - px-3 py-2 text-base ring-offset-background: Sets padding, text size, and prepares for focus ring offset.
          
          // Styling for file inputs (using the file::-webkit-file-upload-button pseudoelement):
          // - file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground: Makes the file input button invisible/transparent and styles the text within it.
          
          // State styling:
          // - placeholder:text-muted-foreground: Styles the placeholder text.
          // - focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2: Defines the focus ring for accessibility.
          // - disabled:cursor-not-allowed disabled:opacity-50: Styles for the disabled state.
          // - md:text-sm: Sets the text size to be slightly smaller on medium screens and up.
          "flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref} // Forwards the ref to the underlying HTMLInputElement.
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

// -----------------------------------------------------------------------------
// 2. Export
// -----------------------------------------------------------------------------

export { Input }