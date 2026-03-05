import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface TracktryTrackInfo {
  Date?: string;
  StatusDescription?: string;
  Details?: string;
  checkpoint_status?: string;
}

interface TracktryOrigin {
  trackinfo?: TracktryTrackInfo[];
}

interface TracktryItem {
  id?: string;
  tracking_number?: string;
  carrier_code?: string;
  status?: string;
  original_country?: string;
  destination_country?: string;
  lastEvent?: string;
  lastUpdateTime?: string;
  origin_info?: TracktryOrigin;
  destination_info?: TracktryOrigin;
}

interface TracktryResponse {
  meta?: { code?: number; message?: string };
  data?: { items?: TracktryItem[] };
}

/** Extract latest location from Tracktry trackinfo (Details field) */
function getLatestLocation(item: TracktryItem): string | null {
  const sources = [item.destination_info, item.origin_info].filter(Boolean);
  let latest: TracktryTrackInfo | null = null;
  let latestDate = "";

  for (const src of sources) {
    const info = src as TracktryOrigin;
    const trackinfo = info?.trackinfo ?? [];
    for (const t of trackinfo) {
      const date = t.Date ?? "";
      if (date && date > latestDate && t.Details?.trim()) {
        latestDate = date;
        latest = t;
      }
    }
  }
  return latest?.Details?.trim() ?? null;
}

/** Geocode location string using Nominatim (OpenStreetMap) */
async function geocode(
  location: string,
  country?: string
): Promise<{ lat: number; lon: number } | null> {
  const query = country ? `${location}, ${country}` : location;
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;
  const res = await fetch(url, {
    headers: { "User-Agent": "AXIS-Store/1.0" },
  });
  const data = await res.json();
  const first = Array.isArray(data) ? data[0] : null;
  if (first?.lat && first?.lon) {
    return { lat: parseFloat(first.lat), lon: parseFloat(first.lon) };
  }
  return null;
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const trackingNumber = request.nextUrl.searchParams.get("trackingNumber");
  if (!trackingNumber?.trim()) {
    return NextResponse.json(
      { error: "Tracking number required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.TRACKTRY_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "Tracking not configured",
        message: "Add TRACKTRY_API_KEY to enable package tracking.",
      },
      { status: 503 }
    );
  }

  try {
    const res = await fetch("https://api.tracktry.com/v1/trackings/realtime", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Tracktry-Api-Key": apiKey,
      },
      body: JSON.stringify({
        tracking_number: trackingNumber.trim(),
        carrier_code: "", // auto-detect
      }),
    });

    const json: TracktryResponse = await res.json();
    const code = json.meta?.code ?? 0;

    if (code !== 200 && code !== 201) {
      return NextResponse.json(
        {
          error: "Tracking not found",
          message: json.meta?.message ?? "Could not find this tracking number.",
        },
        { status: 404 }
      );
    }

    const items = json.data?.items ?? [];
    const item = items[0];
    if (!item) {
      return NextResponse.json(
        { error: "No tracking data" },
        { status: 404 }
      );
    }

    const locationStr = getLatestLocation(item);
    let coordinates: { lat: number; lon: number } | null = null;
    if (locationStr) {
      coordinates = await geocode(
        locationStr,
        item.destination_country ?? item.original_country ?? undefined
      );
    }

    const trackinfo = [
      ...(item.destination_info?.trackinfo ?? []),
      ...(item.origin_info?.trackinfo ?? []),
    ].sort((a, b) => (b.Date ?? "").localeCompare(a.Date ?? ""));

    return NextResponse.json({
      trackingNumber: item.tracking_number,
      carrierCode: item.carrier_code,
      status: item.status,
      originalCountry: item.original_country,
      destinationCountry: item.destination_country,
      lastEvent: item.lastEvent,
      lastUpdateTime: item.lastUpdateTime,
      latestLocation: locationStr,
      coordinates,
      events: trackinfo.slice(0, 10).map((e) => ({
        date: e.Date,
        description: e.StatusDescription,
        location: e.Details,
      })),
    });
  } catch (err) {
    console.error("Tracking API error:", err);
    return NextResponse.json(
      { error: "Tracking failed" },
      { status: 500 }
    );
  }
}
