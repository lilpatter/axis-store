"use client";

import { useState, useEffect } from "react";
import { formatPriceLocale } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface PriceProps {
  /** Price in USD */
  value: number;
  /** For amounts stored in cents, pass true to divide by 100 */
  fromCents?: boolean;
  className?: string;
}

/**
 * Client component that formats price according to the user's locale/currency.
 * Uses navigator.language to match their location.
 */
export function Price({ value, fromCents = false, className }: PriceProps) {
  const [formatted, setFormatted] = useState(() =>
    formatPriceLocale(fromCents ? value / 100 : value, "en-US")
  );

  useEffect(() => {
    const locale = typeof navigator !== "undefined" ? navigator.language : "en-US";
    setFormatted(
      formatPriceLocale(fromCents ? value / 100 : value, locale)
    );
  }, [value, fromCents]);

  return <span className={cn(className)}>{formatted}</span>;
}
