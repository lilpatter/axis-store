import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * Webhook for shipping providers (ShipStation, Shippo, EasyPost, etc.) to push
 * tracking numbers when an order is shipped.
 * Configure your provider to POST here with:
 * - order_number (e.g. AXIS-100001) or stripe_session_id
 * - tracking_number
 * Authorization: Bearer SHIPPING_WEBHOOK_SECRET
 */
export async function POST(request: NextRequest) {
  const secret = request.headers.get("authorization")?.replace("Bearer ", "");
  const expected = process.env.SHIPPING_WEBHOOK_SECRET;
  if (!expected || secret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const tracking = body.tracking_number?.trim();
    const orderRef = body.order_number ?? body.order_id ?? body.stripe_session_id;

    if (!tracking || !orderRef) {
      return NextResponse.json(
        { error: "tracking_number and order_number (or order_id) required" },
        { status: 400 }
      );
    }

    const hasSupabase =
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!hasSupabase) {
      return NextResponse.json(
        { error: "Orders not configured" },
        { status: 500 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { data: found } = await supabase
      .from("orders")
      .select("id")
      .or(`order_number.eq.${orderRef},id.eq.${orderRef},stripe_session_id.eq.${orderRef}`)
      .limit(1)
      .maybeSingle();

    if (!found?.id) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    const { data, error } = await supabase
      .from("orders")
      .update({
        tracking_number: tracking,
        order_status: "shipped",
      })
      .eq("id", found.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: "Update failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, order: data });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
