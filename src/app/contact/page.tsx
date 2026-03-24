"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, AlertCircle } from "lucide-react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const serviceTypes = [
  "Mobile Service",
  "Drop-Off",
  "Mail-In",
  "Special Event / Market",
  "Restaurant / Commercial",
  "Other",
];

const contactDetails = [
  {
    icon: Phone,
    label: "Phone",
    value: "604 373 1500",
    href: "tel:6043731500",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@covecutlery.ca",
    href: "mailto:info@covecutlery.ca",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Vancouver, BC — Serving the Lower Mainland",
    href: "https://maps.google.com/?q=Vancouver+BC",
  },
];

const hours = [
  { days: "Monday – Friday", time: "10:00 am – 7:00 pm" },
  { days: "Saturday", time: "Noon – 4:00 pm" },
  { days: "Sunday", time: "Closed" },
  { days: "Drop Box", time: "24 / 7" },
];

type FormState = {
  name: string;
  phone: string;
  email: string;
  service_type: string;
  item_count: string;
  message: string;
};

const emptyForm: FormState = {
  name: "",
  phone: "",
  email: "",
  service_type: "",
  item_count: "",
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) return;
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          item_count: form.item_count ? parseInt(form.item_count, 10) : null,
          captchaToken,
        }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setErrorMessage(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        turnstileRef.current?.reset();
        setCaptchaToken(null);
        return;
      }

      setStatus("success");
      setForm(emptyForm);
      setCaptchaToken(null);
      turnstileRef.current?.reset();
    } catch {
      setErrorMessage("Network error. Please check your connection and try again.");
      setStatus("error");
      turnstileRef.current?.reset();
      setCaptchaToken(null);
    }
  };

  const inputClass =
    "w-full px-4 py-3 rounded-lg text-sm border outline-none transition-all duration-200 focus:border-[#D4A017] focus:ring-1 focus:ring-[#D4A017]/30";
  const inputStyle = {
    backgroundColor: "#0D1117",
    borderColor: "#30363D",
    color: "#FFFFFF",
  };
  const labelClass = "block text-xs font-semibold tracking-widest uppercase mb-2";
  const labelStyle = { color: "#6B7280" };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#0D1117", fontFamily: "Inter, system-ui, sans-serif" }}
    >
      <Navbar />

      <main className="flex-1 pt-16">
        {/* Hero */}
        <section className="relative py-20 px-6 overflow-hidden" style={{ backgroundColor: "#0D1117" }}>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg, rgba(212,160,23,0.07) 0%, transparent 55%, rgba(30,144,255,0.04) 100%)",
            }}
          />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <h1
              className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight mb-4"
              style={{ color: "#FFFFFF" }}
            >
              Get in <span style={{ color: "#D4A017" }}>Touch</span>
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "#6B7280" }}>
              Ready to book? Have a question? Fill out the form and we'll get back to you within a few hours.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 px-6" style={{ borderTop: "1px solid #30363D" }}>
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-10">

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div
                className="rounded-xl border p-8"
                style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
              >
                <h2 className="text-xl font-bold mb-6" style={{ color: "#FFFFFF" }}>
                  Send Us a Message
                </h2>

                {status === "success" ? (
                  <div
                    className="rounded-xl p-8 flex flex-col items-center text-center gap-4"
                    style={{ backgroundColor: "rgba(212,160,23,0.06)", border: "1px solid rgba(212,160,23,0.25)" }}
                  >
                    <CheckCircle size={40} style={{ color: "#D4A017" }} />
                    <div>
                      <p className="font-bold text-lg mb-1" style={{ color: "#FFFFFF" }}>Message Sent!</p>
                      <p className="text-sm" style={{ color: "#6B7280" }}>
                        Thanks for reaching out. We'll be in touch within a few hours to confirm your booking or answer your questions.
                      </p>
                    </div>
                    <button
                      onClick={() => setStatus("idle")}
                      className="mt-2 text-sm font-medium transition-colors duration-200 hover:text-white"
                      style={{ color: "#D4A017" }}
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                    {/* Name & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="name" className={labelClass} style={labelStyle}>
                          Name <span style={{ color: "#D4A017" }}>*</span>
                        </label>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          required
                          placeholder="Jane Smith"
                          value={form.name}
                          onChange={handleChange}
                          className={inputClass}
                          style={inputStyle}
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className={labelClass} style={labelStyle}>
                          Phone
                        </label>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="604-555-0100"
                          value={form.phone}
                          onChange={handleChange}
                          className={inputClass}
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className={labelClass} style={labelStyle}>
                        Email <span style={{ color: "#D4A017" }}>*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="jane@example.com"
                        value={form.email}
                        onChange={handleChange}
                        className={inputClass}
                        style={inputStyle}
                      />
                    </div>

                    {/* Service Type & Item Count */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="service_type" className={labelClass} style={labelStyle}>
                          Service Type
                        </label>
                        <select
                          id="service_type"
                          name="service_type"
                          value={form.service_type}
                          onChange={handleChange}
                          className={inputClass}
                          style={{ ...inputStyle, cursor: "pointer" }}
                        >
                          <option value="">Select a service...</option>
                          {serviceTypes.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="item_count" className={labelClass} style={labelStyle}>
                          Number of Items
                        </label>
                        <input
                          id="item_count"
                          name="item_count"
                          type="number"
                          min="1"
                          placeholder="e.g. 8"
                          value={form.item_count}
                          onChange={handleChange}
                          className={inputClass}
                          style={inputStyle}
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className={labelClass} style={labelStyle}>
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        placeholder="Tell us about your knives, preferred timing, or any questions..."
                        value={form.message}
                        onChange={handleChange}
                        className={inputClass}
                        style={{ ...inputStyle, resize: "vertical" }}
                      />
                    </div>

                    {/* Error */}
                    {status === "error" && (
                      <div
                        className="flex items-start gap-3 rounded-lg px-4 py-3 text-sm"
                        style={{ backgroundColor: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)", color: "#FCA5A5" }}
                      >
                        <AlertCircle size={16} className="mt-0.5 shrink-0" />
                        {errorMessage}
                      </div>
                    )}

                    {/* CAPTCHA */}
                    <Turnstile
                      ref={turnstileRef}
                      siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                      onSuccess={setCaptchaToken}
                      onExpire={() => setCaptchaToken(null)}
                    />

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={status === "loading" || !captchaToken}
                      className="flex items-center justify-center gap-2 w-full py-4 rounded-lg font-semibold text-base transition-all duration-200 hover:brightness-110 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                      style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
                    >
                      {status === "loading" ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar — Contact Details & Hours */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Contact Details */}
              <div
                className="rounded-xl border p-6"
                style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
              >
                <h2 className="text-base font-bold mb-5" style={{ color: "#FFFFFF" }}>
                  Contact Details
                </h2>
                <ul className="flex flex-col gap-5">
                  {contactDetails.map(({ icon: Icon, label, value, href }) => (
                    <li key={label} className="flex items-start gap-3">
                      <div
                        className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: "rgba(212,160,23,0.1)" }}
                      >
                        <Icon size={16} style={{ color: "#D4A017" }} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold tracking-widest uppercase mb-0.5" style={{ color: "#6B7280" }}>
                          {label}
                        </p>
                        <a
                          href={href}
                          target={href.startsWith("http") ? "_blank" : undefined}
                          rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="text-sm transition-colors duration-200 hover:text-white"
                          style={{ color: "#D4A017" }}
                        >
                          {value}
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hours */}
              <div
                className="rounded-xl border p-6"
                style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
              >
                <div className="flex items-center gap-2 mb-5">
                  <Clock size={16} style={{ color: "#D4A017" }} />
                  <h2 className="text-base font-bold" style={{ color: "#FFFFFF" }}>
                    Business Hours
                  </h2>
                </div>
                <ul className="flex flex-col gap-3">
                  {hours.map(({ days, time }) => (
                    <li key={days} className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: "#6B7280" }}>{days}</span>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: days === "Drop Box" ? "#D4A017" : "#FFFFFF" }}
                      >
                        {time}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Map Link */}
              <div
                className="rounded-xl border p-6"
                style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
              >
                <h2 className="text-base font-bold mb-3" style={{ color: "#FFFFFF" }}>
                  Find Us
                </h2>
                <p className="text-sm mb-4" style={{ color: "#6B7280" }}>
                  Based in Vancouver, BC. Serving North Shore, Burnaby, Surrey, Langley, and the Fraser Valley.
                </p>
                <a
                  href="https://maps.google.com/?q=Vancouver+BC+Canada"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium transition-colors duration-200 hover:text-white"
                  style={{ color: "#D4A017" }}
                >
                  <MapPin size={14} />
                  Open in Google Maps
                </a>
              </div>

              {/* Quick Call CTA */}
              <a
                href="tel:6043731500"
                className="flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-base border-2 transition-all duration-200 hover:bg-yellow-900/20 active:scale-95"
                style={{ borderColor: "#D4A017", color: "#D4A017" }}
              >
                <Phone size={18} />
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
