import * as React from "react"
// Imports the core OTP components and the context from the 'input-otp' library.
import { OTPInput, OTPInputContext } from "input-otp"
// Imports the Dot icon (used for the separator).
import { Dot } from "lucide-react"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"

// -----------------------------------------------------------------------------
// 1. InputOTP Root Component
// -----------------------------------------------------------------------------

// The main component wrapping the entire OTP input sequence.
const InputOTP = React.forwardRef<
  React.ElementRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    // Styling for the container wrapper provided by the 'input-otp' library.
    containerClassName={cn(
      // Base styling: ensures items are flexed, spaced, and sets styles for disabled state.
      "flex items-center gap-2 has-[:disabled]:opacity-50",
      containerClassName
    )}
    // Styling for the inner input element (the actual hidden input field).
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
))
InputOTP.displayName = "InputOTP"

// -----------------------------------------------------------------------------
// 2. InputOTPGroup Component
// -----------------------------------------------------------------------------

// Component used to visually group adjacent OTP slots (the individual boxes).
const InputOTPGroup = React.forwardRef<
  React.ElementRef<"div">, // Ref type is a standard HTML div.
  React.ComponentPropsWithoutRef<"div"> // Props are standard HTML div props.
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center", className)} {...props} />
))
InputOTPGroup.displayName = "InputOTPGroup"

// -----------------------------------------------------------------------------
// 3. InputOTPSlot Component (Individual Digit Box)
// -----------------------------------------------------------------------------

// Component representing a single box/slot for one digit of the OTP code.
const InputOTPSlot = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & { index: number } // Requires an index prop to identify its position.
>(({ index, className, ...props }, ref) => {
  // Accesses the internal state provided by the 'input-otp' library for the slot.
  const inputOTPContext = React.useContext(OTPInputContext)
  // Destructures the current character, caret visibility, and active state for this slot index.
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index]

  return (
    <div
      ref={ref}
      className={cn(
        // Base styling for the box: centers content, fixed size, relative position for caret/focus.
        "relative flex h-10 w-10 items-center justify-center border-y border-r border-input text-sm transition-all",
        // Styling for the first slot: applies left border and rounds the left corners.
        "first:rounded-l-md first:border-l",
        // Styling for the last slot: rounds the right corners.
        "last:rounded-r-md",
        // Focus state: brings the slot forward (z-10) and adds a focus ring.
        isActive && "z-10 ring-2 ring-ring ring-offset-background",
        className
      )}
      {...props}
    >
      {/* Displays the current character entered into this slot. */}
      {char}
      {/* Renders the blinking caret if the input-otp library indicates the slot is active. */}
      {hasFakeCaret && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {/* The blinking cursor line. */}
          <div className="h-4 w-px animate-caret-blink bg-foreground duration-1000" />
        </div>
      )}
    </div>
  )
})
InputOTPSlot.displayName = "InputOTPSlot"

// -----------------------------------------------------------------------------
// 4. InputOTPSeparator Component
// -----------------------------------------------------------------------------

// Component used to display a separator (e.g., a dash or a dot) between groups of slots.
const InputOTPSeparator = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div">
>(({ ...props }, ref) => (
  <div ref={ref} role="separator" {...props}>
    {/* Renders the Lucide Dot icon. */}
    <Dot />
  </div>
))
InputOTPSeparator.displayName = "InputOTPSeparator"

// -----------------------------------------------------------------------------
// 5. Exports
// -----------------------------------------------------------------------------

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
