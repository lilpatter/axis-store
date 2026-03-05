import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AccountContent } from "@/components/account/AccountContent";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin?callbackUrl=/account");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1
        className="text-2xl md:text-3xl font-semibold text-[#1D1D1F] mb-8"
        style={{ fontFamily: "var(--font-display), 'DM Sans', sans-serif" }}
      >
        Account
      </h1>
      <AccountContent session={session} />
    </div>
  );
}
