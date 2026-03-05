"use client";

import { X } from "lucide-react";
import { useShopStore } from "@/store/shopStore";

export function ActiveFilters() {
  const {
    selectedCategories,
    priceMin,
    priceMax,
    clearFilters,
    toggleCategory,
    setPriceRange,
  } = useShopStore();

  const hasFilters =
    selectedCategories.length > 0 || priceMin !== null || priceMax !== null;

  if (!hasFilters) return null;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {selectedCategories.map((cat) => (
        <span
          key={cat}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F5F7] text-sm text-[#1D1D1F]"
        >
          {cat}
          <button
            onClick={() => toggleCategory(cat)}
            className="p-0.5 -m-0.5 hover:bg-black/10 rounded"
            aria-label={`Remove ${cat} filter`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      ))}
      {(priceMin !== null || priceMax !== null) && (
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F5F5F7] text-sm text-[#1D1D1F]">
          ${priceMin ?? 0} – ${priceMax ?? "∞"}
          <button
            onClick={() => setPriceRange(null, null)}
            className="p-0.5 -m-0.5 hover:bg-black/10 rounded"
            aria-label="Remove price filter"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      )}
      <button
        onClick={clearFilters}
        className="text-sm text-[#6E6E73] hover:text-[#1D1D1F] underline"
      >
        Clear all
      </button>
    </div>
  );
}
