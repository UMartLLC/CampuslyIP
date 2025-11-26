import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

// -----------------------------------------------------------------------------
// 1. Toaster Component
// -----------------------------------------------------------------------------

// The Toaster component is responsible for rendering all active toast notifications.
export function Toaster() {
  // Custom hook (likely internal to the library) used to access the list of currently queued toasts.
  const { toasts } = useToast()

  return (
    // ToastProvider is the required root component from Radix UI; it manages state and accessibility for all toasts.
    <ToastProvider>
      {/* Maps over the array of toasts retrieved from the hook. */}
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          // The individual Toast component (Radix Toast.Root)
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {/* Renders the optional title if it exists. */}
              {title && <ToastTitle>{title}</ToastTitle>}
              {/* Renders the optional description/body text if it exists. */}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {/* Renders an optional action button (e.g., "Undo" button). */}
            {action}
            {/* Renders the default close button (the 'X' icon). */}
            <ToastClose />
          </Toast>
        )
      })}
      {/* ToastViewport is the fixed container on the screen where toasts appear (usually a corner). 
          It receives all mapped toast children. */}
      <ToastViewport />
    </ToastProvider>
  )
}