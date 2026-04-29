"use client";

import { ChevronDown, CalendarDays } from "lucide-react";
import { useBooking } from "@/components/BookingProvider";
import DropBoxCodeButton from "@/components/DropBoxCodeButton";

export default function HeroSection() {
  const { open: openBooking } = useBooking();

  const scrollToSchedule = () => {
    document.getElementById("schedule")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-16 sm:pt-20 sm:pb-12"
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

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto w-full">

        {/* Blade / gold line decoration — top */}
        <div className="flex items-center gap-3 mb-8 w-full max-w-xs mx-auto">
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, #D4A017)" }} />
          {/* Ram ProMaster 1500 — zooms in from the left, smoking the tires */}
          <span className="van-trail flex-shrink-0">
            <span className="smoke-puff smoke-puff-1" aria-hidden="true" />
            <span className="smoke-puff smoke-puff-2" aria-hidden="true" />
            <span className="smoke-puff smoke-puff-3" aria-hidden="true" />
            <span className="smoke-puff smoke-puff-4" aria-hidden="true" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/promaster.png"
              alt=""
              aria-hidden="true"
              className="object-contain block relative"
              style={{ height: 48, width: "auto" }}
            />
          </span>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, #D4A017)" }} />
        </div>

        {/* Headline */}
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight mb-6"
          style={{ color: "#FFFFFF" }}
        >
          Vancouver&apos;s Premier
          <br />
          <span style={{ color: "#D4A017" }}>Cutlery Sharpening</span> Service
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
            onClick={openBooking}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-base transition-all duration-200 hover:brightness-110 active:scale-95"
            style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
          >
            Book Mobile Service
          </button>

          <button
            onClick={scrollToSchedule}
            className="flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-base border-2 transition-all duration-200 hover:bg-yellow-900/20 active:scale-95"
            style={{ borderColor: "#D4A017", color: "#D4A017" }}
          >
            <CalendarDays className="w-4 h-4" />
            Current Schedule
          </button>
          <DropBoxCodeButton />
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
