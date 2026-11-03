"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [bookingsEnabled, setBookingsEnabled] = useState<boolean | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => setBookingsEnabled(d.bookings_enabled !== false))
      .catch(() => setMsg("Couldn't load settings"));
  }, []);

  async function toggleBookings() {
    if (bookingsEnabled === null) return;
    const next = !bookingsEnabled;
    if (!next && !confirm("Pause new bookings? Book buttons will disappear from the website and new bookings will be refused.")) return;
    setSaving(true);
    setMsg(null);
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookings_enabled: next }),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      setBookingsEnabled(data.bookings_enabled);
      setMsg(data.bookings_enabled ? "Bookings are open" : "New bookings paused");
    } else {
      setMsg(data.error || "Save failed");
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-white mb-6">Settings</h1>

      <div className="rounded-xl p-5" style={{ backgroundColor: "#161B22", border: "1px solid #30363D" }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white">Accept new bookings</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: "#6B7280" }}>
              When off, every Book button is hidden from the website, the booking page shows a
              &ldquo;not taking new bookings&rdquo; notice, and the booking system refuses new
              bookings. Existing bookings aren&rsquo;t affected.
            </p>
          </div>
          {bookingsEnabled === null ? (
            <Loader2 className="w-5 h-5 animate-spin shrink-0" style={{ color: "#6B7280" }} />
          ) : (
            <button
              type="button"
              role="switch"
              aria-checked={bookingsEnabled}
              aria-label="Accept new bookings"
              onClick={toggleBookings}
              disabled={saving}
              className="relative shrink-0 w-11 h-6 rounded-full transition-colors disabled:opacity-50"
              style={{ backgroundColor: bookingsEnabled ? "#22C55E" : "#30363D" }}
            >
              <span
                className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform"
                style={{ transform: bookingsEnabled ? "translateX(20px)" : "translateX(0)" }}
              />
            </button>
          )}
        </div>
        {bookingsEnabled !== null && (
          <p className="text-xs mt-4 font-medium" style={{ color: bookingsEnabled ? "#22C55E" : "#EF4444" }}>
            {bookingsEnabled ? "● Bookings are open" : "● New bookings are paused"}
          </p>
        )}
      </div>

      {msg && (
        <p className="text-sm mt-3" style={{ color: msg.includes("fail") || msg.includes("Couldn") ? "#EF4444" : "#6B7280" }}>
          {msg}
        </p>
      )}
    </div>
  );
}
