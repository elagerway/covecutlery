"use client";

import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import BookingModal from "@/components/BookingModal";
import { useBooking } from "@/components/BookingProvider";

/** Client boundary for the booking flow rendered as a page rather than a modal.
 *  `open` is permanently true here — the modal's effects are all gated on it,
 *  and there's nothing to close on a dedicated route, so "done" goes home.
 *  When admin has paused bookings, show a notice instead of the flow. */
export default function BookMobileFlow() {
  const router = useRouter();
  const { bookingsEnabled } = useBooking();

  if (bookingsEnabled === null) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#D4A017" }} />
      </div>
    );
  }

  if (!bookingsEnabled) {
    return (
      <div
        className="max-w-lg mx-auto rounded-xl border p-6 text-center"
        style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
      >
        <p className="text-white font-semibold mb-2">We&rsquo;re not taking new bookings right now.</p>
        <p className="text-sm" style={{ color: "#6B7280" }}>
          Questions? Call or text{" "}
          <a href="tel:6042108180" style={{ color: "#D4A017" }}>604-210-8180</a>.
        </p>
      </div>
    );
  }

  return (
    <BookingModal
      open
      variant="page"
      initialDate={null}
      onClose={() => router.push("/")}
    />
  );
}
