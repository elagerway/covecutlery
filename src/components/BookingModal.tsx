"use client";

import { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight, Loader2, CheckCircle, MapPin } from "lucide-react";

interface AddressSuggestion {
  place_id: number;
  display_name: string;
}

interface Slot {
  start: string;
}

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
}

const TIMEZONE = "America/Vancouver";

function formatDate(date: Date) {
  return date.toLocaleDateString("en-CA", { timeZone: TIMEZONE }); // YYYY-MM-DD
}

function formatDisplayDate(dateStr: string) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

function formatSlotTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    timeZone: TIMEZONE,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function addDays(date: Date, n: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export default function BookingModal({ open, onClose }: BookingModalProps) {
  const [step, setStep] = useState<"date" | "time" | "details" | "done">("date");
  const [weekStart, setWeekStart] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [slots, setSlots] = useState<Record<string, Slot[]>>({});
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [addressSuggestions, setAddressSuggestions] = useState<AddressSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const addressDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
  const addressRef = useRef<HTMLDivElement>(null);

  // Fetch slots for the visible week
  useEffect(() => {
    if (!open) return;
    const start = weekStart.toISOString();
    const end = addDays(weekStart, 14).toISOString();
    setLoadingSlots(true);
    fetch(`/api/cal/slots?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`)
      .then((r) => r.json())
      .then((data) => setSlots(data.data || {}))
      .catch(() => setSlots({}))
      .finally(() => setLoadingSlots(false));
  }, [open, weekStart]);

  // Reset on close — store timeout ref so it can be cancelled on re-open
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!open) {
      resetTimer.current = setTimeout(() => {
        setStep("date");
        setSelectedDate(null);
        setSelectedSlot(null);
        setForm({ name: "", email: "", phone: "", address: "", notes: "" });
        setError(null);
        setAddressSuggestions([]);
      }, 300);
    } else {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    }
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, [open]);

  // Close address dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (addressRef.current && !addressRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleAddressChange(value: string) {
    setForm((f) => ({ ...f, address: value }));
    setShowSuggestions(true);
    if (addressDebounce.current) clearTimeout(addressDebounce.current);
    if (value.length < 3) {
      setAddressSuggestions([]);
      return;
    }
    addressDebounce.current = setTimeout(async () => {
      setAddressLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(value)}&format=json&addressdetails=1&limit=5&countrycodes=ca`,
          { headers: { "Accept-Language": "en", "User-Agent": "CoveCutlery/1.0" } }
        );
        const data = await res.json();
        setAddressSuggestions(data);
      } catch {
        setAddressSuggestions([]);
      } finally {
        setAddressLoading(false);
      }
    }, 350);
  }

  const days = Array.from({ length: 14 }, (_, i) => addDays(weekStart, i));
  const today = formatDate(new Date());

  async function handleBook() {
    if (!selectedSlot || !form.name || !form.email || !form.address) return;
    setSubmitting(true);
    setError(null);
    const notes = [
      form.address && `Address: ${form.address}`,
      form.notes,
    ].filter(Boolean).join("\n");
    try {
      const res = await fetch("/api/cal/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start: selectedSlot,
          name: form.name,
          email: form.email,
          phone: form.phone,
          notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error?.message || "Booking failed. Please try again.");
      } else {
        setStep("done");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: "#0D1117", border: "1px solid #30363D" }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid #30363D" }}
        >
          <div>
            <h2 className="text-lg font-bold text-white">Book Mobile Sharpening</h2>
            <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>
              We come to you · $12/knife
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:bg-white/10"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Steps indicator */}
        {step !== "done" && (
          <div className="flex gap-1 px-6 pt-4">
            {(["date", "time", "details"] as const).map((s, i) => (
              <div
                key={s}
                className="h-1 flex-1 rounded-full transition-colors duration-300"
                style={{
                  backgroundColor:
                    step === s
                      ? "#D4A017"
                      : ["date", "time", "details"].indexOf(step) > i
                      ? "#D4A01760"
                      : "#30363D",
                }}
              />
            ))}
          </div>
        )}

        <div className="px-6 py-6">
          {/* STEP: Date */}
          {step === "date" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-white">Select a date</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setWeekStart((d) => addDays(d, -7))}
                    disabled={formatDate(weekStart) <= today}
                    className="p-1.5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => setWeekStart((d) => addDays(d, 7))}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>

              {loadingSlots ? (
                <div className="flex justify-center py-10">
                  <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#D4A017" }} />
                </div>
              ) : (
                <div className="grid grid-cols-7 gap-1.5">
                  {days.map((day) => {
                    const key = formatDate(day);
                    const hasSlots = (slots[key]?.length ?? 0) > 0;
                    const isPast = key < today;
                    return (
                      <button
                        key={key}
                        disabled={!hasSlots || isPast}
                        onClick={() => {
                          setSelectedDate(key);
                          setStep("time");
                        }}
                        className="flex flex-col items-center py-2.5 rounded-xl text-xs font-medium transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: hasSlots && !isPast ? "#161B22" : "transparent",
                          border: `1px solid ${hasSlots && !isPast ? "#30363D" : "transparent"}`,
                          color: hasSlots && !isPast ? "#FFFFFF" : "#6B7280",
                        }}
                      >
                        <span style={{ color: "#6B7280", fontSize: "10px" }}>
                          {day.toLocaleDateString("en-US", { weekday: "short" })}
                        </span>
                        <span className="mt-0.5 text-sm font-bold">{day.getDate()}</span>
                        {hasSlots && !isPast && (
                          <span className="mt-1 w-1 h-1 rounded-full" style={{ backgroundColor: "#D4A017" }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* STEP: Time */}
          {step === "time" && selectedDate && (
            <div>
              <button
                onClick={() => setStep("date")}
                className="flex items-center gap-1.5 text-sm mb-4 transition-colors hover:text-white"
                style={{ color: "#6B7280" }}
              >
                <ChevronLeft className="w-4 h-4" />
                {formatDisplayDate(selectedDate)}
              </button>

              <p className="text-sm font-semibold text-white mb-3">Available times</p>

              <div className="grid grid-cols-3 gap-2 max-h-52 overflow-y-auto pr-1">
                {(slots[selectedDate] || []).map((slot) => (
                  <button
                    key={slot.start}
                    onClick={() => {
                      setSelectedSlot(slot.start);
                      setStep("details");
                    }}
                    className="py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-150 hover:brightness-110 active:scale-95"
                    style={{ backgroundColor: "#161B22", border: "1px solid #30363D", color: "#FFFFFF" }}
                  >
                    {formatSlotTime(slot.start)}
                  </button>
                ))}
                {(slots[selectedDate]?.length ?? 0) === 0 && (
                  <p className="col-span-3 text-center py-6 text-sm" style={{ color: "#6B7280" }}>
                    No slots available for this day.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP: Details */}
          {step === "details" && selectedSlot && (
            <div>
              <button
                onClick={() => setStep("time")}
                className="flex items-center gap-1.5 text-sm mb-4 transition-colors hover:text-white"
                style={{ color: "#6B7280" }}
              >
                <ChevronLeft className="w-4 h-4" />
                {formatDisplayDate(selectedDate!)} · {formatSlotTime(selectedSlot)}
              </button>

              <p className="text-sm font-semibold text-white mb-4">Your details</p>

              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#6B7280" }}>
                    Name <span style={{ color: "#D4A017" }}>*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="Your name"
                    className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-[#6B7280] outline-none focus:ring-1"
                    style={{ backgroundColor: "#161B22", border: "1px solid #30363D" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#6B7280" }}>
                    Email <span style={{ color: "#D4A017" }}>*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="you@email.com"
                    className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-[#6B7280] outline-none focus:ring-1"
                    style={{ backgroundColor: "#161B22", border: "1px solid #30363D" }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#6B7280" }}>
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    placeholder="604-xxx-xxxx"
                    className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-[#6B7280] outline-none focus:ring-1"
                    style={{ backgroundColor: "#161B22", border: "1px solid #30363D" }}
                  />
                </div>
                <div ref={addressRef} className="relative">
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#6B7280" }}>
                    Service Address <span style={{ color: "#D4A017" }}>*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "#6B7280" }} />
                    {addressLoading && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin pointer-events-none" style={{ color: "#6B7280" }} />
                    )}
                    <input
                      type="text"
                      value={form.address}
                      onChange={(e) => handleAddressChange(e.target.value)}
                      onFocus={() => addressSuggestions.length > 0 && setShowSuggestions(true)}
                      placeholder="Start typing your address…"
                      autoComplete="off"
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg text-sm text-white placeholder-[#6B7280] outline-none"
                      style={{ backgroundColor: "#161B22", border: "1px solid #30363D" }}
                    />
                  </div>
                  {showSuggestions && addressSuggestions.length > 0 && (
                    <ul
                      className="absolute z-10 w-full mt-1 rounded-lg overflow-hidden shadow-xl"
                      style={{ backgroundColor: "#161B22", border: "1px solid #30363D" }}
                    >
                      {addressSuggestions.map((s) => (
                        <li key={s.place_id}>
                          <button
                            type="button"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setForm((f) => ({ ...f, address: s.display_name }));
                              setShowSuggestions(false);
                              setAddressSuggestions([]);
                            }}
                            className="w-full text-left px-3 py-2.5 text-sm transition-colors hover:bg-white/10"
                            style={{ color: "#FFFFFF" }}
                          >
                            <span className="font-medium">{s.display_name.split(",")[0]}</span>
                            <span className="block text-xs mt-0.5 truncate" style={{ color: "#6B7280" }}>
                              {s.display_name.split(",").slice(1).join(",").trim()}
                            </span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "#6B7280" }}>
                    Notes (# of knives, parking, etc.)
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    placeholder="e.g. 8 kitchen knives, street parking available"
                    rows={2}
                    className="w-full px-3 py-2.5 rounded-lg text-sm text-white placeholder-[#6B7280] outline-none resize-none"
                    style={{ backgroundColor: "#161B22", border: "1px solid #30363D" }}
                  />
                </div>

                {error && (
                  <p className="text-sm rounded-lg px-3 py-2.5" style={{ backgroundColor: "#2D1B1B", color: "#F87171", border: "1px solid #7F1D1D" }}>
                    {error}
                  </p>
                )}

                <button
                  onClick={handleBook}
                  disabled={submitting || !form.name || !form.email || !form.address}
                  className="w-full py-3 rounded-lg font-semibold text-sm transition-all duration-200 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Confirm Booking
                </button>
              </div>
            </div>
          )}

          {/* STEP: Done */}
          {step === "done" && (
            <div className="flex flex-col items-center text-center py-4">
              <CheckCircle className="w-14 h-14 mb-4" style={{ color: "#D4A017" }} />
              <h3 className="text-xl font-bold text-white mb-2">You&apos;re booked!</h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: "#6B7280" }}>
                A confirmation has been sent to <span className="text-white">{form.email}</span>.
                We&apos;ll be in touch to confirm your address and details.
              </p>
              <button
                onClick={onClose}
                className="px-8 py-3 rounded-lg font-semibold text-sm transition-all hover:brightness-110 active:scale-95"
                style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
