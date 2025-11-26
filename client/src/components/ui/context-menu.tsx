import * as React from "react"
// Imports the core, unstyled Context Menu components from Radix UI.
import * as ContextMenuPrimitive from "@radix-ui/react-context-menu"
// Imports icons used for checked state, sub-menu arrows, and radio buttons.
import { Check, ChevronRight, Circle } from "lucide-react"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// 1. Root & Grouping Components
// -----------------------------------------------------------------------------

// The root component that manages the open/closed state.
const ContextMenu = ContextMenuPrimitive.Root

// The component that, when right-clicked (default), opens the context menu.
const ContextMenuTrigger = ContextMenuPrimitive.Trigger

// Component to group related menu items visually and semantically.
const ContextMenuGroup = ContextMenuPrimitive.Group

// Component to ensure the menu content is rendered outside the normal DOM flow (e.g., under the body tag).
const ContextMenuPortal = ContextMenuPrimitive.Portal

// Component for creating nested menus (a sub-menu).
const ContextMenuSub = ContextMenuPrimitive.Sub

// Component to group radio menu items, ensuring only one can be selected at a time.
const ContextMenuRadioGroup = ContextMenuPrimitive.RadioGroup

// -----------------------------------------------------------------------------
// 2. Context Menu Sub-Trigger
// -----------------------------------------------------------------------------

// The item that, when hovered or clicked, opens a nested sub-menu (ContextMenuSubContent).
const ContextMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubTrigger> & {
    inset?: boolean // Optional prop to add left padding for alignment with checkbox/radio items.
  }
>(({ className, inset, children, ...props }, ref) => (
  <ContextMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      // Base styling: ensures non-interactive text selection, rounded corners, padding.
      "flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
      // Focus/Open state styling: Changes background and text color when focused or sub-menu is open.
      "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      // Inset styling: Adds extra left padding (pl-8) if 'inset' prop is true.
      inset && "pl-8",
      className
    )}
    {...props}
  >
    {children}
    {/* Right arrow icon visually indicates a nested menu. */}
    <ChevronRight className="ml-auto h-4 w-4" />
  </ContextMenuPrimitive.SubTrigger>
))
ContextMenuSubTrigger.displayName = ContextMenuPrimitive.SubTrigger.displayName

// -----------------------------------------------------------------------------
// 3. Context Menu Sub-Content
// -----------------------------------------------------------------------------

// The content panel for a nested sub-menu.
const ContextMenuSubContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      // Base styling: High z-index, minimum width, rounded border, popover colors, and shadow.
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
      // Radix animation classes for smooth opening/closing, including sliding and zooming from the side it opens.
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      // Uses a CSS variable set by Radix to define the transform origin for animations.
      "origin-[--radix-context-menu-content-transform-origin]",
      className
    )}
    {...props}
  />
))
ContextMenuSubContent.displayName = ContextMenuPrimitive.SubContent.displayName

// -----------------------------------------------------------------------------
// 4. Context Menu Content (Main Menu)
// -----------------------------------------------------------------------------

// The main menu panel content wrapper.
const ContextMenuContent = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Content>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Portal>
    <ContextMenuPrimitive.Content
      ref={ref}
      className={cn(
        // Base styling: High z-index, max height constrained by Radix variable, scrollable, popover colors/shadow.
        "z-50 max-h-[--radix-context-menu-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        // Comprehensive Radix animation classes for smooth opening/closing.
        "animate-in fade-in-80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        // Uses a CSS variable set by Radix to define the transform origin for animations.
        "origin-[--radix-context-menu-content-transform-origin]",
        className
      )}
      {...props}
    />
  </ContextMenuPrimitive.Portal>
))
ContextMenuContent.displayName = ContextMenuPrimitive.Content.displayName

// -----------------------------------------------------------------------------
// 5. Context Menu Item
// -----------------------------------------------------------------------------

// A standard, clickable item in the context menu.
const ContextMenuItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean // Optional prop to add left padding for alignment.
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Item
    ref={ref}
    className={cn(
      // Base styling: ensures default cursor, non-interactive text selection, rounded corners, padding.
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
      // Focus/Disabled states: Focus changes background/text color; disabled state removes interactivity and reduces opacity.
      "focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      // Inset styling: Adds extra left padding (pl-8) if 'inset' prop is true.
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
ContextMenuItem.displayName = ContextMenuPrimitive.Item.displayName

// -----------------------------------------------------------------------------
// 6. Context Menu Checkbox Item
// -----------------------------------------------------------------------------

// An item that can be checked or unchecked independently.
const ContextMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <ContextMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      // Base styling, includes padding offset (pl-8) to make space for the checkmark icon.
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    {/* Container for the checkmark icon, positioned absolutely to the left. */}
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        {/* The checkmark icon itself, visible when the item is checked. */}
        <Check className="h-4 w-4" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.CheckboxItem>
))
ContextMenuCheckboxItem.displayName =
  ContextMenuPrimitive.CheckboxItem.displayName

// -----------------------------------------------------------------------------
// 7. Context Menu Radio Item
// -----------------------------------------------------------------------------

// An item within a ContextMenuRadioGroup where only one item can be selected at a time.
const ContextMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <ContextMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      // Base styling, includes padding offset (pl-8) to make space for the radio dot.
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    {/* Container for the radio dot icon, positioned absolutely to the left. */}
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <ContextMenuPrimitive.ItemIndicator>
        {/* The solid dot icon, visible when the radio item is selected. */}
        <Circle className="h-2 w-2 fill-current" />
      </ContextMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </ContextMenuPrimitive.RadioItem>
))
ContextMenuRadioItem.displayName = ContextMenuPrimitive.RadioItem.displayName

// -----------------------------------------------------------------------------
// 8. Context Menu Label
// -----------------------------------------------------------------------------

// Non-interactive text label used within a menu group.
const ContextMenuLabel = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Label> & {
    inset?: boolean // Optional prop to add left padding for alignment.
  }
>(({ className, inset, ...props }, ref) => (
  <ContextMenuPrimitive.Label
    ref={ref}
    className={cn(
      // Base styling: padding, small text, bold font, and foreground color.
      "px-2 py-1.5 text-sm font-semibold text-foreground",
      // Inset styling: Adds extra left padding (pl-8) if 'inset' prop is true.
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
ContextMenuLabel.displayName = ContextMenuPrimitive.Label.displayName

// -----------------------------------------------------------------------------
// 9. Context Menu Separator
// -----------------------------------------------------------------------------

// A horizontal line divider between menu items or groups.
const ContextMenuSeparator = React.forwardRef<
  React.ElementRef<typeof ContextMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof ContextMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <ContextMenuPrimitive.Separator
    ref={ref}
    // Base styling: Negative horizontal margin, small height, and border color for the line.
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
))
ContextMenuSeparator.displayName = ContextMenuPrimitive.Separator.displayName

// -----------------------------------------------------------------------------
// 10. Context Menu Shortcut
// -----------------------------------------------------------------------------

// Component used to display keyboard shortcut hints next to a menu item.
const ContextMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        // Base styling: Pushes the shortcut to the right (ml-auto), very small text, muted color.
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
ContextMenuShortcut.displayName = "ContextMenuShortcut"

// -----------------------------------------------------------------------------
// 11. Exports
// -----------------------------------------------------------------------------

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}
