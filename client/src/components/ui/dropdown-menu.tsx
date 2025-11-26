import * as React from "react"
// Imports the core, unstyled Dropdown Menu components from Radix UI.
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
// Imports icons used for checked state, sub-menu arrows, and radio buttons.
import { Check, ChevronRight, Circle } from "lucide-react"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// 1. Root & Grouping Components
// -----------------------------------------------------------------------------

// The root component that manages the open/closed state of the dropdown menu.
const DropdownMenu = DropdownMenuPrimitive.Root

// The component that, when interacted with, opens the dropdown menu.
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

// Component to group related menu items visually and semantically.
const DropdownMenuGroup = DropdownMenuPrimitive.Group

// Component to ensure the menu content is rendered outside the normal DOM flow (essential for layering).
const DropdownMenuPortal = DropdownMenuPrimitive.Portal

// Component for creating nested menus (a sub-menu).
const DropdownMenuSub = DropdownMenuPrimitive.Sub

// Component to group radio menu items, ensuring only one can be selected at a time.
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

// -----------------------------------------------------------------------------
// 2. Dropdown Menu Sub-Trigger
// -----------------------------------------------------------------------------

// The item that, when hovered or clicked, opens a nested sub-menu (DropdownMenuSubContent).
const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean // Optional prop to add left padding for alignment.
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      // Base styling: ensures default cursor, non-interactive text selection, rounded corners, padding, and spacing.
      "flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none",
      // Focus/Open state styling: Changes background when focused or sub-menu is open.
      "focus:bg-accent data-[state=open]:bg-accent",
      // Icon styling: Ensures icons inside the sub-trigger are correctly sized and non-interactive.
      "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      // Inset styling: Adds extra left padding (pl-8) if 'inset' prop is true.
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    {/* Right arrow icon visually indicates a nested menu, pushed to the right. */}
    <ChevronRight className="ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

// -----------------------------------------------------------------------------
// 3. Dropdown Menu Sub-Content
// -----------------------------------------------------------------------------

// The content panel for a nested sub-menu.
const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      // Base styling: High z-index, minimum width, rounded border, popover colors, and shadow.
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg",
      // Radix animation classes: Defines smooth opening/closing with fade, zoom, and slide effects from the direction it opens.
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      // Uses a CSS variable set by Radix to define the transform origin for animations.
      "origin-[--radix-dropdown-menu-content-transform-origin]",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

// -----------------------------------------------------------------------------
// 4. Dropdown Menu Content (Main Menu Panel)
// -----------------------------------------------------------------------------

// The main dropdown menu panel content wrapper.
const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      // Specifies the distance (in pixels) the menu should be offset from the trigger on the side it opens.
      sideOffset={sideOffset}
      className={cn(
        // Base styling: High z-index, max height constrained by Radix variable, scrollable, popover colors/shadow.
        "z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        // Comprehensive Radix animation classes for smooth opening/closing, including fade, zoom, and slide.
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        // Uses a CSS variable set by Radix to define the transform origin for animations.
        "origin-[--radix-dropdown-menu-content-transform-origin]",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

// -----------------------------------------------------------------------------
// 5. Dropdown Menu Item
// -----------------------------------------------------------------------------

// A standard, clickable item in the dropdown menu.
const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean // Optional prop to add left padding for alignment.
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      // Base styling: ensures default cursor, non-interactive text selection, rounded corners, padding, and spacing.
      "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors",
      // Focus/Disabled states: Focus changes background/text color; disabled state removes interactivity and reduces opacity.
      "focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      // Icon styling: Ensures nested icons are correctly sized and non-interactive.
      "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      // Inset styling: Adds extra left padding (pl-8) if 'inset' prop is true.
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

// -----------------------------------------------------------------------------
// 6. Dropdown Menu Checkbox Item
// -----------------------------------------------------------------------------

// An item that can be checked or unchecked independently.
const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      // Base styling, includes padding offset (pl-8) to make space for the checkmark icon.
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    {/* Container for the checkmark icon, positioned absolutely to the left. */}
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        {/* The checkmark icon itself, visible when the item is checked. */}
        <Check className="h-4 w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

// -----------------------------------------------------------------------------
// 7. Dropdown Menu Radio Item
// -----------------------------------------------------------------------------

// An item within a DropdownMenuRadioGroup where only one item can be selected at a time.
const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      // Base styling, includes padding offset (pl-8) to make space for the radio dot.
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    {/* Container for the radio dot icon, positioned absolutely to the left. */}
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        {/* The solid dot icon, visible when the radio item is selected. */}
        <Circle className="h-2 w-2 fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

// -----------------------------------------------------------------------------
// 8. Dropdown Menu Label
// -----------------------------------------------------------------------------

// Non-interactive text label used within a menu group.
const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean // Optional prop to add left padding for alignment.
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      // Base styling: padding, small text, bold font.
      "px-2 py-1.5 text-sm font-semibold",
      // Inset styling: Adds extra left padding (pl-8) if 'inset' prop is true.
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

// -----------------------------------------------------------------------------
// 9. Dropdown Menu Separator
// -----------------------------------------------------------------------------

// A horizontal line divider between menu items or groups.
const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    // Base styling: Negative horizontal margin, small height, and muted color for the line.
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

// -----------------------------------------------------------------------------
// 10. Dropdown Menu Shortcut
// -----------------------------------------------------------------------------

// Component used to display keyboard shortcut hints next to a menu item.
const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

// -----------------------------------------------------------------------------
// 11. Exports
// -----------------------------------------------------------------------------

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}