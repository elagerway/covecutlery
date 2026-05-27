import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Phone, Sparkles, DollarSign } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseSignUp from "@/components/courses/CourseSignUp";
import { safeJsonLd, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title:
    "Build Your Business with AI — Hands-On Workshop | Cove Blades",
  description:
    "A 3-4 hour one-on-one build session. Together we set up your website, email marketing, social profiles, business cards, phone number, and AI assistant. $600.",
  alternates: { canonical: "/train-to-be-sharp/build-your-business" },
};

export default function BuildYourBusinessPage() {
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Home", url: "https://coveblades.com" },
    { name: "Training", url: "https://coveblades.com/train-to-be-sharp" },
    {
      name: "Build Your Business with AI",
      url: "https://coveblades.com/train-to-be-sharp/build-your-business",
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
              <Sparkles size={14} />
              Half-day workshop
            </div>
            <h1
              className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-6"
              style={{ color: "#FFFFFF" }}
            >
              Build Your Business with{" "}
              <span style={{ color: "#D4A017" }}>AI</span>
            </h1>
            <p
              className="text-lg max-w-xl mx-auto leading-relaxed mb-8"
              style={{ color: "#6B7280" }}
            >
              A 3&ndash;4 hour one-on-one build session. Walk out with a working
              business toolkit and the playbook to maintain it.
            </p>
            <p className="text-3xl font-bold" style={{ color: "#D4A017" }}>
              $600
            </p>
          </div>
        </section>

        {/* What We Build */}
        <section
          className="py-16 px-6"
          style={{ borderTop: "1px solid #30363D" }}
        >
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-10 text-center"
              style={{ color: "#FFFFFF" }}
            >
              What We <span style={{ color: "#D4A017" }}>Build Together</span>
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
                Together we set up your website, email marketing, social
                profiles, business cards, phone number, and AI assistant — all
                using modern AI tooling. This is a hands-on build session, not a
                lecture.
              </p>
              <p>
                By the end of the workshop you&rsquo;ll have a working online
                presence and the tools to start marketing your sharpening
                service immediately. Everything we set up is yours to keep and
                maintain on your own.
              </p>
              <p>
                This module works well as a standalone for students who already
                have sharpening skills and need to get the business side off the
                ground, or as an add-on after the One-Inch Grinder course.
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
                $600
              </div>
              <h2
                className="text-2xl sm:text-3xl font-bold mb-3"
                style={{ color: "#FFFFFF" }}
              >
                Sign Up &{" "}
                <span style={{ color: "#D4A017" }}>Get Started</span>
              </h2>
              <p className="text-sm" style={{ color: "#6B7280" }}>
                Reserve your one-on-one build session.
              </p>
            </div>
            <div
              className="rounded-xl border p-5 sm:p-8"
              style={{ backgroundColor: "#0D1117", borderColor: "#30363D" }}
            >
              <CourseSignUp
                courseSlug="build-your-business"
                courseName="Build Your Business with AI — Hands-On"
                price="$600"
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
              Happy to walk you through what the session looks like and whether
              it fits your goals.
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
