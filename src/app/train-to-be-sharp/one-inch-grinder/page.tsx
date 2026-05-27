import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  Phone,
  BookOpen,
  Wrench,
  Microscope,
  MapPin,
  TrendingUp,
  Truck,
  DollarSign,
  Video,
  Plus,
  Cog,
  Briefcase,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseSignUp from "@/components/courses/CourseSignUp";
import { safeJsonLd, breadcrumbSchema } from "@/lib/schema";
import { isEnrollmentOpen } from "@/lib/course-enrollment-status";

export const metadata: Metadata = {
  title: "One-Inch Grinder Course — Knife Sharpening Training | Cove Blades",
  description:
    "Learn small-machine knife sharpening with the Cove Blades One-Inch Grinder course. Online theory plus a 3-hour hands-on practicum. Sharpness-tester verified, microscope-checked. $600.",
  alternates: { canonical: "/train-to-be-sharp/one-inch-grinder" },
};

const addOns = [
  {
    icon: Cog,
    name: "Two-Inch Grinder Module",
    description:
      "For students who want to expand into larger blades, higher volume, or a bigger belt platform.",
  },
  {
    icon: Briefcase,
    name: "Business Process & Automation Discussion",
    description:
      "A two-hour discussion covering how Cove Blades operates, including drop-off, pickup, mobile logistics, inbound calls, texts, and automation.",
  },
];

export default async function OneInchGrinderPage() {
  const enrollOpen = await isEnrollmentOpen("train-to-be-sharp");
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Home", url: "https://coveblades.com" },
    { name: "Training", url: "https://coveblades.com/train-to-be-sharp" },
    {
      name: "One-Inch Grinder",
      url: "https://coveblades.com/train-to-be-sharp/one-inch-grinder",
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
              <Wrench size={14} />
              Core offering
            </div>
            <h1
              className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-6"
              style={{ color: "#FFFFFF" }}
            >
              One-Inch <span style={{ color: "#D4A017" }}>Grinder</span> Course
            </h1>
            <p
              className="text-lg max-w-xl mx-auto leading-relaxed mb-8"
              style={{ color: "#6B7280" }}
            >
              The practical workhorse setup for a residential, drop-off, or
              small commercial sharpening service. Most students start here
              before expanding into larger machines or additional business
              modules.
            </p>
            <p className="text-3xl font-bold" style={{ color: "#D4A017" }}>
              $600
            </p>
          </div>
        </section>

        {/* Course Structure */}
        <section
          className="py-16 px-6"
          style={{ borderTop: "1px solid #30363D" }}
        >
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-10 text-center"
              style={{ color: "#FFFFFF" }}
            >
              Course <span style={{ color: "#D4A017" }}>Structure</span>
            </h2>

            <div className="space-y-8">
              {/* Part 1 */}
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
                    <BookOpen size={20} style={{ color: "#D4A017" }} />
                  </div>
                  <div>
                    <span
                      className="text-xs uppercase tracking-wider"
                      style={{ color: "#D4A017" }}
                    >
                      Part 1 — Completed first
                    </span>
                    <h3
                      className="font-bold text-lg mt-1"
                      style={{ color: "#FFFFFF" }}
                    >
                      Online Course
                    </h3>
                  </div>
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#9CA3AF" }}
                >
                  Before booking the hands-on practicum, students must complete
                  the online portion of the course. It generally takes one to two
                  hours and covers core sharpening theory, safety, machine setup,
                  belt progression, edge geometry, apex formation, and the basic
                  workflow used in the Cove Blades sharpening process.
                </p>
              </div>

              {/* Part 2 */}
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
                    <Wrench size={20} style={{ color: "#D4A017" }} />
                  </div>
                  <div>
                    <span
                      className="text-xs uppercase tracking-wider"
                      style={{ color: "#D4A017" }}
                    >
                      Part 2 — Approximately 3 hours
                    </span>
                    <h3
                      className="font-bold text-lg mt-1"
                      style={{ color: "#FFFFFF" }}
                    >
                      Hands-On Practicum
                    </h3>
                  </div>
                </div>
                <div
                  className="space-y-4 text-sm leading-relaxed"
                  style={{ color: "#9CA3AF" }}
                >
                  <p>
                    Once the online portion is complete, students can book their
                    in-person practicum. The practical session focuses on
                    supervised sharpening practice using one-inch machines. You
                    will work on training knives provided by Cove Blades, and
                    once you&rsquo;re comfortable, you&rsquo;re welcome to bring
                    some of your own knives to practise on as well.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 pt-2">
                    <div className="flex items-start gap-3">
                      <Microscope
                        size={16}
                        className="mt-0.5 shrink-0"
                        style={{ color: "#D4A017" }}
                      />
                      <p>
                        We use a sharpness tester and microscope to verify that
                        you can create and consistently repeat a commercially
                        viable apex. The goal is not just to &ldquo;get a knife
                        sharp once,&rdquo; but to understand how to repeat the
                        process with confidence.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Video
                        size={16}
                        className="mt-0.5 shrink-0"
                        style={{ color: "#D4A017" }}
                      />
                      <p>
                        Your practicum may be recorded so you can refer back to
                        the lesson later as you continue practising.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Location */}
        <section
          className="py-16 px-6"
          style={{
            backgroundColor: "#161B22",
            borderTop: "1px solid #30363D",
          }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <div
              className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full text-xs uppercase tracking-wider"
              style={{
                backgroundColor: "rgba(212,160,23,0.1)",
                color: "#D4A017",
                border: "1px solid rgba(212,160,23,0.3)",
              }}
            >
              <MapPin size={14} />
              Location
            </div>
            <h2
              className="text-2xl sm:text-3xl font-bold mb-4"
              style={{ color: "#FFFFFF" }}
            >
              Onsite or <span style={{ color: "#D4A017" }}>Mobile</span>
            </h2>
            <p
              className="text-base leading-relaxed max-w-xl mx-auto"
              style={{ color: "#9CA3AF" }}
            >
              The hands-on practicum is available either at our home shop in
              North Vancouver, or we can come to you if you have suitable level
              parking for our Sprinter van.
            </p>
          </div>
        </section>

        {/* Add-On Modules */}
        <section
          className="py-16 px-6"
          style={{ borderTop: "1px solid #30363D" }}
        >
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div
                className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full text-xs uppercase tracking-wider"
                style={{
                  backgroundColor: "rgba(212,160,23,0.1)",
                  color: "#D4A017",
                  border: "1px solid rgba(212,160,23,0.3)",
                }}
              >
                <Plus size={14} />
                Optional Add-Ons
              </div>
              <h2
                className="text-2xl sm:text-3xl font-bold"
                style={{ color: "#FFFFFF" }}
              >
                Expand <span style={{ color: "#D4A017" }}>Your Path</span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {addOns.map((a) => (
                <div
                  key={a.name}
                  className="rounded-xl border p-6"
                  style={{
                    backgroundColor: "#161B22",
                    borderColor: "#30363D",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: "rgba(212,160,23,0.1)" }}
                  >
                    <a.icon size={20} style={{ color: "#D4A017" }} />
                  </div>
                  <h3
                    className="font-bold mb-2"
                    style={{ color: "#FFFFFF" }}
                  >
                    {a.name}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#9CA3AF" }}
                  >
                    {a.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ROI */}
        <section
          className="py-16 px-6"
          style={{
            backgroundColor: "#161B22",
            borderTop: "1px solid #30363D",
          }}
        >
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div
                className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full text-xs uppercase tracking-wider"
                style={{
                  backgroundColor: "rgba(212,160,23,0.1)",
                  color: "#D4A017",
                  border: "1px solid rgba(212,160,23,0.3)",
                }}
              >
                <TrendingUp size={14} />
                Return on Investment
              </div>
              <h2
                className="text-2xl sm:text-3xl font-bold"
                style={{ color: "#FFFFFF" }}
              >
                Recoup in{" "}
                <span style={{ color: "#D4A017" }}>One to Two Months</span>
              </h2>
            </div>
            <div
              className="space-y-5 text-base leading-relaxed"
              style={{ color: "#9CA3AF" }}
            >
              <p>
                Many students are able to recoup their tuition within one to two
                months, depending on location, effort, practice time, and how
                actively they market the service.
              </p>
              <p>
                Students who already understand social media, local marketing,
                Google Business Profile, or paid ads often see a faster path to
                paid work.
              </p>
              <p>
                By the end of the course, you should have the foundation needed
                to offer sharpening as a billable service, with the potential to
                generate strong hourly revenue once your skill, speed,
                reputation, and customer base develop.
              </p>
            </div>
          </div>
        </section>

        {/* Equipment */}
        <section
          className="py-16 px-6"
          style={{ borderTop: "1px solid #30363D" }}
        >
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div
                className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full text-xs uppercase tracking-wider"
                style={{
                  backgroundColor: "rgba(212,160,23,0.1)",
                  color: "#D4A017",
                  border: "1px solid rgba(212,160,23,0.3)",
                }}
              >
                <Truck size={14} />
                Equipment & Startup Costs
              </div>
              <h2
                className="text-2xl sm:text-3xl font-bold"
                style={{ color: "#FFFFFF" }}
              >
                Start <span style={{ color: "#D4A017" }}>Lean</span>
              </h2>
            </div>
            <div
              className="space-y-5 text-base leading-relaxed"
              style={{ color: "#9CA3AF" }}
            >
              <p>
                I&rsquo;ll guide you on which small machines and basic startup
                equipment make the most sense. Amazon is usually the easiest
                place to source the main machine.
              </p>
              <p>
                Consumables, mainly belts, can be purchased through Cove Blades
                at below-market rates because we source directly from the
                manufacturer. You&rsquo;re also welcome to buy your own supplies
                elsewhere.
              </p>
              <p>
                Startup costs can be kept very lean. My usual recommendation is
                to begin with one small machine, operate from your garage or home
                shop, and grow the business using profit rather than overbuying
                equipment on day one.
              </p>
            </div>
          </div>
        </section>

        {/* Sign Up / Coming Soon */}
        <section
          className="py-20 px-6"
          style={{
            backgroundColor: "#161B22",
            borderTop: "1px solid #30363D",
          }}
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
              $600
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
                  Secure your spot — we&rsquo;ll send you access to the online
                  course right away.
                </p>
                <div
                  className="rounded-xl border p-5 sm:p-8 text-left"
                  style={{ backgroundColor: "#0D1117", borderColor: "#30363D" }}
                >
                  <CourseSignUp
                    courseSlug="one-inch-grinder"
                    courseName="One-Inch Grinder Course"
                    price="$600"
                    priceNote="Tuition is non-refundable. Additional modules can be added separately."
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
                  This course is currently being finalized. Reach out if
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
              Happy to jump on a call if you&rsquo;d like to talk through the
              setup, course format, equipment, and whether this is the right fit
              for your goals.
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
