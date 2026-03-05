import { products } from "@/lib/data/products";
import { ProductGrid } from "@/components/product/ProductGrid";

export function TrendingSection() {
  const trending = products
    .filter((p) => p.badge === "Bestseller" || p.rating >= 4.5)
    .slice(0, 4);

  return (
    <section className="py-16 md:py-24 bg-[#F5F5F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-2xl md:text-3xl font-semibold text-[#1D1D1F] mb-10"
          style={{ fontFamily: "var(--font-display), 'DM Sans', sans-serif" }}
        >
          Trending Now
        </h2>
        <ProductGrid products={trending} />
      </div>
    </section>
  );
}
