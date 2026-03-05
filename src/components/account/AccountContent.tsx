"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { Button } from "@/components/ui/Button";
import { Package, Truck, CheckCircle, CreditCard } from "lucide-react";

interface OrderItem {
  name: string;
  quantity: number;
  amount_total: number;
}

interface Order {
  id: string;
  order_number?: string | null;
  stripe_session_id: string;
  items: OrderItem[];
  total: number;
  created_at: string;
  order_status?: string | null;
  tracking_number?: string | null;
  details?: Record<string, unknown>;
}

interface AccountContentProps {
  session: Session;
}

function StatusBadge({ status }: { status: string }) {
  const s = (status ?? "paid").toLowerCase();
  const styles =
    s === "delivered"
      ? "bg-green-100 text-green-800"
      : s === "shipped"
        ? "bg-blue-100 text-blue-800"
        : "bg-zinc-100 text-zinc-700";
  const label = s === "delivered" ? "Delivered" : s === "shipped" ? "Shipped" : "Paid";
  const Icon = s === "delivered" ? CheckCircle : s === "shipped" ? Truck : CreditCard;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${styles}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
}

export function AccountContent({ session }: AccountContentProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div className="p-6 rounded-lg border border-[#e5e5e7] bg-[#F5F5F7]">
        <h2 className="text-lg font-medium text-[#1D1D1F] mb-4">Profile</h2>
        <div className="space-y-2 text-[15px]">
          <p>
            <span className="text-[#6E6E73]">Name:</span>{" "}
            {session.user?.name ?? "—"}
          </p>
          <p>
            <span className="text-[#6E6E73]">Email:</span>{" "}
            {session.user?.email ?? "—"}
          </p>
        </div>
      </div>
      <div className="p-6 rounded-lg border border-[#e5e5e7] bg-[#F5F5F7]">
        <h2 className="text-lg font-medium text-[#1D1D1F] mb-4">Orders</h2>
        {loading ? (
          <p className="text-[15px] text-[#6E6E73]">Loading orders…</p>
        ) : orders.length === 0 ? (
          <p className="text-[15px] text-[#6E6E73]">
            No orders yet. Orders placed with this email will appear here.
          </p>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => (
              <li
                key={order.id}
                className="border border-[#e5e5e7] rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
              >
                <Link
                  href={`/account/orders/${order.id}`}
                  className="block p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {order.order_number && (
                        <span className="font-semibold text-[#1D1D1F]">
                          {order.order_number}
                        </span>
                      )}
                      <StatusBadge status={order.order_status ?? "paid"} />
                      {order.tracking_number && (
                        <span className="text-xs text-[#6E6E73] flex items-center gap-1">
                          <Package className="w-3.5 h-3.5" />
                          {order.tracking_number}
                        </span>
                      )}
                    </div>
                    <span className="font-medium text-[#1D1D1F]">
                      ${(order.total / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-sm text-[#6E6E73] mb-2">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                  <ul className="text-[15px] text-[#1D1D1F] space-y-0.5">
                    {order.items.map((item, i) => (
                      <li key={i}>
                        {item.name} × {item.quantity}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-[#6E6E73] mt-3 font-medium">
                    View details →
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Button variant="secondary" onClick={() => signOut()}>
        Sign out
      </Button>
    </div>
  );
}
