"use client";

import { useState } from "react";
import Link from "next/link";

const TRACKING_URL = "https://t.17track.net/en";

interface Order {
  id: string;
  order_number?: string | null;
  email: string;
  total: number;
  order_status?: string | null;
  tracking_number?: string | null;
  items?: Array<{ name?: string; quantity?: number }>;
  created_at: string;
}

export function AdminOrdersClient({
  initialOrders,
}: {
  initialOrders: Order[];
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [editing, setEditing] = useState<string | null>(null);
  const [tracking, setTracking] = useState("");
  const [status, setStatus] = useState("");

  const saveOrder = async (id: string) => {
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tracking_number: tracking || undefined,
        order_status: status || undefined,
      }),
    });
    if (res.ok) {
      const updated = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, ...updated } : o))
      );
      setEditing(null);
      setTracking("");
      setStatus("");
    }
  };

  return (
    <div className="bg-white rounded-lg border border-[#e5e5e7] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#e5e5e7] bg-[#F5F5F7]">
              <th className="text-left py-3 px-4 font-medium">Order</th>
              <th className="text-left py-3 px-4 font-medium">Customer</th>
              <th className="text-left py-3 px-4 font-medium">Total</th>
              <th className="text-left py-3 px-4 font-medium">Status</th>
              <th className="text-left py-3 px-4 font-medium">Tracking</th>
              <th className="text-left py-3 px-4 font-medium">Date</th>
              <th className="text-left py-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-[#e5e5e7]">
                <td className="py-3 px-4">
                  <Link
                    href={`/admin/orders/${o.id}`}
                    className="font-medium text-[#1D1D1F] hover:underline"
                  >
                    {o.order_number ?? o.id.slice(0, 8)}
                  </Link>
                </td>
                <td className="py-3 px-4 text-[#6E6E73]">{o.email}</td>
                <td className="py-3 px-4">
                  ${((o.total ?? 0) / 100).toFixed(2)}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${
                      o.order_status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : o.order_status === "shipped"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {o.order_status ?? "paid"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {o.tracking_number ? (
                    <a
                      href={`${TRACKING_URL}#nums=${encodeURIComponent(o.tracking_number)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1D1D1F] hover:underline"
                    >
                      {o.tracking_number}
                    </a>
                  ) : (
                    <span className="text-[#6E6E73]">—</span>
                  )}
                </td>
                <td className="py-3 px-4 text-[#6E6E73]">
                  {new Date(o.created_at).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  {editing === o.id ? (
                    <div className="flex flex-wrap gap-2">
                      <input
                        type="text"
                        placeholder="Tracking #"
                        value={tracking}
                        onChange={(e) => setTracking(e.target.value)}
                        className="w-32 h-8 px-2 text-xs border rounded"
                      />
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="h-8 px-2 text-xs border rounded"
                      >
                        <option value="">Status</option>
                        <option value="paid">Paid</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                      <button
                        onClick={() => saveOrder(o.id)}
                        className="h-8 px-3 text-xs bg-[#1D1D1F] text-white rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditing(null);
                          setTracking("");
                          setStatus("");
                        }}
                        className="h-8 px-3 text-xs border rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setEditing(o.id);
                        setTracking(o.tracking_number ?? "");
                        setStatus(o.order_status ?? "paid");
                      }}
                      className="text-[#1D1D1F] hover:underline text-xs"
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
