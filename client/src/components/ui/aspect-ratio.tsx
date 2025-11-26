import * as AspectRatioPrimitive from "@radix-ui/react-aspect-ratio"

// Imports the entire Radix Aspect Ratio module as AspectRatioPrimitive.

// -----------------------------------------------------------------------------
// 1. Aspect Ratio Component
// -----------------------------------------------------------------------------

// Exports the base AspectRatio component, which is the main component from the Radix primitive.
// This component automatically maintains a defined width-to-height ratio for its content,
// preventing layout shifts when content loads.
const AspectRatio = AspectRatioPrimitive.Root

// -----------------------------------------------------------------------------
// 2. Exports
// -----------------------------------------------------------------------------

export { AspectRatio }