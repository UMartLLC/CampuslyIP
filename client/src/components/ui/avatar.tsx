"use client"

import * as React from "react"
// Import the core, unstyled Avatar components from Radix UI.
import * as AvatarPrimitive from "@radix-ui/react-avatar"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// 1. Avatar Root Component
// -----------------------------------------------------------------------------

// Avatar is the main container component that wraps the image or fallback.
const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      /* * Styling for a subtle, internal border effect using the 'after' pseudo-element:
       * - after:content-[''] after:block after:absolute after:inset-0: Creates a pseudo-element that covers the entire avatar area.
       * - after:rounded-full after:pointer-events-none: Ensures the pseudo-element is round and non-interactive.
       * - after:border after:border-black/10 dark:after:border-white/10: Applies a very faint border for visual polish in light and dark modes.
       */
      `after:content-[''] after:block after:absolute after:inset-0 after:rounded-full after:pointer-events-none after:border after:border-black/10 dark:after:border-white/10
      
      /* Base styles for the avatar container: */
      relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full`,
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

// -----------------------------------------------------------------------------
// 2. Avatar Image Component
// -----------------------------------------------------------------------------

// AvatarImage displays the actual user image, handling the loading state via Radix.
const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    // Ensures the image maintains its aspect ratio and fills the parent container.
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

// -----------------------------------------------------------------------------
// 3. Avatar Fallback Component
// -----------------------------------------------------------------------------

// AvatarFallback displays content (like initials or a generic icon) when the image fails to load or is not provided.
const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      // Fills the parent container, centers the content, and sets a background color.
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

// -----------------------------------------------------------------------------
// 4. Exports
// -----------------------------------------------------------------------------

export { Avatar, AvatarImage, AvatarFallback }
