"use client";

import { useMemo } from "react";
import { useShopStore } from "@/store/shopStore";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Filters } from "./Filters";
import { SortDropdown } from "./SortDropdown";
import { ActiveFilters } from "./ActiveFilters";
import type { Product } from "@/types";

interface ShopContentProps {
  products: Product[];
  categoryName?: string;
}

export function ShopContent({ products, categoryName }: ShopContentProps) {
  const { selectedCategories, priceMin, priceMax, sort } = useShopStore();

  const filteredAndSorted = useMemo(() => {
    let result = [...products];

    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }
    if (priceMin !== null) {
      result = result.filter((p) => p.price >= priceMin);
    }
    if (priceMax !== null) {
      result = result.filter((p) => p.price <= priceMax);
    }

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        break;
    }

    return result;
  }, [products, selectedCategories, priceMin, priceMax, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex flex-col lg:flex-row gap-10">
        <Filters />
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <p className="text-[15px] text-[#6E6E73]">
              Showing {filteredAndSorted.length} of {products.length} products
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[#6E6E73]">Sort:</span>
              <SortDropdown />
            </div>
          </div>
          <ActiveFilters />
          <div className="mt-6">
            <ProductGrid products={filteredAndSorted} />
          </div>
        </div>
      </div>
    </div>
  );
}
