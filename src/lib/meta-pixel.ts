// Meta (Facebook) Pixel conversion events. The pixel base code is loaded in
// app/layout.tsx when NEXT_PUBLIC_FB_PIXEL_ID is set; until then every helper
// here is a no-op.

const PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
const DEFAULT_VALUE_CAD = 60; // 5 knives × $12 minimum

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

// For client-side route changes; the initial PageView fires from the base
// snippet in app/layout.tsx.
export function fireMetaPageView(): void {
  if (typeof window === "undefined") return;
  if (!PIXEL_ID) return;
  if (typeof window.fbq !== "function") return;
  try {
    window.fbq("track", "PageView");
  } catch {
    // never let a tracking failure surface to the customer
  }
}

export function fireMetaBookingConversion(valueCad: number = DEFAULT_VALUE_CAD): void {
  if (typeof window === "undefined") return;
  if (!PIXEL_ID) return;
  if (typeof window.fbq !== "function") return;
  try {
    window.fbq("track", "Schedule", {
      value: valueCad,
      currency: "CAD",
    });
  } catch {
    // never let a tracking failure surface to the customer
  }
}
