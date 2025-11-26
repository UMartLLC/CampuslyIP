import * as React from "react"
// Imports the type definition for DialogProps from Radix UI.
import { type DialogProps } from "@radix-ui/react-dialog"
// Imports the core command palette library components from 'cmdk' (Command-K).
import { Command as CommandPrimitive } from "cmdk"
// Imports the Search icon from lucide-react.
import { Search } from "lucide-react"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"
// Imports Dialog and DialogContent, assuming they are local styled components built on Radix UI.
import { Dialog, DialogContent } from "@/components/ui/dialog"

// -----------------------------------------------------------------------------
// 1. Command Root Component (The Command Palette Container)
// -----------------------------------------------------------------------------

// Styled wrapper around the core cmdk Command component.
const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      // Base styling: ensures flex layout, takes full height/width, sets colors using popover theme tokens.
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground",
      className
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

// -----------------------------------------------------------------------------
// 2. Command Dialog Component (Wrapper for Modal)
// -----------------------------------------------------------------------------

// A convenience component that wraps the Command palette in a Dialog modal.
const CommandDialog = ({ children, ...props }: DialogProps) => {
  return (
    <Dialog {...props}>
      {/* DialogContent styling: Removes internal padding and adds shadow to the modal content. */}
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        {/* Command styling: Complex selectors target nested cmdk components (groups, headings, input) 
            to apply specific spacing and sizing adjustments (e.g., px-2, h-12). */}
        <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

// -----------------------------------------------------------------------------
// 3. Command Input Component
// -----------------------------------------------------------------------------

// Styled wrapper for the search input field.
const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  // Wrapper div for the search icon and the input field itself.
  <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
    {/* Search icon styling: Adds right margin and reduces opacity. */}
    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        // Input styling: Sets height, removes default outline, styles placeholder text.
        "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  </div>
))

CommandInput.displayName = CommandPrimitive.Input.displayName

// -----------------------------------------------------------------------------
// 4. Command List Component
// -----------------------------------------------------------------------------

// Container for the scrollable list of command items.
const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    // Styling: Sets a maximum height and enables vertical scrolling (overflow-y-auto).
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
))

CommandList.displayName = CommandPrimitive.List.displayName

// -----------------------------------------------------------------------------
// 5. Command Empty Component
// -----------------------------------------------------------------------------

// Component displayed when the search query returns no results.
const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    // Simple centered text styling.
    className="py-6 text-center text-sm"
    {...props}
  />
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

// -----------------------------------------------------------------------------
// 6. Command Group Component
// -----------------------------------------------------------------------------

// Used to group related command items under a common heading.
const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      // Styling: Hides overflow, adds padding, sets text color.
      // Selectors style the group heading (e.g., small text, muted color).
      "overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground",
      className
    )}
    {...props}
  />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

// -----------------------------------------------------------------------------
// 7. Command Separator Component
// -----------------------------------------------------------------------------

// A visual divider between command groups or items.
const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    // Styling: Sets height, applies a background color (bg-border) to create the line, and negative horizontal margin.
    className={cn("-mx-1 h-px bg-border", className)}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

// -----------------------------------------------------------------------------
// 8. Command Item Component
// -----------------------------------------------------------------------------

// The individual clickable command item in the list.
const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      // Base styling: flex layout, selection styles, small text, outline removal.
      "relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
      // Radix data attributes trigger hover/selection/disabled states:
      "data-[disabled=true]:pointer-events-none data-[selected='true']:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50",
      // Styling for nested SVG icons within the item.
      "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      className
    )}
    {...props}
  />
))

CommandItem.displayName = CommandPrimitive.Item.displayName

// -----------------------------------------------------------------------------
// 9. Command Shortcut Component
// -----------------------------------------------------------------------------

// Used to display keyboard shortcut hints next to a command item.
const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        // Styling: Pushes the shortcut to the right (ml-auto), very small text (text-xs), uses muted color.
        "ml-auto text-xs tracking-widest text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
CommandShortcut.displayName = "CommandShortcut"

// -----------------------------------------------------------------------------
// 10. Exports
// -----------------------------------------------------------------------------

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}