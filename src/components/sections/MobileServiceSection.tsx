"use client";

import { MapPin } from "lucide-react";

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

const serviceAreas = [
  {
    area: "North Shore",
    minimum: "Minimum 6 pieces",
  },
  {
    area: "Burnaby, Vancouver, Port Moody",
    minimum: "Minimum 8 pieces",
  },
  {
    area: "Whistler, Squamish, Chilliwack & Rest of Lower Mainland",
    minimum: "Minimum 14 pieces",
  },
];

export default function MobileServiceSection() {
  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="mobile-service"
      className="py-20 px-6"
      style={{ backgroundColor: "#0D1117" }}
    >
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-4">
          <h2
            className="text-3xl sm:text-4xl font-bold mb-4"
            style={{ color: "#FFFFFF" }}
          >
            Mobile Service —{" "}
            <span style={{ color: "#D4A017" }}>We Come to You</span>
          </h2>
          <p
            className="text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#6B7280" }}
          >
            Professional knife sharpening at your door. No need to travel —
            book an appointment and we'll come to your home, restaurant, or
            business.
          </p>
        </div>

        {/* Divider */}
        <div
          className="h-px w-24 mx-auto my-10"
          style={{ backgroundColor: "#D4A017", opacity: 0.5 }}
        />

        {/* Service Area Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          {serviceAreas.map((item) => (
            <div
              key={item.area}
              className="flex flex-col items-center text-center p-6 rounded-xl border"
              style={{
                backgroundColor: "#161B22",
                borderColor: "#30363D",
              }}
            >
              <MapPin
                className="w-7 h-7 mb-4 flex-shrink-0"
                style={{ color: "#D4A017" }}
              />
              <p
                className="font-semibold text-base mb-3 leading-snug"
                style={{ color: "#FFFFFF" }}
              >
                {item.area}
              </p>
              <p
                className="text-sm font-medium"
                style={{ color: "#D4A017" }}
              >
                {item.minimum}
              </p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <button
            onClick={scrollToContact}
            className="px-8 py-4 rounded-lg font-semibold text-base transition-all duration-200 hover:brightness-110 active:scale-95"
            style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
          >
            Book Mobile Service
          </button>

          <a
            href="https://www.instagram.com/coveblades/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-base border-2 transition-all duration-200 hover:bg-white/5 active:scale-95"
            style={{ borderColor: "#30363D", color: "#FFFFFF" }}
          >
            <span style={{ color: "#D4A017" }}><InstagramIcon /></span>
            Follow us @coveblades
          </a>
        </div>

        {/* Pricing note */}
        <p
          className="text-center text-sm"
          style={{ color: "#6B7280" }}
        >
          Pricing: $12/knife. We sharpen at your location.
        </p>
      </div>
    </section>
  );
}
