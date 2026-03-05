"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { Product } from "@/types";
import { Price } from "@/components/ui/Price";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/Button";

interface ProductDetailClientProps {
  product: Product;
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] ?? "");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] ?? "");
  const addItem = useCartStore((s) => s.addItem);

  const variant =
    [selectedSize, selectedColor].filter(Boolean).join(" / ") || undefined;

  const handleAddToBag = () => {
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      quantity,
      image: product.images[0],
      variant,
    });
  };

  return (
    <div>
      {product.badge && (
        <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-full bg-[#F5F5F7] text-[#1D1D1F] mb-4">
          {product.badge}
        </span>
      )}
      <h1
        className="text-2xl md:text-3xl font-semibold text-[#1D1D1F]"
        style={{ fontFamily: "var(--font-display), 'DM Sans', sans-serif" }}
      >
        {product.name}
      </h1>
      <div className="mt-4 flex items-center gap-2">
        <span className="text-xl font-medium text-[#1D1D1F]">
          <Price value={product.price} />
        </span>
        {product.originalPrice && (
          <span className="text-[#6E6E73] line-through">
            <Price value={product.originalPrice} />
          </span>
        )}
      </div>
      <p className="mt-4 text-[15px] text-[#6E6E73] leading-relaxed">
        {product.description}
      </p>

      {product.sizes && product.sizes.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-medium text-[#1D1D1F] mb-2">Size</p>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`w-12 h-10 rounded-lg border text-sm font-medium transition-all hover:scale-105 ${
                  selectedSize === s
                    ? "border-black bg-black text-white"
                    : "border-[#e5e5e7] hover:border-[#6E6E73] hover:bg-[#F5F5F7]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.colors && product.colors.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-medium text-[#1D1D1F] mb-2">Color</p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedColor(c)}
                className={`px-4 h-10 rounded-lg border text-sm font-medium transition-all hover:scale-105 ${
                  selectedColor === c
                    ? "border-black bg-black text-white"
                    : "border-[#e5e5e7] hover:border-[#6E6E73] hover:bg-[#F5F5F7]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <p className="text-sm font-medium text-[#1D1D1F] mb-2">Quantity</p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-10 h-10 rounded-lg border border-[#e5e5e7] flex items-center justify-center text-lg hover:bg-[#F5F5F7] hover:border-[#6E6E73] transition-colors"
          >
            −
          </button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="w-10 h-10 rounded-lg border border-[#e5e5e7] flex items-center justify-center text-lg hover:bg-[#F5F5F7] hover:border-[#6E6E73] transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleAddToBag}
          disabled={!product.inStock}
        >
          Add to Bag
        </Button>
        <Link
          href="#"
          className="flex items-center justify-center gap-2 text-[15px] text-[#6E6E73] hover:text-[#1D1D1F]"
        >
          <Heart className="w-4 h-4" />
          Save to Wishlist
        </Link>
      </div>
    </div>
  );
}
