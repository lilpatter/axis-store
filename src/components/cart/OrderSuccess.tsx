"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Check, Sparkles } from "lucide-react";

const COLORS = ["#1D1D1F", "#6E6E73", "#e5e5e7", "#a3a3a6"];

function runConfetti() {
  const duration = 2000;
  const end = Date.now() + duration;

  const style = document.createElement("style");
  style.textContent = `
    @keyframes axis-confetti {
      0% { transform: translate(0,0) rotate(0deg); opacity: 1; }
      100% { transform: translate(calc(var(--dx) * 1px), 400px) rotate(720deg); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
  setTimeout(() => style.remove(), duration + 1000);

  function burst() {
    const w = window.innerWidth;
    const h = window.innerHeight * 0.5;
    for (let i = 0; i < 6; i++) {
      const el = document.createElement("div");
      const size = 8 + Math.random() * 8;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const x = w * (0.25 + Math.random() * 0.5);
      const dx = (Math.random() - 0.5) * 150;
      const delay = Math.random() * 0.25;
      const durationMs = 1800 + Math.random() * 400;
      el.style.cssText = `
        position:fixed;pointer-events:none;width:${size}px;height:${size}px;
        background:${color};left:${x}px;top:${h}px;border-radius:2px;
        z-index:9999;--dx:${dx};
        animation:axis-confetti ${durationMs}ms ease-out ${delay}s forwards;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), durationMs + delay * 1000);
    }
    if (Date.now() < end) setTimeout(burst, 100);
  }
  burst();
}

export function OrderSuccess() {
  const hasFired = useRef(false);

  useEffect(() => {
    if (hasFired.current || typeof document === "undefined") return;
    hasFired.current = true;
    runConfetti();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center max-w-md mx-auto">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <Check className="w-10 h-10 text-green-600" strokeWidth={2.5} />
        </div>
        <Sparkles className="w-6 h-6 text-amber-500 absolute -top-1 -right-2 animate-pulse" />
      </div>
      <h2 className="text-2xl font-semibold text-[#1D1D1F] mb-2">
        Order confirmed!
      </h2>
      <p className="text-[#6E6E73] mb-8">
        Thank you for your purchase. A confirmation email is on its way.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        <Button asChild variant="primary" size="lg" className="min-w-[160px]">
          <Link href="/account">View orders</Link>
        </Button>
        <Button asChild variant="secondary" size="lg" className="min-w-[160px]">
          <Link href="/shop">Continue shopping</Link>
        </Button>
      </div>
    </div>
  );
}
