import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle, ChevronRight, Phone } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cutlery Sharpening Prices Vancouver | Cove Cutlery",
  description:
    "Transparent cutlery sharpening pricing in Vancouver. $12/knife for standard blades. Mobile, drop-off, and mail-in options. 30-day edge guarantee included.",
};

const mainPricing = [
  {
    category: "Kitchen Knives",
    items: [
      { service: "Standard kitchen knife (any length)", price: "$12" },
      { service: "Japanese knife (single bevel)", price: "$18" },
      { service: "Ceramic knife", price: "$18" },
      { service: "Cleaver / Machete", price: "$18" },
    ],
  },
  {
    category: "Scissors & Shears",
    items: [
      { service: "Kitchen scissors", price: "$12 / pair" },
      { service: "Hairdressing shears", price: "$20 / pair" },
      { service: "Garden shears / Pruners", price: "$15 / pair" },
    ],
  },
  {
    category: "Other Blades",
    items: [
      { service: "Hunting / fillet knife", price: "$12" },
      { service: "Serrated knife", price: "$18" },
      { service: "Pocket knife", price: "$12" },
      { service: "Axe / Hatchet", price: "$20" },
    ],
  },
];

const additionalServices = [
  { service: "Blade repair (chips, tip break)", price: "From $25", note: "Pricing depends on damage extent" },
  { service: "Handle tightening", price: "$10", note: "Bolster and handle inspection" },
  { service: "Rust removal & polish", price: "From $15", note: "Light surface rust" },
  { service: "Special event / market visit", price: "Contact us", note: "Minimum booking applies" },
];

const mobileMins = [
  { area: "Vancouver / North Shore / Burnaby", min: "5 knives / $60" },
  { area: "Surrey / Langley / Delta", min: "6 knives / $72" },
  { area: "Abbotsford / Chilliwack", min: "Call for quote" },
];

const faqs = [
  {
    q: "Is there a minimum order for mobile service?",
    a: "Yes — mobile visits require a minimum of 5 pieces. This helps us cover travel costs while keeping per-knife pricing low for you.",
  },
  {
    q: "Are there any hidden fees?",
    a: "No. The per-knife price you see is the price you pay. There are no sharpening surcharges, fuel charges, or service fees layered on top.",
  },
  {
    q: "Does the 30-day guarantee cost extra?",
    a: "No. Every sharpening is covered by our 30-day edge guarantee at no additional charge. If an edge doesn't hold under normal use, we re-sharpen it free.",
  },
  {
    q: "How do I pay?",
    a: "We accept cash, e-Transfer, and most major credit/debit cards on-site. For drop-off, payment is collected at pickup.",
  },
];

export default function PricingPage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#0D1117", fontFamily: "Inter, system-ui, sans-serif" }}
    >
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
              Simple, Honest <span style={{ color: "#D4A017" }}>Pricing</span>
            </h1>
            <p className="text-lg max-w-xl mx-auto leading-relaxed" style={{ color: "#6B7280" }}>
              No hidden fees. No confusing tiers. Just a flat rate per blade with a 30-day edge guarantee on every sharpening.
            </p>
          </div>
        </section>

        {/* Main Pricing Tables */}
        <section className="py-16 px-6" style={{ borderTop: "1px solid #30363D" }}>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {mainPricing.map(({ category, items }) => (
                <div
                  key={category}
                  className="rounded-xl border overflow-hidden"
                  style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
                >
                  <div
                    className="px-6 py-4 border-b"
                    style={{ borderColor: "#30363D", backgroundColor: "#0D1117" }}
                  >
                    <h2 className="font-bold text-sm tracking-widest uppercase" style={{ color: "#D4A017" }}>
                      {category}
                    </h2>
                  </div>
                  <ul className="divide-y" style={{ borderColor: "#30363D" }}>
                    {items.map(({ service, price }) => (
                      <li
                        key={service}
                        className="flex items-center justify-between px-6 py-4"
                        style={{ borderColor: "#30363D" }}
                      >
                        <span className="text-sm" style={{ color: "#6B7280" }}>{service}</span>
                        <span className="text-sm font-bold ml-4 shrink-0" style={{ color: "#FFFFFF" }}>
                          {price}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Guarantee callout */}
            <div
              className="mt-8 rounded-xl p-5 border flex items-start gap-3"
              style={{ backgroundColor: "rgba(212,160,23,0.06)", borderColor: "rgba(212,160,23,0.25)" }}
            >
              <CheckCircle size={18} className="mt-0.5 shrink-0" style={{ color: "#D4A017" }} />
              <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                Every sharpening is backed by our{" "}
                <strong className="text-white">30-day edge guarantee</strong>. If an edge doesn't hold under normal kitchen use within 30 days, we re-sharpen it free of charge — no questions asked.
              </p>
            </div>
          </div>
        </section>

        {/* Mobile Minimums */}
        <section
          className="py-16 px-6"
          style={{ backgroundColor: "#161B22", borderTop: "1px solid #30363D" }}
        >
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8" style={{ color: "#FFFFFF" }}>
              Mobile Service <span style={{ color: "#D4A017" }}>Minimums</span>
            </h2>
            <div className="overflow-hidden rounded-xl border" style={{ borderColor: "#30363D" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: "#0D1117", borderBottom: "1px solid #30363D" }}>
                    <th className="text-left px-5 py-3 font-semibold text-xs tracking-widest uppercase" style={{ color: "#6B7280" }}>
                      Area
                    </th>
                    <th className="text-left px-5 py-3 font-semibold text-xs tracking-widest uppercase" style={{ color: "#6B7280" }}>
                      Minimum
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mobileMins.map(({ area, min }, i) => (
                    <tr
                      key={area}
                      style={{
                        backgroundColor: i % 2 === 0 ? "#161B22" : "#0D1117",
                        borderBottom: i < mobileMins.length - 1 ? "1px solid #30363D" : "none",
                      }}
                    >
                      <td className="px-5 py-4" style={{ color: "#FFFFFF" }}>{area}</td>
                      <td className="px-5 py-4 font-semibold" style={{ color: "#D4A017" }}>{min}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Additional Services */}
        <section className="py-16 px-6" style={{ borderTop: "1px solid #30363D" }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8" style={{ color: "#FFFFFF" }}>
              Additional <span style={{ color: "#D4A017" }}>Services</span>
            </h2>
            <div className="overflow-hidden rounded-xl border" style={{ borderColor: "#30363D" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: "#161B22", borderBottom: "1px solid #30363D" }}>
                    <th className="text-left px-5 py-3 font-semibold text-xs tracking-widest uppercase" style={{ color: "#6B7280" }}>Service</th>
                    <th className="text-left px-5 py-3 font-semibold text-xs tracking-widest uppercase" style={{ color: "#6B7280" }}>Price</th>
                    <th className="text-left px-5 py-3 font-semibold text-xs tracking-widest uppercase hidden sm:table-cell" style={{ color: "#6B7280" }}>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {additionalServices.map(({ service, price, note }, i) => (
                    <tr
                      key={service}
                      style={{
                        backgroundColor: i % 2 === 0 ? "#0D1117" : "#161B22",
                        borderBottom: i < additionalServices.length - 1 ? "1px solid #30363D" : "none",
                      }}
                    >
                      <td className="px-5 py-4" style={{ color: "#FFFFFF" }}>{service}</td>
                      <td className="px-5 py-4 font-semibold" style={{ color: "#D4A017" }}>{price}</td>
                      <td className="px-5 py-4 hidden sm:table-cell" style={{ color: "#6B7280" }}>{note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
              Pricing <span style={{ color: "#D4A017" }}>FAQs</span>
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
        <section className="py-20 px-6 text-center" style={{ borderTop: "1px solid #30363D" }}>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "#FFFFFF" }}>
              Ready to Get Your <span style={{ color: "#D4A017" }}>Knives Sharp?</span>
            </h2>
            <p className="text-base mb-8" style={{ color: "#6B7280" }}>
              Book online or call us to schedule a mobile visit, arrange a drop-off, or ask any questions.
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
                604 373 1500
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
