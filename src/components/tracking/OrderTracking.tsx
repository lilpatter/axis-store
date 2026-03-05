"use client";

import { useState, useEffect } from "react";

interface TrackingEvent {
  time?: string;
  description?: string;
  location?: string;
}

interface TrackingData {
  status: string;
  rawStatus?: string;
  deliveryTime?: string | null;
  carrier?: string | null;
  lastEvent?: { time?: string; description?: string; location?: string } | null;
  events: TrackingEvent[];
}

interface OrderTrackingProps {
  trackingNumber: string | null | undefined;
  orderId?: string | null;
}

const TRACKING_URL = "https://t.17track.net/en";

export function OrderTracking({ trackingNumber, orderId }: OrderTrackingProps) {
  const num = trackingNumber?.trim();
  const [data, setData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!num) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    const url = `/api/tracking?trackingNumber=${encodeURIComponent(num)}${orderId ? `&orderId=${encodeURIComponent(orderId)}` : ""}`;
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (json.error) {
          setError(json.message || json.error);
          return;
        }
        setData(json);
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load tracking");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [num, orderId]);

  return (
    <section className="p-6 rounded-lg border border-[#e5e5e7] bg-[#F5F5F7]">
      <h2 className="text-lg font-medium text-[#1D1D1F] mb-4">
        Package tracking
      </h2>
      {num ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[15px] text-[#1D1D1F]">
              Tracking number: <span className="font-medium">{num}</span>
            </p>
            {data?.carrier && (
              <span className="text-sm text-[#6E6E73]">via {data.carrier}</span>
            )}
          </div>

          {loading && (
            <p className="text-sm text-[#6E6E73]">Fetching latest status…</p>
          )}
          {error && !loading && (
            <p className="text-sm text-amber-600">{error}</p>
          )}

          {data && !loading && (
            <>
              <div className="flex flex-wrap gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    data.status === "delivered"
                      ? "bg-green-100 text-green-800"
                      : data.status === "shipped"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {data.status === "delivered"
                    ? "Delivered"
                    : data.status === "shipped"
                      ? "In transit"
                      : "Processing"}
                </span>
                {data.deliveryTime && (
                  <span className="text-sm text-[#6E6E73]">
                    Delivered {new Date(data.deliveryTime).toLocaleDateString()}
                  </span>
                )}
              </div>

              {data.events && data.events.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-[#1D1D1F] mb-2">
                    Tracking timeline
                  </h3>
                  <ul className="space-y-2 max-h-48 overflow-y-auto">
                    {data.events.map((e, i) => (
                      <li
                        key={i}
                        className="text-sm border-b border-[#e5e5e7] pb-2 last:border-0"
                      >
                        <span className="text-[#1D1D1F]">
                          {e.description ?? "—"}
                        </span>
                        {e.location && (
                          <span className="block text-[#6E6E73] text-xs">
                            {e.location}
                          </span>
                        )}
                        {e.time && (
                          <span className="block text-[#6E6E73] text-xs">
                            {new Date(e.time).toLocaleString()}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          <a
            href={`${TRACKING_URL}#nums=${encodeURIComponent(num)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1D1D1F] text-white text-[15px] font-medium hover:bg-[#424245] transition-colors"
          >
            Track on 17track →
          </a>
        </div>
      ) : (
        <p className="text-[15px] text-[#6E6E73]">
          Tracking information will appear here once your order has been
          shipped.
        </p>
      )}
    </section>
  );
}
