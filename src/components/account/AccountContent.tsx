"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { Button } from "@/components/ui/Button";

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
}

interface AccountContentProps {
  session: Session;
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
                className="border-b border-[#e5e5e7] pb-4 last:border-0 last:pb-0"
              >
                <Link
                  href={`/account/orders/${order.id}`}
                  className="block hover:bg-[#ebebed] -mx-2 px-2 py-1 rounded-lg transition-colors"
                >
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#6E6E73]">
                      {order.order_number && (
                        <span className="font-medium text-[#1D1D1F] mr-2">
                          {order.order_number}
                        </span>
                      )}
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        dateStyle: "medium",
                      })}
                    </span>
                    <span className="font-medium">
                      ${(order.total / 100).toFixed(2)}
                    </span>
                  </div>
                  <ul className="text-[15px] text-[#1D1D1F]">
                    {order.items.map((item, i) => (
                      <li key={i}>
                        {item.name} × {item.quantity}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-[#6E6E73] mt-2">
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
