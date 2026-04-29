import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Phone, Cog, Target, Repeat, Gauge } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { safeJsonLd, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "How We Sharpen Your Knives | Cove Blades",
  description:
    "Cove Blades uses purpose-built belt-sharpening systems to deliver near-whetstone results in a fraction of the time. Repeatable angles, consistent pressure, and a 30-day edge guarantee.",
  alternates: { canonical: "/how-we-sharpen-your-knives" },
};

const principles = [
  {
    icon: Target,
    title: "Repeatable Angles",
    description:
      "Every blade is matched to its correct bevel — Western, Asian, single-bevel — and that angle is held consistently across the full edge.",
  },
  {
    icon: Gauge,
    title: "Speed and Pressure Control",
    description:
      "Belt speed and contact pressure are tuned to the steel and grit. Aggressive enough to remove chips, gentle enough to avoid burning the temper.",
  },
  {
    icon: Repeat,
    title: "Progressive Grit Sequence",
    description:
      "Coarse for shape and chips, medium for the bevel, fine for refinement, and a leather strop for the final polish — the same progression a whetstone master uses, just faster.",
  },
  {
    icon: Cog,
    title: "Purpose-Built Machines",
    description:
      "1×30 and larger belt grinders dedicated to knife work. Not a bench grinder, not a pull-through. Real tools that take hand skill to operate well.",
  },
];

export default function HowWeSharpenPage() {
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Home", url: "https://coveblades.com" },
    { name: "How We Sharpen", url: "https://coveblades.com/how-we-sharpen-your-knives" },
  ]);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#0D1117", fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }}
      />
      <Navbar />

      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="relative py-24 px-6 overflow-hidden" style={{ backgroundColor: "#0D1117" }}>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(212,160,23,0.07) 0%, transparent 55%, rgba(30,144,255,0.04) 100%)",
            }}
          />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h1
              className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-6"
              style={{ color: "#FFFFFF" }}
            >
              How We <span style={{ color: "#D4A017" }}>Sharpen Your Knives</span>
            </h1>
            <p className="text-lg max-w-xl mx-auto leading-relaxed" style={{ color: "#6B7280" }}>
              Near-whetstone sharpness in a fraction of the time. We pair purpose-built
              machines with a careful, repeatable process so every edge that leaves our shop
              is one you can rely on.
            </p>
          </div>
        </section>

        {/* Principles */}
        <section className="py-16 px-6" style={{ borderTop: "1px solid #30363D" }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center" style={{ color: "#FFFFFF" }}>
              Four Things We <span style={{ color: "#D4A017" }}>Get Right</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {principles.map((p) => (
                <div
                  key={p.title}
                  className="rounded-xl border p-6"
                  style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: "rgba(212,160,23,0.1)" }}
                    >
                      <p.icon size={20} style={{ color: "#D4A017" }} />
                    </div>
                    <h3 className="font-bold" style={{ color: "#FFFFFF" }}>
                      {p.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Process */}
        <section
          className="py-16 px-6"
          style={{ backgroundColor: "#161B22", borderTop: "1px solid #30363D" }}
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center" style={{ color: "#FFFFFF" }}>
              The <span style={{ color: "#D4A017" }}>Process</span>
            </h2>
            <div className="flex flex-col gap-8">
              {[
                {
                  step: "1",
                  title: "Inspect & Identify",
                  description:
                    "Every blade is inspected for chips, rolls, dents, and the original bevel. We match each knife to the correct technique before any belt touches steel.",
                },
                {
                  step: "2",
                  title: "Reshape and Repair",
                  description:
                    "Coarse belts handle the heavy work — fixing chips, restoring tips, and squaring up bevels that have drifted out of true.",
                },
                {
                  step: "3",
                  title: "Build the Bevel",
                  description:
                    "Mid-grit belts establish a clean, consistent bevel along the full length of the edge. Both sides matched, no flat spots, no burn marks.",
                },
                {
                  step: "4",
                  title: "Refine the Edge",
                  description:
                    "Fine belts and a leather strop polish the apex — knocking down the burr and bringing the edge to working sharpness.",
                },
                {
                  step: "5",
                  title: "Test and Hand Back",
                  description:
                    "Every knife is tested before it leaves the bench. If it does not slice cleanly through paper and a tomato skin, it goes back on the belt.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-5">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold text-sm"
                    style={{ backgroundColor: "rgba(212,160,23,0.15)", color: "#D4A017" }}
                  >
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-bold mb-1" style={{ color: "#FFFFFF" }}>
                      {item.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          className="py-20 px-6 text-center"
          style={{ borderTop: "1px solid #30363D" }}
        >
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "#FFFFFF" }}>
              Ready for a <span style={{ color: "#D4A017" }}>Sharper Edge</span>?
            </h2>
            <p className="text-base mb-8" style={{ color: "#6B7280" }}>
              Book a mobile visit, drop your knives at our 24/7 box, or get in touch with a question.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-base transition-all duration-200 hover:brightness-110 active:scale-95"
                style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
              >
                Get Started
                <ChevronRight size={18} />
              </Link>
              <a
                href="tel:6042108180"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-base border-2 transition-all duration-200 hover:bg-yellow-900/20 active:scale-95"
                style={{ borderColor: "#D4A017", color: "#D4A017" }}
              >
                <Phone size={16} />
                604 210 8180
              </a>
            </div>
            <div className="mt-6 flex justify-center gap-6">
              <Link
                href="/pricing"
                className="text-sm transition-colors hover:text-[#D4A017]"
                style={{ color: "#6B7280" }}
              >
                View pricing →
              </Link>
              <Link
                href="/mobile-service"
                className="text-sm transition-colors hover:text-[#D4A017]"
                style={{ color: "#6B7280" }}
              >
                Mobile service →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
