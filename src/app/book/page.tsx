import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookMobileFlow from "./BookMobileFlow";
import { LOWEST_MINIMUM, HIGHEST_MINIMUM } from "@/data/mobileMinimums";

export const metadata: Metadata = {
  title: "Book Mobile Knife Sharpening | Cove Blades",
  description:
    "Book a mobile knife sharpening visit in Metro Vancouver. We come to you — $12 per blade, with a 30-day edge guarantee.",
  alternates: { canonical: "/book" },
};

/**
 * Standalone booking route.
 *
 * The flow used to exist only as a modal opened from a CTA, which meant the AI
 * receptionist had nothing to text except cal.com/coveblades/mobile — Cal's own
 * page, which bypasses the address city guard and the piece-count minimum, and
 * sends no confirmation SMS. This gives it a link on our own domain that runs
 * the validated flow.
 */
export default function BookPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-16" style={{ backgroundColor: "#0D1117" }}>
        <section className="py-16 px-4">
          <div className="max-w-lg mx-auto mb-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Book mobile sharpening
            </h1>
            <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
              We come to you anywhere in Metro Vancouver. $12 per blade, 30-day edge guarantee.
              Minimums run from {LOWEST_MINIMUM} pieces on the North Shore to {HIGHEST_MINIMUM}{" "}
              further out — knives, scissors, and garden shears all count.
            </p>
          </div>
          <BookMobileFlow />
        </section>
      </main>
      <Footer />
    </>
  );
}
