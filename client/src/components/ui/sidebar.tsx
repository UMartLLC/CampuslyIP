"use client"

import * as React from "react"
// Imports the Slot component from Radix UI for component composition flexibility.
import { Slot } from "@radix-ui/react-slot"
// Imports cva and VariantProps for defining component styling variants.
import { cva, VariantProps } from "class-variance-authority"
// Imports the PanelLeftIcon for the sidebar toggle button.
import { PanelLeftIcon } from "lucide-react"

// Imports custom hooks and utilities.
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
// Imports styled UI components.
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Sheet, // Used for the mobile offcanvas sidebar.
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// -----------------------------------------------------------------------------
// 1. Constants & Context Setup
// -----------------------------------------------------------------------------

// Constants for managing sidebar state via browser cookie.
const SIDEBAR_COOKIE_NAME = "sidebar_state"
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days in seconds.
// CSS variables definitions for various sidebar widths.
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"
const SIDEBAR_KEYBOARD_SHORTCUT = "b" // The key used for the keyboard shortcut (e.g., Cmd+B).

// Defines the shape of the sidebar state and control functions shared via context.
type SidebarContextProps = {
  state: "expanded" | "collapsed" // Current visual state.
  open: boolean // Desktop open/close state.
  setOpen: (open: boolean) => void // Function to set desktop state.
  openMobile: boolean // Mobile sheet open/close state.
  setOpenMobile: (open: boolean) => void // Function to set mobile state.
  isMobile: boolean // Flag indicating if the current view is mobile.
  toggleSidebar: () => void // Function to toggle the appropriate sidebar state.
}

// Creates the React Context object.
const SidebarContext = React.createContext<SidebarContextProps | null>(null)

// Custom hook to access the sidebar context, throwing an error if used outside the provider.
function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

// -----------------------------------------------------------------------------
// 2. Sidebar Provider (State Management)
// -----------------------------------------------------------------------------

// The component that manages all sidebar state, hooks, and context provision.
function SidebarProvider({
  defaultOpen = true,
  open: openProp, // Controlled prop for external state management.
  onOpenChange: setOpenProp, // Controlled callback for external state management.
  className,
  style,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const isMobile = useIsMobile() // Detects mobile view.
  const [openMobile, setOpenMobile] = React.useState(false) // State for mobile Sheet visibility.

  // Internal state management for desktop sidebar.
  const [_open, _setOpen] = React.useState(defaultOpen)
  // Uses openProp if provided (controlled), otherwise uses internal state.
  const open = openProp ?? _open
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      // Calculates the new state.
      const openState = typeof value === "function" ? value(open) : value
      // Updates external state via prop or internal state.
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }

      // Sets a browser cookie to persist the sidebar state across sessions.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [setOpenProp, open]
  )

  // Helper to toggle the sidebar, choosing between mobile (Sheet) or desktop state.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
  }, [isMobile, setOpen, setOpenMobile])

  // Adds a keyboard shortcut (Cmd/Ctrl + B) to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey) // Checks for Command or Control key pressed simultaneously.
      ) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleSidebar])

  // Determines the simple state string for data attributes.
  const state = open ? "expanded" : "collapsed"

  // Memoizes the context value to prevent unnecessary re-renders of consuming components.
  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          // Injects CSS variables for width definitions, crucial for responsive styling.
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            // Base layout: flex container taking at least full viewport height, full width.
            "group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
}

// -----------------------------------------------------------------------------
// 3. Sidebar Component (Container & Rendering Logic)
// -----------------------------------------------------------------------------

// The main sidebar container component, handling desktop rendering (fixed) and mobile rendering (Sheet).
function Sidebar({
  side = "left", // Position of the sidebar.
  variant = "sidebar", // Visual style (standard, floating, inset).
  collapsible = "offcanvas", // Collapse behavior (slide off-screen, collapse to icon, or none).
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  side?: "left" | "right"
  variant?: "sidebar" | "floating" | "inset"
  collapsible?: "offcanvas" | "icon" | "none"
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

  // Rendering for non-collapsible sidebars (static width).
  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          "bg-sidebar text-sidebar-foreground flex h-full w-[var(--sidebar-width)] flex-col",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }

  // Rendering for mobile view (uses Radix Sheet component).
  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          // Overrides Sheet styles to make it look like a sidebar: no padding, hides default close button.
          className="bg-sidebar text-sidebar-foreground w-[var(--sidebar-width)] p-0 [&>button]:hidden"
          style={
            {
              // Uses a slightly wider width for mobile view.
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
        >
          {/* Hides accessibility info visually but makes it available to screen readers. */}
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    )
  }

  // Rendering for desktop view (collapsible logic).
  return (
    <div
      className="group peer text-sidebar-foreground hidden md:block"
      data-state={state} // "expanded" or "collapsed"
      data-collapsible={state === "collapsed" ? collapsible : ""} // Sets collapse style only when collapsed.
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      {/* This div creates the required space in the document flow *before* the fixed sidebar.
        Its width transitions, making content shift when the sidebar expands/collapses.
      */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative w-[var(--sidebar-width)] bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0", // Width is 0 when offcanvas is collapsed.
          "group-data-[side=right]:rotate-180", // Rotation used to flip horizontal movement for right-side sidebar.
          // Calculates the gap size based on variant type when collapsed to icon.
          variant === "floating" || variant === "inset"
            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+var(--spacing-4))]"
            : "group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)]"
        )}
      />
      {/* The actual fixed sidebar container.
      */}
      <div
        data-slot="sidebar-container"
        className={cn(
          // Base position: fixed, full height, high z-index, initial full width.
          "fixed inset-y-0 z-10 hidden h-svh w-[var(--sidebar-width)] transition-[left,right,width] duration-200 ease-linear md:flex",
          // Offcanvas horizontal movement: moves off-screen based on 'side' when collapsed.
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
          // Adjust width and padding based on variant when collapsed to icon.
          variant === "floating" || variant === "inset"
            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+var(--spacing-4)+2px)]"
            : "group-data-[collapsible=icon]:w-[var(--sidebar-width-icon)] group-data-[side=left]:border-r group-data-[side=right]:border-l",
          className
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className="bg-sidebar group-data-[variant=floating]:border-sidebar-border flex h-full w-full flex-col group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:shadow-sm"
        >
          {children}
        </div>
      </div>
    </div>
  )
}

// -----------------------------------------------------------------------------
// 4. Sidebar Trigger (Toggle Button)
// -----------------------------------------------------------------------------

// Component that toggles the sidebar open/close state.
function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-7", className)}
      // Calls the external onClick handler and then the internal toggle function.
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeftIcon />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  )
}

// -----------------------------------------------------------------------------
// 5. Sidebar Rail (Handle for Resizing/Toggling)
// -----------------------------------------------------------------------------

// Component that creates a narrow, sensitive area for clicking/hovering near the edge of the sidebar.
function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar()

  // Note: Tailwind v3.4 doesn't support "in-" selectors. So the rail won't work perfectly.
  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1} // Makes it non-focusable by default, but clickable.
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        // Base styling: absolute position, hidden on small screens, wide interactive area (w-4).
        "hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear sm:flex",
        // Positions the rail relative to the sidebar edge based on 'side'.
        "group-data-[side=left]:-right-4 group-data-[side=right]:left-0",
        // Creates the thin visible line (the 'after' pseudo-element).
        "after:absolute after:inset-y-0 after:left-1/2 after:w-[2px]",
        // Cursor changes based on side and state (resizing behavior).
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        // Offcanvas specific styling to ensure the rail moves with the sliding content.
        "hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props}
    />
  )
}

// -----------------------------------------------------------------------------
// 6. Sidebar Inset (Main Content Area for Inset Variant)
// -----------------------------------------------------------------------------

// The component that wraps the main page content, styled to be inset when the sidebar is floating/inset.
function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "bg-background relative flex w-full flex-1 flex-col",
        // Conditional styling applied only on desktop when the peer sidebar has variant=inset.
        "md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2",
        className
      )}
      {...props}
    />
  )
}

// -----------------------------------------------------------------------------
// 7. Sidebar Sub-Components (Header, Footer, Content, etc.)
// -----------------------------------------------------------------------------

// Input component specifically styled for use within the sidebar.
function SidebarInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      // Light background, fixed height, no shadow, full width.
      className={cn("bg-background h-8 w-full shadow-none", className)}
      {...props}
    />
  )
}

// Component wrapper for the top section of the sidebar.
function SidebarHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
}

// Component wrapper for the bottom section of the sidebar.
function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn("flex flex-col gap-2 p-2", className)}
      {...props}
    />
  )
}

// Styled Separator component for use within the sidebar.
function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      // Uses sidebar-border color and fixed horizontal margins.
      className={cn("bg-sidebar-border mx-2 w-auto", className)}
      {...props}
    />
  )
}

// Wrapper for the primary scrollable content area of the sidebar.
function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        // Base styling: ensures content fills space, allows vertical scrolling.
        "flex min-h-0 flex-1 flex-col gap-2 overflow-auto",
        // Hides overflow when sidebar is collapsed to icon.
        "group-data-[collapsible=icon]:overflow-hidden",
        className
      )}
      {...props}
    />
  )
}

// -----------------------------------------------------------------------------
// 8. Sidebar Group Components
// -----------------------------------------------------------------------------

// Wrapper for grouping menu items and content.
function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col p-2", className)}
      {...props}
    />
  )
}

// Label/Heading for a sidebar group.
function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div"

  return (
    <Comp
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      className={cn(
        // Base styling: muted text, fixed height, small text, medium font.
        "text-sidebar-foreground/70 ring-sidebar-ring flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0",
        // Collapse styling: Shifts up and hides the label when collapsed to icon.
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...props}
    />
  )
}

// Action button placed within the sidebar group header (e.g., "Add New").
function SidebarGroupAction({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      className={cn(
        // Base styling: Absolute position, small square size, hover/focus states, transition.
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the clickable area on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        // Hides the action button when the sidebar is collapsed to icon.
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}

// Content wrapper for items belonging to a group.
function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn("w-full text-sm", className)}
      {...props}
    />
  )
}

// -----------------------------------------------------------------------------
// 9. Sidebar Menu Components
// -----------------------------------------------------------------------------

// Unordered list container for menu items.
function SidebarMenu({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn("flex w-full min-w-0 flex-col gap-1", className)}
      {...props}
    />
  )
}

// List item wrapper for a single menu item.
function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      // 'group/menu-item' marks this li as a group for styling its children on hover/focus.
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  )
}

// Styling variants for the primary clickable menu button.
const sidebarMenuButtonVariants = cva(
  // Base styling: flex layout, rounded corners, padding, transition for hover/focus.
  // Post-variant modifiers:
  // Styling applied when inside a menu item that has an action button.
  "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:w-8! group-data-[collapsible=icon]:h-8! group-data-[collapsible=icon]:p-2! [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        outline:
          // Styles for an outline button variant, using background and shadow/border color tokens.
          "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
      },
      size: {
        default: "h-8 text-sm",
        sm: "h-7 text-xs",
        lg: "h-12 text-sm group-data-[collapsible=icon]:p-0!",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

// The primary clickable button for a menu item.
function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean
  isActive?: boolean
  tooltip?: string | React.ComponentProps<typeof TooltipContent>
} & VariantProps<typeof sidebarMenuButtonVariants>) {
  const Comp = asChild ? Slot : "button"
  const { isMobile, state } = useSidebar()

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      // Applies the calculated variants and custom classes.
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  )

  // If no tooltip is provided, return the button directly.
  if (!tooltip) {
    return button
  }

  // Converts a simple string tooltip to the full TooltipContent prop object.
  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    }
  }

  // Wraps the button in a Tooltip only if a tooltip prop is provided.
  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        // Tooltip is only shown when the sidebar is collapsed and not on mobile.
        hidden={state !== "collapsed" || isMobile}
        {...tooltip}
      />
    </Tooltip>
  )
}

// Small action button placed next to the main menu button (e.g., an 'Edit' icon).
function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean
  showOnHover?: boolean
}) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      className={cn(
        // Base styling: Absolute position, small square size, hover/focus states.
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground peer-hover/menu-button:text-sidebar-accent-foreground absolute top-1.5 right-1 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the clickable area.
        "after:absolute after:-inset-2 md:after:hidden",
        // Vertical positioning based on the size of the peer button.
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        // Hides the action button when the sidebar is collapsed to icon.
        "group-data-[collapsible=icon]:hidden",
        // Hover/focus visibility logic: shows action on hover/focus, hides it on desktop by default.
        showOnHover &&
          "peer-data-[active=true]/menu-button:text-sidebar-accent-foreground group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 md:opacity-0",
        className
      )}
      {...props}
    />
  )
}

// Small badge component to display numerical counts or status next to a menu item.
function SidebarMenuBadge({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        // Base styling: absolute position, small fixed size, rounded corners, small text, select-none.
        "text-sidebar-foreground pointer-events-none absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums select-none",
        // Text color changes on peer hover/active state.
        "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground",
        // Vertical positioning based on the size of the peer button.
        "peer-data-[size=sm]/menu-button:top-1",
        "peer-data-[size=default]/menu-button:top-1.5",
        "peer-data-[size=lg]/menu-button:top-2.5",
        // Hides the badge when the sidebar is collapsed to icon.
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}

// Skeleton loader component for menu items (used during loading states).
function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<"div"> & {
  showIcon?: boolean
}) {
  // Random width calculation for realistic loading appearance.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="size-4 rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="h-4 max-w-[var(--skeleton-width)] flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            // Injects the randomly calculated width via CSS variable.
            "--skeleton-width": width,
          } as React.CSSProperties
        }
      />
    </div>
  )
}

// -----------------------------------------------------------------------------
// 10. Sidebar Menu Sub-Components (Nested Menu)
// -----------------------------------------------------------------------------

// Unordered list container for nested menu items.
function SidebarMenuSub({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        // Base styling: adds left border and internal padding to visually denote nesting.
        "border-sidebar-border mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l px-2.5 py-0.5",
        // Hides the sub-menu when the parent sidebar is collapsed to icon.
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}

// List item wrapper for a single nested menu item.
function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      // 'group/menu-sub-item' marks this li as a group for styling its children on hover/focus.
      className={cn("group/menu-sub-item relative", className)}
      {...props}
    />
  )
}

// Clickable button/link for a nested menu item.
function SidebarMenuSubButton({
  asChild = false,
  size = "md",
  isActive = false,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean
  size?: "sm" | "md"
  isActive?: boolean
}) {
  const Comp = asChild ? Slot : "a"

  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        // Base styling: flex layout, rounded corners, padding, hover/active states.
        "text-sidebar-foreground ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground [&>svg]:text-sidebar-accent-foreground flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 outline outline-2 outline-transparent outline-offset-2 focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
        // Active state styling.
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground",
        // Sizing based on the 'size' prop.
        size === "sm" && "text-xs",
        size === "md" && "text-sm",
        // Hides the sub-button when the parent sidebar is collapsed to icon.
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  )
}

// -----------------------------------------------------------------------------
// 11. Exports
// -----------------------------------------------------------------------------

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}