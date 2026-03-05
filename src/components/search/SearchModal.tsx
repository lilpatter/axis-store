"use client";

import { useEffect, useCallback, useRef, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import DOMPurify from "dompurify";
import { Search, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Product } from "@/types";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (open) fetch("/api/products").then((r) => r.json()).then(setProducts);
  }, [open]);

  const fuse = useMemo(
    () =>
      new Fuse(products, {
        keys: [
          { name: "name", weight: 0.4 },
          { name: "category", weight: 0.3 },
          { name: "tags", weight: 0.2 },
          { name: "description", weight: 0.1 },
        ],
        includeScore: true,
        threshold: 0.4,
      }),
    [products]
  );

  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    const sanitized = DOMPurify.sanitize(debouncedQuery, { ALLOWED_TAGS: [] });
    const found = fuse.search(sanitized);
    return found.slice(0, 8).map((r) => r.item);
  }, [debouncedQuery, fuse]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" && query.trim()) {
        onClose();
        router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      }
    },
    [onClose, query, router]
  );

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
      setQuery("");
    }
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-white"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-4">
        <div className="flex items-center gap-4 border-b border-[#e5e5e7] pb-4">
          <Search className="w-6 h-6 text-[#6E6E73] shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search products..."
            className="flex-1 bg-transparent text-xl text-[#1D1D1F] placeholder:text-[#6E6E73] outline-none border-none"
            autoComplete="off"
          />
          <button
            onClick={onClose}
            className="p-2 -m-2 text-[#6E6E73] hover:text-[#1D1D1F]"
            aria-label="Close search"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6">
          {query.trim() ? (
            <>
              {results.length > 0 ? (
                <ul className="space-y-2">
                  {results.map((product) => (
                    <li key={product.id}>
                      <Link
                        href={`/product/${product.slug}`}
                        onClick={onClose}
                        className={cn(
                          "flex items-center gap-4 p-3 rounded-lg",
                          "hover:bg-[#F5F5F7] transition-colors"
                        )}
                      >
                        <div className="relative w-14 h-14 rounded overflow-hidden bg-[#F5F5F7] shrink-0 aspect-square">
                          <img
                            src={product.images[0]}
                            alt=""
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-[#1D1D1F] truncate">
                            {product.name}
                          </p>
                          <p className="text-sm text-[#6E6E73]">
                            {product.category} · {formatPrice(product.price)}
                          </p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#6E6E73] py-4">No results found.</p>
              )}
              {query.trim() && (
                <p className="mt-4 text-sm text-[#6E6E73]">
                  Press Enter to see all results
                </p>
              )}
            </>
          ) : (
            <p className="text-[#6E6E73] py-4">Start typing to search...</p>
          )}
        </div>
      </div>
    </div>
  );
}
