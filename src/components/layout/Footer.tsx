import Link from "next/link";

const shopLinks = [
  { href: "/shop", label: "All Products" },
  { href: "/shop/clothing", label: "Clothing" },
  { href: "/shop/shoes", label: "Shoes" },
  { href: "/shop/jewellery", label: "Jewellery" },
  { href: "/shop/accessories", label: "Accessories" },
];

const helpLinks = [
  { href: "#", label: "Shipping" },
  { href: "#", label: "Returns" },
  { href: "#", label: "FAQ" },
  { href: "#", label: "Contact" },
];

const socialLinks = [
  { href: "#", label: "Instagram" },
  { href: "#", label: "Twitter" },
  { href: "#", label: "Pinterest" },
];

export function Footer() {
  return (
    <footer className="border-t border-[#e5e5e7] bg-[#F5F5F7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Logo + tagline */}
          <div>
            <Link
              href="/"
              className="text-xl font-semibold tracking-tight text-[#1D1D1F]"
              style={{ fontFamily: "var(--font-display), 'DM Sans', sans-serif" }}
            >
              AXIS
            </Link>
            <p className="mt-3 text-[15px] text-[#6E6E73] leading-relaxed max-w-[240px]">
              Minimal design. Premium quality.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider text-[#1D1D1F] mb-4">
              Shop
            </h4>
            <ul className="space-y-3">
              {shopLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[15px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider text-[#1D1D1F] mb-4">
              Help
            </h4>
            <ul className="space-y-3">
              {helpLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[15px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider text-[#1D1D1F] mb-4">
              Follow
            </h4>
            <ul className="space-y-3">
              {socialLinks.map(({ href, label }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-[15px] text-[#6E6E73] hover:text-[#1D1D1F] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[#e5e5e7] text-center text-sm text-[#6E6E73]">
          © {new Date().getFullYear()} AXIS. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
