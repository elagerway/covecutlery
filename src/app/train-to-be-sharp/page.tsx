import type { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  Phone,
  GraduationCap,
  Wrench,
  Cog,
  Briefcase,
  Microscope,
  TrendingUp,
  Truck,
  MapPin,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InquiryForm from "@/components/InquiryForm";
import { safeJsonLd, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Train to Be Sharp — Knife Sharpening Training | Cove Blades",
  description:
    "Two- to three-day knife sharpening practicum with Cove Blades. Three modules: One-Inch Grinder ($600), Two-Inch Grinder ($400), Business Process & Automation ($200). Sharpness-tester verified, microscope-checked, every session recorded.",
  alternates: { canonical: "/train-to-be-sharp" },
};

const modules = [
  {
    icon: Wrench,
    name: "One-Inch Grinder",
    price: "$600",
    tag: "Core offering",
    description:
      "Our flagship module, focused on small-machine sharpening — the workhorse of a residential and small-commercial practice. Most students start here.",
  },
  {
    icon: Cog,
    name: "Two-Inch Grinder",
    price: "$400",
    tag: "Expand your range",
    description:
      "For students who want to handle larger blades and higher volume on a bigger belt platform. Pairs naturally with the one-inch course.",
  },
  {
    icon: Briefcase,
    name: "Business Process & Automation",
    price: "$200",
    tag: "Two-hour session",
    description:
      "How we actually run Cove Blades behind the scenes. AI automation for inbound calls and texts, plus the logistical playbook for drop-off, pickup, and mobile operations. For anyone serious about scaling without drowning in admin.",
  },
];

const overviewPoints = [
  {
    icon: Microscope,
    title: "Verified, not assumed",
    description:
      "We use a sharpness tester and microscope to confirm you can produce — and consistently repeat — a commercially viable apex. You leave when the data says you're there.",
  },
  {
    icon: GraduationCap,
    title: "Hands-on, not lecture",
    description:
      "Two to three days of targeted theory paired with extensive practice on training knives we provide. You're behind the machines for the majority of the time.",
  },
  {
    icon: TrendingUp,
    title: "Recorded for life",
    description:
      "Every session is recorded and yours to revisit any time. The muscle memory builds in the practicum; the reference material never goes away.",
  },
];

export default function TrainingPage() {
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Home", url: "https://coveblades.com" },
    { name: "Training", url: "https://coveblades.com/train-to-be-sharp" },
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
            <div
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-xs uppercase tracking-wider"
              style={{
                backgroundColor: "rgba(212,160,23,0.1)",
                color: "#D4A017",
                border: "1px solid rgba(212,160,23,0.3)",
              }}
            >
              <GraduationCap size={14} />
              Two- to three-day practicum
            </div>
            <h1
              className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-6"
              style={{ color: "#FFFFFF" }}
            >
              Train to Be <span style={{ color: "#D4A017" }}>Sharp</span>
            </h1>
            <p className="text-lg max-w-xl mx-auto leading-relaxed" style={{ color: "#6B7280" }}>
              Learn the craft and the business of professional knife sharpening — verified
              with real instruments, paid back in months, not years.
            </p>
          </div>
        </section>

        {/* Course Modules */}
        <section className="py-16 px-6" style={{ borderTop: "1px solid #30363D" }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 text-center" style={{ color: "#FFFFFF" }}>
              Three <span style={{ color: "#D4A017" }}>Modules</span>
            </h2>
            <p className="text-center text-sm mb-10 max-w-xl mx-auto" style={{ color: "#6B7280" }}>
              Offered separately so you can pick the path that fits your goals. Most students
              start with the one-inch course — modules can be combined in any configuration
              for full coverage.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {modules.map((m) => (
                <div
                  key={m.name}
                  className="rounded-xl border p-7 flex flex-col"
                  style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: "rgba(212,160,23,0.1)" }}
                    >
                      <m.icon size={20} style={{ color: "#D4A017" }} />
                    </div>
                    <span className="text-xs uppercase tracking-wider" style={{ color: "#D4A017" }}>
                      {m.tag}
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-1" style={{ color: "#FFFFFF" }}>
                    {m.name}
                  </h3>
                  <p className="text-2xl font-bold mb-4" style={{ color: "#D4A017" }}>
                    {m.price}
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
                    {m.description}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-center text-xs mt-8" style={{ color: "#6B7280" }}>
              Tuition is payable in advance and non-refundable.
            </p>
          </div>
        </section>

        {/* The Practicum */}
        <section
          className="py-16 px-6"
          style={{ backgroundColor: "#161B22", borderTop: "1px solid #30363D" }}
        >
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center" style={{ color: "#FFFFFF" }}>
              The <span style={{ color: "#D4A017" }}>Practicum</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {overviewPoints.map((p) => (
                <div
                  key={p.title}
                  className="rounded-xl border p-6"
                  style={{ backgroundColor: "#0D1117", borderColor: "#30363D" }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{ backgroundColor: "rgba(212,160,23,0.1)" }}
                  >
                    <p.icon size={20} style={{ color: "#D4A017" }} />
                  </div>
                  <h3 className="font-bold mb-2" style={{ color: "#FFFFFF" }}>
                    {p.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#9CA3AF" }}>
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Return on Investment */}
        <section className="py-16 px-6" style={{ borderTop: "1px solid #30363D" }}>
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
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "#FFFFFF" }}>
                Recoup in <span style={{ color: "#D4A017" }}>One to Two Months</span>
              </h2>
            </div>
            <div className="space-y-5 text-base leading-relaxed" style={{ color: "#9CA3AF" }}>
              <p>
                Most students recoup their tuition within one to two months — though mileage
                will vary. If you put effort into marketing, you can break even sooner. Students
                who already have experience with social media or Google Ads tend to get there
                faster.
              </p>
              <p>
                By the end of the course, you'll have the skills to charge in the
                neighborhood of <strong style={{ color: "#FFFFFF" }}>$200 per hour</strong>,
                with rates depending on whether you operate as a drop-off shop or run mobile.
                With practice and a bit of brand recognition, many students hit that benchmark
                inside their first week of working solo.
              </p>
            </div>
          </div>
        </section>

        {/* Equipment & Startup */}
        <section
          className="py-16 px-6"
          style={{ backgroundColor: "#161B22", borderTop: "1px solid #30363D" }}
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
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "#FFFFFF" }}>
                Start at <span style={{ color: "#D4A017" }}>$300</span>, Scale to a Van
              </h2>
            </div>
            <div className="space-y-5 text-base leading-relaxed" style={{ color: "#9CA3AF" }}>
              <p>
                I'll advise you on which machines to buy — Amazon is generally the best source.
                Consumables (primarily belts) can be purchased through me at below-market rates,
                since I source directly from the manufacturer. You're welcome to buy elsewhere,
                but going through me is the most economical option.
              </p>
              <p>
                Startup costs typically range from <strong style={{ color: "#FFFFFF" }}>$300 to $15,000</strong>,
                depending on your initial setup. For reference, a mobile power station (inverter,
                batteries, and car charging included) runs about <strong style={{ color: "#FFFFFF" }}>$1,200</strong>;
                a van is around <strong style={{ color: "#FFFFFF" }}>$13,000</strong>.
              </p>
              <p>
                My recommendation: start with a single machine, operate from your garage or
                home, and reinvest profits as you scale.
              </p>
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="py-16 px-6" style={{ borderTop: "1px solid #30363D" }}>
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
                <MapPin size={14} />
                Location
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "#FFFFFF" }}>
                Onsite or <span style={{ color: "#D4A017" }}>Mobile</span>
              </h2>
            </div>
            <p className="text-base leading-relaxed text-center" style={{ color: "#9CA3AF" }}>
              Training takes place onsite at our home office in North Vancouver. Mobile
              training is also available, provided you have level parking.
            </p>
          </div>
        </section>

        {/* Inquiry Form */}
        <section
          className="py-20 px-6"
          style={{ backgroundColor: "#161B22", borderTop: "1px solid #30363D" }}
        >
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: "#FFFFFF" }}>
                Request a <span style={{ color: "#D4A017" }}>Training Session</span>
              </h2>
              <p className="text-sm" style={{ color: "#6B7280" }}>
                Tell us which course (or combination) interests you and what you'd like to get
                out of it.
              </p>
            </div>
            <div
              className="rounded-xl border p-5 sm:p-8"
              style={{ backgroundColor: "#0D1117", borderColor: "#30363D" }}
            >
              <InquiryForm
                serviceType="Training"
                buttonLabel="Request Training"
                successMessage="Got it. We'll be in touch to schedule your session."
                messagePlaceholder="Which module(s) — One-Inch ($600), Two-Inch ($400), Business ($200)? Goals, experience level, and anything else we should know..."
                showAddress
                addressLabel="Your address"
              />
            </div>
          </div>
        </section>

        {/* CTA — call or visit */}
        <section className="py-16 px-6 text-center" style={{ borderTop: "1px solid #30363D" }}>
          <div className="max-w-xl mx-auto">
            <h2 className="text-2xl font-bold mb-3" style={{ color: "#FFFFFF" }}>
              Want to <span style={{ color: "#D4A017" }}>Talk First</span>?
            </h2>
            <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
              Happy to set up a call to walk through the details and help you decide which
              course fits. You're also welcome to come by, see the setup in person, and have
              a conversation before deciding whether to move forward.
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
                href="/how-we-sharpen-your-knives"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-colors hover:text-white"
                style={{ color: "#6B7280" }}
              >
                See how we sharpen
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
