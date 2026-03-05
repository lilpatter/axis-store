import { Suspense } from "react";
import { CartContent } from "@/components/cart/CartContent";

export default function CartPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1
        className="text-2xl md:text-3xl font-semibold text-[#1D1D1F] mb-10"
        style={{ fontFamily: "var(--font-display), 'DM Sans', sans-serif" }}
      >
        Your Bag
      </h1>
      <Suspense fallback={<div className="animate-pulse h-48 bg-[#F5F5F7] rounded-lg" />}>
        <CartContent />
      </Suspense>
    </div>
  );
}
