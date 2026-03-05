import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const hasSupabase =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!hasSupabase) {
    return NextResponse.json({ products: [] });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admin products error:", error);
      return NextResponse.json({ products: [] });
    }
    return NextResponse.json({ products: data ?? [] });
  } catch {
    return NextResponse.json({ products: [] });
  }
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function parseArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.filter((x) => typeof x === "string");
  if (typeof val === "string") {
    return val
      .split(/[\n,]+/)
      .map((x) => x.trim())
      .filter(Boolean);
  }
  return [];
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const hasSupabase =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!hasSupabase) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const price = parseFloat(body.price);
    const category = String(body.category ?? "").trim();

    if (!name || Number.isNaN(price) || price < 0) {
      return NextResponse.json(
        { error: "Name and valid price required" },
        { status: 400 }
      );
    }

    const slug =
      String(body.slug ?? "").trim() || slugify(name);
    const images = parseArray(body.images);
    const sizes = parseArray(body.sizes);
    const colors = parseArray(body.colors);

    const row = {
      name,
      slug,
      price,
      original_price: body.originalPrice
        ? parseFloat(body.originalPrice)
        : null,
      category: category || "Uncategorized",
      sub_category: body.subCategory?.trim() || null,
      description: body.description?.trim() || "",
      images: images.length ? images : ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80"],
      sizes,
      colors,
      badge: ["New", "Sale", "Bestseller"].includes(body.badge) ? body.badge : null,
      in_stock: body.inStock !== false,
      sku: body.sku?.trim() || null,
      brand: body.brand?.trim() || null,
      metadata: body.metadata ?? {},
    };

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("products")
      .insert(row)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "A product with this slug already exists" },
          { status: 400 }
        );
      }
      console.error("Product create error:", error);
      return NextResponse.json(
        { error: error.message ?? "Failed to create product" },
        { status: 500 }
      );
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error("Product create error:", err);
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}
