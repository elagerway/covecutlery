"use client";

import { createContext, useContext, useState } from "react";
import BookingModal from "./BookingModal";

const BookingContext = createContext<{ open: () => void }>({ open: () => {} });

export function useBooking() {
  return useContext(BookingContext);
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <BookingContext.Provider value={{ open: () => setIsOpen(true) }}>
      {children}
      <BookingModal open={isOpen} onClose={() => setIsOpen(false)} />
    </BookingContext.Provider>
  );
}
