import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  Phone,
  Cog,
  DollarSign,
  BookOpen,
  Wrench,
  Flame,
  Layers,
  Zap,
  Shield,
  TrendingUp,
  AlertTriangle,
  ScanLine,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CourseSignUp from "@/components/courses/CourseSignUp";
import { safeJsonLd, breadcrumbSchema } from "@/lib/schema";
import { isEnrollmentOpen } from "@/lib/course-enrollment-status";

export const metadata: Metadata = {
  title: "Two-Inch Grinder Module — Knife Sharpening Training | Cove Blades",
  description:
    "Expand into larger blades, higher volume, and polishing with the Cove Blades Two-Inch Grinder module. Belt progression, heat management, platen vs contact wheel, and commercial workflow. $400.",
  alternates: { canonical: "/train-to-be-sharp/two-inch-grinder" },
};

const topics = [
  {
    icon: Cog,
    title: "Machine setup & belt tracking",
    description:
      "Platen alignment, belt tension, tracking adjustment, and when to use the flat platen versus the contact wheel for different blade types.",
  },
  {
    icon: Layers,
    title: "Belt progression & abrasives",
    description:
      "Ceramic, zirconia, aluminum oxide, and Trizact structured abrasives — which grits to use, when to skip, and how the progression differs from one-inch work.",
  },
  {
    icon: Flame,
    title: "Heat management",
    description:
      "How to keep the edge below tempering temperature with light pressure, quick passes, and speed control. Recognizing heat discoloration before it costs you a blade.",
  },
  {
    icon: Zap,
    title: "Speed & pressure control",
    description:
      "Variable speed selection for each stage — from aggressive reprofiling down to slow-speed stropping. Why the same hand pressure behaves differently on a wider belt.",
  },
  {
    icon: ScanLine,
    title: "Knife thinning with a radius platen",
    description:
      "How to thin behind the edge using the Airplaten radius platen — restoring cutting geometry on knives that have been sharpened many times and now wedge through food.",
  },
  {
    icon: Shield,
    title: "Polishing & stropping",
    description:
      "Trizact finishing belts, leather strop belts with compound, and the grit progression to take a working edge to a presentation-quality finish.",
  },
  {
    icon: TrendingUp,
    title: "Commercial workflow",
    description:
      "How to move through volume efficiently — belt staging, fixture-based angle control, and the practical sharpening cycle that gets a knife from dull to finished in under two minutes.",
  },
];

const bladeTypes = [
  "Chef's knives & slicers",
  "Cleavers & butcher knives",
  "Machetes & camp knives",
  "Axes & hatchets",
  "Garden tools — hedge shears, loppers, pruners",
  "Lawnmower blades & shovels",
];

export default async function TwoInchGrinderPage() {
  const enrollOpen = await isEnrollmentOpen("two-inch-grinder");
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
              Step up to the wider belt platform — handle larger blades, move
              through higher volumes, and add polishing to your service. This
              module picks up where the one-inch course leaves off.
            </p>
            <p className="text-3xl font-bold" style={{ color: "#D4A017" }}>
              $400
            </p>
          </div>
        </section>

        {/* Why Two-Inch */}
        <section
          className="py-16 px-6"
          style={{ borderTop: "1px solid #30363D" }}
        >
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-6 text-center"
              style={{ color: "#FFFFFF" }}
            >
              Why <span style={{ color: "#D4A017" }}>Two Inches</span>?
            </h2>
            <div
              className="space-y-5 text-base leading-relaxed"
              style={{ color: "#9CA3AF" }}
            >
              <p>
                A one-inch belt is the right tool for small knives, detail work,
                and tight recurves. But once you start handling full-size
                chef&rsquo;s knives, cleavers, or anything with a broad bevel,
                the wider belt earns its place quickly.
              </p>
              <p>
                The two-inch platform covers the full bevel in a single pass,
                runs cooler because 72 inches of abrasive surface dissipates
                heat more effectively, and gets through volume faster without
                sacrificing edge quality. For a working sharpening service, it
                means more knives per hour and the ability to take on blade
                types that a one-inch machine struggles with.
              </p>
            </div>
          </div>
        </section>

        {/* Blade Types */}
        <section
          className="py-16 px-6"
          style={{
            backgroundColor: "#161B22",
            borderTop: "1px solid #30363D",
          }}
        >
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-8 text-center"
              style={{ color: "#FFFFFF" }}
            >
              Blades You&rsquo;ll{" "}
              <span style={{ color: "#D4A017" }}>Work On</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {bladeTypes.map((b) => (
                <div
                  key={b}
                  className="flex items-center gap-3 px-5 py-3.5 rounded-lg border"
                  style={{
                    backgroundColor: "#0D1117",
                    borderColor: "#30363D",
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: "#D4A017" }}
                  />
                  <span className="text-sm" style={{ color: "#9CA3AF" }}>
                    {b}
                  </span>
                </div>
              ))}
            </div>
            <p
              className="text-sm text-center mt-6"
              style={{ color: "#6B7280" }}
            >
              Training knives and blades are provided. You&rsquo;re welcome to
              bring your own once you&rsquo;re comfortable.
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
              {/* Prerequisites */}
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
                    <AlertTriangle
                      size={20}
                      style={{ color: "#D4A017" }}
                    />
                  </div>
                  <div>
                    <span
                      className="text-xs uppercase tracking-wider"
                      style={{ color: "#D4A017" }}
                    >
                      Prerequisite
                    </span>
                    <h3
                      className="font-bold text-lg mt-1"
                      style={{ color: "#FFFFFF" }}
                    >
                      One-Inch Grinder Course
                    </h3>
                  </div>
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#9CA3AF" }}
                >
                  This module assumes you already have the fundamentals —
                  edge geometry, apex formation, belt progression, and basic
                  machine workflow. If you haven&rsquo;t completed the{" "}
                  <Link
                    href="/train-to-be-sharp/one-inch-grinder"
                    className="underline transition-colors hover:text-white"
                    style={{ color: "#D4A017" }}
                  >
                    One-Inch Grinder course
                  </Link>
                  , start there first.
                </p>
              </div>

              {/* Online */}
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
                      Part 1 — Online review
                    </span>
                    <h3
                      className="font-bold text-lg mt-1"
                      style={{ color: "#FFFFFF" }}
                    >
                      Theory & Machine Differences
                    </h3>
                  </div>
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#9CA3AF" }}
                >
                  A focused online module covering what changes when you move
                  to a wider belt: abrasive selection for larger blades,
                  variable speed settings by stage, heat management on
                  thicker stock, and platen versus contact wheel geometry.
                  Takes about an hour.
                </p>
              </div>

              {/* Practicum */}
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
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#9CA3AF" }}
                >
                  Supervised practice on a two-inch belt grinder working
                  through a range of blade types — from large kitchen knives
                  through garden tools and axes. You&rsquo;ll run the full
                  belt progression from coarse reprofiling through Trizact
                  finishing and leather strop polishing, with sharpness
                  testing and microscope verification at each stage.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What's Covered */}
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
              What&rsquo;s{" "}
              <span style={{ color: "#D4A017" }}>Covered</span>
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

        {/* Knife Thinning */}
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
                <ScanLine size={14} />
                Airplaten Radius Platen
              </div>
              <h2
                className="text-2xl sm:text-3xl font-bold mb-4"
                style={{ color: "#FFFFFF" }}
              >
                Knife <span style={{ color: "#D4A017" }}>Thinning</span>
              </h2>
              <p className="text-sm max-w-xl mx-auto" style={{ color: "#6B7280" }}>
                The technique most sharpening services don&rsquo;t offer — and
                the one that makes the biggest difference on heavily used knives.
              </p>
            </div>

            <div
              className="space-y-5 text-base leading-relaxed"
              style={{ color: "#9CA3AF" }}
            >
              <p>
                Every time a knife is sharpened, metal is removed at the apex.
                Over months or years, the cutting edge migrates upward into
                progressively thicker steel. The result: a knife that tests
                sharp on paper but wedges through carrots and sticks to
                potatoes. The edge is fine — the geometry behind it is the
                problem.
              </p>
              <p>
                Thinning addresses this by reducing the thickness of the blade
                behind the edge, restoring the original cutting geometry.
                It&rsquo;s the difference between a knife that splits food
                apart and one that glides through it. For customers, it feels
                like getting a new knife — at a fraction of the replacement
                cost.
              </p>
            </div>

            {/* Radius platen detail */}
            <div
              className="rounded-xl border p-6 sm:p-8 mt-8"
              style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
            >
              <h3
                className="font-bold text-lg mb-4"
                style={{ color: "#FFFFFF" }}
              >
                Why a Radius Platen?
              </h3>
              <div
                className="space-y-4 text-sm leading-relaxed"
                style={{ color: "#9CA3AF" }}
              >
                <p>
                  A flat platen produces a flat grind — fine for setting bevels,
                  but it creates a hard shoulder where the grind meets the blade
                  face. A radius (convex) platen produces a smooth, gradual
                  curve that eliminates that shoulder entirely. Food parts
                  progressively instead of hitting a sudden thickness change.
                </p>
                <p>
                  We use the{" "}
                  <strong style={{ color: "#FFFFFF" }}>
                    Airplaten carbon-fiber radius platen
                  </strong>{" "}
                  — precision-machined to tolerances below 0.001&Prime;, with an
                  integrated thermal tunnel system that reduces heat buildup by
                  up to 40% compared to solid platens. That matters because
                  thinning work happens on already-thin steel where heat damage
                  can occur in milliseconds.
                </p>
                <p>
                  You&rsquo;ll learn to thin at shallow angles (2&ndash;5&deg;
                  from the blade face), using light pressure and low belt speed,
                  working both sides evenly. The radius platen naturally blends
                  the transition from thinned area to blade face, producing a
                  micro-convex geometry that improves both cutting performance
                  and edge retention.
                </p>
              </div>
            </div>

            {/* Thinning candidates */}
            <div
              className="rounded-xl border p-6 sm:p-8 mt-6"
              style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
            >
              <h3
                className="font-bold text-lg mb-4"
                style={{ color: "#FFFFFF" }}
              >
                Knives That Need Thinning
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "Japanese gyutos, santokus, and nakiris — thin steel that thickens quickly with repeated sharpening",
                  "German chef's knives — convex grinds that are difficult to thin on stones alone",
                  "Chinese vegetable cleavers — designed to slice, not chop, but they wedge when thick behind the edge",
                  "Restaurant knives — sharpened frequently, rarely thinned, often past the point where sharpening alone helps",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 p-3 rounded-lg"
                    style={{ backgroundColor: "#0D1117" }}
                  >
                    <div
                      className="w-2 h-2 rounded-full shrink-0 mt-1.5"
                      style={{ backgroundColor: "#D4A017" }}
                    />
                    <span className="text-sm" style={{ color: "#9CA3AF" }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Service upsell */}
            <div
              className="rounded-xl border p-6 sm:p-8 mt-6"
              style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
            >
              <h3
                className="font-bold text-lg mb-4"
                style={{ color: "#FFFFFF" }}
              >
                Thinning as a Service Add-On
              </h3>
              <div
                className="space-y-4 text-sm leading-relaxed"
                style={{ color: "#9CA3AF" }}
              >
                <p>
                  Thinning is the ideal premium upsell for a sharpening
                  business. Most customers don&rsquo;t know it exists, but once
                  you explain why their knife wedges through food even after
                  sharpening, the value sells itself.
                </p>
                <p>
                  With a radius platen on a belt grinder, thinning takes 3–5
                  minutes per knife — compared to 20–30 minutes by hand on
                  stones. That makes it commercially viable as a line item.
                  Typical market rates run{" "}
                  <strong style={{ color: "#FFFFFF" }}>
                    $10–$30+ per knife
                  </strong>{" "}
                  on top of the base sharpening fee.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Belt Progression */}
        <section
          className="py-16 px-6"
          style={{
            backgroundColor: "#161B22",
            borderTop: "1px solid #30363D",
          }}
        >
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-6 text-center"
              style={{ color: "#FFFFFF" }}
            >
              Belt <span style={{ color: "#D4A017" }}>Progression</span>
            </h2>
            <p
              className="text-center text-sm mb-10"
              style={{ color: "#6B7280" }}
            >
              The practical sharpening cycle we teach for service work — not
              every knife needs every step.
            </p>
            <div className="space-y-3">
              {[
                {
                  grit: "80–120",
                  type: "Ceramic",
                  use: "Reprofiling damaged or chipped edges only",
                },
                {
                  grit: "220",
                  type: "Ceramic / A.O.",
                  use: "Set the primary bevel — the workhorse grit",
                },
                {
                  grit: "400–600",
                  type: "A.O. / Trizact A30",
                  use: "Refine the scratch pattern and finish the bevel",
                },
                {
                  grit: "Trizact A16–A6",
                  type: "Structured",
                  use: "Polish to near-mirror — for presentation or customer preference",
                },
                {
                  grit: "Leather + compound",
                  type: "Strop",
                  use: "Deburr, remove wire edge, and bring the apex to its final state",
                },
              ].map((step, i) => (
                <div
                  key={step.grit}
                  className="flex items-start gap-4 rounded-xl border p-4 sm:p-5"
                  style={{
                    backgroundColor: "#161B22",
                    borderColor: "#30363D",
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
                    style={{
                      backgroundColor: "rgba(212,160,23,0.15)",
                      color: "#D4A017",
                    }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <span
                        className="font-bold text-sm"
                        style={{ color: "#FFFFFF" }}
                      >
                        {step.grit}
                      </span>
                      <span
                        className="text-xs"
                        style={{ color: "#6B7280" }}
                      >
                        {step.type}
                      </span>
                    </div>
                    <p
                      className="text-sm mt-1"
                      style={{ color: "#9CA3AF" }}
                    >
                      {step.use}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Differences */}
        <section
          className="py-16 px-6"
          style={{
            backgroundColor: "#161B22",
            borderTop: "1px solid #30363D",
          }}
        >
          <div className="max-w-3xl mx-auto">
            <h2
              className="text-2xl sm:text-3xl font-bold mb-6 text-center"
              style={{ color: "#FFFFFF" }}
            >
              One-Inch vs.{" "}
              <span style={{ color: "#D4A017" }}>Two-Inch</span>
            </h2>
            <p
              className="text-center text-sm mb-10"
              style={{ color: "#6B7280" }}
            >
              The wider belt isn&rsquo;t just &ldquo;bigger.&rdquo; The
              physics change.
            </p>
            <div
              className="space-y-5 text-base leading-relaxed"
              style={{ color: "#9CA3AF" }}
            >
              <p>
                The same hand force on a two-inch belt is distributed over
                twice the contact area, roughly halving the pressure at the
                cutting point. That makes the wider belt more forgiving —
                less likely to dig in or create uneven spots — but it also
                means you need to be more deliberate about your pressure to
                get the same cut rate.
              </p>
              <p>
                With 72 inches of belt surface, each section of abrasive
                contacts the blade less frequently, so belts last
                significantly longer and build less heat. That directly
                translates to fewer belt changes, faster throughput, and less
                risk of drawing the temper on a thin edge.
              </p>
              <p>
                The tradeoff: you lose the narrow belt&rsquo;s ability to
                reach into tight recurves and small detail areas. Most
                working sharpeners keep both machines set up and reach for
                whichever one fits the blade.
              </p>
            </div>
          </div>
        </section>

        {/* Safety */}
        <section
          className="py-16 px-6"
          style={{ borderTop: "1px solid #30363D" }}
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
                <Shield size={14} />
                Safety
              </div>
              <h2
                className="text-2xl sm:text-3xl font-bold"
                style={{ color: "#FFFFFF" }}
              >
                Respect the{" "}
                <span style={{ color: "#D4A017" }}>Machine</span>
              </h2>
            </div>
            <div
              className="space-y-5 text-base leading-relaxed"
              style={{ color: "#9CA3AF" }}
            >
              <p>
                A two-inch belt running at speed carries more kinetic energy
                than a one-inch. A blade tip that snags can be thrown hard
                enough to cause serious injury. We cover safe hand
                positioning, proper belt speed for each stage, and the
                specific risks around leather strop belts (which must run at
                very low speed or they&rsquo;ll grab the blade).
              </p>
              <p>
                Safety glasses are mandatory. We&rsquo;ll discuss gloves,
                hearing protection, and machine anchoring. You&rsquo;ll
                practise the correct technique for presenting different blade
                types to the belt so that muscle memory and safety develop
                together.
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
              $400
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
                  Add this module to your training path.
                </p>
                <div
                  className="rounded-xl border p-5 sm:p-8 text-left"
                  style={{ backgroundColor: "#0D1117", borderColor: "#30363D" }}
                >
                  <CourseSignUp
                    courseSlug="two-inch-grinder"
                    courseName="Two-Inch Grinder Module"
                    price="$400"
                    priceNote="Tuition is non-refundable. Requires completion of the One-Inch Grinder course."
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
              Happy to chat about whether this module is the right next step
              for you, or whether the one-inch course is a better starting
              point.
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
