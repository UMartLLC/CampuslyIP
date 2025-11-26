import * as React from "react"
// Imports the core, unstyled Navigation Menu components from Radix UI.
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
// Imports the core function 'cva' for creating dynamic classes.
import { cva } from "class-variance-authority"
// Imports the ChevronDown icon, used as the indicator on menu triggers.
import { ChevronDown } from "lucide-react"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// 1. NavigationMenu Root Component
// -----------------------------------------------------------------------------

// The main container component that manages the state of all menus.
const NavigationMenu = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Root
    ref={ref}
    className={cn(
      // Base styling: ensures high z-index, centers content, allows max width.
      "relative z-10 flex max-w-max flex-1 items-center justify-center",
      className
    )}
    {...props}
  >
    {children}
    {/* The Viewport must be included inside the Root component to render the dropdown content. */}
    <NavigationMenuViewport />
  </NavigationMenuPrimitive.Root>
))
NavigationMenu.displayName = NavigationMenuPrimitive.Root.displayName

// -----------------------------------------------------------------------------
// 2. Navigation Menu List
// -----------------------------------------------------------------------------

// Container component for all individual menu items (NavigationMenuItem). Renders as an <ul> list.
const NavigationMenuList = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.List>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.List
    ref={ref}
    className={cn(
      // Base styling: flex layout, removes list markers, centers items, adds horizontal spacing.
      // 'group' is added to enable styling of child elements via group-* utilities.
      "group flex flex-1 list-none items-center justify-center space-x-1",
      className
    )}
    {...props}
  />
))
NavigationMenuList.displayName = NavigationMenuPrimitive.List.displayName

// -----------------------------------------------------------------------------
// 3. Navigation Menu Item
// -----------------------------------------------------------------------------

// Alias for the Radix Item component, wrapping the Trigger and Content for a single menu.
const NavigationMenuItem = NavigationMenuPrimitive.Item

// -----------------------------------------------------------------------------
// 4. Trigger Style Definition
// -----------------------------------------------------------------------------

// Defines the consistent styling applied to all NavigationMenuTrigger components.
const navigationMenuTriggerStyle = cva(
  "group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=open]:text-accent-foreground data-[state=open]:bg-accent/50 data-[state=open]:hover:bg-accent data-[state=open]:focus:bg-accent"
)

// -----------------------------------------------------------------------------
// 5. Navigation Menu Trigger
// -----------------------------------------------------------------------------

// The clickable element that, when hovered or clicked, opens the menu content.
const NavigationMenuTrigger = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <NavigationMenuPrimitive.Trigger
    ref={ref}
    // Applies the shared trigger styles, re-adds the 'group' class for icon rotation, and merges custom classes.
    className={cn(navigationMenuTriggerStyle(), "group", className)}
    {...props}
  >
    {children}{" "}
    {/* Chevron icon rotates when the data-state=open attribute is present on the parent trigger. */}
    <ChevronDown
      className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180"
      aria-hidden="true"
    />
  </NavigationMenuPrimitive.Trigger>
))
NavigationMenuTrigger.displayName = NavigationMenuPrimitive.Trigger.displayName

// -----------------------------------------------------------------------------
// 6. Navigation Menu Content
// -----------------------------------------------------------------------------

// The dropdown panel containing the actual navigation links or custom content.
const NavigationMenuContent = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Content
    ref={ref}
    className={cn(
      // Base styling: full width positioning.
      "left-0 top-0 w-full",
      // Radix motion data attributes trigger complex fade and slide animations for entrance and exit.
      "data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52",
      // On medium screens and up, content switches to absolute positioning and auto-width.
      "md:absolute md:w-auto ",
      className
    )}
    {...props}
  />
))
NavigationMenuContent.displayName = NavigationMenuPrimitive.Content.displayName

// -----------------------------------------------------------------------------
// 7. Navigation Menu Link
// -----------------------------------------------------------------------------

// Alias for the Radix Link component, primarily used for accessibility/state management of links inside the Content panel.
const NavigationMenuLink = NavigationMenuPrimitive.Link

// -----------------------------------------------------------------------------
// 8. Navigation Menu Viewport
// -----------------------------------------------------------------------------

// The container that clips the Navigation Menu Content and manages its height/width transitions.
const NavigationMenuViewport = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  // Wrapper div centers the viewport horizontally under the trigger.
  <div className={cn("absolute left-0 top-full flex justify-center")}>
    <NavigationMenuPrimitive.Viewport
      className={cn(
        // Base styling: sets transform origin for animation, offsets slightly, fixed height/width based on Radix variables.
        "origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg",
        // Radix data attributes trigger zoom animations for opening and closing.
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90",
        // On medium screens and up, width is controlled by Radix variable instead of full width.
        "md:w-[var(--radix-navigation-menu-viewport-width)]",
        className
      )}
      ref={ref}
      {...props}
    />
  </div>
))
NavigationMenuViewport.displayName =
  NavigationMenuPrimitive.Viewport.displayName

// -----------------------------------------------------------------------------
// 9. Navigation Menu Indicator
// -----------------------------------------------------------------------------

// A small visual indicator (usually a triangle) that highlights the currently open menu item.
const NavigationMenuIndicator = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitive.Indicator>,
  React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitive.Indicator>
>(({ className, ...props }, ref) => (
  <NavigationMenuPrimitive.Indicator
    ref={ref}
    className={cn(
      // Base styling: positioned at the bottom of the trigger, high z-index, hides overflow.
      "top-full z-[1] flex h-1.5 items-end justify-center overflow-hidden",
      // Radix data attributes trigger fade animations for appearance and disappearance.
      "data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:fade-in",
      className
    )}
    {...props}
  >
    {/* The actual triangle/caret shape, created using rotation and rounded corners on a div. */}
    <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
  </NavigationMenuPrimitive.Indicator>
))
NavigationMenuIndicator.displayName =
  NavigationMenuPrimitive.Indicator.displayName

// -----------------------------------------------------------------------------
// 10. Exports
// -----------------------------------------------------------------------------

export {
  navigationMenuTriggerStyle,
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
}
