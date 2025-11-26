"use client"

import * as React from "react"
// Imports the base, unstyled Label component from Radix UI.
import * as LabelPrimitive from "@radix-ui/react-label"
// Imports the Slot component from Radix UI. Slot allows a component to inherit the DOM element and props of its children.
import { Slot } from "@radix-ui/react-slot"
import {
  // Controller is the component that registers the input field with react-hook-form.
  Controller,
  // FormProvider sets up the context for the entire form, providing methods like getFieldState and formState.
  FormProvider,
  // useFormContext provides access to all form methods anywhere within the form.
  useFormContext,
  // Imports TypeScript types necessary for generic form props.
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form"

// Utility function (cn) for conditionally merging Tailwind CSS classes.
import { cn } from "@/lib/utils"
// Imports a local styled Label component (presumably built on top of Radix Label).
import { Label } from "@/components/ui/label"

// -----------------------------------------------------------------------------
// 1. Root Form Component (Alias for react-hook-form's FormProvider)
// -----------------------------------------------------------------------------

// Form is an alias for the FormProvider component from react-hook-form.
// It wraps the entire form and provides all form methods via context.
const Form = FormProvider

// -----------------------------------------------------------------------------
// 2. Form Field Context
// -----------------------------------------------------------------------------

// Defines the type for the Form Field Context, which only holds the field's unique 'name'.
type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName // The field name (used for registration and validation).
}

// Creates the React context to pass the field name down to descendants.
const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue
)

// -----------------------------------------------------------------------------
// 3. Form Field Component
// -----------------------------------------------------------------------------

// FormField wraps the Controller from react-hook-form and injects the field's name into context.
const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    // Provides the field 'name' to the FormFieldContext.
    <FormFieldContext.Provider value={{ name: props.name }}>
      {/* Renders the react-hook-form Controller component. */}
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

// -----------------------------------------------------------------------------
// 4. useFormField Hook
// -----------------------------------------------------------------------------

// Custom hook that combines data from all relevant contexts (Form, Field, Item) 
// to provide everything needed for a form input component (ID, name, error state, etc.).
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext) // Gets field name.
  const itemContext = React.useContext(FormItemContext) // Gets unique ID prefix.
  const { getFieldState, formState } = useFormContext() // Gets form state/validation helpers.

  // Retrieves validation and state information (error, isDirty, etc.) for the specific field name.
  const fieldState = getFieldState(fieldContext.name, formState)

  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>")
  }

  const { id } = itemContext // The unique base ID for this FormItem.

  // Returns all necessary IDs, name, and field state.
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`, // ID for the input control.
    formDescriptionId: `${id}-form-item-description`, // ID for the description text.
    formMessageId: `${id}-form-item-message`, // ID for the error message text.
    ...fieldState,
  }
}

// -----------------------------------------------------------------------------
// 5. Form Item Context & Component
// -----------------------------------------------------------------------------

// Defines the type for the Form Item Context, which holds a unique ID generated per item.
type FormItemContextValue = {
  id: string
}

// Creates the React context to pass the unique ID down to its descendants.
const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
)

// FormItem is a simple wrapper component that creates vertical spacing for a form field (Label, Control, Message).
const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  // Generates a unique ID for this specific form item instance.
  const id = React.useId()

  return (
    // Provides the unique ID to the FormItemContext.
    <FormItemContext.Provider value={{ id }}>
      {/* Renders the container div with vertical spacing. */}
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  )
})
FormItem.displayName = "FormItem"

// -----------------------------------------------------------------------------
// 6. Form Label Component
// -----------------------------------------------------------------------------

// Styled wrapper for the label associated with the form field.
const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  // Uses the hook to get the error state and the target input's ID.
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      // Styles the label text in red/destructive color if an error exists.
      className={cn(error && "text-destructive", className)}
      // Sets the htmlFor attribute to link the label to the input (using the generated ID).
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = "FormLabel"

// -----------------------------------------------------------------------------
// 7. Form Control Component
// -----------------------------------------------------------------------------

// Component that wraps the actual input field, injecting necessary ARIA attributes.
const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => {
  // Uses the hook to get IDs and error state.
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

  return (
    // Uses Radix Slot to ensure the actual input element (provided as a child) inherits these props.
    <Slot
      ref={ref}
      // Sets the ID for the input field.
      id={formItemId}
      // Sets ARIA attribute for description/message linkage based on error state.
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}` // Links both description and message if error exists.
      }
      // Sets ARIA attribute to indicate if the input's value is currently invalid.
      aria-invalid={!!error}
      {...props}
    />
  )
})
FormControl.displayName = "FormControl"

// -----------------------------------------------------------------------------
// 8. Form Description Component
// -----------------------------------------------------------------------------

// Component for optional descriptive text under the input field.
const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  // Uses the hook to get the generated ID for the description.
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      // Sets the ID needed for the FormControl's aria-describedby attribute.
      id={formDescriptionId}
      // Styling: small text size and muted color.
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

// -----------------------------------------------------------------------------
// 9. Form Message Component
// -----------------------------------------------------------------------------

// Component to display validation error messages.
const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  // Uses the hook to get the error object and message ID.
  const { error, formMessageId } = useFormField()
  // Determines the content: either the error message from react-hook-form or fallback children props.
  const body = error ? String(error?.message ?? "") : children

  if (!body) {
    return null // Renders nothing if there is no error message or children content.
  }

  return (
    <p
      ref={ref}
      // Sets the ID needed for the FormControl's aria-describedby attribute during error state.
      id={formMessageId}
      // Styling: small text size, bold font, and destructive (red) color.
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

// -----------------------------------------------------------------------------
// 10. Exports
// -----------------------------------------------------------------------------

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}