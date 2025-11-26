import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// -----------------------------------------------------------------------------
// 1. cn Utility Function
// -----------------------------------------------------------------------------

// Defines the 'cn' function, which combines multiple class strings and intelligently merges them.
export function cn(...inputs: ClassValue[]) {
  // 1. clsx(inputs): Takes an array of mixed inputs (strings, objects, arrays, conditional expressions) 
  //    and efficiently combines them into a single, clean class string.
  // 2. twMerge(...): Takes the single class string from clsx and resolves conflicts between Tailwind CSS classes.
  //    Example: If you pass "p-4 p-8", twMerge ensures only "p-8" is kept.
  return twMerge(clsx(inputs))
}