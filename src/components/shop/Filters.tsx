"use client";

import { useShopStore, type SortOption } from "@/store/shopStore";
import { products } from "@/lib/data/products";
import { cn } from "@/lib/utils";

const categorySlugs: Record<string, string> = {
  Clothing: "clothing",
  Shoes: "shoes",
  Jewellery: "jewellery",
  Accessories: "accessories",
  "Tech Accessories": "tech-accessories",
  Home: "home",
};

const categories = Array.from(
  new Set(products.map((p) => p.category))
).sort();

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name A-Z" },
];

export function Filters() {
  const {
    selectedCategories,
    priceMin,
    priceMax,
    sort,
    toggleCategory,
    setPriceRange,
    setSort,
    clearFilters,
  } = useShopStore();

  const hasFilters =
    selectedCategories.length > 0 || priceMin !== null || priceMax !== null;

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="sticky top-24 space-y-8">
        <div>
          <h3 className="text-sm font-medium text-[#1D1D1F] mb-3">Categories</h3>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat}>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="w-4 h-4 rounded border-[#6E6E73] text-black"
                  />
                  <span className="text-[15px] text-[#1D1D1F]">{cat}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-medium text-[#1D1D1F] mb-3">Price</h3>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              placeholder="Min"
              value={priceMin ?? ""}
              onChange={(e) =>
                setPriceRange(
                  e.target.value ? Number(e.target.value) : null,
                  priceMax
                )
              }
              className="w-24 h-10 px-3 rounded-lg border border-[#e5e5e7] text-[15px]"
            />
            <span className="text-[#6E6E73]">–</span>
            <input
              type="number"
              placeholder="Max"
              value={priceMax ?? ""}
              onChange={(e) =>
                setPriceRange(
                  priceMin,
                  e.target.value ? Number(e.target.value) : null
                )
              }
              className="w-24 h-10 px-3 rounded-lg border border-[#e5e5e7] text-[15px]"
            />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-[#1D1D1F] mb-3">Sort</h3>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="w-full h-10 px-3 rounded-lg border border-[#e5e5e7] text-[15px] bg-white"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-[#6E6E73] hover:text-[#1D1D1F] underline"
          >
            Clear all filters
          </button>
        )}
      </div>
    </aside>
  );
}
