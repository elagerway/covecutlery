// Google Ads conversion event. Set NEXT_PUBLIC_GADS_CONVERSION_ID to your
// full send_to string from Google Ads (format: "AW-XXXXXXXXXX/YYYYYYYY").
// Until that env var is set, this is a no-op.

const CONVERSION_SEND_TO = process.env.NEXT_PUBLIC_GADS_CONVERSION_ID;
const DEFAULT_VALUE_CAD = 60; // 5 knives × $12 minimum

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
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
