import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Phone, Cog, DollarSign } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseSignUp from "@/components/courses/CourseSignUp";
import { safeJsonLd, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Two-Inch Grinder Module — Knife Sharpening Training | Cove Blades",
  description:
    "Expand into larger blades and higher volume with the Cove Blades Two-Inch Grinder module. Hands-on training on a bigger belt platform. $400.",
  alternates: { canonical: "/train-to-be-sharp/two-inch-grinder" },
};

export default function TwoInchGrinderPage() {
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Home", url: "https://coveblades.com" },
    { name: "Training", url: "https://coveblades.com/train-to-be-sharp" },
    {
      name: "Two-Inch Grinder",
      url: "https://coveblades.com/train-to-be-sharp/two-inch-grinder",
    },
  ]);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "#0D1117",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />
      <Navbar />

      <main className="flex-1 pt-16">
        {/* Hero */}
        <section
          className="relative py-24 px-6 overflow-hidden"
          style={{ backgroundColor: "#0D1117" }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(212,160,23,0.07) 0%, transparent 55%, rgba(30,144,255,0.04) 100%)",
            }}
          />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <Link
              href="/train-to-be-sharp"
              className="flex items-center justify-center gap-1 text-xs mb-6 transition-colors hover:text-white"
              style={{ color: "#6B7280" }}
            >
              <ChevronRight size={12} className="rotate-180" />
              All courses
            </Link>
            <div
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-xs uppercase tracking-wider"
              style={{
                backgroundColor: "rgba(212,160,23,0.1)",
                color: "#D4A017",
                border: "1px solid rgba(212,160,23,0.3)",
              }}
            >
              <Cog size={14} />
              Expand your range
            </div>
            <h1
              className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-6"
              style={{ color: "#FFFFFF" }}
            >
              Two-Inch <span style={{ color: "#D4A017" }}>Grinder</span> Module
            </h1>
            <p
              className="text-lg max-w-xl mx-auto leading-relaxed mb-8"
              style={{ color: "#6B7280" }}
            >
              For students who want to expand into larger blades, higher volume,
              or a bigger belt platform. Pairs naturally with the One-Inch
              Grinder course.
            </p>
            <p className="text-3xl font-bold" style={{ color: "#D4A017" }}>
              $400
            </p>
          </div>
        </section>

        {/* What You'll Learn */}
        <section
          className="py-16 px-6"
          style={{ borderTop: "1px solid #30363D" }}
        >
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-10 text-center"
              style={{ color: "#FFFFFF" }}
            >
              What You&rsquo;ll <span style={{ color: "#D4A017" }}>Learn</span>
            </h2>
            <div
              className="rounded-xl border p-6 sm:p-8 space-y-5 text-base leading-relaxed"
              style={{
                backgroundColor: "#161B22",
                borderColor: "#30363D",
                color: "#9CA3AF",
              }}
            >
              <p>
                The two-inch grinder opens up a wider range of blade types and
                lets you move through higher volumes more efficiently. This
                module covers the differences in machine setup, belt selection,
                pressure control, and workflow adaptations compared to the
                one-inch platform.
              </p>
              <p>
                You&rsquo;ll work on a variety of larger blades during the
                hands-on portion, building confidence with the wider belt and
                learning when to reach for the two-inch over the one-inch for
                different jobs.
              </p>
              <p>
                This module is designed as an add-on for students who have
                already completed (or are completing) the One-Inch Grinder
                course.
              </p>
            </div>
          </div>
        </section>

        {/* Sign Up & Pay */}
        <section
          className="py-20 px-6"
          style={{
            backgroundColor: "#161B22",
            borderTop: "1px solid #30363D",
          }}
        >
          <div className="max-w-md mx-auto">
            <div className="text-center mb-10">
              <div
                className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full text-xs uppercase tracking-wider"
                style={{
                  backgroundColor: "rgba(212,160,23,0.1)",
                  color: "#D4A017",
                  border: "1px solid rgba(212,160,23,0.3)",
                }}
              >
                <DollarSign size={14} />
                $400
              </div>
              <h2
                className="text-2xl sm:text-3xl font-bold mb-3"
                style={{ color: "#FFFFFF" }}
              >
                Sign Up &{" "}
                <span style={{ color: "#D4A017" }}>Get Started</span>
              </h2>
              <p className="text-sm" style={{ color: "#6B7280" }}>
                Add this module to your training path.
              </p>
            </div>
            <div
              className="rounded-xl border p-5 sm:p-8"
              style={{ backgroundColor: "#0D1117", borderColor: "#30363D" }}
            >
              <CourseSignUp
                courseSlug="two-inch-grinder"
                courseName="Two-Inch Grinder Module"
                price="$400"
                priceNote="Tuition is non-refundable."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          className="py-16 px-6 text-center"
          style={{ borderTop: "1px solid #30363D" }}
        >
          <div className="max-w-xl mx-auto">
            <h2
              className="text-2xl font-bold mb-3"
              style={{ color: "#FFFFFF" }}
            >
              Want to <span style={{ color: "#D4A017" }}>Talk First</span>?
            </h2>
            <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
              Happy to chat about whether this module is the right next step for
              you.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="tel:6042108180"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border-2 transition-all duration-200 hover:bg-yellow-900/20 active:scale-95"
                style={{ borderColor: "#D4A017", color: "#D4A017" }}
              >
                <Phone size={16} />
                604 210 8180
              </a>
              <Link
                href="/train-to-be-sharp"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-colors hover:text-white"
                style={{ color: "#6B7280" }}
              >
                <ChevronRight size={14} className="rotate-180" />
                All courses
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
