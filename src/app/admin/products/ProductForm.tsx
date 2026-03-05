"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    slug: string;
    price: number;
    original_price?: number | null;
    category: string;
    sub_category?: string | null;
    description?: string | null;
    images: string[];
    sizes: string[];
    colors: string[];
    badge?: string | null;
    in_stock: boolean;
    sku?: string | null;
    brand?: string | null;
  };
}

const BADGES = ["", "New", "Sale", "Bestseller"] as const;
const CATEGORIES = [
  "Clothing",
  "Shoes",
  "Jewellery",
  "Accessories",
  "Tech Accessories",
  "Home",
  "Uncategorized",
];

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    price: product?.price?.toString() ?? "",
    originalPrice: product?.original_price?.toString() ?? "",
    category: product?.category ?? "Uncategorized",
    subCategory: product?.sub_category ?? "",
    description: product?.description ?? "",
    images: (product?.images ?? []).join("\n"),
    sizes: (product?.sizes ?? []).join(", "),
    colors: (product?.colors ?? []).join(", "),
    badge: product?.badge ?? "",
    inStock: product?.in_stock ?? true,
    sku: product?.sku ?? "",
    brand: product?.brand ?? "",
  });

  const updateSlug = (name: string) => {
    setForm((f) => ({
      ...f,
      name,
      slug: product ? f.slug : slugify(name), // Only auto-slug when creating
    }));
  };

  const parseArray = (s: string) =>
    s
      .split(/[\n,]+/)
      .map((x) => x.trim())
      .filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim() || slugify(form.name),
        price: parseFloat(form.price) || 0,
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
        category: form.category || "Uncategorized",
        subCategory: form.subCategory || undefined,
        description: form.description || undefined,
        images: parseArray(form.images),
        sizes: parseArray(form.sizes),
        colors: parseArray(form.colors),
        badge: form.badge || undefined,
        inStock: form.inStock,
        sku: form.sku || undefined,
        brand: form.brand || undefined,
      };

      const url = product
        ? `/api/admin/products/${product.id}`
        : "/api/admin/products";
      const method = product ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Request failed");
      }
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="p-4 rounded-lg bg-red-50 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-[#1D1D1F] mb-1">
          Name *
        </label>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => updateSlug(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-[#e5e5e7] bg-white focus:ring-2 focus:ring-[#1D1D1F] focus:border-transparent"
          placeholder="Product name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1D1D1F] mb-1">
          Slug (URL)
        </label>
        <input
          type="text"
          value={form.slug}
          onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
          className="w-full px-4 py-2 rounded-lg border border-[#e5e5e7] bg-white focus:ring-2 focus:ring-[#1D1D1F] focus:border-transparent"
          placeholder="product-slug"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#1D1D1F] mb-1">
            Price *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            className="w-full px-4 py-2 rounded-lg border border-[#e5e5e7] bg-white focus:ring-2 focus:ring-[#1D1D1F] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1D1D1F] mb-1">
            Original price (if on sale)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.originalPrice}
            onChange={(e) => setForm((f) => ({ ...f, originalPrice: e.target.value }))}
            className="w-full px-4 py-2 rounded-lg border border-[#e5e5e7] bg-white focus:ring-2 focus:ring-[#1D1D1F] focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#1D1D1F] mb-1">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            className="w-full px-4 py-2 rounded-lg border border-[#e5e5e7] bg-white focus:ring-2 focus:ring-[#1D1D1F] focus:border-transparent"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1D1D1F] mb-1">
            Sub-category
          </label>
          <input
            type="text"
            value={form.subCategory}
            onChange={(e) => setForm((f) => ({ ...f, subCategory: e.target.value }))}
            className="w-full px-4 py-2 rounded-lg border border-[#e5e5e7] bg-white focus:ring-2 focus:ring-[#1D1D1F] focus:border-transparent"
            placeholder="e.g. t-shirts"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1D1D1F] mb-1">
          Description
        </label>
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="w-full px-4 py-2 rounded-lg border border-[#e5e5e7] bg-white focus:ring-2 focus:ring-[#1D1D1F] focus:border-transparent"
          placeholder="Product description"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#1D1D1F] mb-1">
          Image URLs
        </label>
        <textarea
          rows={3}
          value={form.images}
          onChange={(e) => setForm((f) => ({ ...f, images: e.target.value }))}
          className="w-full px-4 py-2 rounded-lg border border-[#e5e5e7] bg-white focus:ring-2 focus:ring-[#1D1D1F] focus:border-transparent font-mono text-sm"
          placeholder="One URL per line or comma-separated"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#1D1D1F] mb-1">
            Sizes
          </label>
          <input
            type="text"
            value={form.sizes}
            onChange={(e) => setForm((f) => ({ ...f, sizes: e.target.value }))}
            className="w-full px-4 py-2 rounded-lg border border-[#e5e5e7] bg-white focus:ring-2 focus:ring-[#1D1D1F] focus:border-transparent"
            placeholder="XS, S, M, L, XL"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1D1D1F] mb-1">
            Colors
          </label>
          <input
            type="text"
            value={form.colors}
            onChange={(e) => setForm((f) => ({ ...f, colors: e.target.value }))}
            className="w-full px-4 py-2 rounded-lg border border-[#e5e5e7] bg-white focus:ring-2 focus:ring-[#1D1D1F] focus:border-transparent"
            placeholder="Black, White, Grey"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#1D1D1F] mb-1">
            Badge
          </label>
          <select
            value={form.badge}
            onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
            className="w-full px-4 py-2 rounded-lg border border-[#e5e5e7] bg-white focus:ring-2 focus:ring-[#1D1D1F] focus:border-transparent"
          >
            {BADGES.map((b) => (
              <option key={b} value={b}>
                {b || "None"}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1D1D1F] mb-1">
            In stock
          </label>
          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={form.inStock}
              onChange={(e) => setForm((f) => ({ ...f, inStock: e.target.checked }))}
              className="rounded border-[#e5e5e7]"
            />
            <span className="text-sm">Available for purchase</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#1D1D1F] mb-1">
            SKU
          </label>
          <input
            type="text"
            value={form.sku}
            onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
            className="w-full px-4 py-2 rounded-lg border border-[#e5e5e7] bg-white focus:ring-2 focus:ring-[#1D1D1F] focus:border-transparent"
            placeholder="Optional"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#1D1D1F] mb-1">
            Brand
          </label>
          <input
            type="text"
            value={form.brand}
            onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
            className="w-full px-4 py-2 rounded-lg border border-[#e5e5e7] bg-white focus:ring-2 focus:ring-[#1D1D1F] focus:border-transparent"
            placeholder="Optional"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <Button type="submit" variant="primary" disabled={saving}>
          {saving ? "Saving…" : product ? "Save changes" : "Create product"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={saving}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
