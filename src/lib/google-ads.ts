// Google Ads conversion event. Set NEXT_PUBLIC_GADS_CONVERSION_ID to your
// full send_to string from Google Ads (format: "AW-XXXXXXXXXX/YYYYYYYY").
// Until that env var is set, this is a no-op.

export const GOOGLE_ADS_ID = "AW-18180527373";

const CONVERSION_SEND_TO = process.env.NEXT_PUBLIC_GADS_CONVERSION_ID;
const DEFAULT_VALUE_CAD = 60; // 5 knives × $12 minimum

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// For client-side route changes; the initial page view fires from the
// gtag('config', ...) call in app/layout.tsx. Re-running config with a
// page_path is the standard gtag SPA pattern — it reports a page view.
export function fireGooglePageView(path: string): void {
  if (typeof window === "undefined") return;
  if (typeof window.gtag !== "function") return;
  try {
    window.gtag("config", GOOGLE_ADS_ID, { page_path: path });
  } catch {
    // never let a tracking failure surface to the customer
  }
}

export function fireBookingConversion(valueCad: number = DEFAULT_VALUE_CAD): void {
  if (typeof window === "undefined") return;
  if (!CONVERSION_SEND_TO) return;
  if (typeof window.gtag !== "function") return;
  try {
    window.gtag("event", "conversion", {
      send_to: CONVERSION_SEND_TO,
      value: valueCad,
      currency: "CAD",
    });
  } catch {
    // never let a tracking failure surface to the customer
  }
}
