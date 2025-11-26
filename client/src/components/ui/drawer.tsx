"use client"

import * as React from "react"
// Imports the Drawer primitive library 'vaul', designed for building responsive drawers (modals sliding up from the bottom).
import { Drawer as DrawerPrimitive } from "vaul"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// 1. Drawer Root Component
// -----------------------------------------------------------------------------

// The main root component, wrapping the Vaul primitive and applying default props.
const Drawer = ({
  // Prop that controls whether the background content should scale down when the drawer is open (Vaul default behavior).
  shouldScaleBackground = true, 
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
)
Drawer.displayName = "Drawer"

// -----------------------------------------------------------------------------
// 2. Control Components (Trigger, Portal, Close)
// -----------------------------------------------------------------------------

// The component that triggers the drawer to open (e.g., a button).
const DrawerTrigger = DrawerPrimitive.Trigger

// Component to ensure the drawer content is rendered outside the normal DOM flow (essential for modals).
const DrawerPortal = DrawerPrimitive.Portal

// A button/element that closes the drawer when activated.
const DrawerClose = DrawerPrimitive.Close

// -----------------------------------------------------------------------------
// 3. Drawer Overlay (The Backdrop)
// -----------------------------------------------------------------------------

// The backdrop component that covers the screen when the drawer is open.
const DrawerOverlay = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Overlay
    ref={ref}
    // Fixed position, covers the entire viewport, high z-index, and dark background.
    className={cn("fixed inset-0 z-50 bg-black/80", className)}
    {...props}
  />
))
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName

// -----------------------------------------------------------------------------
// 4. Drawer Content
// -----------------------------------------------------------------------------

// DrawerContent contains the actual sliding panel structure and internal elements.
const DrawerContent = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DrawerPortal>
    <DrawerOverlay />
    <DrawerPrimitive.Content
      ref={ref}
      className={cn(
        // Fixed position at the bottom and across the x-axis, high z-index.
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col",
        // Rounded top corners, border, and theme background color.
        "rounded-t-[10px] border bg-background",
        className
      )}
      {...props}
    >
      {/* The visible grab handle (drag indicator) at the top of the drawer. */}
      <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
))
DrawerContent.displayName = "DrawerContent"

// -----------------------------------------------------------------------------
// 5. Drawer Header
// -----------------------------------------------------------------------------

// Wrapper for the title and description inside the drawer.
const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
    {...props}
  />
)
DrawerHeader.displayName = "DrawerHeader"

// -----------------------------------------------------------------------------
// 6. Drawer Footer
// -----------------------------------------------------------------------------

// Wrapper for action buttons or supplemental information at the bottom of the drawer content.
const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    // Pushes the footer to the bottom (mt-auto) and applies default spacing/padding.
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    {...props}
  />
)
DrawerFooter.displayName = "DrawerFooter"

// -----------------------------------------------------------------------------
// 7. Drawer Title and Description
// -----------------------------------------------------------------------------

// Component for the main heading of the drawer.
const DrawerTitle = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      // Typography styles: large text, bold font, tight line height and tracking.
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
DrawerTitle.displayName = DrawerPrimitive.Title.displayName

// Component for the body text of the drawer.
const DrawerDescription = React.forwardRef<
  React.ElementRef<typeof DrawerPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DrawerDescription.displayName = DrawerPrimitive.Description.displayName

// -----------------------------------------------------------------------------
// 8. Exports
// -----------------------------------------------------------------------------

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
