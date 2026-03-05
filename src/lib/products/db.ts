import type { Product } from "@/types";
import { getSupabaseAdmin } from "@/lib/supabase";

interface DbProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  original_price: number | null;
  category: string;
  sub_category: string | null;
  description: string | null;
  images: string[];
  sizes: string[];
  colors: string[];
  badge: string | null;
  in_stock: boolean;
  sku: string | null;
  brand: string | null;
  metadata: Record<string, string> | null;
  created_at: string;
}

function dbToProduct(row: DbProduct): Product {
  return {
    id: row.id,
    sku: row.sku ?? undefined,
    name: row.name,
    slug: row.slug,
    price: Number(row.price),
    originalPrice: row.original_price != null ? Number(row.original_price) : undefined,
    category: row.category,
    subCategory: row.sub_category ?? undefined,
    description: row.description ?? "",
    images: Array.isArray(row.images) ? row.images : [],
    sizes: Array.isArray(row.sizes) ? row.sizes : undefined,
    colors: Array.isArray(row.colors) ? row.colors : undefined,
    badge: (row.badge as Product["badge"]) ?? undefined,
    inStock: row.in_stock,
    rating: 4.5,
    reviewCount: 0,
    tags: [row.category.toLowerCase()],
    createdAt: row.created_at,
    brand: row.brand ?? undefined,
    metadata: row.metadata ?? undefined,
  };
}

export async function getProductsFromDb(): Promise<Product[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Products fetch error:", error);
    return [];
  }
  return (data ?? []).map((r) => dbToProduct(r as DbProduct));
}

export async function getProductBySlugFromDb(slug: string): Promise<Product | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) return null;
  return dbToProduct(data as DbProduct);
}
