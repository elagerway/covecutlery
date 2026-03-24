"use client";

import { createContext, useContext, useState } from "react";
import BookingModal from "./BookingModal";

interface BookingContextType {
  open: () => void;
  openWithDate: (date: string) => void;
}

const BookingContext = createContext<BookingContextType>({
  open: () => {},
  openWithDate: () => {},
});

export function useBooking() {
  return useContext(BookingContext);
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialDate, setInitialDate] = useState<string | null>(null);

  return (
    <BookingContext.Provider value={{
      open: () => { setInitialDate(null); setIsOpen(true); },
      openWithDate: (date) => { setInitialDate(date); setIsOpen(true); },
    }}>
      {children}
      <BookingModal open={isOpen} onClose={() => setIsOpen(false)} initialDate={initialDate} />
    </BookingContext.Provider>
  );
}
