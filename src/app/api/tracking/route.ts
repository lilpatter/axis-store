import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { scrape17Track } from "@/lib/scrape-17track";

/** 17track API response structures */
interface TrackEvent {
  time_iso?: string;
  time_zone?: string;
  description?: string;
  location?: string;
  stage?: string;
}

interface TrackProvider {
  provider?: { name?: string; key?: number };
  events?: TrackEvent[];
}

interface TrackInfo {
  latest_status?: { status?: string; sub_status?: string };
  latest_event?: TrackEvent;
  time_metrics?: { delievery_time?: string };
  tracking?: { providers?: TrackProvider[] };
}

interface Track17Response {
  code?: number;
  data?: {
    accepted?: Array<{ number?: string; track_info?: TrackInfo }>;
    rejected?: unknown[];
  };
}

/** Map 17track status to our order_status */
function mapStatus(s: string | undefined): "paid" | "shipped" | "delivered" {
  const status = (s ?? "").toLowerCase();
  if (status === "delivered") return "delivered";
  if (
    [
      "intransit",
      "outfordelivery",
      "availableforpickup",
      "expired",
      "deliveryfailure",
      "exception",
    ].includes(status)
  ) {
    return "shipped";
  }
  return "paid";
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const trackingNumber = request.nextUrl.searchParams.get("trackingNumber");
  const orderId = request.nextUrl.searchParams.get("orderId");

  if (!trackingNumber?.trim()) {
    return NextResponse.json(
      { error: "Tracking number required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.TRACK17_API_KEY;

  try {
    let mappedStatus: "paid" | "shipped" | "delivered";
    let rawStatus: string;
    let deliveryTime: string | null;
    let carrier: string | null;
    let lastEvent: { time?: string; description?: string; location?: string } | null;
    let events: Array<{ time?: string; description?: string; location?: string }>;

    if (apiKey) {
      // Use 17track API when key is set
      const res = await fetch(
        "https://api.17track.net/track/v2.2/getRealTimeTrackInfo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "17token": apiKey,
          },
          body: JSON.stringify([
            {
              number: trackingNumber.trim(),
              cacheLevel: 0, // Standard: 1 quota, 3h cache
            },
          ]),
        }
      );

      const json: Track17Response = await res.json();

      if (json.code !== 0) {
        return NextResponse.json(
          {
            error: "Tracking not found",
            message: "Could not fetch tracking for this number.",
          },
          { status: 404 }
        );
      }

      const accepted = json.data?.accepted ?? [];
      const item = accepted[0];
      const trackInfo = item?.track_info;

      if (!trackInfo) {
        return NextResponse.json(
          { error: "No tracking data" },
          { status: 404 }
        );
      }

      rawStatus = trackInfo.latest_status?.status ?? "";
      mappedStatus = mapStatus(rawStatus);
      deliveryTime = trackInfo.time_metrics?.delievery_time ?? null;

      const providers = trackInfo.tracking?.providers ?? [];
      carrier = providers[0]?.provider?.name ?? null;
      lastEvent = trackInfo.latest_event
        ? {
            time: trackInfo.latest_event.time_iso,
            description: trackInfo.latest_event.description,
            location: trackInfo.latest_event.location,
          }
        : null;

      events = [];
      for (const p of providers) {
        for (const e of p.events ?? []) {
          events.push({
            time: e.time_iso ?? e.time_zone,
            description: e.description,
            location: e.location,
          });
        }
      }
      events.sort((a, b) => (b.time ?? "").localeCompare(a.time ?? ""));
    } else {
      // Fallback: scrape 17track (no API key — testing only)
      const scraped = await scrape17Track(trackingNumber.trim());
      mappedStatus = scraped.status;
      rawStatus = scraped.rawStatus;
      deliveryTime = scraped.deliveryTime;
      carrier = scraped.carrier;
      lastEvent = scraped.lastEvent;
      events = scraped.events;
    }

    // Update order in DB if orderId provided and belongs to user
    if (orderId?.trim()) {
      const hasSupabase =
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (hasSupabase) {
        const supabase = getSupabaseAdmin();
        const { data: order } = await supabase
          .from("orders")
          .select("id, email")
          .eq("id", orderId)
          .eq("email", session.user.email)
          .single();

        if (order?.id) {
          const { data: current } = await supabase
            .from("orders")
            .select("details")
            .eq("id", orderId)
            .single();
          const details = (current?.details ?? {}) as Record<string, unknown>;
          if (deliveryTime) details.delivery_time = deliveryTime;
          await supabase
            .from("orders")
            .update({ order_status: mappedStatus, details })
            .eq("id", orderId);
        }
      }
    }

    return NextResponse.json({
      status: mappedStatus,
      rawStatus,
      deliveryTime,
      carrier,
      lastEvent,
      events: events.slice(0, 20),
    });
  } catch (err) {
    console.error("Tracking API error:", err);
    return NextResponse.json(
      { error: "Tracking failed" },
      { status: 500 }
    );
  }
}
