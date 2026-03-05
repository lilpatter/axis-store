import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

interface OrderItem {
  name: string;
  quantity: number;
  amount_total: number;
}

interface OrderDetails {
  address?: {
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  payment_method?: {
    brand: string;
    last4: string;
    exp_month: number | null;
    exp_year: number | null;
  };
  customer_name?: string | null;
  phone?: string | null;
}

interface Order {
  id: string;
  order_number?: string | null;
  stripe_session_id: string;
  email: string;
  items: OrderItem[];
  total: number;
  details?: OrderDetails | null;
  created_at: string;
}

async function getOrder(
  id: string,
  email: string
): Promise<Order | null> {
  try {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      return null;
    }
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .eq("email", email)
      .single();
    if (error || !data) return null;
    return data as Order;
  } catch {
    return null;
  }
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/auth/signin?callbackUrl=/account");
  }

  const { id } = await params;
  const order = await getOrder(id, session.user.email);

  if (!order) {
    notFound();
  }

  let details: OrderDetails = {};
  if (typeof order.details === "object" && order.details !== null) {
    details = order.details;
  } else if (typeof order.details === "string") {
    try {
      const parsed = JSON.parse(order.details);
      details =
        typeof parsed === "object" && parsed !== null ? parsed : {};
    } catch {
      details = {};
    }
  }
  const address =
    typeof details.address === "object" && details.address !== null
      ? details.address
      : null;
  const pm =
    typeof details.payment_method === "object" && details.payment_method !== null
      ? details.payment_method
      : null;
  const brandDisplay =
    pm?.brand && pm.brand !== "card"
      ? pm.brand.charAt(0).toUpperCase() + pm.brand.slice(1)
      : "Card";
  let items: OrderItem[] = [];
  if (Array.isArray(order.items)) {
    items = order.items;
  } else if (typeof order.items === "string") {
    try {
      const parsed = JSON.parse(order.items);
      items = Array.isArray(parsed) ? parsed : [];
    } catch {
      items = [];
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/account"
        className="inline-flex items-center text-[15px] text-[#6E6E73] hover:text-[#1D1D1F] mb-8"
      >
        ← Back to account
      </Link>

      <h1
        className="text-2xl md:text-3xl font-semibold text-[#1D1D1F] mb-8"
        style={{ fontFamily: "var(--font-display), 'DM Sans', sans-serif" }}
      >
        Order {order.order_number ?? `#${order.id.slice(0, 8).toUpperCase()}`}
      </h1>

      <div className="space-y-6">
        {/* Order info */}
        <section className="p-6 rounded-lg border border-[#e5e5e7] bg-[#F5F5F7]">
          <h2 className="text-lg font-medium text-[#1D1D1F] mb-4">
            Order details
          </h2>
          <dl className="space-y-2 text-[15px]">
            {order.order_number && (
              <div className="flex justify-between">
                <dt className="text-[#6E6E73]">Order number</dt>
                <dd className="font-medium">{order.order_number}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-[#6E6E73]">Date</dt>
              <dd>
                {new Date(order.created_at).toLocaleString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-[#6E6E73]">Total</dt>
              <dd className="font-medium">
                ${((order.total ?? 0) / 100).toFixed(2)}
              </dd>
            </div>
          </dl>
        </section>

        {/* Items */}
        <section className="p-6 rounded-lg border border-[#e5e5e7] bg-[#F5F5F7]">
          <h2 className="text-lg font-medium text-[#1D1D1F] mb-4">
            Items
          </h2>
          <ul className="space-y-3">
            {items.map((item, i) => (
              <li
                key={i}
                className="flex justify-between text-[15px] border-b border-[#e5e5e7] pb-3 last:border-0 last:pb-0"
              >
                <span>
                  {item.name} × {item.quantity}
                </span>
                <span className="text-[#6E6E73]">
                  ${((item.amount_total ?? 0) / 100).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Shipping address */}
        {address && (
          <section className="p-6 rounded-lg border border-[#e5e5e7] bg-[#F5F5F7]">
            <h2 className="text-lg font-medium text-[#1D1D1F] mb-4">
              Shipping address
            </h2>
            <p className="text-[15px] text-[#1D1D1F] whitespace-pre-line">
              {details.customer_name && `${details.customer_name}\n`}
              {address.line1 ?? ""}
              {address.line2 ? `\n${address.line2}` : ""}
              {`\n${address.city ?? ""}${address.state ? `, ${address.state}` : ""} ${address.postal_code ?? ""}`}
              {`\n${address.country ?? ""}`}
            </p>
          </section>
        )}

        {/* Payment method */}
        {pm && (
          <section className="p-6 rounded-lg border border-[#e5e5e7] bg-[#F5F5F7]">
            <h2 className="text-lg font-medium text-[#1D1D1F] mb-4">
              Payment method
            </h2>
            <p className="text-[15px] text-[#1D1D1F]">
              {brandDisplay} •••• {pm.last4}
              {pm.exp_month != null && pm.exp_year != null && (
                <span className="text-[#6E6E73]">
                  {" "}
                  Expires {String(pm.exp_month).padStart(2, "0")}/
                  {pm.exp_year}
                </span>
              )}
            </p>
          </section>
        )}

        {/* Contact */}
        <section className="p-6 rounded-lg border border-[#e5e5e7] bg-[#F5F5F7]">
          <h2 className="text-lg font-medium text-[#1D1D1F] mb-4">
            Contact
          </h2>
          <dl className="space-y-2 text-[15px]">
            <div>
              <dt className="text-[#6E6E73]">Email</dt>
              <dd>{order.email}</dd>
            </div>
            {details.phone && (
              <div>
                <dt className="text-[#6E6E73]">Phone</dt>
                <dd>{details.phone}</dd>
              </div>
            )}
          </dl>
        </section>
      </div>
    </div>
  );
}
