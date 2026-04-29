import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Phone, GraduationCap, Briefcase, Wrench, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InquiryForm from "@/components/InquiryForm";
import { safeJsonLd, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Train to Be Sharp — Knife Sharpening Training | Cove Blades",
  description:
    "Learn professional knife sharpening from Cove Blades. 3-hour core training covers angles, speeds, feeds, belt selection, serrated knives, axes, and machetes. 5-hour extended option adds business training for aspiring sharpeners.",
  alternates: { canonical: "/train-to-be-sharp" },
};

const programs = [
  {
    icon: Wrench,
    title: "3-Hour Core Training",
    bullet: "Hands-on sharpening fundamentals",
    items: [
      "Edge geometry and bevel angles",
      "Belt speeds, feeds, and grit progression",
      "Belt selection for different steels and tasks",
      "Serrated knife sharpening",
      "Axes, machetes, and larger blades",
      "Practical practice on real knives you bring",
    ],
  },
  {
    icon: Briefcase,
    title: "5-Hour Extended Program",
    bullet: "Core training + business module",
    items: [
      "Everything in the 3-hour core training",
      "Plus a 2-hour business module:",
      "Payment processing and invoicing",
      "Marketing channels that actually work for a service business",
      "Social media positioning",
      "Booking and customer-management automation",
    ],
  },
];

const goodFitFor = [
  "Home cooks who want to maintain their own knives properly",
  "Outdoor and bushcraft enthusiasts who care about a working edge",
  "Restaurant owners who want a designated in-house sharpener",
  "Aspiring entrepreneurs starting their own sharpening business",
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
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full text-xs uppercase tracking-wider"
              style={{ backgroundColor: "rgba(212,160,23,0.1)", color: "#D4A017", border: "1px solid rgba(212,160,23,0.3)" }}
            >
              <GraduationCap size={14} />
              Hands-on training
            </div>
            <h1
              className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-6"
              style={{ color: "#FFFFFF" }}
            >
              Train to Be <span style={{ color: "#D4A017" }}>Sharp</span>
            </h1>
            <p className="text-lg max-w-xl mx-auto leading-relaxed" style={{ color: "#6B7280" }}>
              Learn professional knife sharpening one-on-one with Cove Blades — from the
              fundamentals of edge geometry to running a sharpening business of your own.
            </p>
          </div>
        </section>

        {/* Programs */}
        <section className="py-16 px-6" style={{ borderTop: "1px solid #30363D" }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center" style={{ color: "#FFFFFF" }}>
              Two <span style={{ color: "#D4A017" }}>Programs</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {programs.map((p) => (
                <div
                  key={p.title}
                  className="rounded-xl border p-7"
                  style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: "rgba(212,160,23,0.1)" }}
                    >
                      <p.icon size={20} style={{ color: "#D4A017" }} />
                    </div>
                    <h3 className="font-bold text-lg" style={{ color: "#FFFFFF" }}>
                      {p.title}
                    </h3>
                  </div>
                  <p className="text-sm mb-5" style={{ color: "#D4A017" }}>
                    {p.bullet}
                  </p>
                  <ul className="space-y-2">
                    {p.items.map((item, i) => (
                      <li key={i} className="text-sm flex gap-2" style={{ color: "#9CA3AF" }}>
                        <span style={{ color: "#D4A017" }}>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="text-center text-sm mt-6" style={{ color: "#6B7280" }}>
              Reach out for current pricing and scheduling — sessions run by appointment in North Vancouver.
            </p>
          </div>
        </section>

        {/* Who It's For */}
        <section
          className="py-16 px-6"
          style={{ backgroundColor: "#161B22", borderTop: "1px solid #30363D" }}
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center" style={{ color: "#FFFFFF" }}>
              Who It's <span style={{ color: "#D4A017" }}>For</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {goodFitFor.map((item) => (
                <div
                  key={item}
                  className="rounded-lg border p-4 text-sm flex items-start gap-3"
                  style={{ backgroundColor: "#0D1117", borderColor: "#30363D", color: "#9CA3AF" }}
                >
                  <Clock size={16} className="mt-0.5 flex-shrink-0" style={{ color: "#D4A017" }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Inquiry Form */}
        <section className="py-20 px-6" style={{ borderTop: "1px solid #30363D" }}>
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: "#FFFFFF" }}>
                Request a <span style={{ color: "#D4A017" }}>Training Session</span>
              </h2>
              <p className="text-sm" style={{ color: "#6B7280" }}>
                Tell us which program interests you and what you'd like to get out of it.
              </p>
            </div>
            <div
              className="rounded-xl border p-8"
              style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
            >
              <InquiryForm
                serviceType="Training"
                buttonLabel="Request Training"
                successMessage="Got it. We'll be in touch to schedule your session."
                messagePlaceholder="Which program (3-hour or 5-hour)? Goals, experience level, anything else we should know..."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          className="py-12 px-6 text-center"
          style={{ backgroundColor: "#161B22", borderTop: "1px solid #30363D" }}
        >
          <div className="max-w-xl mx-auto">
            <p className="text-sm mb-4" style={{ color: "#6B7280" }}>
              Questions before you commit? Give us a call.
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
