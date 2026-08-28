"use client";

import { useRouter } from "next/navigation";
import BookingModal from "@/components/BookingModal";

/** Client boundary for the booking flow rendered as a page rather than a modal.
 *  `open` is permanently true here — the modal's effects are all gated on it,
 *  and there's nothing to close on a dedicated route, so "done" goes home. */
export default function BookMobileFlow() {
  const router = useRouter();
  return (
    <BookingModal
      open
      variant="page"
      initialDate={null}
      onClose={() => router.push("/")}
    />
  );
}
