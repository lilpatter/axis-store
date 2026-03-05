import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-[#F5F5F7]"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)`,
        backgroundSize: "48px 48px",
      }}
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40">
        <div
          className="max-w-2xl animate-in"
          style={{ animationDelay: "100ms", animationDuration: "700ms" }}
        >
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-[#1D1D1F] leading-[1.1]"
            style={{ fontFamily: "var(--font-display), 'DM Sans', sans-serif" }}
          >
            Design that speaks
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-[#6E6E73] max-w-xl leading-relaxed">
            Premium essentials for everyday life. Minimal, intentional, crafted.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button asChild variant="primary" size="lg">
              <Link href="/shop">Shop Now</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/shop#categories">Explore</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
