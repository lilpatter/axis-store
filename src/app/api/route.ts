import { NextResponse } from "next/server";

/**
 * Placeholder API route.
 *
 * Future endpoints to implement:
 * - POST /api/auth/* — NextAuth.js for account authentication
 * - POST /api/checkout — Stripe Checkout session creation
 * - POST /api/webhooks/stripe — Stripe webhook handler
 * - POST /api/webhooks/inventory — Inventory management webhooks
 */

export async function GET() {
  return NextResponse.json({ status: "ok", message: "API placeholder" });
}
