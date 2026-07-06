"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, Suspense } from "react";
import { track } from "@/lib/analytics-client";
import { fireMetaPageView } from "@/lib/meta-pixel";

function TrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstPageview = useRef(true);

  useEffect(() => {
    const qs = searchParams.toString();
    track("pageview", qs ? { qs } : {});
    // Meta's base snippet already tracks the initial PageView
    if (isFirstPageview.current) {
      isFirstPageview.current = false;
    } else {
      fireMetaPageView();
    }
  }, [pathname, searchParams]);

  return null;
}

export default function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <TrackerInner />
    </Suspense>
  );
}
