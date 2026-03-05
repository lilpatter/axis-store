"use client";

import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { Button } from "@/components/ui/Button";

interface AccountContentProps {
  session: Session;
}

export function AccountContent({ session }: AccountContentProps) {
  return (
    <div className="space-y-8">
      <div className="p-6 rounded-lg border border-[#e5e5e7] bg-[#F5F5F7]">
        <h2 className="text-lg font-medium text-[#1D1D1F] mb-4">
          Profile
        </h2>
        <div className="space-y-2 text-[15px]">
          <p>
            <span className="text-[#6E6E73]">Name:</span>{" "}
            {session.user?.name ?? "—"}
          </p>
          <p>
            <span className="text-[#6E6E73]">Email:</span>{" "}
            {session.user?.email ?? "—"}
          </p>
        </div>
      </div>
      <div className="p-6 rounded-lg border border-[#e5e5e7] bg-[#F5F5F7]">
        <h2 className="text-lg font-medium text-[#1D1D1F] mb-4">
          Orders
        </h2>
        <p className="text-[15px] text-[#6E6E73]">
          Order history will appear here once you make a purchase.
        </p>
      </div>
      <Button variant="secondary" onClick={() => signOut()}>
        Sign out
      </Button>
    </div>
  );
}
