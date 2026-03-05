import type { Product } from "@/types";

const SHOPIFY_STORE = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  priceRange: { minVariantPrice: { amount: string } };
  variants: { edges: { node: { id: string } }[] };
  images: { edges: { node: { url: string } }[] };
  tags: string[];
}

const productFragment = `
  id
  title
  handle
  description
  priceRange {
    minVariantPrice {
      amount
    }
  }
  variants(first: 1) {
    edges {
      node {
        id
      }
    }
  }
  images(first: 5) {
    edges {
      node {
        url
      }
    }
  }
  tags
`;

function shopifyProductToProduct(p: ShopifyProduct): Product {
  const img = p.images?.edges?.[0]?.node?.url ?? `https://picsum.photos/seed/${p.handle}/800/1000`;
  return {
    id: p.id,
    name: p.title,
    slug: p.handle,
    price: Math.round(parseFloat(p.priceRange?.minVariantPrice?.amount ?? "0") * 100) / 100,
    category: p.tags?.[0] ?? "Shop",
    description: p.description?.slice(0, 200) ?? "",
    images: p.images?.edges?.map((e) => e.node.url) ?? [img],
    inStock: true,
    rating: 4.5,
    reviewCount: 0,
    tags: p.tags ?? [],
    createdAt: new Date().toISOString(),
  };
}

export async function fetchShopifyProducts(): Promise<Product[] | null> {
  if (!SHOPIFY_STORE || !SHOPIFY_TOKEN) return null;

  try {
    const res = await fetch(
      `https://${SHOPIFY_STORE}/api/2024-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
        },
        body: JSON.stringify({
          query: `
            query GetProducts {
              products(first: 50) {
                edges {
                  node {
                    ${productFragment}
                  }
                }
              }
            }
          `,
        }),
      }
    );

    const json = await res.json();
    const products = json?.data?.products?.edges?.map(
      (e: { node: ShopifyProduct }) => shopifyProductToProduct(e.node)
    );
    return products ?? null;
  } catch (err) {
    console.error("Shopify fetch error:", err);
    return null;
  }
}

export async function getProducts(): Promise<Product[]> {
  const hasSupabase =
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (hasSupabase) {
    const { getProductsFromDb } = await import("@/lib/products/db");
    const dbProducts = await getProductsFromDb();
    if (dbProducts.length > 0) return dbProducts;
  }
  const shopify = await fetchShopifyProducts();
  if (shopify?.length) return shopify;
  const { products } = await import("@/lib/data/products");
  return products;
}

export async function getRelatedProducts(
  product: Product,
  limit = 4
): Promise<Product[]> {
  const all = await getProducts();
  return all
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, limit);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const hasSupabase =
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (hasSupabase) {
    const { getProductBySlugFromDb } = await import("@/lib/products/db");
    const db = await getProductBySlugFromDb(slug);
    if (db) return db;
  }
  if (!SHOPIFY_STORE || !SHOPIFY_TOKEN) {
    const { getProductBySlug: getStatic } = await import("@/lib/data/products");
    return getStatic(slug) ?? null;
  }

  try {
    const res = await fetch(
      `https://${SHOPIFY_STORE}/api/2024-01/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": SHOPIFY_TOKEN,
        },
        body: JSON.stringify({
          query: `
            query GetProduct($handle: String!) {
              product(handle: $handle) {
                ${productFragment}
              }
            }
          `,
          variables: { handle: slug },
        }),
      }
    );

    const json = await res.json();
    const node = json?.data?.product;
    if (!node) return null;
    return shopifyProductToProduct(node as ShopifyProduct);
  } catch (err) {
    console.error("Shopify product fetch error:", err);
  }
  const { getProductBySlug } = await import("@/lib/data/products");
  return getProductBySlug(slug) ?? null;
}
