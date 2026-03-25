import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

async function SuccessContent({ sessionId }: { sessionId: string }) {
  let customerName = "";
  let appointmentDate = "";
  let appointmentTime = "";
  let paid = false;

  if (!sessionId.startsWith("cs_")) {
    return (
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Invalid Session</h1>
        <p className="mb-6" style={{ color: "#6B7280" }}>This booking link is not valid. Please contact us if you need help.</p>
        <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm" style={{ backgroundColor: "#D4A017", color: "#0D1117" }}>Back to Home</Link>
      </div>
    );
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    paid = session.payment_status === "paid";
    customerName = session.metadata?.customerName ?? "";
    appointmentDate = session.metadata?.appointmentDate ?? "";
    appointmentTime = session.metadata?.appointmentTime ?? "";

    if (paid) {
      // Confirm booking in Supabase (belt-and-suspenders alongside webhook)
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      await supabase
        .from("bookings")
        .update({
          status: "confirmed",
          stripe_payment_intent_id: session.payment_intent as string,
        })
        .eq("stripe_session_id", sessionId)
        .eq("status", "pending_payment");
    }
  } catch {
    // Session fetch failed — will show error state below
  }

  if (!paid) {
    return (
      <div className="w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-white mb-2">Payment Not Completed</h1>
        <p className="mb-6" style={{ color: "#6B7280" }}>
          Your payment could not be verified. If you were charged, please contact us and we&apos;ll sort it out.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm"
          style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
        >
          Back to Home
        </Link>
      </div>
    );
  }

  return (
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
      {customerName && (
        <p className="text-white mb-1">Thanks, {customerName}.</p>
      )}
      <p className="mb-2" style={{ color: "#6B7280" }}>
        Your $50 deposit has been received.
      </p>
      {appointmentDate && appointmentTime && (
        <p className="text-white font-medium mb-6">
          {appointmentDate} at {appointmentTime}
        </p>
      )}
      <p className="text-sm mb-8" style={{ color: "#6B7280" }}>
        We&apos;ll be in touch to confirm the details. The remaining balance is due on the day of service.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm"
        style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
      >
        Back to Home
      </Link>
    </div>
  );
}

export default async function BookingSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#0D1117" }}
    >
      {session_id ? (
        <Suspense fallback={<p style={{ color: "#6B7280" }}>Confirming your booking…</p>}>
          <SuccessContent sessionId={session_id} />
        </Suspense>
      ) : (
        <div className="text-center">
          <p className="text-white mb-4">Booking confirmed.</p>
          <Link href="/" style={{ color: "#D4A017" }}>Back to Home</Link>
        </div>
      )}
    </main>
  );
}
