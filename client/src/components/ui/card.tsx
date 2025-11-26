import * as React from "react"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// 1. Card Root Component
// -----------------------------------------------------------------------------

// The main Card component serves as the primary container for content.
const Card = React.forwardRef<
  HTMLDivElement, // Specifies the underlying HTML element type (div) for the ref.
  React.HTMLAttributes<HTMLDivElement> // Inherits standard HTML div attributes.
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Base styling for the card container:
      // - shadcn-card: A potential custom selector for base styling or overrides.
      // - rounded-xl: Large rounded corners.
      // - border bg-card border-card-border: Defines border, background color, and border color (using theme tokens).
      // - text-card-foreground: Sets text color to the card's foreground color token.
      // - shadow-sm: Applies a small box shadow.
      "shadcn-card rounded-xl border bg-card border-card-border text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card"

// -----------------------------------------------------------------------------
// 2. Card Header Component
// -----------------------------------------------------------------------------

// Component used for the top section of the card, usually containing the title and description.
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Stacks children vertically (flex-col), adds vertical spacing (space-y-1.5), and padding (p-6).
      "flex flex-col space-y-1.5 p-6", 
      className
    )}
    {...props}
  />
));
CardHeader.displayName = "CardHeader"

// -----------------------------------------------------------------------------
// 3. Card Title Component
// -----------------------------------------------------------------------------

// Component for the primary heading inside the CardHeader.
const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Typography styles: large text (text-2xl), bold font (font-semibold), tight line height and tracking.
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

// -----------------------------------------------------------------------------
// 4. Card Description Component
// -----------------------------------------------------------------------------

// Component for secondary text providing context under the CardTitle.
const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      // Small text size (text-sm) and muted color (text-muted-foreground) for less emphasis.
      "text-sm text-muted-foreground", 
      className
    )}
    {...props}
  />
));
CardDescription.displayName = "CardDescription"

// -----------------------------------------------------------------------------
// 5. Card Content Component
// -----------------------------------------------------------------------------

// Component for the main body content of the card.
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    // Applies padding (p-6) but removes top padding (pt-0) because the header already provides top spacing.
    className={cn("p-6 pt-0", className)} 
    {...props} 
  />
))
CardContent.displayName = "CardContent"

// -----------------------------------------------------------------------------
// 6. Card Footer Component
// -----------------------------------------------------------------------------

// Component for the bottom section of the card, often used for buttons or supplemental info.
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    // Aligns items vertically in the center and applies padding (p-6) while removing top padding (pt-0).
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

// -----------------------------------------------------------------------------
// 7. Exports
// -----------------------------------------------------------------------------

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
}