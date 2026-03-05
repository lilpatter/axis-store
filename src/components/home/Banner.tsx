import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Banner() {
  return (
    <section className="py-16 md:py-24 bg-[#1D1D1F]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2
          className="text-2xl md:text-4xl font-semibold text-white max-w-2xl mx-auto"
          style={{ fontFamily: "var(--font-display), 'DM Sans', sans-serif" }}
        >
          Free shipping on orders over $100
        </h2>
        <p className="mt-4 text-[#6E6E73]">
          No code required. Applied at checkout.
        </p>
        <Button asChild variant="secondary" size="lg" className="mt-8 !border-white !text-white hover:!bg-white/10">
          <Link href="/shop">Shop Now</Link>
        </Button>
      </div>
    </section>
  );
}
