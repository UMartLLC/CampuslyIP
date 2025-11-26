import * as React from "react"

import type {
  ToastActionElement, // Type for the action button element within a toast.
  ToastProps,         // Base props for the Radix Toast Root component.
} from "@/components/ui/toast"

// -----------------------------------------------------------------------------
// 1. Constants and Types
// -----------------------------------------------------------------------------

const TOAST_LIMIT = 1 // Maximum number of toasts allowed to be displayed at once.
// Long delay ensures the toast remains visible until the animation completes.
const TOAST_REMOVE_DELAY = 1000000 

// Defines the complete type for a toast object stored in state.
type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

// Defines possible actions for the Reducer. Using 'as const' ensures string literal types.
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

// Global counter used to generate unique IDs for toasts.
let count = 0

// Simple function to generate a unique string ID by incrementing a global counter.
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

// Type alias for the actionTypes object keys.
type ActionType = typeof actionTypes

// Union type defining all possible actions that can be dispatched to the reducer.
type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

// Defines the shape of the global state (an array of active toasts).
interface State {
  toasts: ToasterToast[]
}

// Map to store setTimeout IDs for managing the time until a dismissed toast is fully removed from the DOM.
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

// Helper function to initiate the removal timer for a dismissed toast.
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  // Sets a long timeout after which the toast will be fully removed from the state.
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

// -----------------------------------------------------------------------------
// 2. Reducer Function
// -----------------------------------------------------------------------------

// The Reducer manages state transitions based on dispatched actions.
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        // Adds the new toast to the beginning of the array and limits the total number of toasts.
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        // Maps over toasts, merging updates into the matching toast ID.
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // Side effect: Starts the removal timer for the dismissed toast(s).
      if (toastId) {
        // Dismisses a specific toast.
        addToRemoveQueue(toastId)
      } else {
        // If no ID is provided, dismisses all active toasts.
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        // Sets the 'open' property to false for the dismissed toast(s), triggering the exit animation.
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false, // Radix UI detects this change and triggers the close animation.
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        // If no ID is provided (shouldn't happen for REMOVE), clears all toasts.
        return {
          ...state,
          toasts: [],
        }
      }
      // Filters out the toast with the matching ID after its exit animation is complete.
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

// -----------------------------------------------------------------------------
// 3. Global Store and Dispatcher (External Store Pattern)
// -----------------------------------------------------------------------------

// Array of setter functions (listeners) used by the useToast hook instances.
const listeners: Array<(state: State) => void> = []

// Global state object, maintained outside of the React component tree.
let memoryState: State = { toasts: [] }

// Function to update state and notify all active listeners (useToast hook instances).
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  // Notifies every component subscribed via useToast() about the state change.
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

// Type alias for the function signature required to create a new toast.
type Toast = Omit<ToasterToast, "id">

// -----------------------------------------------------------------------------
// 4. toast Function (Public API for creating notifications)
// -----------------------------------------------------------------------------

// Public function that components call to display a new toast notification.
function toast({ ...props }: Toast) {
  const id = genId() // Generate a unique ID for the new toast.

  // Helper function to update the content/props of an existing toast.
  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
    
  // Helper function to trigger the dismiss action.
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  // Dispatches the ADD_TOAST action to show the new notification.
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      // Radix handler: if the toast closes naturally (e.g., swiped away), trigger the dismiss action.
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  // Returns controls for the developer to manually manage the toast (update or dismiss).
  return {
    id: id,
    dismiss,
    update,
  }
}

// -----------------------------------------------------------------------------
// 5. useToast Hook (Public API for consuming notifications)
// -----------------------------------------------------------------------------

// Hook that components use to subscribe to the global toast state.
function useToast() {
  // Uses React state to hold the current global state (synced via listeners).
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    // On mount, subscribe to state changes by pushing the setter function to the global listeners array.
    listeners.push(setState)
    
    // Cleanup function: removes the setter function from the listeners array on unmount.
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state]) // Dependency array ensures the listener array is managed correctly.

  // Returns the current state (toasts array) and public functions to control the notifications.
  return {
    ...state,
    toast, // Function to add a new toast.
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }), // Function to dismiss a toast(s).
  }
}

// -----------------------------------------------------------------------------
// 6. Exports
// -----------------------------------------------------------------------------

export { useToast, toast }