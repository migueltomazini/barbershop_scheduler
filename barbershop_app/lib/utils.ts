// Utility function to handle dynamic className merging in Tailwind CSS projects.
// It combines the power of `clsx` (for conditional classNames) and `tailwind-merge`
// (for intelligently resolving conflicting Tailwind classes, e.g., "p-2" vs "p-4").

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Tailwind configuration for dynamic additions
export const config = {
  theme: {}
}
