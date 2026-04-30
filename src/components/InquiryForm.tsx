"use client";

import { useState, useRef } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { CheckCircle, AlertCircle } from "lucide-react";
import AddressAutocomplete from "@/components/AddressAutocomplete";

type Props = {
  serviceType: string;
  buttonLabel?: string;
  successMessage?: string;
  showItemCount?: boolean;
  messagePlaceholder?: string;
  /** Show a validated address field (Google Places autocomplete). */
  showAddress?: boolean;
  /** Label for the address field — appears as a UPPERCASE form label. */
  addressLabel?: string;
};

type State = "idle" | "loading" | "success" | "error";

const inputClass =
  "w-full rounded-lg px-4 py-3 text-sm text-white placeholder-[#6B7280] border outline-none transition-all duration-200 focus:border-[#D4A017]";
const inputStyle = {
  backgroundColor: "#161B22",
  borderColor: "#30363D",
  color: "#FFFFFF",
};
const labelClass = "block text-xs font-medium uppercase tracking-wide mb-1.5";
const labelStyle = { color: "#6B7280" };

export default function InquiryForm({
  serviceType,
  buttonLabel = "Send Message",
  successMessage = "Thanks — we'll be in touch soon.",
  showItemCount = false,
  messagePlaceholder = "Tell us a bit about what you need...",
  showAddress = false,
  addressLabel = "Address",
}: Props) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    item_count: "",
    message: "",
    address: "",
  });
  const [addressValidated, setAddressValidated] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaToken) return;
    if (showAddress && !addressValidated) {
      setErrorMessage("Please pick your address from the autocomplete suggestions so we can confirm it's a real, validated address.");
      setState("error");
      return;
    }
    setErrorMessage(null);
    setState("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          service_type: serviceType,
          item_count: showItemCount ? form.item_count : null,
          address: showAddress ? form.address : null,
          captchaToken,
        }),
      });
      if (res.ok) {
        setState("success");
        setForm({ name: "", phone: "", email: "", item_count: "", message: "", address: "" });
        setAddressValidated(false);
        setCaptchaToken(null);
        turnstileRef.current?.reset();
      } else {
        setState("error");
        turnstileRef.current?.reset();
      }
    } catch {
      setState("error");
      turnstileRef.current?.reset();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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

      <div>
        <label htmlFor="email" className={labelClass} style={labelStyle}>
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

      <div>
        <label htmlFor="phone" className={labelClass} style={labelStyle}>
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="604-xxx-xxxx (optional)"
          className={inputClass}
          style={inputStyle}
        />
      </div>

      {showItemCount && (
        <div>
          <label htmlFor="item_count" className={labelClass} style={labelStyle}>
            Estimated number of knives
          </label>
          <input
            id="item_count"
            name="item_count"
            type="text"
            value={form.item_count}
            onChange={handleChange}
            placeholder="e.g. 50–100"
            className={inputClass}
            style={inputStyle}
          />
        </div>
      )}

      {showAddress && (
        <AddressAutocomplete
          label={addressLabel}
          value={form.address}
          required
          placeholder="Start typing — pick from suggestions"
          onChange={(addr, validated) => {
            setForm((prev) => ({ ...prev, address: addr }));
            setAddressValidated(validated);
          }}
        />
      )}

      <div>
        <label htmlFor="message" className={labelClass} style={labelStyle}>
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          value={form.message}
          onChange={handleChange}
          placeholder={messagePlaceholder}
          className={`${inputClass} resize-none`}
          style={inputStyle}
        />
      </div>

      <Turnstile
        ref={turnstileRef}
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
        onSuccess={setCaptchaToken}
        onExpire={() => setCaptchaToken(null)}
        options={{ theme: "dark", appearance: "interaction-only" }}
      />

      <button
        type="submit"
        disabled={state === "loading" || !captchaToken}
        className="w-full py-4 rounded-lg font-semibold text-base transition-all duration-200 hover:brightness-110 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
      >
        {state === "loading" ? "Sending…" : buttonLabel}
      </button>

      {state === "success" && (
        <div
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm"
          style={{
            backgroundColor: "rgba(34, 197, 94, 0.1)",
            border: "1px solid rgba(34, 197, 94, 0.3)",
            color: "#4ade80",
          }}
        >
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          {successMessage}
        </div>
      )}
      {state === "error" && (
        <div
          className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm"
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            color: "#f87171",
          }}
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errorMessage ?? "Something went wrong. Please try calling or texting us at 604 210 8180."}
        </div>
      )}
    </form>
  );
}
