import * as React from "react"
// Imports icons for navigation arrows (ChevronLeft, ChevronRight) and the ellipsis (...).
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"
// Imports required Button types and styling utility to ensure pagination links look like buttons.
import { ButtonProps, buttonVariants } from "@/components/ui/button"

// -----------------------------------------------------------------------------
// 1. Pagination Root Component
// -----------------------------------------------------------------------------

// The main container component for the entire pagination structure. Renders as a semantic <nav> element.
const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation" // ARIA role identifies this as a navigation structure.
    aria-label="pagination" // ARIA label provides a descriptive label for screen readers.
    // Base styling: Centers the navigation bar horizontally.
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
)
Pagination.displayName = "Pagination"

// -----------------------------------------------------------------------------
// 2. Pagination Content
// -----------------------------------------------------------------------------

// The container for the list of pagination items. Renders as a semantic <ul> list.
const PaginationContent = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    // Base styling: flex layout, horizontal row, centers items, adds small gap between items.
    className={cn("flex flex-row items-center gap-1", className)}
    {...props}
  />
))
PaginationContent.displayName = "PaginationContent"

// -----------------------------------------------------------------------------
// 3. Pagination Item
// -----------------------------------------------------------------------------

// Wrapper for a single pagination element (e.g., a link, a previous/next button, or an ellipsis). Renders as a semantic <li> list item.
const PaginationItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  // Empty base styling, primarily acts as the list structure wrapper.
  <li ref={ref} className={cn("", className)} {...props} />
))
PaginationItem.displayName = "PaginationItem"

// -----------------------------------------------------------------------------
// 4. Pagination Link Type Definition
// -----------------------------------------------------------------------------

// Defines the props expected by the PaginationLink component.
type PaginationLinkProps = {
  isActive?: boolean // Custom prop to indicate if this link is the current active page.
} & Pick<ButtonProps, "size"> & // Inherits the 'size' prop type from the Button component.
  React.ComponentProps<"a"> // Inherits standard HTML anchor (<a>) tag props.

// -----------------------------------------------------------------------------
// 5. Pagination Link Component
// -----------------------------------------------------------------------------

// Component for a clickable page number link. Renders as an <a> tag styled like a button.
const PaginationLink = ({
  className,
  isActive, // Controls the visual style and ARIA attribute.
  size = "icon", // Defaults to the square 'icon' size for page number links.
  ...props
}: PaginationLinkProps) => (
  <a
    // Sets the ARIA attribute to 'page' if the link is active, indicating the current page.
    aria-current={isActive ? "page" : undefined}
    className={cn(
      // Applies button styling based on the active state: 'outline' variant if active, 'ghost' if not.
      buttonVariants({
        variant: isActive ? "outline" : "ghost",
        size,
      }),
      className
    )}
    {...props}
  />
)
PaginationLink.displayName = "PaginationLink"

// -----------------------------------------------------------------------------
// 6. Pagination Previous Button
// -----------------------------------------------------------------------------

// Component for the "Previous" navigation button.
const PaginationPrevious = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to previous page" // Descriptive label for screen readers.
    size="default" // Overrides the default size to be wider for text and icon.
    // Adds spacing between the icon and text, and adjusts padding.
    className={cn("gap-1 pl-2.5", className)} 
    {...props}
  >
    <ChevronLeft className="h-4 w-4" /> {/* Previous page icon */}
    <span>Previous</span>
  </PaginationLink>
)
PaginationPrevious.displayName = "PaginationPrevious"

// -----------------------------------------------------------------------------
// 7. Pagination Next Button
// -----------------------------------------------------------------------------

// Component for the "Next" navigation button.
const PaginationNext = ({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink
    aria-label="Go to next page" // Descriptive label for screen readers.
    size="default" // Overrides the default size to be wider for text and icon.
    // Adds spacing between the icon and text, and adjusts padding.
    className={cn("gap-1 pr-2.5", className)} 
    {...props}
  >
    <span>Next</span>
    <ChevronRight className="h-4 w-4" /> {/* Next page icon */}
  </PaginationLink>
)
PaginationNext.displayName = "PaginationNext"

// -----------------------------------------------------------------------------
// 8. Pagination Ellipsis
// -----------------------------------------------------------------------------

// Component representing truncated pages (e.g., 1 ... 10). Renders as a <span> tag.
const PaginationEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    aria-hidden // Hides the element from screen readers as it's purely decorative.
    // Base styling: Fixed height/width to match button size, centers content.
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" /> {/* The three-dot icon */}
    <span className="sr-only">More pages</span> {/* Hidden label for screen readers. */}
  </span>
)
PaginationEllipsis.displayName = "PaginationEllipsis"

// -----------------------------------------------------------------------------
// 9. Exports
// -----------------------------------------------------------------------------

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
}