import * as React from "react"
// Imports the Slot component from Radix UI. Slot allows a component to inherit the DOM element and props of its children, 
// enabling flexible composition (e.g., turning a breadcrumb link into a Wouter Link component).
import { Slot } from "@radix-ui/react-slot"
// Imports icons used for the separator and the ellipsis menu.
import { ChevronRight, MoreHorizontal } from "lucide-react"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// 1. Breadcrumb Root Component
// -----------------------------------------------------------------------------

// The main container for the breadcrumb navigation. Renders as a semantic <nav> element.
const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode // Allows custom separation content to be passed in.
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />) // aria-label is required for accessibility.
Breadcrumb.displayName = "Breadcrumb"

// -----------------------------------------------------------------------------
// 2. Breadcrumb List Component
// -----------------------------------------------------------------------------

// The list wrapper for all breadcrumb items. Renders as a semantic <ol> element.
const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      // Styling for the list: flex layout, wraps items, small text, muted color, small gap/spacing.
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
      className
    )}
    {...props}
  />
))
BreadcrumbList.displayName = "BreadcrumbList"

// -----------------------------------------------------------------------------
// 3. Breadcrumb Item Component
// -----------------------------------------------------------------------------

// Wrapper for a single navigation item. Renders as a semantic <li> element.
const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    // Ensures the item (link + optional separator) is displayed inline.
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props}
  />
))
BreadcrumbItem.displayName = "BreadcrumbItem"

// -----------------------------------------------------------------------------
// 4. Breadcrumb Link Component
// -----------------------------------------------------------------------------

// Component for a clickable, non-current item in the breadcrumb trail.
const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean // If true, uses the Radix Slot component to render the child component instead of an <a> tag.
  }
>(({ asChild, className, ...props }, ref) => {
  // Conditionally selects the component type: Slot if asChild is true, otherwise a standard <a> tag.
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      ref={ref}
      // Styling for links: smooth color transition and changes text color on hover.
      className={cn("transition-colors hover:text-foreground", className)}
      {...props}
    />
  )
})
BreadcrumbLink.displayName = "BreadcrumbLink"

// -----------------------------------------------------------------------------
// 5. Breadcrumb Page Component
// -----------------------------------------------------------------------------

// Component for the current, non-clickable page in the breadcrumb trail.
const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    // ARIA roles and attributes indicate this is the current, disabled, non-linkable page.
    role="link"
    aria-disabled="true"
    aria-current="page"
    // Styling: standard text color, normal font weight.
    className={cn("font-normal text-foreground", className)}
    {...props}
  />
))
BreadcrumbPage.displayName = "BreadcrumbPage"

// -----------------------------------------------------------------------------
// 6. Breadcrumb Separator Component
// -----------------------------------------------------------------------------

// Component to visually separate breadcrumb items. Renders as an <li> element for list structure compliance.
const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    // ARIA attributes indicate this element is purely presentational and hidden from assistive technologies.
    role="presentation"
    aria-hidden="true"
    // Styling to constrain the size of the child SVG icon (e.g., ChevronRight).
    className={cn("[&>svg]:w-3.5 [&>svg]:h-3.5", className)}
    {...props}
  >
    {/* Renders custom content or defaults to the ChevronRight icon. */}
    {children ?? <ChevronRight />}
  </li>
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

// -----------------------------------------------------------------------------
// 7. Breadcrumb Ellipsis Component
// -----------------------------------------------------------------------------

// Component used to represent collapsed (hidden) breadcrumb items.
const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    // ARIA attributes indicate this element is purely presentational and hidden from assistive technologies.
    role="presentation"
    aria-hidden="true"
    // Styling to center the icon within a fixed-size container.
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    {/* The MoreHorizontal icon indicates hidden content. */}
    <MoreHorizontal className="h-4 w-4" />
    {/* sr-only hides the text visually but makes it available to screen readers. */}
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis"

// -----------------------------------------------------------------------------
// 8. Exports
// -----------------------------------------------------------------------------

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}