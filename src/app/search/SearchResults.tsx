"use client";

import { useMemo } from "react";
import Fuse from "fuse.js";
import DOMPurify from "dompurify";
import { ProductGrid } from "@/components/product/ProductGrid";
import type { Product } from "@/types";

interface SearchResultsProps {
  query: string;
  products: Product[];
}

export function SearchResults({ query, products }: SearchResultsProps) {
  const fuse = useMemo(
    () =>
      new Fuse(products, {
        keys: [
          { name: "name", weight: 0.4 },
          { name: "category", weight: 0.3 },
          { name: "tags", weight: 0.2 },
          { name: "description", weight: 0.1 },
        ],
        threshold: 0.4,
      }),
    [products]
  );

  const results = useMemo(() => {
    const sanitized = DOMPurify.sanitize(query, { ALLOWED_TAGS: [] });
    if (!sanitized.trim()) return products;
    const found = fuse.search(sanitized);
    return found.map((r) => r.item);
  }, [query, products, fuse]);

  if (results.length === 0) {
    return (
      <p className="text-[#6E6E73]">
        No products found. Try a different search term.
      </p>
    );
  }

  return (
    <>
      <p className="text-[15px] text-[#6E6E73] mb-6">
        {results.length} result{results.length !== 1 ? "s" : ""} found
      </p>
      <ProductGrid products={results} />
    </>
  );
}
