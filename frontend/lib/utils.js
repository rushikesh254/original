/**
 * UI UTILITIES
 * Small helper functions used across the frontend.
 */

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

/**
 * CN (Class Name Merger)
 * This is a standard shadcn/ui utility. 
 * It helps combine Tailwind CSS classes without common "Class Conflicts".
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
