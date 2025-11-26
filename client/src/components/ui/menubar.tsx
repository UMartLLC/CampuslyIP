"use client"

import * as React from "react"
// Imports the core, unstyled Menubar components from Radix UI.
import * as MenubarPrimitive from "@radix-ui/react-menubar"
// Imports icons used for checked state, sub-menu arrows, and radio buttons.
import { Check, ChevronRight, Circle } from "lucide-react"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// 1. Root & Grouping Components (Simple Aliases)
// -----------------------------------------------------------------------------

// Alias for the root container of a single menu dropdown.
function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu {...props} />
}

// Alias for grouping related menu items within a dropdown.
function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group {...props} />
}

// Alias for the portal component (renders content outside the normal DOM flow).
function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal {...props} />
}

// Alias for the radio group container (ensures only one item is selected).
function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return <MenubarPrimitive.RadioGroup {...props} />
}

// Alias for the sub-menu root component.
function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  // Includes a data-slot attribute for potential CSS targeting of sub-menus.
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />
}

// -----------------------------------------------------------------------------
// 2. Menubar Root Component (The Bar)
// -----------------------------------------------------------------------------

// The main, horizontal bar container that holds all MenubarTrigger components.
const Menubar = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      // Base styling: flex layout, fixed height, rounded border, background, and spacing between items.
      "flex h-10 items-center space-x-1 rounded-md border bg-background p-1",
      className
    )}
    {...props}
  />
))
Menubar.displayName = MenubarPrimitive.Root.displayName

// -----------------------------------------------------------------------------
// 3. Menubar Trigger Component
// -----------------------------------------------------------------------------

// The clickable item within the Menubar that opens a dropdown menu (MenubarContent).
const MenubarTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Trigger
    ref={ref}
    className={cn(
      // Base styling: default cursor, non-interactive text selection, rounded corners, padding.
      "flex cursor-default select-none items-center rounded-sm px-3 py-1.5 text-sm font-medium outline-none",
      // Focus/Open state styling: Changes background and text color when focused or when the menu is open.
      "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      className
    )}
    {...props}
  />
))
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName

// -----------------------------------------------------------------------------
// 4. Menubar Sub-Trigger
// -----------------------------------------------------------------------------

// The item inside a menu that, when hovered, opens a nested sub-menu.
const MenubarSubTrigger = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
    inset?: boolean // Optional prop to add left padding for alignment with checkbox/radio items.
  }
>(({ className, inset, children, ...props }, ref) => (
  <MenubarPrimitive.SubTrigger
    ref={ref}
    className={cn(
      // Base styling: default cursor, rounded corners, padding.
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
    {/* Right arrow icon visually indicates a nested menu, pushed to the right. */}
    <ChevronRight className="ml-auto h-4 w-4" />
  </MenubarPrimitive.SubTrigger>
))
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName

// -----------------------------------------------------------------------------
// 5. Menubar Sub-Content
// -----------------------------------------------------------------------------

// The content panel for a nested sub-menu.
const MenubarSubContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.SubContent
    ref={ref}
    className={cn(
      // Base styling: High z-index, minimum width, rounded border, popover colors.
      "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground",
      // Radix animation classes: Defines smooth opening/closing with fade, zoom, and slide effects.
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      // Uses a CSS variable set by Radix to define the transform origin for animations.
      "origin-[--radix-menubar-content-transform-origin]",
      className
    )}
    {...props}
  />
))
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName

// -----------------------------------------------------------------------------
// 6. Menubar Content (Main Menu Dropdown)
// -----------------------------------------------------------------------------

// The main dropdown menu panel content wrapper that appears below the MenubarTrigger.
const MenubarContent = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(
  (
    { className, align = "start", alignOffset = -4, sideOffset = 8, ...props },
    ref
  ) => (
    <MenubarPrimitive.Portal>
      <MenubarPrimitive.Content
        ref={ref}
        align={align} // Alignment property relative to the trigger.
        alignOffset={alignOffset} // Horizontal offset applied to the alignment.
        sideOffset={sideOffset} // Vertical offset (distance from the trigger).
        className={cn(
          // Base styling: High z-index, minimum width, rounded border, popover colors, and shadow.
          "z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
          // Radix animation classes: Defines smooth opening/closing with fade, zoom, and slide effects.
          "data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          // Uses a CSS variable set by Radix to define the transform origin for animations.
          "origin-[--radix-menubar-content-transform-origin]",
          className
        )}
        {...props}
      />
    </MenubarPrimitive.Portal>
  )
)
MenubarContent.displayName = MenubarPrimitive.Content.displayName

// -----------------------------------------------------------------------------
// 7. Menubar Item
// -----------------------------------------------------------------------------

// A standard, clickable item in the dropdown menu.
const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Item
    ref={ref}
    className={cn(
      // Base styling: relative position, default cursor, rounded corners, padding.
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
MenubarItem.displayName = MenubarPrimitive.Item.displayName

// -----------------------------------------------------------------------------
// 8. Menubar Checkbox Item
// -----------------------------------------------------------------------------

// An item that can be checked or unchecked independently.
const MenubarCheckboxItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <MenubarPrimitive.CheckboxItem
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
      <MenubarPrimitive.ItemIndicator>
        {/* The checkmark icon itself, visible when the item is checked. */}
        <Check className="h-4 w-4" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.CheckboxItem>
))
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName

// -----------------------------------------------------------------------------
// 9. Menubar Radio Item
// -----------------------------------------------------------------------------

// An item within a MenubarRadioGroup where only one item can be selected at a time.
const MenubarRadioItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <MenubarPrimitive.RadioItem
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
      <MenubarPrimitive.ItemIndicator>
        {/* The solid dot icon, visible when the radio item is selected. */}
        <Circle className="h-2 w-2 fill-current" />
      </MenubarPrimitive.ItemIndicator>
    </span>
    {children}
  </MenubarPrimitive.RadioItem>
))
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName

// -----------------------------------------------------------------------------
// 10. Menubar Label
// -----------------------------------------------------------------------------

// Non-interactive text label used within a menu group.
const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
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
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

// -----------------------------------------------------------------------------
// 11. Menubar Separator
// -----------------------------------------------------------------------------

// A horizontal line divider between menu items or groups.
const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    // Base styling: Negative horizontal margin, small height, and muted color for the line.
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

// -----------------------------------------------------------------------------
// 12. Menubar Shortcut
// -----------------------------------------------------------------------------

// Component used to display keyboard shortcut hints next to a menu item.
const MenubarShortcut = ({
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
MenubarShortcut.displayname = "MenubarShortcut"

// -----------------------------------------------------------------------------
// 13. Exports
// -----------------------------------------------------------------------------

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarPortal,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarShortcut,
}