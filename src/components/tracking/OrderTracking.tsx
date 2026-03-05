"use client";

interface OrderTrackingProps {
  trackingNumber: string | null | undefined;
}

const TRACKING_URL = "https://t.17track.net/en";

export function OrderTracking({ trackingNumber }: OrderTrackingProps) {
  const num = trackingNumber?.trim();

  return (
    <section className="p-6 rounded-lg border border-[#e5e5e7] bg-[#F5F5F7]">
      <h2 className="text-lg font-medium text-[#1D1D1F] mb-4">
        Package tracking
      </h2>
      {num ? (
        <div className="space-y-3">
          <p className="text-[15px] text-[#1D1D1F]">
            Tracking number: <span className="font-medium">{num}</span>
          </p>
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
          Tracking information will appear here once your order has been shipped.
        </p>
      )}
    </section>
  );
}
