import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ExternalLink, Shield, Zap, Heart, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About Cove Cutlery | Vancouver Cutlery Sharpening",
  description:
    "Learn the story behind Cove Cutlery — Vancouver's mobile cutlery sharpening service. Professional wet-wheel sharpening since 2020, serving home cooks and restaurants alike.",
};

const values = [
  {
    icon: Shield,
    title: "Quality First",
    desc: "We back every sharpening with a 30-day edge guarantee. If it doesn't hold, we fix it free — no questions asked.",
  },
  {
    icon: Zap,
    title: "On-Site Efficiency",
    desc: "Most knives are done in minutes. Our mobile setup means zero waiting room time — we work while you get on with your day.",
  },
  {
    icon: Heart,
    title: "Passion for the Craft",
    desc: "We genuinely love knives. From entry-level home kitchen blades to single-bevel Japanese chef's knives, every blade gets the same care and attention.",
  },
  {
    icon: Award,
    title: "Transparent Pricing",
    desc: "Flat rate per blade. No hidden fees, no bait-and-switch. You always know what you'll pay before we start.",
  },
];

const equipment = [
  { item: "Japanese water-cooled whetstone wheel system", detail: "No heat damage to your blade's temper" },
  { item: "Diamond-infused grinding wheels", detail: "For ceramic and serrated blades" },
  { item: "Leather stropping wheel", detail: "Final polish for a mirror-sharp edge" },
  { item: "Custom mobile rig", detail: "Full setup transported directly to your door" },
];

export default function AboutPage() {
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
              About <span style={{ color: "#D4A017" }}>Cove Cutlery</span>
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "#6B7280" }}>
              Vancouver-based cutlery sharpening with a mobile-first approach. We come to you so you never have to go out of your way for a sharp knife again.
            </p>
          </div>
        </section>

        {/* Story */}
        <section className="py-16 px-6" style={{ borderTop: "1px solid #30363D" }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6" style={{ color: "#FFFFFF" }}>
              Our <span style={{ color: "#D4A017" }}>Story</span>
            </h2>
            <div className="flex flex-col gap-5 text-sm leading-relaxed" style={{ color: "#6B7280" }}>
              <p>
                Cove Cutlery started in 2020 with a single wet-wheel sharpening setup and a belief that great cutlery sharpening should be easy to access — not something you have to plan your week around. What began as a weekend passion project grew quickly into a full mobile service covering the entire Metro Vancouver area and the Fraser Valley.
              </p>
              <p>
                We built our business around one core idea: come to the customer. No storefront, no waiting in line, no guessing when your knives will be ready. Whether you're a home cook who wants their chef's knife feeling like new, a restaurant that needs a full knife roll done before service, or a market vendor who wants us set up on-site — we bring the full professional setup directly to you.
              </p>
              <p>
                Since 2020 we've sharpened thousands of blades across Vancouver, North Shore, Burnaby, Surrey, Langley, and the Fraser Valley. We also run a YouTube channel — <strong className="text-white">@covecutlery</strong> — where we share sharpening techniques, knife care tips, and behind-the-scenes content. Check it out if you want to geek out on edges as much as we do.
              </p>
              <p>
                We're 5-star rated on Google and proud of every review. Our 30-day edge guarantee isn't just a marketing line — it's a commitment we take seriously. If a blade we've sharpened doesn't hold its edge under normal use within 30 days, we'll re-sharpen it free of charge.
              </p>
            </div>
          </div>
        </section>

        {/* YouTube Card */}
        <section
          className="py-16 px-6"
          style={{ backgroundColor: "#161B22", borderTop: "1px solid #30363D" }}
        >
          <div className="max-w-3xl mx-auto">
            <div
              className="rounded-xl p-8 border"
              style={{ backgroundColor: "#0D1117", borderColor: "#30363D" }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {/* YouTube icon */}
                <div
                  className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: "rgba(255,0,0,0.1)" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#FF0000"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
                    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#FF0000" stroke="none" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-1" style={{ color: "#FFFFFF" }}>
                    Watch Us on YouTube
                  </h3>
                  <p className="text-sm mb-4" style={{ color: "#6B7280" }}>
                    We share sharpening tutorials, knife reviews, and behind-the-scenes looks at how we work. Follow <strong className="text-white">@covecutlery</strong> for regular uploads.
                  </p>
                  <a
                    href="https://www.youtube.com/@covecutlery"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 hover:brightness-110 active:scale-95"
                    style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
                  >
                    Visit Channel
                    <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 px-6" style={{ borderTop: "1px solid #30363D" }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12" style={{ color: "#FFFFFF" }}>
              What We <span style={{ color: "#D4A017" }}>Stand For</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {values.map(({ icon: Icon, title, desc }) => (
                <div
                  key={title}
                  className="rounded-xl p-6 border"
                  style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
                >
                  <div
                    className="inline-flex items-center justify-center w-11 h-11 rounded-lg mb-4"
                    style={{ backgroundColor: "rgba(212,160,23,0.1)" }}
                  >
                    <Icon size={20} style={{ color: "#D4A017" }} />
                  </div>
                  <h3 className="font-semibold text-base mb-2" style={{ color: "#FFFFFF" }}>
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

        {/* Equipment */}
        <section
          className="py-16 px-6"
          style={{ backgroundColor: "#161B22", borderTop: "1px solid #30363D" }}
        >
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8" style={{ color: "#FFFFFF" }}>
              Our <span style={{ color: "#D4A017" }}>Equipment</span>
            </h2>
            <div className="overflow-hidden rounded-xl border" style={{ borderColor: "#30363D" }}>
              {equipment.map(({ item, detail }, i) => (
                <div
                  key={item}
                  className="flex items-start gap-4 px-6 py-5"
                  style={{
                    backgroundColor: i % 2 === 0 ? "#0D1117" : "#161B22",
                    borderBottom: i < equipment.length - 1 ? "1px solid #30363D" : "none",
                  }}
                >
                  <div
                    className="flex-shrink-0 w-2 h-2 rounded-full mt-2"
                    style={{ backgroundColor: "#D4A017" }}
                  />
                  <div>
                    <p className="text-sm font-medium" style={{ color: "#FFFFFF" }}>{item}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm mt-4" style={{ color: "#6B7280" }}>
              Water-cooled wheels are the gold standard for sharpening — they remove metal precisely without overheating the steel, which preserves the blade's temper and keeps the edge lasting longer.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 text-center" style={{ borderTop: "1px solid #30363D" }}>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "#FFFFFF" }}>
              Ready to Work <span style={{ color: "#D4A017" }}>With Us?</span>
            </h2>
            <p className="text-base mb-8" style={{ color: "#6B7280" }}>
              Book a mobile visit, arrange a drop-off, or just say hello. We're happy to answer any questions about your knives or our process.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-lg font-semibold text-base transition-all duration-200 hover:brightness-110 active:scale-95 hover:shadow-[0_0_20px_rgba(212,160,23,0.4)]"
              style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
            >
              Get in Touch
              <ChevronRight size={18} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
