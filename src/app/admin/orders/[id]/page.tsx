import { notFound } from "next/navigation";
import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";

async function getOrder(id: string) {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .single();
  return data;
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  const items = Array.isArray(order.items) ? order.items : [];
  const details = typeof order.details === "object" && order.details ? order.details : {};
  const address = details.address;

  return (
    <div>
      <Link
        href="/admin/orders"
        className="text-sm text-[#6E6E73] hover:text-[#1D1D1F] mb-6 inline-block"
      >
        ← Back to orders
      </Link>
      <h1
        className="text-2xl font-semibold text-[#1D1D1F] mb-8"
        style={{ fontFamily: "var(--font-display), 'DM Sans', sans-serif" }}
      >
        Order {order.order_number ?? id.slice(0, 8)}
      </h1>
      <div className="space-y-6">
        <div className="p-6 bg-white rounded-lg border border-[#e5e5e7]">
          <h2 className="font-medium mb-4">Details</h2>
          <dl className="grid grid-cols-2 gap-2 text-sm">
            <dt className="text-[#6E6E73]">Email</dt>
            <dd>{order.email}</dd>
            <dt className="text-[#6E6E73]">Status</dt>
            <dd>{order.order_status ?? "paid"}</dd>
            <dt className="text-[#6E6E73]">Tracking</dt>
            <dd>
              {order.tracking_number ? (
                <a
                  href={`https://t.17track.net/en#nums=${encodeURIComponent(order.tracking_number)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {order.tracking_number}
                </a>
              ) : (
                "—"
              )}
            </dd>
            <dt className="text-[#6E6E73]">Total</dt>
            <dd>${((order.total ?? 0) / 100).toFixed(2)}</dd>
          </dl>
        </div>
        {address && (
          <div className="p-6 bg-white rounded-lg border border-[#e5e5e7]">
            <h2 className="font-medium mb-4">Shipping address</h2>
            <p className="text-sm whitespace-pre-line">
              {details.customer_name && `${details.customer_name}\n`}
              {address.line1}
              {address.line2 ? `\n${address.line2}` : ""}
              {`\n${address.city ?? ""}${address.state ? `, ${address.state}` : ""} ${address.postal_code ?? ""}`}
              {`\n${address.country ?? ""}`}
            </p>
          </div>
        )}
        <div className="p-6 bg-white rounded-lg border border-[#e5e5e7]">
          <h2 className="font-medium mb-4">Items</h2>
          <ul className="space-y-2">
            {items.map((item: { name?: string; quantity?: number }, i: number) => (
              <li key={i} className="text-sm">
                {item.name ?? "Item"} × {item.quantity ?? 0}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
