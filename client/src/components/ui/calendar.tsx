import * as React from "react"
// Import icons for the navigation arrows (Previous/Next month).
import { ChevronLeft, ChevronRight } from "lucide-react"
// Import the core DayPicker component, the foundational library for building date pickers.
import { DayPicker } from "react-day-picker"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"
// Import utility function for generating button styles based on component library variants.
import { buttonVariants } from "@/components/ui/button"

// -----------------------------------------------------------------------------
// 1. Type Definition
// -----------------------------------------------------------------------------

// Defines a type alias for CalendarProps by extending the props of the core DayPicker component.
export type CalendarProps = React.ComponentProps<typeof DayPicker>

// -----------------------------------------------------------------------------
// 2. Calendar Component
// -----------------------------------------------------------------------------

// The main Calendar component, acting as a styled wrapper around DayPicker.
function Calendar({
  className, // Custom classes for the outer container.
  classNames, // Custom classes to override specific internal DayPicker elements.
  showOutsideDays = true, // Default prop to show days from the previous/next month.
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      // Applies base padding and merges any custom className for the root element.
      className={cn("p-3", className)}
      // -----------------------------------------------------------------------------
      // Internal Class Overrides (Styling all DayPicker elements)
      // -----------------------------------------------------------------------------
      classNames={{
        // Controls layout for multiple months (stacked vertically on mobile, horizontal on desktop).
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        // Styling for the container of a single month.
        month: "space-y-4",
        // Styling for the header area showing the month/year label.
        caption: "flex justify-center pt-1 relative items-center",
        // Styling for the text label showing the current month and year.
        caption_label: "text-sm font-medium",
        // Container for the navigation buttons (Previous/Next).
        nav: "space-x-1 flex items-center",
        // Styling for the navigation buttons, applying outline button variants and sizing/opacity.
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        // Position the Previous button absolutely to the left of the header.
        nav_button_previous: "absolute left-1",
        // Position the Next button absolutely to the right of the header.
        nav_button_next: "absolute right-1",
        // Styling for the main grid table containing the days.
        table: "w-full border-collapse space-y-1",
        // Styling for the row containing day abbreviations (Sun, Mon, etc.).
        head_row: "flex",
        // Styling for the individual header cells (day abbreviations).
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        // Styling for a row of days (a week).
        row: "flex w-full mt-2",
        // Styling for the individual day cell, including complex radius logic for date ranges.
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        // Styling applied to the interactive day number button (inherits ghost button styles).
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        // Marker class for the last day of a selected range.
        day_range_end: "day-range-end",
        // Styling for the currently selected single day.
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        // Styling for the current day.
        day_today: "bg-accent text-accent-foreground",
        // Styling for days outside the current month, reducing visibility.
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        // Styling for disabled days.
        day_disabled: "text-muted-foreground opacity-50",
        // Styling for days in the middle of a selected range.
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        // Styling to hide days.
        day_hidden: "invisible",
        // Allows user to pass additional classNames to override these defaults.
        ...classNames,
      }}
      // -----------------------------------------------------------------------------
      // Custom Component Overrides
      // -----------------------------------------------------------------------------
      components={{
        // Replaces the default DayPicker left arrow icon with the lucide ChevronLeft icon.
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("h-4 w-4", className)} {...props} />
        ),
        // Replaces the default DayPicker right arrow icon with the lucide ChevronRight icon.
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("h-4 w-4", className)} {...props} />
        ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

// -----------------------------------------------------------------------------
// 3. Export
// -----------------------------------------------------------------------------

export { Calendar }
