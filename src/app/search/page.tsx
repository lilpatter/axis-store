import { Suspense } from "react";
import { getProducts } from "@/lib/shopify";
import { SearchResults } from "./SearchResults";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const products = await getProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1
        className="text-2xl md:text-3xl font-semibold text-[#1D1D1F] mb-8"
        style={{ fontFamily: "var(--font-display), 'DM Sans', sans-serif" }}
      >
        {q ? `Search: "${q}"` : "Search"}
      </h1>
      <Suspense fallback={<p className="text-[#6E6E73]">Loading...</p>}>
        <SearchResults query={q ?? ""} products={products} />
      </Suspense>
    </div>
  );
}
