"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Button } from "@/components/ui/Button";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const messages: Record<string, string> = {
    OAuthSignin:
      "OAuth sign-in failed. Check that Google/GitHub credentials and NEXTAUTH_URL are set in Vercel. See OAUTH_SETUP.md.",
    OAuthCallback:
      "OAuth callback error. Ensure the redirect URI in Google Cloud Console matches: https://axisstore.vercel.app/api/auth/callback/google",
    OAuthCreateAccount: "Could not create account.",
    EmailCreateAccount: "Could not create account.",
    Callback: "Callback error.",
    OAuthAccountNotLinked:
      "This email is already linked to another sign-in method.",
    EmailSignin: "Check your email for the sign-in link.",
    CredentialsSignin: "Invalid email or password.",
    SessionRequired: "Please sign in to continue.",
    Default: "Something went wrong during sign-in.",
  };

  const msg = (error && messages[error]) ?? messages.Default;

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <h1
          className="text-2xl font-semibold text-[#1D1D1F]"
          style={{ fontFamily: "var(--font-display), 'DM Sans', sans-serif" }}
        >
          Sign-in error
        </h1>
        <p className="text-[15px] text-[#6E6E73]">{msg}</p>
        <Link href="/auth/signin">
          <Button variant="primary">Try again</Button>
        </Link>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <ErrorContent />
    </Suspense>
  );
}
