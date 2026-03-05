import { getProducts } from "@/lib/shopify";
import { Hero } from "@/components/home/Hero";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Banner } from "@/components/home/Banner";
import { TrendingSection } from "@/components/home/TrendingSection";
import { categoriesList } from "@/lib/data/products";

export default async function HomePage() {
  const products = await getProducts();
  return (
    <>
      <Hero />
      <FeaturedCategories products={products} categories={categoriesList} />
      <FeaturedProducts products={products} />
      <Banner />
      <TrendingSection products={products} />
    </>
  );
}
