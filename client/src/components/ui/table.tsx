import * as React from "react"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// 1. Table Root Component
// -----------------------------------------------------------------------------

// The main Table component. It wraps the <table> element in a scrollable container.
const Table = React.forwardRef<
  HTMLTableElement, // Specifies the underlying HTML element type (table).
  React.HTMLAttributes<HTMLTableElement> // Inherits standard HTML table attributes.
>(({ className, ...props }, ref) => (
  // Outer div wrapper enables horizontal scrolling if the table exceeds its container width.
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn(
        // Base styling: full width, positions caption at the bottom, small text size.
        "w-full caption-bottom text-sm", 
        className
      )}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

// -----------------------------------------------------------------------------
// 2. Table Header Component
// -----------------------------------------------------------------------------

// Component for the table header section. Renders as a <thead> element.
const TableHeader = React.forwardRef<
  HTMLTableSectionElement, // Specifies the underlying HTML element type (thead).
  React.HTMLAttributes<HTMLTableSectionElement> // Inherits standard HTML table section attributes.
>(({ className, ...props }, ref) => (
  <thead 
    ref={ref} 
    // Styling: Ensures every <tr> (table row) inside the header has a bottom border.
    className={cn("[&_tr]:border-b", className)} 
    {...props} 
  />
))
TableHeader.displayName = "TableHeader"

// -----------------------------------------------------------------------------
// 3. Table Body Component
// -----------------------------------------------------------------------------

// Component for the table body section. Renders as a <tbody> element.
const TableBody = React.forwardRef<
  HTMLTableSectionElement, // Specifies the underlying HTML element type (tbody).
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    // Styling: Ensures the last row inside the body does NOT have a bottom border.
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

// -----------------------------------------------------------------------------
// 4. Table Footer Component
// -----------------------------------------------------------------------------

// Component for the table footer section. Renders as a <tfoot> element.
const TableFooter = React.forwardRef<
  HTMLTableSectionElement, // Specifies the underlying HTML element type (tfoot).
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      // Base styling: top border, slightly muted background, medium font weight.
      "border-t bg-muted/50 font-medium",
      // Styling: Ensures the last row inside the footer does NOT have a bottom border.
      "&>tr]:last:border-b-0", 
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

// -----------------------------------------------------------------------------
// 5. Table Row Component
// -----------------------------------------------------------------------------

// Component for a single row within the table body or header. Renders as a <tr> element.
const TableRow = React.forwardRef<
  HTMLTableRowElement, // Specifies the underlying HTML element type (tr).
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      // Base styling: bottom border and smooth color transition.
      "border-b transition-colors",
      // State styling: Muted background on hover, and muted background when selected (data-[state=selected]).
      "hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

// -----------------------------------------------------------------------------
// 6. Table Head Component
// -----------------------------------------------------------------------------

// Component for a table header cell. Renders as a <th> element.
const TableHead = React.forwardRef<
  HTMLTableCellElement, // Specifies the underlying HTML element type (th).
  React.ThHTMLAttributes<HTMLTableCellElement> // Inherits standard HTML th attributes.
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      // Base styling: fixed height, padding, left alignment, medium font weight, muted text color.
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground",
      // Conditional styling: Removes right padding if the cell contains an element with role="checkbox" (common for selection columns).
      "&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

// -----------------------------------------------------------------------------
// 7. Table Cell Component
// -----------------------------------------------------------------------------

// Component for a standard table data cell. Renders as a <td> element.
const TableCell = React.forwardRef<
  HTMLTableCellElement, // Specifies the underlying HTML element type (td).
  React.TdHTMLAttributes<HTMLTableCellElement> // Inherits standard HTML td attributes.
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      // Base styling: padding, middle vertical alignment.
      "p-4 align-middle",
      // Conditional styling: Removes right padding if the cell contains an element with role="checkbox".
      "&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

// -----------------------------------------------------------------------------
// 8. Table Caption Component
// -----------------------------------------------------------------------------

// Component for a caption describing the table content. Renders as a <caption> element.
const TableCaption = React.forwardRef<
  HTMLTableCaptionElement, // Specifies the underlying HTML element type (caption).
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    // Base styling: top margin, small text size, muted text color.
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

// -----------------------------------------------------------------------------
// 9. Exports
// -----------------------------------------------------------------------------

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}