import type { Metadata } from "next";
import Link from "next/link";
import { Truck, MapPin, Clock, CheckCircle, ChevronRight, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Mobile Knife Sharpening Vancouver | Cove Cutlery",
  description:
    "We come to you. Professional mobile knife sharpening service across Vancouver, North Shore, Burnaby, and up to Chilliwack. Minimum 5 pieces. Book online.",
};

const requirements = [
  {
    title: "Minimum Order",
    value: "5 pieces",
    note: "Knives, scissors, or a mix",
  },
  {
    title: "Service Area",
    value: "North Shore to Chilliwack",
    note: "Serving all of Metro Vancouver & Fraser Valley",
  },
  {
    title: "Turnaround",
    value: "On-site while you wait",
    note: "Most knives done in minutes",
  },
  {
    title: "Payment",
    value: "Cash, e-Transfer, Card",
    note: "Collected on-site after service",
  },
];

const steps = [
  {
    step: "01",
    title: "Book Online or Call",
    desc: "Fill out the contact form below with your service area, estimated knife count, and preferred time. We'll confirm within a few hours.",
  },
  {
    step: "02",
    title: "We Arrive at Your Door",
    desc: "Our sharpener shows up at your home, restaurant, or business with a full professional wet-wheel setup ready to go.",
  },
  {
    step: "03",
    title: "Sharpen On-Site",
    desc: "Watch as each blade is brought back to a razor-sharp edge using our water-cooled Japanese whetstone wheels. No heat damage.",
  },
  {
    step: "04",
    title: "Pay & You're Done",
    desc: "Once every blade is sharp and inspected, pay on the spot. Covered by our 30-day edge guarantee.",
  },
];

const areas = [
  { name: "North Shore", detail: "North Van, West Van", min: "$60 minimum (5 knives)" },
  { name: "Vancouver", detail: "All neighbourhoods", min: "$60 minimum (5 knives)" },
  { name: "Burnaby / New West", detail: "Including Coquitlam, Port Moody", min: "$60 minimum (5 knives)" },
  { name: "Surrey / Langley", detail: "Including Delta, White Rock", min: "$72 minimum (6 knives)" },
  { name: "Abbotsford / Chilliwack", detail: "Fraser Valley", min: "Call for quote" },
];

const faqs = [
  {
    q: "How long does mobile sharpening take?",
    a: "Most kitchen knives take 3–5 minutes each. A set of 8–10 knives typically takes 30–45 minutes total, including stropping and inspection.",
  },
  {
    q: "Do I need to be home the whole time?",
    a: "Yes — mobile service requires you or another adult to be present. We work outdoors or in a garage/driveway and simply need access to a standard outdoor outlet.",
  },
  {
    q: "What types of knives can you sharpen on-site?",
    a: "German and Japanese steel, ceramic, and serrated blades. We bring our full setup — including diamond wheels for ceramics — on every mobile visit.",
  },
  {
    q: "How far in advance do I need to book?",
    a: "Usually 24–48 hours is enough during the week. Weekends can book up quickly, so try to contact us a few days ahead.",
  },
];

export default function MobileServicePage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#0D1117", fontFamily: "Inter, system-ui, sans-serif" }}
    >
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
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 text-sm font-medium"
              style={{ borderColor: "rgba(212,160,23,0.4)", color: "#D4A017", backgroundColor: "rgba(212,160,23,0.08)" }}>
              <Truck size={14} />
              Mobile Service
            </div>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6"
              style={{ color: "#FFFFFF" }}
            >
              Mobile Knife Sharpening
              <br />
              <span style={{ color: "#D4A017" }}>in Vancouver</span>
            </h1>
            <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: "#6B7280" }}>
              We drive to your home, restaurant, or business and sharpen your knives on-site using professional wet-wheel equipment. No dropping off. No waiting. Just sharp knives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-base transition-all duration-200 hover:brightness-110 active:scale-95"
                style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
              >
                Book Mobile Service
                <ChevronRight size={18} />
              </Link>
              <a
                href="tel:6043731500"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-base border-2 transition-all duration-200 hover:bg-yellow-900/20 active:scale-95"
                style={{ borderColor: "#D4A017", color: "#D4A017" }}
              >
                <Phone size={16} />
                604 373 1500
              </a>
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="py-16 px-6" style={{ backgroundColor: "#0D1117" }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10" style={{ color: "#FFFFFF" }}>
              What You <span style={{ color: "#D4A017" }}>Need to Know</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {requirements.map(({ title, value, note }) => (
                <div
                  key={title}
                  className="rounded-xl p-6 border"
                  style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
                >
                  <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#6B7280" }}>
                    {title}
                  </p>
                  <p className="text-lg font-bold mb-1" style={{ color: "#D4A017" }}>
                    {value}
                  </p>
                  <p className="text-sm" style={{ color: "#6B7280" }}>
                    {note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-6" style={{ borderTop: "1px solid #30363D" }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12" style={{ color: "#FFFFFF" }}>
              How It <span style={{ color: "#D4A017" }}>Works</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map(({ step, title, desc }) => (
                <div key={step} className="relative">
                  <div
                    className="text-5xl font-black mb-4 leading-none"
                    style={{ color: "rgba(212,160,23,0.15)" }}
                  >
                    {step}
                  </div>
                  <h3 className="text-base font-semibold mb-2" style={{ color: "#FFFFFF" }}>
                    {title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Areas */}
        <section
          className="py-16 px-6"
          style={{ backgroundColor: "#161B22", borderTop: "1px solid #30363D" }}
        >
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-3 mb-10">
              <MapPin size={22} style={{ color: "#D4A017" }} />
              <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: "#FFFFFF" }}>
                Service <span style={{ color: "#D4A017" }}>Areas</span>
              </h2>
            </div>
            <div className="overflow-hidden rounded-xl border" style={{ borderColor: "#30363D" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: "#0D1117", borderBottom: "1px solid #30363D" }}>
                    <th className="text-left px-5 py-3 font-semibold text-xs tracking-widest uppercase" style={{ color: "#6B7280" }}>Region</th>
                    <th className="text-left px-5 py-3 font-semibold text-xs tracking-widest uppercase" style={{ color: "#6B7280" }}>Areas Covered</th>
                    <th className="text-left px-5 py-3 font-semibold text-xs tracking-widest uppercase" style={{ color: "#6B7280" }}>Minimum</th>
                  </tr>
                </thead>
                <tbody>
                  {areas.map(({ name, detail, min }, i) => (
                    <tr
                      key={name}
                      style={{
                        backgroundColor: i % 2 === 0 ? "#161B22" : "#0D1117",
                        borderBottom: i < areas.length - 1 ? "1px solid #30363D" : "none",
                      }}
                    >
                      <td className="px-5 py-4 font-medium" style={{ color: "#FFFFFF" }}>{name}</td>
                      <td className="px-5 py-4" style={{ color: "#6B7280" }}>{detail}</td>
                      <td className="px-5 py-4" style={{ color: "#D4A017" }}>{min}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm mt-4" style={{ color: "#6B7280" }}>
              Not sure if we cover your area? Call us at{" "}
              <a href="tel:6043731500" className="hover:text-white transition-colors" style={{ color: "#D4A017" }}>
                604 373 1500
              </a>{" "}
              and we'll let you know.
            </p>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 px-6" style={{ borderTop: "1px solid #30363D" }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10" style={{ color: "#FFFFFF" }}>
              Mobile Service <span style={{ color: "#D4A017" }}>Pricing</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                { type: "Standard Kitchen Knife", price: "$12", note: "Per knife — any steel" },
                { type: "Scissors / Shears", price: "$12", note: "Per pair" },
                { type: "Ceramic Knife", price: "$18", note: "Diamond wheel process" },
              ].map(({ type, price, note }) => (
                <div
                  key={type}
                  className="rounded-xl p-6 border text-center"
                  style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
                >
                  <p className="text-sm mb-3" style={{ color: "#6B7280" }}>{type}</p>
                  <p className="text-4xl font-black mb-2" style={{ color: "#D4A017" }}>{price}</p>
                  <p className="text-xs" style={{ color: "#6B7280" }}>{note}</p>
                </div>
              ))}
            </div>
            <div
              className="mt-6 rounded-xl p-5 border flex items-start gap-3"
              style={{ backgroundColor: "rgba(212,160,23,0.06)", borderColor: "rgba(212,160,23,0.25)" }}
            >
              <CheckCircle size={18} className="mt-0.5 shrink-0" style={{ color: "#D4A017" }} />
              <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                All mobile visits are covered by our <strong className="text-white">30-day edge guarantee</strong>. If an edge doesn't hold for 30 days under normal kitchen use, we'll re-sharpen it at no charge.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          className="py-16 px-6"
          style={{ backgroundColor: "#161B22", borderTop: "1px solid #30363D" }}
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10" style={{ color: "#FFFFFF" }}>
              Frequently Asked <span style={{ color: "#D4A017" }}>Questions</span>
            </h2>
            <div className="flex flex-col gap-5">
              {faqs.map(({ q, a }) => (
                <div
                  key={q}
                  className="rounded-xl p-6 border"
                  style={{ backgroundColor: "#0D1117", borderColor: "#30363D" }}
                >
                  <p className="font-semibold mb-2" style={{ color: "#FFFFFF" }}>{q}</p>
                  <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{a}</p>
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
              Ready to Book Your <span style={{ color: "#D4A017" }}>Mobile Visit?</span>
            </h2>
            <p className="text-base mb-8" style={{ color: "#6B7280" }}>
              Fill out our quick contact form and we'll get back to you within a few hours to confirm your appointment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-base transition-all duration-200 hover:brightness-110 active:scale-95"
                style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
              >
                Book Now
                <ChevronRight size={18} />
              </Link>
              <a
                href="tel:6043731500"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-base border-2 transition-all duration-200 hover:bg-yellow-900/20 active:scale-95"
                style={{ borderColor: "#D4A017", color: "#D4A017" }}
              >
                <Phone size={16} />
                Call 604 373 1500
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
