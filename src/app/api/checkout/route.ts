import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import Stripe from "stripe";
import type { CartItem } from "@/types";
import { getProducts } from "@/lib/shopify";
import { getCurrencyForLocale, toStripeUnitAmount } from "@/lib/currency";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

/** Validate cart prices against server-side product catalog. Rejects price manipulation. */
function validateCartPrices(
  items: CartItem[],
  productMap: Map<string, { price: number; name: string }>
): { valid: boolean; error?: string } {
  for (const item of items) {
    const product = productMap.get(item.productId) ?? productMap.get(item.slug);
    if (!product) {
      return { valid: false, error: `Product not found: ${item.name}` };
    }
    const expectedPrice = Math.round(product.price * 100) / 100;
    const actualPrice = Math.round(item.price * 100) / 100;
    if (actualPrice !== expectedPrice) {
      return {
        valid: false,
        error: `Invalid price for ${product.name}: expected $${expectedPrice}, got $${actualPrice}`,
      };
    }
    if (item.quantity < 1 || item.quantity > 99) {
      return { valid: false, error: `Invalid quantity for ${item.name}` };
    }
  }
  return { valid: true };
}

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured" },
      { status: 500 }
    );
  }

  try {
    const { items, locale, successUrl, cancelUrl } = (await request.json()) as {
      items: CartItem[];
      locale?: string;
      successUrl?: string;
      cancelUrl?: string;
    };

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });
    const customerEmail = token?.email ?? undefined;

    if (!items?.length) {
      return NextResponse.json(
        { error: "Cart is empty" },
        { status: 400 }
      );
    }

    // Server-side price validation: prevent cart price manipulation
    const products = await getProducts();
    const productMap = new Map(
      products.map((p) => [p.id, { price: p.price, name: p.name }])
    );
    products.forEach((p) => {
      if (!productMap.has(p.slug)) productMap.set(p.slug, { price: p.price, name: p.name });
    });
    const validation = validateCartPrices(items, productMap);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error ?? "Invalid cart" },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://axisstore.vercel.app";

    const currency = getCurrencyForLocale(locale ?? "en-US");
    const stripeCurrency = currency.toLowerCase();

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      items.map((item) => ({
        price_data: {
          currency: stripeCurrency,
          product_data: {
            name: item.name,
            images: [item.image],
            metadata: {
              productId: item.productId,
              variant: item.variant ?? "",
            },
          },
          unit_amount: toStripeUnitAmount(item.price, currency),
        },
        quantity: item.quantity,
      }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      customer_email: customerEmail,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: [
          "US", "CA", "GB", "DE", "FR", "DK", "SE", "NO", "NL", "BE", "ES", "IT", "AU", "JP",
        ],
      },
      success_url: successUrl ?? `${baseUrl}/cart?success=true`,
      cancel_url: cancelUrl ?? `${baseUrl}/cart?canceled=true`,
      metadata: {
        itemCount: String(items.length),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout failed" },
      { status: 500 }
    );
  }
}
