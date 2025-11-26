"use client"

// Imports all components from the Radix UI Collapsible primitive.
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"

// -----------------------------------------------------------------------------
// 1. Collapsible Root Component
// -----------------------------------------------------------------------------

// Exports the root component, which manages the open/closed state of the collapsible area.
const Collapsible = CollapsiblePrimitive.Root

// -----------------------------------------------------------------------------
// 2. Collapsible Trigger Component
// -----------------------------------------------------------------------------

// Exports the component that, when clicked, toggles the open/closed state of the content.
const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger

// -----------------------------------------------------------------------------
// 3. Collapsible Content Component
// -----------------------------------------------------------------------------

// Exports the component that wraps the content which is shown or hidden.
const CollapsibleContent = CollapsiblePrimitive.CollapsibleContent

// -----------------------------------------------------------------------------
// 4. Exports
// -----------------------------------------------------------------------------

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
