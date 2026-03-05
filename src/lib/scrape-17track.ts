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
    const context = browser.defaultBrowserContext();
    await context.overridePermissions("https://t.17track.net", ["clipboard-read", "clipboard-write"]);

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });

    // Wait for "Copy details" button (indicates tracking has loaded)
    const copyBtn = await page
      .waitForSelector('button[title="Copy detailed tracking results."]', {
        timeout: 40000,
      })
      .catch(() => null);

    if (!copyBtn) {
      throw new Error("Tracking did not load in time");
    }

    await new Promise((r) => setTimeout(r, 1500));

    // Click "Copy details" to get formatted text in clipboard
    await copyBtn.click();
    await new Promise((r) => setTimeout(r, 800));

    let copyText = await page.evaluate(async () => {
      try {
        return await navigator.clipboard.readText();
      } catch {
        return "";
      }
    });

    // Fallback: if clipboard empty, try DOM (clipboard may be blocked)
    if (!copyText?.includes("Package status")) {
      copyText = await page.evaluate(() => {
        const block = document.getElementById("yq-tracking-progress");
        return block?.innerText ?? document.body.innerText ?? "";
      });
    }

    await browser.close();
    browser = null;

    // Parse "Package status:  Delivered (22 Days)" from Copy details format
    let rawStatus = "";
    const statusMatch = copyText.match(/Package status:\s*([^\n]+)/i);
    if (statusMatch) {
      rawStatus = statusMatch[1].trim();
    } else {
      // Fallback from DOM: look for "Time of delivery" nearby status, or known status words
      const delivered = /\bDelivered\b/i.test(copyText);
      const inTransit = /\bIn transit\b/i.test(copyText);
      if (delivered) rawStatus = "Delivered";
      else if (inTransit) rawStatus = "In transit";
      else rawStatus = copyText.match(/Time of delivery:\s*([^\n]+)/i)?.[1]?.trim() ?? "";
    }
    const statusWord = rawStatus.replace(/\s*\([^)]*\)\s*$/, "").trim();

    // Delivery date: prefer line containing "delivered", else first event date
    const deliveredLineMatch = copyText.match(/(\d{4}-\d{2}-\d{2})\s+\d{2}:\d{2}[^\n]*\bdelivered\b/i);
    const dateMatch = deliveredLineMatch ?? copyText.match(/(\d{4}-\d{2}-\d{2})\s+\d{2}:\d{2}/);
    const deliveryTime = dateMatch?.[1] ?? (copyText.match(/Time of delivery:\s*(\d{4}-\d{2}-\d{2})/i)?.[1] ?? null);

    const extracted = {
      status: statusWord || rawStatus,
      deliveryTime,
    };

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
