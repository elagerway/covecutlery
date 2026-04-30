import { Clock, ExternalLink } from "lucide-react";
import DropBoxCodeButton from "@/components/DropBoxCodeButton";

const steps = [
  "Text 604 210 8180 to receive your unique drop box code",
  "Drop off your knives in the secure lock box",
  "We'll sharpen and notify you when ready for pickup",
  "Next-day service available",
];

const hours = [
  { label: "Mon – Sat", value: "10am – 7pm" },
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-12">
          <h2
            className="text-3xl sm:text-4xl font-bold"
            style={{ color: "#FFFFFF" }}
          >
            Secure Drop Box —{" "}
            <span style={{ color: "#D4A017" }}>Open 24/7</span>
          </h2>
          <DropBoxCodeButton />
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
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
              className="rounded-xl border p-6"
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

          </div>

          {/* Right: Map placeholder card */}
          <div
            className="rounded-xl border overflow-hidden flex flex-col"
            style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
          >
            {/* Static map */}
            <a href="https://goo.gl/maps/C5GSo2wYLX36tTnv7" target="_blank" rel="noopener noreferrer" className="relative flex-1 block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/map-dropoff.png"
                alt="Map showing 4086 Brockton Crescent, North Vancouver"
                className="w-full h-full object-cover"
              />
            </a>

            {/* Address block + Google Maps link */}
            <div
              className="px-6 py-5 border-t mt-auto"
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
