"use client";

import { create } from "zustand";

export type SortOption = "default" | "price-asc" | "price-desc" | "name";

interface ShopState {
  selectedCategories: string[];
  priceMin: number | null;
  priceMax: number | null;
  sort: SortOption;
  toggleCategory: (cat: string) => void;
  setPriceRange: (min: number | null, max: number | null) => void;
  setSort: (s: SortOption) => void;
  clearFilters: () => void;
}

export const useShopStore = create<ShopState>((set) => ({
  selectedCategories: [],
  priceMin: null,
  priceMax: null,
  sort: "default",

  toggleCategory: (cat) =>
    set((s) => ({
      selectedCategories: s.selectedCategories.includes(cat)
        ? s.selectedCategories.filter((c) => c !== cat)
        : [...s.selectedCategories, cat],
    })),

  setPriceRange: (min, max) =>
    set({ priceMin: min, priceMax: max }),

  setSort: (sort) => set({ sort }),

  clearFilters: () =>
    set({
      selectedCategories: [],
      priceMin: null,
      priceMax: null,
      sort: "default",
    }),
}));
