import Link from "next/link";
import { products, categoriesList } from "@/lib/data/products";
import { slugify } from "@/lib/utils";

const categorySlugs: Record<string, string> = {
  Clothing: "clothing",
  Shoes: "shoes",
  Jewellery: "jewellery",
  Accessories: "accessories",
  "Tech Accessories": "tech-accessories",
  Home: "home",
};

export function FeaturedCategories() {
  const categories = categoriesList.map((name) => {
    const slug = categorySlugs[name] ?? slugify(name);
    const count = products.filter((p) => p.category === name).length;
    const firstProduct = products.find((p) => p.category === name);
    const image = firstProduct?.images[0] ?? `https://picsum.photos/seed/cat-${encodeURIComponent(name)}/400/400`;
    return { name, slug, count, image };
  });

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-2xl md:text-3xl font-semibold text-[#1D1D1F] mb-10"
          style={{ fontFamily: "var(--font-display), 'DM Sans', sans-serif" }}
        >
          Shop by Category
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible scrollbar-hide">
          {categories.map((cat, i) => (
            <Link
              key={cat.slug}
              href={`/shop/${cat.slug}`}
              className="group shrink-0 w-[280px] md:w-auto animate-in"
              style={{ animationDelay: `${150 + i * 80}ms` }}
            >
              <div className="relative aspect-square overflow-hidden rounded-lg bg-[#F5F5F7]">
                <img
                  src={cat.image}
                  alt=""
                  className="object-cover w-full h-full transition-transform duration-200 group-hover:scale-105"
                />
              </div>
              <p className="mt-4 text-[15px] font-medium text-[#1D1D1F] group-hover:text-[#6E6E73] transition-colors">
                {cat.name}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
