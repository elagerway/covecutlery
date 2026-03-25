import type { Metadata } from "next";
import Link from "next/link";
import { Lock, Clock, MapPin, Phone, CheckCircle, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DropBoxCodeButton from "@/components/DropBoxCodeButton";

export const metadata: Metadata = {
  title: "24/7 Drop-Off Cutlery Sharpening Vancouver | Cove Cutlery",
  description:
    "Secure 24/7 drop box cutlery sharpening in Vancouver. Drop your knives anytime, pick them up next day. Text us for the secure drop box code.",
};

const steps = [
  {
    step: "01",
    title: "Call or Text for the Code",
    desc: 'Text or call 604 373 1500 to request the secure drop box combination code. We\'ll send it to you right away — it takes less than a minute.',
    icon: Phone,
  },
  {
    step: "02",
    title: "Wrap & Label Your Knives",
    desc: "Wrap each blade individually in a cloth or paper towel and secure with tape. Attach a label with your name and phone number so we can reach you when they're ready.",
    icon: CheckCircle,
  },
  {
    step: "03",
    title: "Drop Them Off Anytime",
    desc: "Use the code to access the secure drop box at our Vancouver location. The box is available 24 hours a day, 7 days a week — drop off whenever it's convenient for you.",
    icon: Lock,
  },
  {
    step: "04",
    title: "Pick Up Next Day",
    desc: "We sharpen and inspect each blade during business hours. We'll text you when your knives are ready. Pick up at your convenience — usually same or next business day.",
    icon: CheckCircle,
  },
];

const hours = [
  { label: "Monday – Friday", time: "Noon – 7:00 pm" },
  { label: "Saturday", time: "Noon – 4:00 pm" },
  { label: "Sunday", time: "Closed (drop box still available)" },
  { label: "Drop Box Access", time: "24 / 7" },
];

export default function DropOffPage() {
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
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-6 text-sm font-medium"
              style={{ borderColor: "rgba(212,160,23,0.4)", color: "#D4A017", backgroundColor: "rgba(212,160,23,0.08)" }}
            >
              <Lock size={14} />
              Secure Drop Box — 24/7
            </div>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6"
              style={{ color: "#FFFFFF" }}
            >
              Drop Off Your Knives{" "}
              <span style={{ color: "#D4A017" }}>Anytime</span>
            </h1>
            <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: "#6B7280" }}>
              Our secure drop box is accessible around the clock. Drop your knives off at midnight, pick them up sharp by the next business day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <DropBoxCodeButton />
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-base border-2 transition-all duration-200 hover:bg-yellow-900/20 active:scale-95"
                style={{ borderColor: "#D4A017", color: "#D4A017" }}
              >
                Book Mobile Instead
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </section>

        {/* Step-by-Step Instructions */}
        <section className="py-16 px-6" style={{ borderTop: "1px solid #30363D" }}>
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12" style={{ color: "#FFFFFF" }}>
              How Drop-Off <span style={{ color: "#D4A017" }}>Works</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {steps.map(({ step, title, desc, icon: Icon }) => (
                <div
                  key={step}
                  className="rounded-xl p-6 border"
                  style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: "rgba(212,160,23,0.1)" }}
                    >
                      <Icon size={22} style={{ color: "#D4A017" }} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "rgba(212,160,23,0.6)" }}>
                        Step {step}
                      </p>
                      <h3 className="font-semibold text-base mb-2" style={{ color: "#FFFFFF" }}>
                        {title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                        {desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div
              className="mt-8 rounded-xl p-5 border"
              style={{ backgroundColor: "rgba(30,144,255,0.04)", borderColor: "rgba(30,144,255,0.2)" }}
            >
              <p className="text-sm font-semibold mb-2" style={{ color: "#FFFFFF" }}>Quick tips for drop-off</p>
              <ul className="text-sm flex flex-col gap-1.5" style={{ color: "#6B7280" }}>
                <li>• Never drop loose knives — always wrap each blade individually.</li>
                <li>• Include your phone number so we can text you when they're ready.</li>
                <li>• Scissors and shears are welcome alongside knives.</li>
                <li>• No minimum pieces required for drop-off.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Address & Hours */}
        <section
          className="py-16 px-6"
          style={{ backgroundColor: "#161B22", borderTop: "1px solid #30363D" }}
        >
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Address */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <MapPin size={20} style={{ color: "#D4A017" }} />
                <h2 className="text-xl font-bold" style={{ color: "#FFFFFF" }}>
                  Our Location
                </h2>
              </div>
              <div
                className="rounded-xl p-6 border mb-4"
                style={{ backgroundColor: "#0D1117", borderColor: "#30363D" }}
              >
                <p className="font-semibold mb-1" style={{ color: "#FFFFFF" }}>Cove Cutlery</p>
                <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>
                  Vancouver, BC
                  <br />
                  (Exact address provided when you request the drop box code)
                </p>
              </div>
              <a
                href="https://maps.google.com/?q=Cove+Cutlery+Vancouver+BC"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200 hover:text-white"
                style={{ color: "#D4A017" }}
              >
                <MapPin size={14} />
                Open in Google Maps
              </a>
            </div>

            {/* Hours */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Clock size={20} style={{ color: "#D4A017" }} />
                <h2 className="text-xl font-bold" style={{ color: "#FFFFFF" }}>
                  Business Hours
                </h2>
              </div>
              <div
                className="rounded-xl border overflow-hidden"
                style={{ borderColor: "#30363D" }}
              >
                {hours.map(({ label, time }, i) => (
                  <div
                    key={label}
                    className="flex items-center justify-between px-5 py-4"
                    style={{
                      backgroundColor: i % 2 === 0 ? "#0D1117" : "#161B22",
                      borderBottom: i < hours.length - 1 ? "1px solid #30363D" : "none",
                    }}
                  >
                    <span className="text-sm" style={{ color: "#6B7280" }}>{label}</span>
                    <span className="text-sm font-semibold" style={{ color: label === "Drop Box Access" ? "#D4A017" : "#FFFFFF" }}>
                      {time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 text-center" style={{ borderTop: "1px solid #30363D" }}>
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "#FFFFFF" }}>
              Get Your <span style={{ color: "#D4A017" }}>Drop Box Code</span>
            </h2>
            <p className="text-base mb-8" style={{ color: "#6B7280" }}>
              Text or call us and we'll send the code immediately. Drop your knives off any time — day or night.
            </p>
            <DropBoxCodeButton />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
