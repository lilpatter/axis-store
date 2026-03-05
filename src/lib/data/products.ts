import type { Product } from "@/types";
import { resolveImageUrl } from "@/lib/products/config";

/**
 * Static product catalog. Replace with Shopify (set SHOPIFY_* env) or your CMS.
 * For real items: add images as full URLs or set NEXT_PUBLIC_PRODUCT_IMAGES_BASE.
 */

const categories = [
  "Clothing",
  "Shoes",
  "Jewellery",
  "Accessories",
  "Tech Accessories",
  "Home",
] as const;

/** Curated product-style images. Swap for your CDN URLs when adding real items. */
const IMAGE_BY_CATEGORY: Record<string, string[]> = {
  clothing: [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800&q=80",
    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80",
  ],
  shoes: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
    "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80",
  ],
  jewellery: [
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
    "https://images.unsplash.com/photo-1611652022419-a9419f74343c?w=800&q=80",
  ],
  accessories: [
    "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
    "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80",
  ],
  techaccessories: [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&q=80",
  ],
  home: [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80",
  ],
};

let imageIndex = 0;
function getCategoryImage(category: string): string {
  const key = category?.toLowerCase().replace(/\s/g, "") ?? "clothing";
  const arr = IMAGE_BY_CATEGORY[key] ?? IMAGE_BY_CATEGORY.clothing;
  const img = Array.isArray(arr) ? arr[imageIndex++ % arr.length] : arr;
  return typeof img === "string" ? img : IMAGE_BY_CATEGORY.clothing[0];
}

function makeProduct(
  overrides: Partial<Product> & Pick<Product, "name" | "price" | "category">
): Product {
  const slug =
    overrides.slug ??
    overrides.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  const id = overrides.id ?? slug;
  const defaultImg = getCategoryImage(overrides.category ?? "");
  const images = overrides.images?.length
    ? overrides.images.map((u) => resolveImageUrl(u))
    : [resolveImageUrl(defaultImg)];
  return {
    id,
    sku: overrides.sku,
    name: overrides.name,
    slug: overrides.slug ?? slug,
    price: overrides.price,
    originalPrice: overrides.originalPrice,
    category: overrides.category,
    subCategory: overrides.subCategory,
    description:
      overrides.description ??
      `${overrides.name}. Quality materials and craftsmanship.`,
    images,
    sizes: overrides.sizes,
    colors: overrides.colors,
    badge: overrides.badge,
    inStock: overrides.inStock ?? true,
    rating: overrides.rating ?? 4.5,
    reviewCount: overrides.reviewCount ?? 24,
    tags: overrides.tags ?? [overrides.category.toLowerCase()],
    createdAt: overrides.createdAt ?? new Date().toISOString(),
    brand: overrides.brand,
    metadata: overrides.metadata,
  };
}

export const products: Product[] = [
  // Clothing
  makeProduct({
    name: "Essential Cotton T-Shirt",
    slug: "essential-cotton-tshirt",
    price: 48,
    category: "Clothing",
    subCategory: "t-shirts",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "White", "Grey"],
    badge: "Bestseller",
  }),
  makeProduct({
    name: "Premium Hoodie",
    slug: "premium-hoodie",
    price: 128,
    category: "Clothing",
    subCategory: "hoodies",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Charcoal", "Navy"],
  }),
  makeProduct({
    name: "Classic Oxford Shirt",
    slug: "classic-oxford-shirt",
    price: 98,
    category: "Clothing",
    subCategory: "shirts",
    sizes: ["S", "M", "L", "XL"],
    badge: "New",
  }),
  makeProduct({
    name: "Oversized Wool Jacket",
    slug: "oversized-wool-jacket",
    price: 298,
    category: "Clothing",
    subCategory: "jackets",
    sizes: ["S", "M", "L"],
  }),
  makeProduct({
    name: "Minimal Crew Neck",
    slug: "minimal-crew-neck",
    price: 58,
    category: "Clothing",
    subCategory: "t-shirts",
    sizes: ["XS", "S", "M", "L"],
  }),
  makeProduct({
    name: "Tailored Blazer",
    slug: "tailored-blazer",
    price: 248,
    category: "Clothing",
    subCategory: "jackets",
    sizes: ["S", "M", "L", "XL"],
  }),

  // Shoes
  makeProduct({
    name: "Clean White Sneakers",
    slug: "clean-white-sneakers",
    price: 148,
    category: "Shoes",
    subCategory: "sneakers",
    sizes: ["7", "8", "9", "10", "11"],
    badge: "New",
  }),
  makeProduct({
    name: "Leather Derby Boots",
    slug: "leather-derby-boots",
    price: 268,
    category: "Shoes",
    subCategory: "boots",
    sizes: ["7", "8", "9", "10"],
  }),
  makeProduct({
    name: "Minimal Sandals",
    slug: "minimal-sandals",
    price: 78,
    category: "Shoes",
    subCategory: "sandals",
    sizes: ["6", "7", "8", "9", "10"],
  }),
  makeProduct({
    name: "Classic Loafers",
    slug: "classic-loafers",
    price: 198,
    category: "Shoes",
    subCategory: "loafers",
  }),

  // Jewellery
  makeProduct({
    name: "Sterling Silver Ring",
    slug: "sterling-silver-ring",
    price: 128,
    category: "Jewellery",
    subCategory: "rings",
    badge: "Sale",
    originalPrice: 168,
  }),
  makeProduct({
    name: "Geometric Pendant Necklace",
    slug: "geometric-pendant-necklace",
    price: 98,
    category: "Jewellery",
    subCategory: "necklaces",
  }),
  makeProduct({
    name: "Minimal Stud Earrings",
    slug: "minimal-stud-earrings",
    price: 68,
    category: "Jewellery",
    subCategory: "earrings",
    badge: "Bestseller",
  }),
  makeProduct({
    name: "Brushed Gold Bracelet",
    slug: "brushed-gold-bracelet",
    price: 158,
    category: "Jewellery",
    subCategory: "bracelets",
  }),

  // Accessories
  makeProduct({
    name: "Leather Tote Bag",
    slug: "leather-tote-bag",
    price: 228,
    category: "Accessories",
    subCategory: "bags",
  }),
  makeProduct({
    name: "Canvas Belt",
    slug: "canvas-belt",
    price: 58,
    category: "Accessories",
    subCategory: "belts",
  }),
  makeProduct({
    name: "Polarized Sunglasses",
    slug: "polarized-sunglasses",
    price: 148,
    category: "Accessories",
    subCategory: "sunglasses",
  }),
  makeProduct({
    name: "Wool Casual Cap",
    slug: "wool-casual-cap",
    price: 48,
    category: "Accessories",
    subCategory: "hats",
  }),

  // Tech Accessories
  makeProduct({
    name: "Leather Phone Case",
    slug: "leather-phone-case",
    price: 48,
    category: "Tech Accessories",
    subCategory: "phone-cases",
    badge: "New",
  }),
  makeProduct({
    name: "Braided USB-C Cable",
    slug: "braided-usb-c-cable",
    price: 28,
    category: "Tech Accessories",
    subCategory: "cables",
  }),
  makeProduct({
    name: "Tech Pouch",
    slug: "tech-pouch",
    price: 68,
    category: "Tech Accessories",
    subCategory: "pouches",
  }),

  // Home
  makeProduct({
    name: "Scented Soy Candle",
    slug: "scented-soy-candle",
    price: 38,
    category: "Home",
    subCategory: "candles",
  }),
  makeProduct({
    name: "Abstract Art Print",
    slug: "abstract-art-print",
    price: 78,
    category: "Home",
    subCategory: "prints",
  }),
  makeProduct({
    name: "Ceramic Mug",
    slug: "ceramic-mug",
    price: 32,
    category: "Home",
    subCategory: "mugs",
  }),
  makeProduct({
    name: "Linen Throw Pillow",
    slug: "linen-throw-pillow",
    price: 58,
    category: "Home",
    subCategory: "pillows",
  }),
];

export const categoriesList = categories;

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}
