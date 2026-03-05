"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { SearchModal } from "@/components/search/SearchModal";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/shop", label: "Shop" },
  { href: "/shop", label: "Categories" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const totalItems = useCartStore((s) => s.totalItems);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50",
          "bg-white/95 backdrop-blur-md border-b border-[#e5e5e7]"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="text-xl font-semibold tracking-tight text-[#1D1D1F]"
              style={{ fontFamily: "var(--font-display), 'DM Sans', sans-serif" }}
            >
              AXIS
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-10">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-[15px] text-[#1D1D1F] hover:text-[#6E6E73] transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Right icons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 -m-2 text-[#1D1D1F] hover:text-[#6E6E73] transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <Link
                href="/cart"
                className="relative p-2 -m-2 text-[#1D1D1F] hover:text-[#6E6E73] transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-black text-white text-xs font-medium">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Link>
              <Link
                href="/account"
                className="hidden sm:block p-2 -m-2 text-[#1D1D1F] hover:text-[#6E6E73] transition-colors"
                aria-label="Account"
              >
                <User className="w-5 h-5" />
              </Link>

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden p-2 -m-2 text-[#1D1D1F]"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile nav */}
          {mobileOpen && (
            <nav className="md:hidden py-4 border-t border-[#e5e5e7]">
              <div className="flex flex-col gap-4">
                {navLinks.map(({ href, label }) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="text-[15px] text-[#1D1D1F] hover:text-[#6E6E73]"
                  >
                    {label}
                  </Link>
                ))}
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="text-[15px] text-[#1D1D1F]"
                >
                  Account
                </Link>
              </div>
            </nav>
          )}
        </div>
      </header>

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
