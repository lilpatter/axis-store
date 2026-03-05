"use client";

import { useShopStore, type SortOption } from "@/store/shopStore";

const options: { value: SortOption; label: string }[] = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name A-Z" },
];

export function SortDropdown() {
  const { sort, setSort } = useShopStore();

  return (
    <select
      value={sort}
      onChange={(e) => setSort(e.target.value as SortOption)}
      className="h-10 px-4 rounded-lg border border-[#e5e5e7] text-[15px] bg-white"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
