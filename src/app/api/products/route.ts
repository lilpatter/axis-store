import { NextResponse } from "next/server";
import { getProducts } from "@/lib/shopify";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}
