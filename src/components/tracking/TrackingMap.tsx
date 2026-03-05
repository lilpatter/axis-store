"use client";

import { useEffect, useRef } from "react";

interface TrackingMapProps {
  lat: number;
  lon: number;
  locationLabel?: string;
  className?: string;
}

export function TrackingMap({
  lat,
  lon,
  locationLabel,
  className = "",
}: TrackingMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;

      if (mapRef.current) {
        mapRef.current.remove();
      }

      const map = L.map(containerRef.current!).setView([lat, lon], 12);
      mapRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const icon = L.divIcon({
        className: "tracking-marker",
        html: `<div style="
          width: 24px;
          height: 24px;
          background: #1D1D1F;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker([lat, lon], { icon }).addTo(map);
    };

    initMap();
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [lat, lon]);

  return (
    <div className={className}>
      {locationLabel && (
        <p className="text-sm text-[#6E6E73] mb-2">{locationLabel}</p>
      )}
      <div
        ref={containerRef}
        className="w-full h-64 rounded-lg overflow-hidden border border-[#e5e5e7] bg-[#F5F5F7]"
      />
    </div>
  );
}
