import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Enrollment Confirmed — Cove Blades",
  robots: { index: false },
};

export default function EnrollmentSuccessPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "#0D1117",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <Navbar />

      <main className="flex-1 pt-16 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center py-24">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: "rgba(34,197,94,0.1)" }}
          >
            <CheckCircle size={32} style={{ color: "#22C55E" }} />
          </div>
          <h1
            className="text-3xl font-bold mb-3"
            style={{ color: "#FFFFFF" }}
          >
            You&rsquo;re In
          </h1>
          <p
            className="text-base leading-relaxed mb-8"
            style={{ color: "#9CA3AF" }}
          >
            Payment received. We&rsquo;ll be in touch shortly to schedule your
            session.
          </p>
          <Link
            href="/train-to-be-sharp/two-inch-grinder"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-white"
            style={{ color: "#D4A017" }}
          >
            Back to course details
            <ChevronRight size={14} />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
