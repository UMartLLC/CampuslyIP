import { cn } from "@/lib/utils"

// Utility function (cn) for conditionally merging Tailwind CSS classes.

// -----------------------------------------------------------------------------
// 1. Skeleton Component
// -----------------------------------------------------------------------------

// The Skeleton component provides a placeholder loading state, typically a gray box that pulses.
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) { // Inherits standard HTML div attributes.
  return (
    <div
      // Base styling:
      // - animate-pulse: Applies a subtle CSS animation that makes the element pulse or fade slowly, indicating loading.
      // - rounded-md bg-muted: Defines the shape and sets the background color to a muted theme token (usually light gray).
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}

// -----------------------------------------------------------------------------
// 2. Export
// -----------------------------------------------------------------------------

export { Skeleton }