import { ProductGrid } from "@/components/product/ProductGrid";
import type { Product } from "@/types";

interface FeaturedProductsProps {
  products: Product[];
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const newArrivals = products.slice(0, 4);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-2xl md:text-3xl font-semibold text-[#1D1D1F] mb-10"
          style={{ fontFamily: "var(--font-display), 'DM Sans', sans-serif" }}
        >
          New Arrivals
        </h2>
        <ProductGrid products={newArrivals} />
      </div>
    </section>
  );
}
