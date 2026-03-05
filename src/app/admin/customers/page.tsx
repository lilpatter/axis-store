import { getSupabaseAdmin } from "@/lib/supabase";

async function getCustomers() {
  const hasSupabase =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!hasSupabase) return [];

  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("orders")
    .select("email, details, created_at")
    .order("created_at", { ascending: false });

  const byEmail = new Map<
    string,
    { email: string; name?: string; orderCount: number; lastOrder: string }
  >();
  for (const row of data ?? []) {
    const email = (row as { email?: string }).email?.toLowerCase().trim();
    if (!email) continue;
    const details = (row as { details?: { customer_name?: string } }).details;
    const name = details?.customer_name;
    const createdAt = (row as { created_at?: string }).created_at ?? "";
    const existing = byEmail.get(email);
    if (existing) {
      existing.orderCount += 1;
      if (createdAt > existing.lastOrder) existing.lastOrder = createdAt;
    } else {
      byEmail.set(email, { email, name, orderCount: 1, lastOrder: createdAt });
    }
  }
  return Array.from(byEmail.values()).sort((a, b) =>
    b.lastOrder.localeCompare(a.lastOrder)
  );
}

export default async function AdminCustomersPage() {
  const customers = await getCustomers();

  return (
    <div>
      <h1
        className="text-2xl font-semibold text-[#1D1D1F] mb-8"
        style={{ fontFamily: "var(--font-display), 'DM Sans', sans-serif" }}
      >
        Customers
      </h1>
      <div className="bg-white rounded-lg border border-[#e5e5e7] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e5e5e7] bg-[#F5F5F7]">
              <th className="text-left py-3 px-4 font-medium">Email</th>
              <th className="text-left py-3 px-4 font-medium">Name</th>
              <th className="text-left py-3 px-4 font-medium">Orders</th>
              <th className="text-left py-3 px-4 font-medium">Last order</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.email} className="border-b border-[#e5e5e7]">
                <td className="py-3 px-4">{c.email}</td>
                <td className="py-3 px-4 text-[#6E6E73]">{c.name ?? "—"}</td>
                <td className="py-3 px-4">{c.orderCount}</td>
                <td className="py-3 px-4 text-[#6E6E73]">
                  {c.lastOrder
                    ? new Date(c.lastOrder).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
