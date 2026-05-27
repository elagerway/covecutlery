import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  Phone,
  Briefcase,
  DollarSign,
  Truck,
  MapPin,
  MessageSquare,
  Bot,
  CreditCard,
  Users,
  Clock,
  Store,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseSignUp from "@/components/courses/CourseSignUp";
import { safeJsonLd, breadcrumbSchema } from "@/lib/schema";
import { isEnrollmentOpen } from "@/lib/course-enrollment-status";

export const metadata: Metadata = {
  title:
    "Business Process & Automation — Knife Sharpening Training | Cove Blades",
  description:
    "Two-hour discussion covering how Cove Blades operates commercially — mobile logistics, drop-off workflows, AI call handling, SMS automation, booking, invoicing, and pricing strategy. $200.",
  alternates: { canonical: "/train-to-be-sharp/business-process" },
};

const topics = [
  {
    icon: Truck,
    title: "Mobile service logistics",
    description:
      "Route planning, van setup, power systems (inverter + batteries), appointment scheduling, and how to serve a geographic area without wasting drive time.",
  },
  {
    icon: Store,
    title: "Drop-off & pickup workflow",
    description:
      "Setting up a drop box, managing intake without being home, labelling systems, turnaround commitments, and how drop-off scales alongside mobile.",
  },
  {
    icon: Bot,
    title: "AI call handling",
    description:
      "How our AI voice agent answers every inbound call 24/7 — greeting, answering questions, quoting prices, and directing callers to book online. What it cost to set up and what it saves.",
  },
  {
    icon: MessageSquare,
    title: "SMS & text automation",
    description:
      "Automatic replies, appointment reminders, customer creation from inbound texts, and the two-number system we use to separate personal from business messaging.",
  },
  {
    icon: CreditCard,
    title: "Booking, invoicing & payments",
    description:
      "Online booking with deposits, Stripe checkout, Interac e-Transfer, invoice generation, and how we collect payment before the knife leaves our hands.",
  },
  {
    icon: Users,
    title: "Customer management & pricing",
    description:
      "How we track customers, set pricing by service type, handle restaurant accounts versus residential, and the upsells that increase average ticket size.",
  },
];

export default async function BusinessProcessPage() {
  const enrollOpen = await isEnrollmentOpen("business-process");
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Home", url: "https://coveblades.com" },
    { name: "Training", url: "https://coveblades.com/train-to-be-sharp" },
    {
      name: "Business Process & Automation",
      url: "https://coveblades.com/train-to-be-sharp/business-process",
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
              <Briefcase size={14} />
              Two-hour discussion
            </div>
            <h1
              className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-6"
              style={{ color: "#FFFFFF" }}
            >
              Business Process &{" "}
              <span style={{ color: "#D4A017" }}>Automation</span>
            </h1>
            <p
              className="text-lg max-w-xl mx-auto leading-relaxed mb-8"
              style={{ color: "#6B7280" }}
            >
              A two-hour, behind-the-scenes look at how we actually run Cove
              Blades — the logistics, the automation, the money side, and the
              decisions that keep it working. This isn&rsquo;t a setup session.
              It&rsquo;s a conversation about what we do and why.
            </p>
            <p className="text-3xl font-bold" style={{ color: "#D4A017" }}>
              $200
            </p>
          </div>
        </section>

        {/* What This Is */}
        <section
          className="py-16 px-6"
          style={{ borderTop: "1px solid #30363D" }}
        >
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-6 text-center"
              style={{ color: "#FFFFFF" }}
            >
              What This <span style={{ color: "#D4A017" }}>Is</span>
            </h2>
            <div
              className="space-y-5 text-base leading-relaxed"
              style={{ color: "#9CA3AF" }}
            >
              <p>
                This is a candid, two-hour discussion about the operational side
                of running a sharpening business. I&rsquo;ll walk you through
                exactly how Cove Blades works — the tools, the workflows, the
                automation, the pricing, and the mistakes I made along the way.
              </p>
              <p>
                The goal is to give you a realistic picture of what the business
                actually looks like day to day, so you can make informed
                decisions about how to build yours. Some of what we do will
                apply directly. Some of it won&rsquo;t fit your market or your
                style. Either way, you&rsquo;ll leave with a clear map of
                what&rsquo;s possible and what it costs.
              </p>
              <p>
                This is not a hands-on build session — if you want to actually
                set up your website, AI assistant, and business tools in one
                sitting, that&rsquo;s the{" "}
                <Link
                  href="/train-to-be-sharp/build-your-business"
                  className="underline transition-colors hover:text-white"
                  style={{ color: "#D4A017" }}
                >
                  Build Your Business with AI
                </Link>{" "}
                workshop.
              </p>
            </div>
          </div>
        </section>

        {/* Topics */}
        <section
          className="py-16 px-6"
          style={{
            backgroundColor: "#161B22",
            borderTop: "1px solid #30363D",
          }}
        >
          <div className="max-w-5xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-10 text-center"
              style={{ color: "#FFFFFF" }}
            >
              What We&rsquo;ll{" "}
              <span style={{ color: "#D4A017" }}>Cover</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map((t) => (
                <div
                  key={t.title}
                  className="rounded-xl border p-6"
                  style={{
                    backgroundColor: "#0D1117",
                    borderColor: "#30363D",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: "rgba(212,160,23,0.1)" }}
                  >
                    <t.icon size={20} style={{ color: "#D4A017" }} />
                  </div>
                  <h3
                    className="font-bold mb-2"
                    style={{ color: "#FFFFFF" }}
                  >
                    {t.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#9CA3AF" }}
                  >
                    {t.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Playbook */}
        <section
          className="py-16 px-6"
          style={{ borderTop: "1px solid #30363D" }}
        >
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-6 text-center"
              style={{ color: "#FFFFFF" }}
            >
              The <span style={{ color: "#D4A017" }}>Playbook</span>
            </h2>
            <p
              className="text-center text-sm mb-10"
              style={{ color: "#6B7280" }}
            >
              A snapshot of the systems and decisions behind a working
              sharpening service.
            </p>

            <div className="space-y-6">
              {/* Mobile */}
              <div
                className="rounded-xl border p-6 sm:p-8"
                style={{
                  backgroundColor: "#161B22",
                  borderColor: "#30363D",
                }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "rgba(212,160,23,0.1)" }}
                  >
                    <Truck size={20} style={{ color: "#D4A017" }} />
                  </div>
                  <h3
                    className="font-bold text-lg mt-1.5"
                    style={{ color: "#FFFFFF" }}
                  >
                    Mobile vs. Drop-Off vs. Both
                  </h3>
                </div>
                <div
                  className="space-y-4 text-sm leading-relaxed"
                  style={{ color: "#9CA3AF" }}
                >
                  <p>
                    We run mobile and drop-off simultaneously. The mobile van
                    handles scheduled appointments across a service area — route
                    planning, drive time, parking logistics, and the power setup
                    (inverter, batteries, car charging) that lets us sharpen
                    anywhere with level ground.
                  </p>
                  <p>
                    Drop-off runs 24/7 through a drop box at the home shop. No
                    appointments needed, no interaction required — customers
                    leave knives, we sharpen and notify when done. I&rsquo;ll
                    walk through how both channels feed each other and why
                    running both is easier than picking one.
                  </p>
                </div>
              </div>

              {/* Automation */}
              <div
                className="rounded-xl border p-6 sm:p-8"
                style={{
                  backgroundColor: "#161B22",
                  borderColor: "#30363D",
                }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "rgba(212,160,23,0.1)" }}
                  >
                    <Bot size={20} style={{ color: "#D4A017" }} />
                  </div>
                  <h3
                    className="font-bold text-lg mt-1.5"
                    style={{ color: "#FFFFFF" }}
                  >
                    Calls, Texts & AI
                  </h3>
                </div>
                <div
                  className="space-y-4 text-sm leading-relaxed"
                  style={{ color: "#9CA3AF" }}
                >
                  <p>
                    Every inbound call hits an AI voice agent that answers
                    questions, quotes prices, describes the service, and directs
                    callers to book online. It runs 24/7 and handles the calls I
                    can&rsquo;t pick up — which is most of them, since I&rsquo;m
                    usually sharpening.
                  </p>
                  <p>
                    Inbound texts get automatic replies with booking links and
                    service info. New numbers are automatically created as
                    customer records. I&rsquo;ll show you the actual system,
                    what it cost to set up, and the monthly running cost.
                  </p>
                </div>
              </div>

              {/* Money */}
              <div
                className="rounded-xl border p-6 sm:p-8"
                style={{
                  backgroundColor: "#161B22",
                  borderColor: "#30363D",
                }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "rgba(212,160,23,0.1)" }}
                  >
                    <CreditCard size={20} style={{ color: "#D4A017" }} />
                  </div>
                  <h3
                    className="font-bold text-lg mt-1.5"
                    style={{ color: "#FFFFFF" }}
                  >
                    Getting Paid
                  </h3>
                </div>
                <div
                  className="space-y-4 text-sm leading-relaxed"
                  style={{ color: "#9CA3AF" }}
                >
                  <p>
                    Online bookings collect a deposit via Stripe before the
                    appointment is confirmed. Invoices go out by email with a
                    pay-by-card or e-Transfer option. Drop-off customers pay on
                    pickup via the same channels. I&rsquo;ll talk through the
                    actual flow — from the moment a customer books to the moment
                    you have the money.
                  </p>
                  <p>
                    We&rsquo;ll also cover pricing strategy: per-knife versus
                    per-inch, residential versus restaurant accounts, how to
                    price mobile versus drop-off, and the upsells (thinning,
                    repair, polish) that increase average ticket size without
                    adding much time.
                  </p>
                </div>
              </div>

              {/* Customers */}
              <div
                className="rounded-xl border p-6 sm:p-8"
                style={{
                  backgroundColor: "#161B22",
                  borderColor: "#30363D",
                }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "rgba(212,160,23,0.1)" }}
                  >
                    <MapPin size={20} style={{ color: "#D4A017" }} />
                  </div>
                  <h3
                    className="font-bold text-lg mt-1.5"
                    style={{ color: "#FFFFFF" }}
                  >
                    Finding & Keeping Customers
                  </h3>
                </div>
                <div
                  className="space-y-4 text-sm leading-relaxed"
                  style={{ color: "#9CA3AF" }}
                >
                  <p>
                    Google Business Profile, local SEO, social media,
                    word-of-mouth, and restaurant cold outreach — what actually
                    brought in customers and what didn&rsquo;t. I&rsquo;ll share
                    real numbers where I can.
                  </p>
                  <p>
                    We&rsquo;ll also talk about the service area question — how
                    far is too far for mobile, when to add a second drop-off
                    point, and how to think about geographic expansion without
                    burning fuel for thin margins.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Format */}
        <section
          className="py-16 px-6"
          style={{
            backgroundColor: "#161B22",
            borderTop: "1px solid #30363D",
          }}
        >
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <div
                className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full text-xs uppercase tracking-wider"
                style={{
                  backgroundColor: "rgba(212,160,23,0.1)",
                  color: "#D4A017",
                  border: "1px solid rgba(212,160,23,0.3)",
                }}
              >
                <Clock size={14} />
                Format
              </div>
              <h2
                className="text-2xl sm:text-3xl font-bold"
                style={{ color: "#FFFFFF" }}
              >
                How It <span style={{ color: "#D4A017" }}>Works</span>
              </h2>
            </div>
            <div
              className="space-y-5 text-base leading-relaxed"
              style={{ color: "#9CA3AF" }}
            >
              <p>
                This is a one-on-one conversation, not a classroom lecture.
                Two hours, in person or over a call, depending on your
                preference. Bring questions — the session works best when it
                follows wherever your specific situation leads.
              </p>
              <p>
                Some students take this before they start sharpening, to
                understand the business model before committing. Others take it
                after the One-Inch Grinder course, once they have the skill and
                want to figure out the commercial side. Both approaches work.
              </p>
              <p>
                If after the discussion you decide you want hands-on help
                actually building out your systems, the{" "}
                <Link
                  href="/train-to-be-sharp/build-your-business"
                  className="underline transition-colors hover:text-white"
                  style={{ color: "#D4A017" }}
                >
                  Build Your Business with AI
                </Link>{" "}
                workshop is the natural next step — that&rsquo;s where we sit
                down together and set everything up.
              </p>
            </div>
          </div>
        </section>

        {/* Sign Up / Coming Soon */}
        <section
          className="py-20 px-6"
          style={{ borderTop: "1px solid #30363D" }}
        >
          <div className="max-w-md mx-auto text-center">
            <div
              className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full text-xs uppercase tracking-wider"
              style={{
                backgroundColor: "rgba(212,160,23,0.1)",
                color: "#D4A017",
                border: "1px solid rgba(212,160,23,0.3)",
              }}
            >
              <DollarSign size={14} />
              $200
            </div>
            {enrollOpen ? (
              <>
                <h2
                  className="text-2xl sm:text-3xl font-bold mb-3"
                  style={{ color: "#FFFFFF" }}
                >
                  Sign Up &{" "}
                  <span style={{ color: "#D4A017" }}>Get Started</span>
                </h2>
                <p className="text-sm mb-10" style={{ color: "#6B7280" }}>
                  Reserve your session — we&rsquo;ll reach out to schedule.
                </p>
                <div
                  className="rounded-xl border p-5 sm:p-8 text-left"
                  style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
                >
                  <CourseSignUp
                    courseSlug="business-process"
                    courseName="Business Process & Automation"
                    price="$200"
                    priceNote="Tuition is non-refundable."
                  />
                </div>
              </>
            ) : (
              <>
                <h2
                  className="text-2xl sm:text-3xl font-bold mb-3"
                  style={{ color: "#FFFFFF" }}
                >
                  Coming <span style={{ color: "#D4A017" }}>Soon</span>
                </h2>
                <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
                  This module is currently being finalized. Reach out if
                  you&rsquo;d like to be notified when enrollment opens.
                </p>
                <a
                  href="tel:6042108180"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border-2 transition-all duration-200 hover:bg-yellow-900/20 active:scale-95"
                  style={{ borderColor: "#D4A017", color: "#D4A017" }}
                >
                  <Phone size={16} />
                  604 210 8180
                </a>
              </>
            )}
          </div>
        </section>

        {/* CTA */}
        <section
          className="py-16 px-6 text-center"
          style={{
            backgroundColor: "#161B22",
            borderTop: "1px solid #30363D",
          }}
        >
          <div className="max-w-xl mx-auto">
            <h2
              className="text-2xl font-bold mb-3"
              style={{ color: "#FFFFFF" }}
            >
              Want to <span style={{ color: "#D4A017" }}>Talk First</span>?
            </h2>
            <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
              Happy to chat about what the session covers and whether it fits
              where you are in the process.
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
