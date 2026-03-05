import { AdminOrdersClient } from "./AdminOrdersClient";

async function getOrders() {
  const hasSupabase =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!hasSupabase) return [];

  const { getSupabaseAdmin } = await import("@/lib/supabase");
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <h1
        className="text-2xl font-semibold text-[#1D1D1F] mb-8"
        style={{ fontFamily: "var(--font-display), 'DM Sans', sans-serif" }}
      >
        Orders
      </h1>
      <AdminOrdersClient initialOrders={orders} />
    </div>
  );
}
