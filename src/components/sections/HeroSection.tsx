"use client";

import { Phone, ChevronDown } from "lucide-react";

export default function HeroSection() {
  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: "#0D1117" }}
    >
      {/* Diagonal gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(212,160,23,0.06) 0%, transparent 50%, rgba(30,144,255,0.04) 100%)",
        }}
      />

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 60px)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto w-full">

        {/* Blade / gold line decoration — top */}
        <div className="flex items-center gap-3 mb-8 w-full max-w-xs mx-auto">
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, #D4A017)" }} />
          <svg
            width="28"
            height="14"
            viewBox="0 0 28 14"
            fill="none"
            className="flex-shrink-0"
            aria-hidden="true"
          >
            {/* Simplified blade silhouette */}
            <path
              d="M0 7 C6 7 8 2 16 1 L28 7 L16 13 C8 12 6 7 0 7Z"
              fill="#D4A017"
              opacity="0.85"
            />
          </svg>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, #D4A017)" }} />
        </div>

        {/* Headline */}
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6"
          style={{ color: "#FFFFFF" }}
        >
          Vancouver&apos;s Premier
          <br />
          <span style={{ color: "#D4A017" }}>Knife Sharpening</span> Service
        </h1>

        {/* Subheadline */}
        <p
          className="text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed"
          style={{ color: "#6B7280" }}
        >
          Mobile service that comes to you. Secure drop box available 24/7.
          Professional results guaranteed.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12 w-full sm:w-auto">
          <button
            onClick={scrollToContact}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-base transition-all duration-200 hover:brightness-110 active:scale-95"
            style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
          >
            Book Mobile Service
          </button>

          <a
            href="tel:6042108180"
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-base border-2 transition-all duration-200 hover:bg-yellow-900/20 active:scale-95"
            style={{ borderColor: "#D4A017", color: "#D4A017" }}
          >
            <Phone className="w-4 h-4" />
            Get Drop Box Code
          </a>
        </div>

        {/* Trust Stats Row */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 pt-8"
          style={{ borderTop: "1px solid #30363D" }}
        >
          {[
            { label: "5★ Google Rated" },
            { label: "Since 2020" },
            { label: "North Shore to Chilliwack" },
          ].map((stat, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="text-sm font-medium tracking-wide uppercase"
                style={{ color: "#6B7280" }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6" style={{ color: "#D4A017", opacity: 0.6 }} />
      </div>
    </section>
  );
}
