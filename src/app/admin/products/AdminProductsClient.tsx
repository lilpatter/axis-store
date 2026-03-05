"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  in_stock: boolean;
  images: string[];
  badge: string | null;
  created_at: string;
}

export function AdminProductsClient({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const [products, setProducts] = useState(initialProducts);

  const deleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } else {
      const json = await res.json();
      alert(json.error ?? "Failed to delete");
    }
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-[#e5e5e7] p-12 text-center">
        <p className="text-[#6E6E73] mb-4">
          No products yet. Add your first product to get started.
        </p>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1D1D1F] text-white text-sm font-medium hover:bg-[#333] transition-colors"
        >
          Add product
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-[#e5e5e7] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e5e5e7] bg-[#F5F5F7]">
              <th className="text-left py-3 px-4 font-medium">Product</th>
              <th className="text-left py-3 px-4 font-medium">Category</th>
              <th className="text-left py-3 px-4 font-medium">Price</th>
              <th className="text-left py-3 px-4 font-medium">Stock</th>
              <th className="text-left py-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-[#e5e5e7]">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded overflow-hidden bg-[#F5F5F7] shrink-0">
                      {p.images?.[0] ? (
                        <Image
                          src={p.images[0]}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#e5e5e7]" />
                      )}
                    </div>
                    <div>
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="font-medium text-[#1D1D1F] hover:underline"
                      >
                        {p.name}
                      </Link>
                      {p.badge && (
                        <span className="ml-2 text-xs px-1.5 py-0.5 rounded bg-zinc-200">
                          {p.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-[#6E6E73]">{p.category}</td>
                <td className="py-3 px-4">${Number(p.price).toFixed(2)}</td>
                <td className="py-3 px-4">
                  <span
                    className={
                      p.in_stock ? "text-green-600" : "text-amber-600"
                    }
                  >
                    {p.in_stock ? "In stock" : "Out of stock"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
