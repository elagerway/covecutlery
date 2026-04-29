"use client";

import { useState, useRef } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  CreditCard,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const YouTubeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
  </svg>
);

type FormData = {
  name: string;
  phone: string;
  email: string;
  service_type: string;
  item_count: string;
  message: string;
};

type SubmitState = "idle" | "loading" | "success" | "error";

const inputClass =
  "w-full rounded-lg px-4 py-3 text-sm text-white placeholder-[#6B7280] border outline-none transition-all duration-200 focus:border-[#D4A017]";
const inputStyle = {
  backgroundColor: "#161B22",
  borderColor: "#30363D",
  color: "#FFFFFF",
};

const labelClass = "block text-xs font-medium uppercase tracking-wide mb-1.5";
const labelStyle = { color: "#6B7280" };

export default function ContactSection() {
  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    service_type: "",
    item_count: "",
    message: "",
  });
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) return;
    setSubmitState("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, captchaToken }),
      });
      if (res.ok) {
        setSubmitState("success");
        setForm({
          name: "",
          phone: "",
          email: "",
          service_type: "",
          item_count: "",
          message: "",
        });
        setCaptchaToken(null);
        turnstileRef.current?.reset();
      } else {
        setSubmitState("error");
        turnstileRef.current?.reset();
      }
    } catch {
      setSubmitState("error");
      turnstileRef.current?.reset();
    }
  };

  return (
    <section
      id="contact"
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
            Get <span style={{ color: "#D4A017" }}>In Touch</span>
          </h2>
          <p className="text-base" style={{ color: "#6B7280" }}>
            Book a service, ask a question, or get a quote.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Left: Contact form */}
          <div
            className="rounded-xl border p-8"
            style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label htmlFor="name" className={labelClass} style={labelStyle}>
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className={labelClass}
                  style={labelStyle}
                >
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="604-xxx-xxxx"
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className={labelClass}
                  style={labelStyle}
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              {/* Service Type */}
              <div>
                <label
                  htmlFor="service_type"
                  className={labelClass}
                  style={labelStyle}
                >
                  Service Type
                </label>
                <select
                  id="service_type"
                  name="service_type"
                  required
                  value={form.service_type}
                  onChange={handleChange}
                  className={inputClass}
                  style={inputStyle}
                >
                  <option value="" disabled>
                    Select a service
                  </option>
                  <option value="Mobile Service">Mobile Service</option>
                  <option value="Drop Off">Drop Off</option>
                  <option value="Special Event">Special Event</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Number of Items */}
              <div>
                <label
                  htmlFor="item_count"
                  className={labelClass}
                  style={labelStyle}
                >
                  Number of Items
                </label>
                <input
                  id="item_count"
                  name="item_count"
                  type="number"
                  min="1"
                  required
                  value={form.item_count}
                  onChange={handleChange}
                  placeholder="e.g. 8"
                  className={inputClass}
                  style={inputStyle}
                />
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  className={labelClass}
                  style={labelStyle}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Any additional details..."
                  className={`${inputClass} resize-none`}
                  style={inputStyle}
                />
              </div>

              {/* CAPTCHA */}
              <Turnstile
                ref={turnstileRef}
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                onSuccess={setCaptchaToken}
                onExpire={() => setCaptchaToken(null)}
                options={{ theme: "dark" }}
              />

              {/* Submit */}
              <button
                type="submit"
                disabled={submitState === "loading" || !captchaToken}
                className="w-full py-4 rounded-lg font-semibold text-base transition-all duration-200 hover:brightness-110 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
              >
                {submitState === "loading" ? "Sending…" : "Send Message"}
              </button>

              {/* Feedback messages */}
              {submitState === "success" && (
                <div
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm"
                  style={{
                    backgroundColor: "rgba(34, 197, 94, 0.1)",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                    color: "#4ade80",
                  }}
                >
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  Message sent! We'll be in touch soon.
                </div>
              )}
              {submitState === "error" && (
                <div
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm"
                  style={{
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    color: "#f87171",
                  }}
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  Something went wrong. Please try calling or texting us.
                </div>
              )}
            </form>
          </div>

          {/* Right: Contact info */}
          <div className="space-y-4">
            {/* Phone */}
            <a
              href="tel:6042108180"
              className="flex items-start gap-4 rounded-xl border p-5 transition-colors duration-200 hover:border-[#D4A017]/50 group"
              style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
            >
              <Phone
                className="w-5 h-5 mt-0.5 flex-shrink-0 transition-colors group-hover:text-yellow-400"
                style={{ color: "#D4A017" }}
              />
              <div>
                <p
                  className="text-xs uppercase tracking-wide mb-1"
                  style={{ color: "#6B7280" }}
                >
                  Phone
                </p>
                <p className="font-semibold text-sm" style={{ color: "#FFFFFF" }}>
                  604 210 8180
                </p>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:info@coveblades.com"
              className="flex items-start gap-4 rounded-xl border p-5 transition-colors duration-200 hover:border-[#D4A017]/50 group"
              style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
            >
              <Mail
                className="w-5 h-5 mt-0.5 flex-shrink-0"
                style={{ color: "#D4A017" }}
              />
              <div>
                <p
                  className="text-xs uppercase tracking-wide mb-1"
                  style={{ color: "#6B7280" }}
                >
                  Email
                </p>
                <p className="font-semibold text-sm" style={{ color: "#FFFFFF" }}>
                  info@coveblades.com
                </p>
              </div>
            </a>

            {/* Address */}
            <div
              className="flex items-start gap-4 rounded-xl border p-5"
              style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
            >
              <MapPin
                className="w-5 h-5 mt-0.5 flex-shrink-0"
                style={{ color: "#D4A017" }}
              />
              <div>
                <p
                  className="text-xs uppercase tracking-wide mb-1"
                  style={{ color: "#6B7280" }}
                >
                  Drop Box Address
                </p>
                <p className="font-semibold text-sm" style={{ color: "#FFFFFF" }}>
                  4086 Brockton Crescent
                </p>
                <p className="text-sm" style={{ color: "#6B7280" }}>
                  North Vancouver, BC V7G 1E6
                </p>
              </div>
            </div>

            {/* Hours */}
            <div
              className="flex items-start gap-4 rounded-xl border p-5"
              style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
            >
              <Clock
                className="w-5 h-5 mt-0.5 flex-shrink-0"
                style={{ color: "#D4A017" }}
              />
              <div className="w-full">
                <p
                  className="text-xs uppercase tracking-wide mb-2"
                  style={{ color: "#6B7280" }}
                >
                  Hours
                </p>
                <ul className="space-y-1">
                  {[
                    { d: "Mon – Fri", t: "Noon – 7pm" },
                    { d: "Saturday", t: "Noon – 4pm" },
                    { d: "Drop Box", t: "24/7" },
                  ].map((h) => (
                    <li key={h.d} className="flex justify-between text-sm">
                      <span style={{ color: "#6B7280" }}>{h.d}</span>
                      <span className="font-medium" style={{ color: "#FFFFFF" }}>
                        {h.t}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Payment */}
            <div
              className="flex items-start gap-4 rounded-xl border p-5"
              style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
            >
              <CreditCard
                className="w-5 h-5 mt-0.5 flex-shrink-0"
                style={{ color: "#D4A017" }}
              />
              <div>
                <p
                  className="text-xs uppercase tracking-wide mb-1"
                  style={{ color: "#6B7280" }}
                >
                  Payment
                </p>
                <p className="text-sm" style={{ color: "#FFFFFF" }}>
                  Cash, Interac e-Transfer, Credit & Debit
                </p>
              </div>
            </div>

            {/* Social links */}
            <div
              className="rounded-xl border p-5"
              style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
            >
              <p
                className="text-xs uppercase tracking-wide mb-4"
                style={{ color: "#6B7280" }}
              >
                Follow Us
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://www.instagram.com/coveblades/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-75"
                  style={{ color: "#FFFFFF" }}
                  aria-label="Instagram"
                >
                  <span style={{ color: "#D4A017" }}><InstagramIcon /></span>
                  Instagram
                </a>
                <a
                  href="https://www.facebook.com/coveblades"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-75"
                  style={{ color: "#FFFFFF" }}
                  aria-label="Facebook"
                >
                  <span style={{ color: "#1E90FF" }}><FacebookIcon /></span>
                  Facebook
                </a>
                <a
                  href="https://www.youtube.com/@coveblades"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-75"
                  style={{ color: "#FFFFFF" }}
                  aria-label="YouTube"
                >
                  <span style={{ color: "#FF0000" }}><YouTubeIcon /></span>
                  YouTube
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
