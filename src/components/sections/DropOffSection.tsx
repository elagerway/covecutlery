import { MapPin, Clock, Phone, ExternalLink } from "lucide-react";

const steps = [
  "Text 604-210-8180 to receive your unique drop box code",
  "Drop off your knives in the secure lock box",
  "We'll sharpen and notify you when ready for pickup",
  "Next-day service available",
];

const hours = [
  { label: "Mon – Fri", value: "10am – 7pm" },
  { label: "Saturday", value: "Noon – 4pm" },
  { label: "Drop Box", value: "24/7" },
];

export default function DropOffSection() {
  return (
    <section
      id="drop-off"
      className="py-20 px-6"
      style={{ backgroundColor: "#0D1117" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: "#FFFFFF" }}
          >
            Secure Drop Box —{" "}
            <span style={{ color: "#D4A017" }}>Open 24/7</span>
          </h2>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left: Instructions + Hours + CTA */}
          <div>
            {/* Steps */}
            <ol className="space-y-5 mb-10">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
                  >
                    {i + 1}
                  </span>
                  <p
                    className="pt-1 text-base leading-relaxed"
                    style={{ color: "#FFFFFF" }}
                  >
                    {step}
                  </p>
                </li>
              ))}
            </ol>

            {/* Hours */}
            <div
              className="rounded-xl border p-6 mb-8"
              style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5" style={{ color: "#D4A017" }} />
                <span
                  className="font-semibold text-sm uppercase tracking-wide"
                  style={{ color: "#6B7280" }}
                >
                  Hours
                </span>
              </div>
              <ul className="space-y-2">
                {hours.map((h) => (
                  <li key={h.label} className="flex justify-between text-sm">
                    <span style={{ color: "#6B7280" }}>{h.label}</span>
                    <span className="font-medium" style={{ color: "#FFFFFF" }}>
                      {h.value}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <a
              href="tel:6042108180"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-base transition-all duration-200 hover:brightness-110 active:scale-95"
              style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
            >
              <Phone className="w-5 h-5" />
              Get Drop Box Code
            </a>
          </div>

          {/* Right: Map placeholder card */}
          <div
            className="rounded-xl border overflow-hidden"
            style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
          >
            {/* Map visual placeholder */}
            <div
              className="relative flex flex-col items-center justify-center py-16 px-8"
              style={{
                background:
                  "linear-gradient(135deg, #161B22 0%, #1a2232 50%, #161B22 100%)",
                minHeight: "240px",
              }}
            >
              {/* Subtle grid */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 40px)",
                }}
              />
              <MapPin
                className="w-12 h-12 mb-4 relative z-10"
                style={{ color: "#D4A017" }}
              />
              <p
                className="text-base font-semibold text-center relative z-10 mb-1"
                style={{ color: "#FFFFFF" }}
              >
                4086 Brockton Crescent
              </p>
              <p
                className="text-sm text-center relative z-10"
                style={{ color: "#6B7280" }}
              >
                North Vancouver, BC V7G 1E6
              </p>
            </div>

            {/* Address block + Google Maps link */}
            <div
              className="px-6 py-5 border-t"
              style={{ borderColor: "#30363D" }}
            >
              <a
                href="https://goo.gl/maps/C5GSo2wYLX36tTnv7"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200 hover:opacity-80"
                style={{ color: "#1E90FF" }}
              >
                <ExternalLink className="w-4 h-4" />
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
