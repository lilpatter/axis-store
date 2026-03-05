export default function AdminSecurityPage() {
  const checks = [
    {
      title: "HTTPS",
      status: process.env.NODE_ENV === "production" ? "ok" : "dev",
      note: "Always use HTTPS in production.",
    },
    {
      title: "Environment variables",
      status: "info",
      note: "Never commit .env.local. Keep API keys in Vercel.",
    },
    {
      title: "Admin access",
      status: "info",
      note: "Only emails in ADMIN_EMAILS can access this panel.",
    },
    {
      title: "NextAuth secret",
      status: process.env.NEXTAUTH_SECRET ? "ok" : "warn",
      note: "NEXTAUTH_SECRET must be set in production.",
    },
    {
      title: "Stripe webhook",
      status: process.env.STRIPE_WEBHOOK_SECRET ? "ok" : "warn",
      note: "Webhook secret verifies Stripe requests.",
    },
  ];

  return (
    <div>
      <h1
        className="text-2xl font-semibold text-[#1D1D1F] mb-8"
        style={{ fontFamily: "var(--font-display), 'DM Sans', sans-serif" }}
      >
        Security
      </h1>
      <div className="space-y-4">
        {checks.map((c) => (
          <div
            key={c.title}
            className="p-6 bg-white rounded-lg border border-[#e5e5e7] flex items-start gap-4"
          >
            <span
              className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                c.status === "ok"
                  ? "bg-green-100 text-green-800"
                  : c.status === "warn"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-gray-100 text-gray-600"
              }`}
            >
              {c.status === "ok" ? "✓" : c.status === "warn" ? "!" : "i"}
            </span>
            <div>
              <h2 className="font-medium text-[#1D1D1F]">{c.title}</h2>
              <p className="text-sm text-[#6E6E73] mt-1">{c.note}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
