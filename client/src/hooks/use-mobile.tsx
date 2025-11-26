import * as React from "react"

// Defines the screen width (in pixels) considered the breakpoint for desktop devices (e.g., typical Tailwind CSS 'md' breakpoint).
const MOBILE_BREAKPOINT = 768

// -----------------------------------------------------------------------------
// 1. useIsMobile Hook
// -----------------------------------------------------------------------------

// Custom React hook to efficiently determine if the current viewport is mobile-sized.
export function useIsMobile() {
  // State holds the mobile status. Starts as undefined because window properties are unavailable on the server/during SSR.
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  // Effect runs only once after the component mounts (client-side).
  React.useEffect(() => {
    // Defines a Media Query List (MQL) that listens for widths less than the mobile breakpoint (767px).
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Callback function to update the state whenever the window size crosses the breakpoint.
    const onChange = () => {
      // Updates state based on the current viewport width.
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Attaches the listener to the Media Query List for dynamic updates.
    mql.addEventListener("change", onChange)
    
    // Initial check: sets the correct state immediately upon mounting (to handle the initial render).
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    
    // Cleanup function: removes the event listener when the component unmounts.
    return () => mql.removeEventListener("change", onChange)
  }, []) // Empty dependency array ensures this runs only once.

  // Returns the boolean status. The !! converts 'undefined' (initial state) to false 
  // for a clean boolean return type, though the state is quickly updated in the useEffect.
  return !!isMobile 
}