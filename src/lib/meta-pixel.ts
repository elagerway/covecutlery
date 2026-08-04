// Meta (Facebook) Pixel conversion events. The pixel base code is loaded in
// app/layout.tsx when NEXT_PUBLIC_FB_PIXEL_ID is set; until then every helper
// here is a no-op.

const PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
// Reported for every booking conversion — callers pass no value. Priced as the
// smallest mobile booking we accept: the 6-piece North Shore minimum at the
// advertised $12/knife. Other areas start at 8, 10 or 15 pieces, so this floors
// the value rather than overstating it.
const DEFAULT_VALUE_CAD = 72;

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
