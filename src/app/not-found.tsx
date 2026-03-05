import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1
        className="text-6xl font-semibold text-[#1D1D1F] mb-4"
        style={{ fontFamily: "var(--font-display), 'DM Sans', sans-serif" }}
      >
        404
      </h1>
      <p className="text-[#6E6E73] mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild variant="primary" size="lg">
        <Link href="/">Back to Home</Link>
      </Button>
    </div>
  );
}
