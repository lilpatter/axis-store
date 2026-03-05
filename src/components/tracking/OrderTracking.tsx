"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

const TrackingMap = dynamic(
  () => import("./TrackingMap").then((m) => ({ default: m.TrackingMap })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-64 rounded-lg bg-[#F5F5F7] border border-[#e5e5e7] animate-pulse" />
    ),
  }
);

interface TrackingData {
  trackingNumber: string;
  carrierCode?: string;
  status?: string;
  originalCountry?: string;
  destinationCountry?: string;
  lastEvent?: string;
  lastUpdateTime?: string;
  latestLocation?: string | null;
  coordinates?: { lat: number; lon: number } | null;
  events?: Array<{
    date?: string;
    description?: string;
    location?: string;
  }>;
}

interface OrderTrackingProps {
  trackingNumber: string | null | undefined;
}

export function OrderTracking({ trackingNumber }: OrderTrackingProps) {
  const [input, setInput] = useState(trackingNumber ?? "");
  const [data, setData] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const autoFetched = useRef(false);

  const numToUse = (trackingNumber ?? input.trim()) || null;

  const fetchTracking = async () => {
    const num = input.trim();
    if (!num) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(
        `/api/tracking?trackingNumber=${encodeURIComponent(num)}`
      );
      const json = await res.json();
      if (!res.ok) {
        setError(json.message ?? json.error ?? "Could not fetch tracking");
        return;
      }
      setData(json);
    } catch {
      setError("Failed to load tracking");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch when order has a tracking number
  useEffect(() => {
    if (trackingNumber?.trim() && !autoFetched.current) {
      autoFetched.current = true;
      setInput(trackingNumber);
      const doFetch = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(
            `/api/tracking?trackingNumber=${encodeURIComponent(trackingNumber)}`
          );
          const json = await res.json();
          if (res.ok) setData(json);
          else setError(json.message ?? json.error ?? "Could not fetch tracking");
        } catch {
          setError("Failed to load tracking");
        } finally {
          setLoading(false);
        }
      };
      doFetch();
    }
  }, [trackingNumber]);

  return (
    <section className="p-6 rounded-lg border border-[#e5e5e7] bg-[#F5F5F7]">
      <h2 className="text-lg font-medium text-[#1D1D1F] mb-4">
        Package tracking
      </h2>

      {!numToUse ? (
        <p className="text-[15px] text-[#6E6E73] mb-4">
          Enter your tracking number to see where your package is.
        </p>
      ) : null}

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. CY012508740DE"
          className="flex-1 h-11 px-4 rounded-full border border-[#e5e5e7] text-[15px]"
          disabled={!!trackingNumber}
        />
        <button
          type="button"
          onClick={fetchTracking}
          disabled={loading || !input.trim()}
          className="px-5 h-11 rounded-full bg-[#1D1D1F] text-white text-[15px] font-medium hover:bg-[#424245] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Loading…" : "Track"}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-600 mb-4">{error}</p>
      )}

      {data && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="px-2 py-1 rounded bg-[#e5e5e7] text-[#1D1D1F]">
              {data.status ?? "—"}
            </span>
            {data.carrierCode && (
              <span className="text-[#6E6E73]">
                via {data.carrierCode}
              </span>
            )}
            {data.lastUpdateTime && (
              <span className="text-[#6E6E73]">
                Updated {new Date(data.lastUpdateTime).toLocaleDateString()}
              </span>
            )}
          </div>

          {data.lastEvent && (
            <p className="text-[15px] text-[#1D1D1F]">
              <span className="text-[#6E6E73]">Latest: </span>
              {data.lastEvent}
            </p>
          )}

          {data.events && data.events.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-[#1D1D1F] mb-2">
                Tracking history
              </h3>
              <ul className="space-y-2 text-sm max-h-40 overflow-y-auto">
                {data.events.map((e, i) => (
                  <li
                    key={i}
                    className="flex flex-col border-b border-[#e5e5e7] pb-2 last:border-0"
                  >
                    <span className="text-[#1D1D1F]">
                      {e.description ?? "—"}
                    </span>
                    {e.location && (
                      <span className="text-[#6E6E73] text-xs">
                        {e.location}
                      </span>
                    )}
                    {e.date && (
                      <span className="text-[#6E6E73] text-xs">
                        {e.date}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.coordinates && (
            <TrackingMap
              lat={data.coordinates.lat}
              lon={data.coordinates.lon}
              locationLabel={data.latestLocation ?? undefined}
            />
          )}

          {data.latestLocation && !data.coordinates && (
            <p className="text-sm text-[#6E6E73]">
              Last known location: {data.latestLocation} (map unavailable for
              this location)
            </p>
          )}
        </div>
      )}
    </section>
  );
}
