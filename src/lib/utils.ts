/**
 * Tailwind class merger
 */
export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

import { formatPriceLocale } from "./currency";

/**
 * Format price for display.
 * Use on server or when locale is known. For client-side locale detection, use the Price component or useFormatPrice hook.
 * @param price - Price in USD (e.g. 98.00)
 * @param locale - Optional BCP 47 locale (e.g. "en-GB"). Defaults to "en-US".
 */
export function formatPrice(price: number, locale?: string): string {
  return formatPriceLocale(price, locale ?? "en-US");
}

/**
 * Convert string to URL-safe slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Escape HTML to prevent XSS (input sanitization fallback)
 */
export function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return str.replace(/[&<>"']/g, (c) => map[c] ?? c);
}
