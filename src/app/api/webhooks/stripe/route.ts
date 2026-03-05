import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getSupabaseAdmin } from "@/lib/supabase";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook not configured" },
      { status: 500 }
    );
  }

  const stripe = new Stripe(key);
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const email =
        session.customer_details?.email ?? session.customer_email ?? null;

      const hasSupabase =
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.SUPABASE_SERVICE_ROLE_KEY;
      if (email && hasSupabase) {
        try {
          const fullSession = await stripe.checkout.sessions.retrieve(
            session.id,
            { expand: ["line_items.data.price.product"] }
          );
          const lineItems = fullSession.line_items?.data ?? [];
          const items = lineItems.map((li) => ({
            name: li.description ?? "Item",
            quantity: li.quantity ?? 0,
            amount_total: li.amount_total ?? 0,
          }));
          const total = session.amount_total ?? 0;

          const supabase = getSupabaseAdmin();
          await supabase.from("orders").insert({
            stripe_session_id: session.id,
            email,
            items,
            total,
          });
        } catch (dbErr) {
          console.error("Failed to store order:", dbErr);
        }
      }
      break;
    }
    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
