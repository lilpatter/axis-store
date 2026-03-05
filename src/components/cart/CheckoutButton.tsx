"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/Button";

export function CheckoutButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { items, clearCart } = useCartStore();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          locale: navigator.language || "en-US",
          successUrl: `${window.location.origin}/cart?success=true`,
          cancelUrl: `${window.location.origin}/cart?canceled=true`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Checkout failed");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 space-y-2">
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      <Button
        variant="primary"
        size="lg"
        className="w-full"
        onClick={handleCheckout}
        disabled={loading || items.length === 0}
      >
        {loading ? "Redirecting to checkout..." : "Checkout"}
      </Button>
    </div>
  );
}
