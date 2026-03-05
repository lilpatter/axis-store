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
            {
              expand: [
                "line_items.data.price.product",
                "payment_intent.payment_method",
              ],
            }
          );
          const lineItems = fullSession.line_items?.data ?? [];
          const items = lineItems.map((li) => ({
            name: li.description ?? "Item",
            quantity: li.quantity ?? 0,
            amount_total: li.amount_total ?? 0,
          }));
          const total = session.amount_total ?? 0;

          // Capture address (shipping preferred, fallback to billing)
          const sessionWithShipping = fullSession as Stripe.Checkout.Session & {
            shipping_details?: { address?: Stripe.Address; name?: string };
          };
          const shipAddr = sessionWithShipping.shipping_details?.address;
          const billAddr = fullSession.customer_details?.address;
          const address = shipAddr ?? billAddr;
          const addrFormatted = address
            ? {
                line1: address.line1 ?? "",
                line2: address.line2 ?? null,
                city: address.city ?? "",
                state: address.state ?? "",
                postal_code: address.postal_code ?? "",
                country: address.country ?? "",
              }
            : null;

          // Capture payment method (card last4, brand)
          const pm =
            typeof fullSession.payment_intent === "object" &&
            fullSession.payment_intent &&
            "payment_method" in fullSession.payment_intent
              ? (fullSession.payment_intent as { payment_method?: unknown })
                  .payment_method
              : null;
          const card =
            pm && typeof pm === "object" && pm !== null && "card" in pm
              ? (pm as { card?: { brand?: string; last4?: string; exp_month?: number; exp_year?: number } }).card
              : null;
          const paymentMethod = card
            ? {
                brand: card.brand ?? "card",
                last4: card.last4 ?? "",
                exp_month: card.exp_month ?? null,
                exp_year: card.exp_year ?? null,
              }
            : null;

          const details: Record<string, unknown> = {};
          if (addrFormatted) details.address = addrFormatted;
          if (paymentMethod) details.payment_method = paymentMethod;
          const name =
            sessionWithShipping.shipping_details?.name ??
            fullSession.customer_details?.name ??
            null;
          if (name) details.customer_name = name;
          const phone = fullSession.customer_details?.phone ?? null;
          if (phone) details.phone = phone;

          const supabase = getSupabaseAdmin();
          await supabase.from("orders").insert({
            stripe_session_id: session.id,
            email,
            items,
            total,
            details,
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
