import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SessionProvider } from "@/components/providers/SessionProvider";
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "AXIS — Premium Design Essentials",
  description: "Minimal design. Premium quality. Shop curated essentials.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={dmSans.variable}>
      <body className="antialiased min-h-screen flex flex-col">
        <SessionProvider>
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
