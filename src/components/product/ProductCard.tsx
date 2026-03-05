"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      quantity: 1,
      image: product.images[0],
    });
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className={cn(
        "group block",
        "transition-all duration-200 ease-out",
        "hover:scale-[1.01] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]",
        className
      )}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-[#F5F5F7]">
        <Image
          src={product.images[0]}
          alt={product.name}
          width={800}
          height={1000}
          className="object-cover w-full h-full transition-transform duration-200 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {product.badge && (
          <span
            className={cn(
              "absolute top-3 left-3 px-2.5 py-1 text-xs font-medium rounded-full",
              product.badge === "Sale" && "bg-black text-white",
              product.badge === "New" && "bg-[#1D1D1F] text-white",
              product.badge === "Bestseller" && "bg-[#6E6E73] text-white"
            )}
          >
            {product.badge}
          </span>
        )}
        <button
          onClick={handleQuickAdd}
          className={cn(
            "absolute top-3 right-3 w-10 h-10 rounded-full",
            "bg-white text-black shadow-[0_2px_8px_rgba(0,0,0,0.06)]",
            "flex items-center justify-center",
            "opacity-0 group-hover:opacity-100 transition-all duration-200",
            "hover:bg-black hover:text-white hover:scale-110"
          )}
          aria-label={`Add ${product.name} to cart`}
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      <div className="mt-4">
        <p className="text-xs text-[#6E6E73] uppercase tracking-wider">
          {product.category}
        </p>
        <h3 className="mt-1 text-[15px] font-medium text-[#1D1D1F]">
          {product.name}
        </h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-[15px] font-medium text-[#1D1D1F]">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-[#6E6E73] line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
