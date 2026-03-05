"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

function SignInForm() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/account";

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    if (res?.error) {
      setError("Invalid email or password");
      return;
    }
    if (res?.ok) window.location.href = callbackUrl;
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <h1
          className="text-2xl font-semibold text-center text-[#1D1D1F]"
          style={{ fontFamily: "var(--font-display), 'DM Sans', sans-serif" }}
        >
          Sign in or create account
        </h1>
        <p className="text-sm text-center text-[#6E6E73] -mt-2">
          Use Google or GitHub — no password needed. First time creates an account.
        </p>
        <div className="space-y-3">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => signIn("google", { callbackUrl })}
          >
            Continue with Google
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => signIn("github", { callbackUrl })}
          >
            Continue with GitHub
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#e5e5e7]" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-[#6E6E73]">or</span>
          </div>
        </div>
        <form onSubmit={handleCredentialsSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-11 px-4 rounded-full border border-[#e5e5e7] text-[15px]"
          />
          <input
            type="password"
            placeholder="Password (demo: password)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-11 px-4 rounded-full border border-[#e5e5e7] text-[15px]"
          />
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <Button type="submit" variant="secondary" size="lg" className="w-full">
            Sign in with Email
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center" />}>
      <SignInForm />
    </Suspense>
  );
}
