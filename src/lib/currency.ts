/**
 * Locale-aware currency formatting.
 * Maps user's locale to their local currency and formats prices accordingly.
 *
 * Store prices are in USD. Conversion rates can be set via env vars:
 * NEXT_PUBLIC_EUR_RATE, NEXT_PUBLIC_GBP_RATE, etc. (e.g. "0.92" = 1 USD = 0.92 EUR)
 */

export type CurrencyCode = "USD" | "EUR" | "GBP" | "DKK" | "SEK" | "NOK" | "AUD" | "JPY" | "CAD";

/** Map locale/region codes to currency. Falls back to USD. */
const LOCALE_TO_CURRENCY: Record<string, CurrencyCode> = {
  "en-GB": "GBP",
  "en-AU": "AUD",
  "en-CA": "CAD",
  "ja-JP": "JPY",
  "da-DK": "DKK",
  "sv-SE": "SEK",
  "nb-NO": "NOK",
  "nn-NO": "NOK",
  // Eurozone
  "de-DE": "EUR",
  "fr-FR": "EUR",
  "es-ES": "EUR",
  "it-IT": "EUR",
  "nl-NL": "EUR",
  "be-BE": "EUR",
  "pt-PT": "EUR",
  "fi-FI": "EUR",
  "el-GR": "EUR",
};

/** Default conversion rates (1 USD = X). Override via env for live rates. */
const DEFAULT_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  DKK: 6.87,
  SEK: 10.49,
  NOK: 10.74,
  AUD: 1.53,
  JPY: 149.5,
  CAD: 1.36,
};

function getRate(currency: CurrencyCode): number {
  const envRate = typeof process !== "undefined" ? (process.env as Record<string, string>)[`NEXT_PUBLIC_${currency}_RATE`] : undefined;
  if (envRate) {
    const r = parseFloat(envRate);
    if (!Number.isNaN(r)) return r;
  }
  return DEFAULT_RATES[currency] ?? 1;
}

/** Derive currency code from a BCP 47 locale (e.g. "en-GB" -> "GBP"). */
export function getCurrencyForLocale(locale: string): CurrencyCode {
  const normalized = locale.trim().replace("_", "-");
  return LOCALE_TO_CURRENCY[normalized] ?? "USD";
}

/** Convert USD amount to target currency. */
export function convertFromUsd(usdAmount: number, currency: CurrencyCode): number {
  if (currency === "USD") return usdAmount;
  const rate = getRate(currency);
  return Math.round(usdAmount * rate * 100) / 100;
}

/** Zero-decimal currencies: amount is in whole units (e.g. JPY). */
const ZERO_DECIMAL_CURRENCIES: CurrencyCode[] = ["JPY"];

/** Convert price to Stripe unit_amount (smallest unit). USD $9.99 → 999. */
export function toStripeUnitAmount(usdPrice: number, currency: CurrencyCode): number {
  const amount = convertFromUsd(usdPrice, currency);
  if (ZERO_DECIMAL_CURRENCIES.includes(currency)) {
    return Math.round(amount);
  }
  return Math.round(amount * 100);
}

/**
 * Format a price for display. Store prices are in USD.
 * @param priceUsd - Price in USD (full amount, e.g. 98.00)
 * @param locale - BCP 47 locale (e.g. navigator.language). Defaults to "en-US".
 * @param options - Override currency or skip conversion.
 */
export function formatPriceLocale(
  priceUsd: number,
  locale: string = "en-US",
  options?: { currency?: CurrencyCode; convert?: boolean }
): string {
  const currency = options?.currency ?? getCurrencyForLocale(locale);
  const convert = options?.convert ?? true;
  const amount = convert ? convertFromUsd(priceUsd, currency) : priceUsd;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: currency === "JPY" ? 0 : 2,
  }).format(amount);
}
