import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { getSupabaseAdmin } from "@/lib/supabase";

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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json(data);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();

  const updates: Record<string, unknown> = {};

  if (body.name !== undefined) updates.name = String(body.name).trim();
  if (body.slug !== undefined) updates.slug = String(body.slug).trim() || slugify(body.name ?? "");
  if (body.price !== undefined) updates.price = parseFloat(body.price);
  if (body.originalPrice !== undefined) {
    updates.original_price = body.originalPrice ? parseFloat(body.originalPrice) : null;
  }
  if (body.category !== undefined) updates.category = String(body.category).trim();
  if (body.subCategory !== undefined) updates.sub_category = body.subCategory?.trim() || null;
  if (body.description !== undefined) updates.description = body.description?.trim() || "";
  if (body.images !== undefined) updates.images = parseArray(body.images);
  if (body.sizes !== undefined) updates.sizes = parseArray(body.sizes);
  if (body.colors !== undefined) updates.colors = parseArray(body.colors);
  if (body.badge !== undefined) {
    updates.badge = ["New", "Sale", "Bestseller"].includes(body.badge) ? body.badge : null;
  }
  if (body.inStock !== undefined) updates.in_stock = body.inStock !== false;
  if (body.sku !== undefined) updates.sku = body.sku?.trim() || null;
  if (body.brand !== undefined) updates.brand = body.brand?.trim() || null;
  if (body.metadata !== undefined) updates.metadata = body.metadata ?? {};

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "A product with this slug already exists" },
        { status: 400 }
      );
    }
    console.error("Product update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    console.error("Product delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
