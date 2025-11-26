"use client"

import * as React from "react"
// Imports the core, unstyled Select components (Dropdown) from Radix UI.
import * as SelectPrimitive from "@radix-ui/react-select"
// Imports icons used for checked state and scroll arrows.
import { Check, ChevronDown, ChevronUp } from "lucide-react"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// 1. Root & Grouping Components
// -----------------------------------------------------------------------------

// The root component that manages the open/closed state of the select box.
const Select = SelectPrimitive.Root

// Component to group related select options visually and semantically.
const SelectGroup = SelectPrimitive.Group

// Component used to display the currently selected value inside the trigger button.
const SelectValue = SelectPrimitive.Value

// -----------------------------------------------------------------------------
// 2. Select Trigger Component (The Input Box)
// -----------------------------------------------------------------------------

// The clickable element that, when activated, opens the select dropdown content.
const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      // Base styling: ensures flex layout, fixed height (h-9), full width, rounded border, and theme background.
      "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
      // State styling: focus ring, disabled state styles, and placeholder text color.
      "ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      // Ensures the text content inside the span does not wrap onto multiple lines.
      "&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    {/* The chevron icon, which uses Radix's Icon primitive to inherit state and rotation behavior. */}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

// -----------------------------------------------------------------------------
// 3. Scroll Buttons
// -----------------------------------------------------------------------------

// Button component displayed at the top of the dropdown content if there are hidden items above.
const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn(
      // Base styling: ensures the button is centered and clickable.
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    {/* Up arrow icon visible inside the button. */}
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
))
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName

// Button component displayed at the bottom of the dropdown content if there are hidden items below.
const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn(
      // Base styling: ensures the button is centered and clickable.
      "flex cursor-default items-center justify-center py-1",
      className
    )}
    {...props}
  >
    {/* Down arrow icon visible inside the button. */}
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
))
SelectScrollDownButton.displayName =
  SelectPrimitive.ScrollDownButton.displayName

// -----------------------------------------------------------------------------
// 4. Select Content (The Dropdown Panel)
// -----------------------------------------------------------------------------

// The container for all select options (items, labels, separators).
const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        // Base styling: High z-index, max height constrained by Radix variable, scrollable, popover colors, and shadow.
        "relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
        // Radix data attributes trigger comprehensive opening/closing animations (fade, zoom, slide).
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        // Uses a CSS variable set by Radix to define the transform origin for animations.
        "origin-[--radix-select-content-transform-origin]",
        // Conditional positioning for 'popper' mode: applies small translate offsets based on the opening side.
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position} // Passes the positioning strategy (popper or item-aligned) to Radix.
      {...props}
    >
      {/* Scroll Up Button included inside content for scrolling. */}
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          // Base padding for the viewport.
          "p-1",
          // Conditional sizing for 'popper' mode: ensures viewport aligns precisely with the trigger's dimensions.
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      {/* Scroll Down Button included inside content for scrolling. */}
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

// -----------------------------------------------------------------------------
// 5. Select Label
// -----------------------------------------------------------------------------

// Non-interactive text label used to introduce groups of options within the dropdown.
const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    // Base styling: padding (pl-8 offset for indicator), small text, bold font.
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

// -----------------------------------------------------------------------------
// 6. Select Item (Option)
// -----------------------------------------------------------------------------

// An individual selectable option within the dropdown content.
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      // Base styling: relative position, full width, default cursor, padding offset (pl-8 for indicator).
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
      // Focus/Disabled states: Focus changes background/text color; disabled state removes interactivity and reduces opacity.
      "focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    {/* Container for the checkmark icon, positioned absolutely to the left. */}
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        {/* The checkmark icon itself, visible only when the item is selected. */}
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>

    {/* Component specifically for the text content of the item. */}
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

// -----------------------------------------------------------------------------
// 7. Select Separator
// -----------------------------------------------------------------------------

// A horizontal line divider between options or groups.
const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    // Base styling: Negative horizontal margin, small height, and muted color for the line.
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

// -----------------------------------------------------------------------------
// 8. Exports
// -----------------------------------------------------------------------------

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
}
