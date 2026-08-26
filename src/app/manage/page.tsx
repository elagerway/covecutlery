"use client";

import { useState } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useRef } from "react";

/**
 * One fixed URL a customer can be given over the phone: enter your number, get
 * your reschedule/cancel link by text. The AI receptionist can read this out or
 * text it on a voice call, where there's no SMS thread holding a per-booking link.
 *
 * The booking is never shown on screen — it's texted to the number on file — so
 * typing someone else's number reveals nothing about them.
 */
export default function ManageBookingPage() {
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/bookings/manage-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, cfToken: captchaToken }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "Something went wrong.");
        setState("error");
        turnstileRef.current?.reset();
        setCaptchaToken(null);
        return;
      }
      setMessage(data.message);
      setState("done");
    } catch {
      setMessage("Something went wrong. Please call us at +1 (604) 210-8180.");
      setState("error");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-16" style={{ backgroundColor: "#0D1117" }}>
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-2">Manage your booking</h1>
        <p className="mb-8 text-sm" style={{ color: "#8B949E" }}>
          Enter the phone number you booked with and we&apos;ll text you a link to reschedule or cancel.
        </p>

        {state === "done" ? (
          <div className="rounded-lg border p-4 text-sm" style={{ borderColor: "#30363D", color: "#8B949E" }}>
            {message}
            <p className="mt-3">
              Didn&apos;t get it? Call us at{" "}
              <a href="tel:+16042108180" className="underline" style={{ color: "#D4A017" }}>
                +1 (604) 210-8180
              </a>
              .
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="phone" className="block text-sm mb-2" style={{ color: "#8B949E" }}>
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="604-555-0100"
                className="w-full px-4 py-3 rounded-lg border text-white outline-none focus:border-white/30"
                style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
              />
            </div>

            <Turnstile
              ref={turnstileRef}
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              onSuccess={setCaptchaToken}
              onExpire={() => setCaptchaToken(null)}
              options={{ theme: "dark", appearance: "interaction-only" }}
            />

            {state === "error" && (
              <p className="text-sm" style={{ color: "#F85149" }}>
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={state === "loading" || !captchaToken}
              className="w-full py-4 rounded-lg font-semibold text-base transition-all duration-200 hover:brightness-110 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
            >
              {state === "loading" ? "Sending…" : "Text me my link"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
