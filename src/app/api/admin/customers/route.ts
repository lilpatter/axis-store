import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const hasSupabase =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!hasSupabase) {
    return NextResponse.json({ customers: [] });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("orders")
      .select("email, details, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Admin customers error:", error);
      return NextResponse.json({ customers: [] });
    }

    // Unique customers by email with order count and last order
    const byEmail = new Map<
      string,
      { email: string; name?: string; orderCount: number; lastOrder: string }
    >();
    for (const row of data ?? []) {
      const email = row.email?.toLowerCase().trim();
      if (!email) continue;
      const existing = byEmail.get(email);
      const name = (row.details as { customer_name?: string })?.customer_name;
      const createdAt = (row as { created_at?: string }).created_at ?? "";
      if (existing) {
        existing.orderCount += 1;
        if (createdAt > existing.lastOrder) existing.lastOrder = createdAt;
      } else {
        byEmail.set(email, { email, name: name ?? undefined, orderCount: 1, lastOrder: createdAt });
      }
    }
    const customers = Array.from(byEmail.values()).sort(
      (a, b) => b.lastOrder.localeCompare(a.lastOrder)
    );
    return NextResponse.json({ customers });
  } catch {
    return NextResponse.json({ customers: [] });
  }
}
