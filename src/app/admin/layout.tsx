import { redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/auth/signin?callbackUrl=/admin");
  }
  if (!isAdmin(session.user.email)) {
    redirect("/account");
  }

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <header className="sticky top-0 z-10 border-b border-[#e5e5e7] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/admin"
              className="font-semibold text-[#1D1D1F]"
              style={{ fontFamily: "var(--font-display), 'DM Sans', sans-serif" }}
            >
              AXIS Admin
            </Link>
            <div className="flex items-center gap-6">
              <nav className="flex gap-4 text-sm">
                <Link
                  href="/admin"
                  className="text-[#6E6E73] hover:text-[#1D1D1F]"
                >
                  Overview
                </Link>
                <Link
                  href="/admin/products"
                  className="text-[#6E6E73] hover:text-[#1D1D1F]"
                >
                  Products
                </Link>
                <Link
                  href="/admin/orders"
                  className="text-[#6E6E73] hover:text-[#1D1D1F]"
                >
                  Orders
                </Link>
                <Link
                  href="/admin/customers"
                  className="text-[#6E6E73] hover:text-[#1D1D1F]"
                >
                  Customers
                </Link>
                <Link
                  href="/admin/security"
                  className="text-[#6E6E73] hover:text-[#1D1D1F]"
                >
                  Security
                </Link>
              </nav>
              <span className="text-sm text-[#6E6E73]">
                {session.user.email}
              </span>
              <Link
                href="/"
                className="text-sm text-[#6E6E73] hover:text-[#1D1D1F]"
              >
                Store
              </Link>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
