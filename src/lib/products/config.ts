/**
 * Product catalog configuration.
 * Ready for real items:
 * - Set SHOPIFY_* for Shopify Storefront API (see lib/shopify.ts)
 * - Or add your CMS/API in lib/products/source.ts
 * - Images: use full URLs in product data, or set NEXT_PUBLIC_PRODUCT_IMAGES_BASE
 *   to prefix relative paths (e.g. "/shirt-1.jpg" -> "https://cdn.example.com/shirt-1.jpg")
 */

const imagesBase = process.env.NEXT_PUBLIC_PRODUCT_IMAGES_BASE;

export function resolveImageUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  if (imagesBase) {
    return `${imagesBase.replace(/\/$/, "")}/${pathOrUrl.replace(/^\//, "")}`;
  }
  return pathOrUrl;
}
