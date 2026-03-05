import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  getProductBySlug,
  getRelatedProducts,
} from "@/lib/shopify";
import { formatPrice } from "@/lib/utils";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { ProductGrid } from "@/components/product/ProductGrid";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = await getRelatedProducts(product);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <nav className="text-sm text-[#6E6E73] mb-8">
        <Link href="/shop" className="hover:text-[#1D1D1F]">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/shop/${product.category.toLowerCase().replace(" ", "-")}`}
          className="hover:text-[#1D1D1F]"
        >
          {product.category}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#1D1D1F]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        <div className="space-y-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-[#F5F5F7]">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <div
                  key={i}
                  className="relative w-20 h-24 shrink-0 rounded overflow-hidden bg-[#F5F5F7]"
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <ProductDetailClient product={product} />
      </div>

      {/* Tabs */}
      <div className="mt-16 border-t border-[#e5e5e7] pt-12">
        <div className="prose prose-neutral max-w-none">
          <h3 className="text-lg font-semibold text-[#1D1D1F] mb-4">
            Description
          </h3>
          <p className="text-[#6E6E73] leading-relaxed">{product.description}</p>
          <h3 className="text-lg font-semibold text-[#1D1D1F] mt-8 mb-4">
            Details
          </h3>
          <ul className="text-[#6E6E73] space-y-2">
            <li>Category: {product.category}</li>
            {product.subCategory && (
              <li>Type: {product.subCategory}</li>
            )}
            <li>Free shipping on orders over $100</li>
          </ul>
          <h3 className="text-lg font-semibold text-[#1D1D1F] mt-8 mb-4">
            Shipping
          </h3>
          <p className="text-[#6E6E73]">
            Standard shipping: 5–7 business days. Express available at
            checkout.
          </p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2
            className="text-2xl font-semibold text-[#1D1D1F] mb-10"
            style={{ fontFamily: "var(--font-display), 'DM Sans', sans-serif" }}
          >
            Related Products
          </h2>
          <ProductGrid products={related} />
        </section>
      )}
    </div>
  );
}
