"use client";

import { createContext, useContext, useEffect, useState } from "react";
import BookingModal from "./BookingModal";

interface BookingContextType {
  open: () => void;
  openWithDate: (date: string) => void;
  /** Admin can pause new bookings. null while the setting is still loading. */
  bookingsEnabled: boolean | null;
}

const BookingContext = createContext<BookingContextType>({
  open: () => {},
  openWithDate: () => {},
  bookingsEnabled: null,
});

export function useBooking() {
  return useContext(BookingContext);
}

/** Renders children only once bookings are confirmed open — wrap any "Book" CTA
 *  in this. Hidden while loading so a paused site never flashes the buttons. */
export function BookingOnly({ children }: { children: React.ReactNode }) {
  return useBooking().bookingsEnabled ? <>{children}</> : null;
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialDate, setInitialDate] = useState<string | null>(null);
  const [bookingsEnabled, setBookingsEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/settings/bookings", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { enabled: true }))
      .then((d) => setBookingsEnabled(d.enabled !== false))
      // Can't reach the setting — the booking API still enforces it, so show the buttons
      .catch(() => setBookingsEnabled(true));
  }, []);

  return (
    <BookingContext.Provider value={{
      open: () => { if (bookingsEnabled) { setInitialDate(null); setIsOpen(true); } },
      openWithDate: (date) => { if (bookingsEnabled) { setInitialDate(date); setIsOpen(true); } },
      bookingsEnabled,
    }}>
      {children}
      <BookingModal open={isOpen} onClose={() => setIsOpen(false)} initialDate={initialDate} />
    </BookingContext.Provider>
  );
}
