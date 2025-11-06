import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a price number with thousand separators and LAK currency
 * @param price - Price number to format
 * @returns Formatted price string with commas and "ກີບ" suffix (e.g., "10,000 ກີບ")
 */
export function formatPrice(price: number): string {
  const formatted = Math.round(price).toLocaleString('en-US')
  return `${formatted} ກີບ`
}