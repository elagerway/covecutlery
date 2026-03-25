"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function CancelContent() {
  const searchParams = useSearchParams();
  const uid = searchParams.get("uid");

  useEffect(() => {
    if (!uid) return;
    // Cancel the Cal.com booking on the client side via our API
    fetch(`/api/cal/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uid }),
    }).catch(() => {});
  }, [uid]);

  return (
    <div className="w-full max-w-md text-center">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
        style={{ backgroundColor: "#6B728022" }}
      >
        <svg width="32" height="32" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Booking Cancelled</h1>
      <p className="mb-8" style={{ color: "#6B7280" }}>
        Your booking was not completed and no charge was made. You&apos;re welcome to book again anytime.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border transition-colors hover:bg-white/5"
        style={{ borderColor: "#30363D", color: "#FFFFFF" }}
      >
        Back to Home
      </Link>
    </div>
  );
}

export default function BookingCancelPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#0D1117" }}
    >
      <Suspense fallback={null}>
        <CancelContent />
      </Suspense>
    </main>
  );
}
