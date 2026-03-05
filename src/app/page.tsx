import { Hero } from "@/components/home/Hero";
import { FeaturedCategories } from "@/components/home/FeaturedCategories";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Banner } from "@/components/home/Banner";
import { TrendingSection } from "@/components/home/TrendingSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedCategories />
      <FeaturedProducts />
      <Banner />
      <TrendingSection />
    </>
  );
}
