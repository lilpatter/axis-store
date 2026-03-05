import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";

async function getAdminStats() {
  const hasSupabase =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!hasSupabase)
    return { orderCount: 0, customerCount: 0, totalRevenue: 0, shippedCount: 0 };

  try {
    const supabase = getSupabaseAdmin();
    const { data: orders } = await supabase
      .from("orders")
      .select("id, total, order_status, email")
      .order("created_at", { ascending: false });

    const orderList = orders ?? [];
    const totalRevenue = orderList.reduce(
      (sum, o) => sum + ((o.total ?? 0) / 100),
      0
    );
    const shippedCount = orderList.filter(
      (o) => o.order_status === "shipped" || o.order_status === "delivered"
    ).length;
    const uniqueEmails = new Set(orderList.map((o) => o.email?.toLowerCase()).filter(Boolean));

    return {
      orderCount: orderList.length,
      customerCount: uniqueEmails.size,
      totalRevenue,
      shippedCount,
    };
  } catch {
    return { orderCount: 0, customerCount: 0, totalRevenue: 0, shippedCount: 0 };
  }
}

export default async function AdminPage() {
  const stats = await getAdminStats();

  return (
    <div>
      <h1
        className="text-2xl font-semibold text-[#1D1D1F] mb-8"
        style={{ fontFamily: "var(--font-display), 'DM Sans', sans-serif" }}
      >
        Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link
          href="/admin/orders"
          className="p-6 rounded-lg bg-white border border-[#e5e5e7] hover:border-[#1D1D1F]/20 transition-colors"
        >
          <p className="text-sm text-[#6E6E73]">Orders</p>
          <p className="text-2xl font-semibold text-[#1D1D1F] mt-1">
            {stats.orderCount}
          </p>
        </Link>
        <Link
          href="/admin/customers"
          className="p-6 rounded-lg bg-white border border-[#e5e5e7] hover:border-[#1D1D1F]/20 transition-colors"
        >
          <p className="text-sm text-[#6E6E73]">Customers</p>
          <p className="text-2xl font-semibold text-[#1D1D1F] mt-1">
            {stats.customerCount}
          </p>
        </Link>
        <div className="p-6 rounded-lg bg-white border border-[#e5e5e7]">
          <p className="text-sm text-[#6E6E73]">Revenue</p>
          <p className="text-2xl font-semibold text-[#1D1D1F] mt-1">
            ${stats.totalRevenue.toFixed(2)}
          </p>
        </div>
        <div className="p-6 rounded-lg bg-white border border-[#e5e5e7]">
          <p className="text-sm text-[#6E6E73]">Shipped</p>
          <p className="text-2xl font-semibold text-[#1D1D1F] mt-1">
            {stats.shippedCount}
          </p>
        </div>
      </div>
    </div>
  );
}
