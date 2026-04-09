import Link from "next/link";

export default function BookingSuccessPage() {
  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#0D1117" }}
    >
      <div className="w-full max-w-md text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: "#D4A01722" }}
        >
          <svg width="32" height="32" fill="none" stroke="#D4A017" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h1>
        <p className="mb-6" style={{ color: "#6B7280" }}>
          You&apos;ll receive an SMS confirmation shortly. We&apos;ll see you at your scheduled time!
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm"
          style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
