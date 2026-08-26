import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Manage your booking | Cove Blades",
  // Given out over the phone, not meant to rank or be crawled.
  robots: { index: false, follow: false },
};

export default function ManageLayout({ children }: { children: ReactNode }) {
  return children;
}
