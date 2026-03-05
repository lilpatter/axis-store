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
    if (isVercel) {
      executablePath = await chromium.executablePath();
    } else if (process.platform === "win32") {
      executablePath =
        process.env.PUPPETEER_EXECUTABLE_PATH ||
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
    } else if (process.platform === "darwin") {
      executablePath =
        process.env.PUPPETEER_EXECUTABLE_PATH ||
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
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
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

    // Wait for tracking content to appear (or "no data" state)
    await page.waitForSelector(
      "h3, [class*='status'], [class*='yq-'], .el-empty, [class*='empty']",
      { timeout: 15000 }
    );

    const extracted = await page.evaluate(() => {
      const result: {
        status: string;
        deliveryTime: string | null;
        events: Array<{ time?: string; description?: string; location?: string }>;
      } = { status: "", deliveryTime: null, events: [] };

      // Status: look for h3 or prominent status text
      const h3 = document.querySelector("h3");
      if (h3?.textContent?.trim()) {
        result.status = h3.textContent.trim();
      }
      const statusEl = document.querySelector("[class*='status']");
      if (!result.status && statusEl?.textContent?.trim()) {
        result.status = statusEl.textContent.trim();
      }

      // Delivery time: "Time of delivery: YYYY-MM-DD HH:mm" or similar
      const body = document.body.innerText;
      const deliveryMatch = body.match(/time of delivery:?\s*([^\n]+)/i);
      if (deliveryMatch?.[1]) {
        result.deliveryTime = deliveryMatch[1].trim();
      }

      // Timeline: .yq-time with sibling description
      const timeSpans = document.querySelectorAll(".yq-time");
      timeSpans.forEach((span) => {
        const time = span.textContent?.trim();
        const parent = span.closest(".flex, [class*='flex']");
        const descEl = parent?.querySelector("span:not(.yq-time)");
        const desc = descEl?.textContent?.trim();
        if (time || desc) {
          result.events.push({ time, description: desc });
        }
      });

      // Fallback: any list of events
      if (result.events.length === 0) {
        const rows = document.querySelectorAll("[class*='space-y'] .flex, [class*='timeline'] > div");
        rows.forEach((row) => {
          const timeEl = row.querySelector(".yq-time, [class*='time']");
          const text = Array.from(row.querySelectorAll("span"))
            .map((s) => s.textContent?.trim())
            .filter(Boolean)
            .join(" ");
          if (text) {
            result.events.push({
              time: timeEl?.textContent?.trim(),
              description: text,
            });
          }
        });
      }

      return result;
    });

    await browser.close();
    browser = null;

    const mappedStatus = mapStatus(extracted.status);
    const events = extracted.events.slice(0, 20);
    const lastEvent =
      events.length > 0
        ? {
            time: events[0].time,
            description: events[0].description,
            location: events[0].location,
          }
        : null;

    return {
      status: mappedStatus,
      rawStatus: extracted.status || "Unknown",
      deliveryTime: extracted.deliveryTime,
      carrier: null,
      lastEvent,
      events,
    };
  } finally {
    if (browser) {
      await browser.close().catch(() => {});
    }
  }
}
