"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef, Suspense } from "react";
import { track } from "@/lib/analytics-client";
import { fireMetaPageView } from "@/lib/meta-pixel";
import { fireGooglePageView } from "@/lib/google-ads";

function TrackerInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFirstPageview = useRef(true);

  useEffect(() => {
    const qs = searchParams.toString();
    track("pageview", qs ? { qs } : {});
    // The base snippets in app/layout.tsx already track the initial page view
    // for both Meta and Google
    if (isFirstPageview.current) {
      isFirstPageview.current = false;
    } else {
      fireMetaPageView();
      fireGooglePageView(pathname + (qs ? `?${qs}` : ""));
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
