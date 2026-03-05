import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { getSupabaseAdmin } from "@/lib/supabase";
import { ProductForm } from "../ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return null;
  }

  const { id } = await params;
  const supabase = getSupabaseAdmin();
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !product) notFound();

  return (
    <div>
      <nav className="mb-6 text-sm text-[#6E6E73]">
        <Link href="/admin/products" className="hover:text-[#1D1D1F]">
          Products
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[#1D1D1F]">{product.name}</span>
      </nav>
      <h1 className="text-2xl font-semibold text-[#1D1D1F] mb-8">
        Edit product
      </h1>
      <ProductForm
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          price: product.price,
          original_price: product.original_price,
          category: product.category,
          sub_category: product.sub_category,
          description: product.description,
          images: product.images ?? [],
          sizes: product.sizes ?? [],
          colors: product.colors ?? [],
          badge: product.badge,
          in_stock: product.in_stock,
          sku: product.sku,
          brand: product.brand,
        }}
      />
    </div>
  );
}
