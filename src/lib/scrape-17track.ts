import { existsSync } from "fs";
import { join } from "path";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

/** Scraped tracking data (same shape as API response) */
export interface ScrapedTracking {
  status: "paid" | "shipped" | "delivered";
  rawStatus: string;
  deliveryTime: string | null;
  carrier: string | null;
  lastEvent: { time?: string; description?: string; location?: string } | null;
  events: Array<{ time?: string; description?: string; location?: string }>;
}

function mapStatus(s: string): "paid" | "shipped" | "delivered" {
  const status = s.toLowerCase();
  if (status.includes("deliver")) return "delivered";
  if (
    status.includes("transit") ||
    status.includes("out for delivery") ||
    status.includes("pickup") ||
    status.includes("exception")
  ) {
    return "shipped";
  }
  return "paid";
}

/** Scrape 17track page when API key is not available (testing only). */
export async function scrape17Track(
  trackingNumber: string
): Promise<ScrapedTracking> {
  let browser = null;

  try {
    const isVercel = !!process.env.VERCEL;
    let executablePath: string;
    if (process.env.PUPPETEER_EXECUTABLE_PATH) {
      executablePath = process.env.PUPPETEER_EXECUTABLE_PATH;
    } else if (isVercel) {
      // On Vercel, pass explicit bin path (pnpm nests packages; tracer may put it at cwd)
      const { join } = await import("path");
      const cwd = process.cwd();
      const binPaths = [
        join(cwd, "node_modules", "@sparticuz", "chromium", "bin"),
        join(cwd, "node_modules", ".pnpm", "@sparticuz+chromium@143.0.4", "node_modules", "@sparticuz", "chromium", "bin"),
      ];
      const binPath = binPaths.find((p) => existsSync(p));
      executablePath = await chromium.executablePath(binPath || undefined);
    } else if (process.platform === "win32") {
      const paths = [
        join(process.env["ProgramFiles"] || "C:\\Program Files", "Google", "Chrome", "Application", "chrome.exe"),
        join(process.env["ProgramFiles(x86)"] || "C:\\Program Files (x86)", "Google", "Chrome", "Application", "chrome.exe"),
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
      ];
      executablePath = paths.find((p) => existsSync(p)) || paths[0];
    } else if (process.platform === "darwin") {
      executablePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    } else {
      executablePath = await chromium.executablePath();
    }

    browser = await puppeteer.launch({
      executablePath,
      args: isVercel
        ? chromium.args
        : ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
      headless: true,
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"
    );

    const url = `https://t.17track.net/en#nums=${encodeURIComponent(trackingNumber.trim())}`;
    // Use domcontentloaded for speed; 17track is SPA, content loads async
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });

    // Wait for tracking block (status only; timeline deferred)
    await page
      .waitForSelector("#yq-tracking-progress h3, #yq-tracking-progress", {
        timeout: 35000,
      })
      .catch(() => {});

    // Brief wait for status text to render
    await new Promise((r) => setTimeout(r, 2000));

    const extracted = await page.evaluate(() => {
      const result: {
        status: string;
        deliveryTime: string | null;
      } = { status: "", deliveryTime: null };

      const trackingBlock = document.getElementById("yq-tracking-progress");
      const statusH3 = trackingBlock?.querySelector("h3");
      if (statusH3?.textContent?.trim()) {
        result.status = statusH3.textContent.trim();
      }
      if (!result.status && trackingBlock) {
        const h3 = trackingBlock.querySelector("h3");
        if (h3?.textContent?.trim()) result.status = h3.textContent.trim();
      }
      if (!result.status) {
        const h3 = document.querySelector("h3");
        if (h3?.textContent?.trim()) result.status = h3.textContent.trim();
      }

      const blockText = trackingBlock?.innerText ?? document.body.innerText;
      const deliveryMatch = blockText.match(/time of delivery:?\s*([^\n]+)/i);
      if (deliveryMatch?.[1]) {
        result.deliveryTime = deliveryMatch[1].trim();
      }

      return result;
    });

    await browser.close();
    browser = null;

    const mappedStatus = mapStatus(extracted.status);

    return {
      status: mappedStatus,
      rawStatus: extracted.status || "Unknown",
      deliveryTime: extracted.deliveryTime,
      carrier: null,
      lastEvent: null,
      events: [], // Timeline skipped for now; can add later
    };
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}
