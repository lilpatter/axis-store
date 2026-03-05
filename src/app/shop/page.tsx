import { getProducts } from "@/lib/shopify";
import { ShopContent } from "@/components/shop/ShopContent";

export default async function ShopPage() {
  const products = await getProducts();
  return (
    <div>
      <header className="border-b border-[#e5e5e7] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1
            className="text-3xl md:text-4xl font-semibold text-[#1D1D1F]"
            style={{ fontFamily: "var(--font-display), 'DM Sans', sans-serif" }}
          >
            Shop All
          </h1>
          <p className="mt-2 text-[#6E6E73]">
            Explore our full collection of premium essentials.
          </p>
        </div>
      </header>
      <ShopContent products={products} />
    </div>
  );
}
