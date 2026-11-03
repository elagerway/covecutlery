"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ArrowRight } from "lucide-react";

export const FOR_SALE_PATH = "/business-for-sale";
const DISMISS_KEY = "forSaleBannerDismissed";

/** Height of the bar in px — Navbar renders a matching spacer so page content isn't covered. */
export const FOR_SALE_BANNER_HEIGHT = 36;

// Dismissal lives in localStorage; every mounted banner re-reads it when it changes.
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

function readDismissed() {
  try {
    return localStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false; // Storage blocked — just keep showing the banner
  }
}

/** Returns whether the banner should render, and a dismiss callback. */
export function useForSaleBanner() {
  const pathname = usePathname();
  const dismissed = useSyncExternalStore(subscribe, readDismissed, () => false);

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {}
    listeners.forEach((l) => l());
  };

  return { visible: !dismissed && pathname !== FOR_SALE_PATH, dismiss };
}

export default function ForSaleBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div
      className="flex items-center justify-center gap-3 px-10 text-xs sm:text-sm font-medium relative"
      style={{ height: FOR_SALE_BANNER_HEIGHT, backgroundColor: "#D4A017", color: "#0D1117" }}
    >
      <Link href={FOR_SALE_PATH} className="inline-flex items-center gap-1.5 hover:underline truncate">
        <span className="font-bold uppercase tracking-wide">For sale:</span>
        <span className="truncate">
          <span className="hidden sm:inline">Cove Blades is for sale — equipment, van & 500+ customers.</span>
          <span className="sm:hidden">Cove Blades is for sale.</span>
        </span>
        <span className="inline-flex items-center gap-0.5 font-semibold whitespace-nowrap">
          Details <ArrowRight size={14} />
        </span>
      </Link>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss"
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded hover:bg-black/10 transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  );
}
