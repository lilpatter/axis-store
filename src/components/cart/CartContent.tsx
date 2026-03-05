"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/Button";
import { CheckoutButton } from "./CheckoutButton";
import { formatPrice } from "@/lib/utils";
import { ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";

export function CartContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "true";
  const canceled = searchParams.get("canceled") === "true";
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } =
    useCartStore();

  useEffect(() => {
    if (success) clearCart();
  }, [success, clearCart]);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        {success && (
          <div className="mb-4 space-y-2">
            <p className="text-green-600 font-medium">
              Payment successful! Thank you for your order.
            </p>
            <p className="text-sm text-[#6E6E73]">
              <Link
                href="/account"
                className="underline hover:text-[#1D1D1F]"
              >
                View your orders
              </Link>
            </p>
          </div>
        )}
        {canceled && (
          <p className="text-[#6E6E73] mb-4">
            Checkout was canceled. Your cart is still here when you&apos;re ready.
          </p>
        )}
        <ShoppingBag className="w-16 h-16 text-[#6E6E73] mb-4" />
        <h2 className="text-xl font-medium text-[#1D1D1F] mb-2">
          Your bag is empty
        </h2>
        <p className="text-[#6E6E73] mb-8">
          Add something you love to get started.
        </p>
        <Button asChild variant="primary" size="lg">
          <Link href="/shop">Shop Now</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex gap-6 py-6 border-b border-[#e5e5e7]"
          >
            <div className="relative w-24 h-32 shrink-0 rounded-lg overflow-hidden bg-[#F5F5F7]">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover"
                sizes="96px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <Link
                href={`/product/${item.slug}`}
                className="font-medium text-[#1D1D1F] hover:underline"
              >
                {item.name}
              </Link>
              {item.variant && (
                <p className="text-sm text-[#6E6E73] mt-0.5">{item.variant}</p>
              )}
              <p className="mt-2 font-medium">{formatPrice(item.price)}</p>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center border border-[#e5e5e7] rounded-lg">
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        Math.max(0, item.quantity - 1),
                        item.variant
                      )
                    }
                    className="w-10 h-10 flex items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F]"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        item.quantity + 1,
                        item.variant
                      )
                    }
                    className="w-10 h-10 flex items-center justify-center text-[#6E6E73] hover:text-[#1D1D1F]"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.productId, item.variant)}
                  className="flex items-center gap-1 text-sm text-[#6E6E73] hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="lg:col-span-1">
        <div className="sticky top-24 p-6 rounded-lg border border-[#e5e5e7] bg-[#F5F5F7]">
          <h3 className="text-lg font-medium text-[#1D1D1F] mb-4">
            Order Summary
          </h3>
          <div className="space-y-2 text-[15px]">
            <div className="flex justify-between">
              <span className="text-[#6E6E73]">Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6E6E73]">Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between pt-4 border-t border-[#e5e5e7] font-medium text-lg">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>
          <CheckoutButton />
        </div>
      </div>
    </div>
  );
}
