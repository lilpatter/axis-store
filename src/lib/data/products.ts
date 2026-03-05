import type { Product } from "@/types";

// TODO: Replace static product data with Shopify Storefront API or custom CMS

const categories = [
  "Clothing",
  "Shoes",
  "Jewellery",
  "Accessories",
  "Tech Accessories",
  "Home",
] as const;

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
  const img = (seed: string) =>
    `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/1000`;
  return {
    id,
    name: overrides.name,
    slug: overrides.slug ?? slug,
    price: overrides.price,
    originalPrice: overrides.originalPrice,
    category: overrides.category,
    subCategory: overrides.subCategory,
    description:
      overrides.description ??
      `Premium ${overrides.name.toLowerCase()}. Crafted with care for everyday elegance.`,
    images: overrides.images ?? [img(id)],
    sizes: overrides.sizes,
    colors: overrides.colors,
    badge: overrides.badge,
    inStock: overrides.inStock ?? true,
    rating: overrides.rating ?? 4.5,
    reviewCount: overrides.reviewCount ?? 24,
    tags: overrides.tags ?? [overrides.category.toLowerCase()],
    createdAt: overrides.createdAt ?? new Date().toISOString(),
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
