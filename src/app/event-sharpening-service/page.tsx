import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Phone, Tent, Users, Zap, MapPin } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InquiryForm from "@/components/InquiryForm";
import { safeJsonLd, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Event Sharpening Service | Cove Blades",
  description:
    "On-site knife sharpening for block parties, flea markets, farmers markets, and community events around Metro Vancouver. Self-contained setup — no power, no shelter required.",
  alternates: { canonical: "/event-sharpening-service" },
};

const features = [
  {
    icon: Tent,
    title: "Self-Contained Setup",
    description:
      "We arrive with our own power, lighting, and weather cover. Plant us anywhere with foot traffic and we are ready to sharpen.",
  },
  {
    icon: Users,
    title: "Crowd-Friendly Format",
    description:
      "Sharpening is a great spectator activity. People love watching dull knives come back to life — built-in conversation starter for your event.",
  },
  {
    icon: Zap,
    title: "Fast Turnaround",
    description:
      "Most kitchen knives are sharpened in three to five minutes. Customers can drop off, grab a coffee, and pick up sharp.",
  },
  {
    icon: MapPin,
    title: "Lower Mainland Coverage",
    description:
      "We cover Metro Vancouver and the Lower Mainland. If your event is within roughly 90 km of North Vancouver, we can get there.",
  },
];

const eventTypes = [
  "Block parties and street fairs",
  "Farmers markets and flea markets",
  "Community center activity days",
  "Corporate appreciation events",
  "Private parties and pop-ups",
  "Brewery and cidery events",
];

export default function EventSharpeningPage() {
  const breadcrumbJsonLd = breadcrumbSchema([
    { name: "Home", url: "https://coveblades.com" },
    { name: "Event Sharpening", url: "https://coveblades.com/event-sharpening-service" },
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
              <Tent size={14} />
              On-site service
            </div>
            <h1
              className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-6"
              style={{ color: "#FFFFFF" }}
            >
              Event Sharpening <span style={{ color: "#D4A017" }}>Service</span>
            </h1>
            <p className="text-lg max-w-xl mx-auto leading-relaxed" style={{ color: "#6B7280" }}>
              Bring sharp knives to your event. We set up on-site at block parties, flea
              markets, and community gatherings around Metro Vancouver — no power outlets or
              shelter required.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 px-6" style={{ borderTop: "1px solid #30363D" }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center" style={{ color: "#FFFFFF" }}>
              Why It <span style={{ color: "#D4A017" }}>Works</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="rounded-xl border p-6"
                  style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: "rgba(212,160,23,0.1)" }}
                    >
                      <f.icon size={20} style={{ color: "#D4A017" }} />
                    </div>
                    <h3 className="font-bold" style={{ color: "#FFFFFF" }}>
                      {f.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section
          className="py-16 px-6"
          style={{ backgroundColor: "#161B22", borderTop: "1px solid #30363D" }}
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-10 text-center" style={{ color: "#FFFFFF" }}>
              How It <span style={{ color: "#D4A017" }}>Works</span>
            </h2>
            <div className="flex flex-col gap-8">
              {[
                {
                  step: "1",
                  title: "Tell Us About Your Event",
                  description:
                    "Date, location, expected attendance, and any specific requirements. Use the form below or give us a call.",
                },
                {
                  step: "2",
                  title: "We Confirm and Quote",
                  description:
                    "We confirm availability, send a quote, and lock in the booking. Pricing depends on event length and expected volume.",
                },
                {
                  step: "3",
                  title: "We Arrive Self-Contained",
                  description:
                    "Generator, lighting, weather cover, signage. We can set up almost anywhere — no infrastructure required from the venue.",
                },
                {
                  step: "4",
                  title: "Sharpen on the Spot",
                  description:
                    "Attendees bring their dull knives. Most are sharpened in three to five minutes while they watch. Cash, e-Transfer, or card.",
                },
                {
                  step: "5",
                  title: "Pack Out Clean",
                  description:
                    "We tear down at the agreed end time, leave the space exactly as we found it, and follow up with you afterwards.",
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

        {/* Event Types */}
        <section className="py-16 px-6" style={{ borderTop: "1px solid #30363D" }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center" style={{ color: "#FFFFFF" }}>
              Events We've <span style={{ color: "#D4A017" }}>Sharpened At</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {eventTypes.map((e) => (
                <div
                  key={e}
                  className="rounded-lg border p-4 text-sm"
                  style={{ backgroundColor: "#161B22", borderColor: "#30363D", color: "#9CA3AF" }}
                >
                  • {e}
                </div>
              ))}
            </div>
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
                Book Us for Your <span style={{ color: "#D4A017" }}>Event</span>
              </h2>
              <p className="text-sm" style={{ color: "#6B7280" }}>
                Send us the details and we'll get back to you with availability and pricing.
              </p>
            </div>
            <div
              className="rounded-xl border p-8"
              style={{ backgroundColor: "#0D1117", borderColor: "#30363D" }}
            >
              <InquiryForm
                serviceType="Event"
                buttonLabel="Request Booking"
                successMessage="Thanks — we'll review and get back to you soon."
                messagePlaceholder="Event name, date, location, expected attendance, and anything else we should know..."
              />
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          className="py-12 px-6 text-center"
          style={{ borderTop: "1px solid #30363D" }}
        >
          <div className="max-w-xl mx-auto">
            <p className="text-sm mb-4" style={{ color: "#6B7280" }}>
              Want to talk it through first? Give us a call.
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
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm transition-colors hover:text-white"
                style={{ color: "#6B7280" }}
              >
                Other inquiry types
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
