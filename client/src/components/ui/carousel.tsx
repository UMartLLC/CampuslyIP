import * as React from "react"
// Imports the core hook for the Embla Carousel library and its related types.
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react"
// Imports icons for navigation arrows (used in CarouselPrevious and CarouselNext).
import { ArrowLeft, ArrowRight } from "lucide-react"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"
// Imports a styled Button component from the local UI library.
import { Button } from "@/components/ui/button"

// -----------------------------------------------------------------------------
// 1. Type Definitions for Embla Carousel
// -----------------------------------------------------------------------------

// Type alias for the Embla API object (used for controlling the carousel).
type CarouselApi = UseEmblaCarouselType[1]
// Type definition for the parameters passed to the useEmblaCarousel hook.
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>
// Type alias for the Embla Carousel options (e.g., loop, watchDrag).
type CarouselOptions = UseCarouselParameters[0]
// Type alias for Embla Carousel plugins.
type CarouselPlugin = UseCarouselParameters[1]

// Props expected by the root Carousel component.
type CarouselProps = {
  opts?: CarouselOptions // Optional Embla configuration options.
  plugins?: CarouselPlugin // Optional Embla plugins.
  orientation?: "horizontal" | "vertical" // Custom orientation prop (defaults to horizontal).
  setApi?: (api: CarouselApi) => void // Callback to expose the Embla API instance to the parent component.
}

// Props included in the Carousel context (combines internal state with initial props).
type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0] // The ref object to be attached to the carousel wrapper.
  api: ReturnType<typeof useEmblaCarousel>[1] // The Embla API instance.
  scrollPrev: () => void // Function to scroll to the previous slide.
  scrollNext: () => void // Function to scroll to the next slide.
  canScrollPrev: boolean // State indicating if scrolling backwards is possible.
  canScrollNext: boolean // State indicating if scrolling forwards is possible.
} & CarouselProps

// Creates the React Context to share carousel state and controls across child components (like CarouselNext/Previous).
const CarouselContext = React.createContext<CarouselContextProps | null>(null)

// -----------------------------------------------------------------------------
// 2. useCarousel Hook
// -----------------------------------------------------------------------------

// Custom hook to access the carousel context easily.
function useCarousel() {
  const context = React.useContext(CarouselContext)

  // Throws an error if the hook is used outside of a <Carousel /> component.
  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context
}

// -----------------------------------------------------------------------------
// 3. Carousel Root Component
// -----------------------------------------------------------------------------

// The main, accessible container component for the carousel.
const Carousel = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
  (
    {
      orientation = "horizontal", // Default orientation is horizontal.
      opts,
      setApi,
      plugins,
      className,
      children,
      ...props
    },
    ref
  ) => {
    // Initializes the Embla Carousel hook.
    const [carouselRef, api] = useEmblaCarousel(
      {
        ...opts,
        // Maps the custom 'orientation' prop to Embla's 'axis' property ('x' for horizontal, 'y' for vertical).
        axis: orientation === "horizontal" ? "x" : "y",
      },
      plugins
    )
    // State to track scrollability for disabling/enabling navigation buttons.
    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    // Callback to update the scroll state when a slide changes or the carousel is initialized/re-initialized.
    const onSelect = React.useCallback((api: CarouselApi) => {
      if (!api) {
        return
      }

      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    }, [])

    // Memoized function to scroll to the previous slide.
    const scrollPrev = React.useCallback(() => {
      api?.scrollPrev()
    }, [api])

    // Memoized function to scroll to the next slide.
    const scrollNext = React.useCallback(() => {
      api?.scrollNext()
    }, [api])

    // Handler for keyboard navigation (Left/Right arrow keys).
    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault()
          scrollPrev()
        } else if (event.key === "ArrowRight") {
          event.preventDefault()
          scrollNext()
        }
      },
      [scrollPrev, scrollNext]
    )

    // Effect to expose the Embla API instance to the parent component via setApi prop.
    React.useEffect(() => {
      if (!api || !setApi) {
        return
      }

      setApi(api)
    }, [api, setApi])

    // Effect to attach event listeners (select and reInit) to the Embla API.
    React.useEffect(() => {
      if (!api) {
        return
      }

      onSelect(api) // Initial check on mount
      api.on("reInit", onSelect) // Recalculate scroll state if carousel configuration changes
      api.on("select", onSelect) // Recalculate scroll state when a new slide is selected

      // Cleanup function to remove event listeners on unmount.
      return () => {
        api?.off("select", onSelect)
      }
    }, [api, onSelect])

    return (
      // Provides the context values to all descendant carousel components.
      <CarouselContext.Provider
        value={{
          carouselRef,
          api: api,
          opts,
          // Determines the orientation for context consumption.
          orientation:
            orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
          scrollPrev,
          scrollNext,
          canScrollPrev,
          canScrollNext,
        }}
      >
        <div
          ref={ref}
          // Uses onKeyDownCapture to handle keyboard events before children elements do.
          onKeyDownCapture={handleKeyDown}
          // Base styling: relative positioning for absolute navigation buttons.
          className={cn("relative", className)}
          role="region" // ARIA role for a distinct section.
          aria-roledescription="carousel" // ARIA description for screen readers.
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    )
  }
)
Carousel.displayName = "Carousel"

// -----------------------------------------------------------------------------
// 4. Carousel Content Component
// -----------------------------------------------------------------------------

// Wrapper for all individual CarouselItem components (the moving track).
const CarouselContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  // Accesses the carousel context to get the Embla ref and orientation.
  const { carouselRef, orientation } = useCarousel()

  return (
    // Outer div for masking (hiding) the excess carousel content.
    <div ref={carouselRef} className="overflow-hidden">
      <div
        ref={ref}
        className={cn(
          "flex",
          // Applies negative margin and sets flex direction based on orientation, compensating for item padding.
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className
        )}
        {...props}
      />
    </div>
  )
})
CarouselContent.displayName = "CarouselContent"

// -----------------------------------------------------------------------------
// 5. Carousel Item Component
// -----------------------------------------------------------------------------

// Individual slide container within the CarouselContent.
const CarouselItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { orientation } = useCarousel()

  return (
    <div
      ref={ref}
      role="group" // ARIA role indicating this is a group of related elements.
      aria-roledescription="slide" // ARIA description to identify this element as a slide.
      className={cn(
        // Base sizing: item takes full width (basis-full), is non-shrinkable/non-growable.
        "min-w-0 shrink-0 grow-0 basis-full",
        // Applies padding (pl-4 or pt-4) based on orientation, which is compensated for by the negative margin on CarouselContent.
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className
      )}
      {...props}
    />
  )
})
CarouselItem.displayName = "CarouselItem"

// -----------------------------------------------------------------------------
// 6. Carousel Navigation Buttons
// -----------------------------------------------------------------------------

// Button component to scroll to the previous slide.
const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  // Accesses orientation, scroll function, and scroll state from context.
  const { orientation, scrollPrev, canScrollPrev } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        // Base positioning and sizing for navigation buttons.
        "absolute  h-8 w-8 rounded-full",
        // Position and rotation based on orientation (centered on side for horizontal, top/bottom for vertical).
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollPrev} // Button is disabled if scrolling back is not possible.
      onClick={scrollPrev}
      {...props}
    >
      <ArrowLeft className="h-4 w-4" />
      <span className="sr-only">Previous slide</span> {/* Hidden label for screen readers. */}
    </Button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

// Button component to scroll to the next slide.
const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button>
>(({ className, variant = "outline", size = "icon", ...props }, ref) => {
  // Accesses orientation, scroll function, and scroll state from context.
  const { orientation, scrollNext, canScrollNext } = useCarousel()

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      className={cn(
        // Base positioning and sizing for navigation buttons.
        "absolute h-8 w-8 rounded-full",
        // Position and rotation based on orientation (centered on side for horizontal, top/bottom for vertical).
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className
      )}
      disabled={!canScrollNext} // Button is disabled if scrolling forward is not possible.
      onClick={scrollNext}
      {...props}
    >
      <ArrowRight className="h-4 w-4" />
      <span className="sr-only">Next slide</span> {/* Hidden label for screen readers. */}
    </Button>
  )
})
CarouselNext.displayName = "CarouselNext"

// -----------------------------------------------------------------------------
// 7. Exports
// -----------------------------------------------------------------------------

export {
  type CarouselApi, // Exports the API type definition.
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
}