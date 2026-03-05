import { notFound } from "next/navigation";
import { getProducts } from "@/lib/shopify";
import { ShopContent } from "@/components/shop/ShopContent";

const slugToCategory: Record<string, string> = {
  clothing: "Clothing",
  shoes: "Shoes",
  jewellery: "Jewellery",
  accessories: "Accessories",
  "tech-accessories": "Tech Accessories",
  home: "Home",
};

interface PageProps {
  params: Promise<{ category: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { category: slug } = await params;
  const categoryName = slugToCategory[slug];

  if (!categoryName) {
    notFound();
  }

  const products = await getProducts();
  const categoryProducts = products.filter((p) => p.category === categoryName);

  return (
    <div>
      <header className="border-b border-[#e5e5e7] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1
            className="text-3xl md:text-4xl font-semibold text-[#1D1D1F]"
            style={{ fontFamily: "var(--font-display), 'DM Sans', sans-serif" }}
          >
            {categoryName}
          </h1>
          <p className="mt-2 text-[#6E6E73]">
            {categoryProducts.length} products
          </p>
        </div>
      </header>
      <ShopContent products={categoryProducts} categoryName={categoryName} />
    </div>
  );
}
