import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { AdminProductsClient } from "./AdminProductsClient";
import { Plus } from "lucide-react";

async function getProducts() {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("products")
    .select("id, name, slug, price, category, in_stock, images, badge, created_at")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return null;
  }

  const hasSupabase =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  const products = hasSupabase ? await getProducts() : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-semibold text-[#1D1D1F]">Products</h1>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1D1D1F] text-white text-sm font-medium hover:bg-[#333] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add product
        </Link>
      </div>
      <AdminProductsClient initialProducts={products} />
    </div>
  );
}
