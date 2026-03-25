"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPhone } from "@/lib/format";

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  appointment_date: string;
  appointment_time: string;
  address: string | null;
  deposit_amount: number;
  amount_charged: number | null;
  payment_method: "card" | "cash" | null;
  status: string;
  notes: string | null;
  created_at: string;
  stripe_payment_intent_id: string | null;
  stripe_customer_id: string | null;
  receipt_sent_at: string | null;
}

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  pending_payment: { bg: "#EAB30822", color: "#EAB308" },
  confirmed:       { bg: "#3B82F622", color: "#60A5FA" },
  completed:       { bg: "#16A34A22", color: "#4ADE80" },
  cancelled:       { bg: "#6B728022", color: "#9CA3AF" },
  refunded:        { bg: "#EF444422", color: "#F87171" },
};

function formatDate(d: string) {
  return new Date(d + "T12:00:00").toLocaleDateString("en-CA", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-CA", {
    timeZone: "America/Vancouver",
    month: "short", day: "numeric", year: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
  });
}

function formatCAD(cents: number | null) {
  if (cents === null) return "—";
  return `$${(cents / 100).toFixed(2)}`;
}

export default function JobsTable({ bookings }: { bookings: Booking[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<string | null>(null);
  const [amountInput, setAmountInput] = useState("");
  const [saving, setSaving] = useState<string | null>(null);
  const [refunding, setRefunding] = useState<string | null>(null);
  const [refundMsg, setRefundMsg] = useState<Record<string, string>>({});
  const [chargeMsg, setChargeMsg] = useState<Record<string, string>>({});
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const selectedBooking = bookings.find((b) => b.id === selectedBookingId) ?? null;
  const [receiptOpen, setReceiptOpen] = useState<string | null>(null);
  const [receiptEmail, setReceiptEmail] = useState(true);
  const [receiptSms, setReceiptSms] = useState(true);
  const [receiptEmailTo, setReceiptEmailTo] = useState("");
  const [receiptSmsTo, setReceiptSmsTo] = useState("");
  const [sendingReceipt, setSendingReceipt] = useState<string | null>(null);
  const [receiptMsg, setReceiptMsg] = useState<Record<string, string>>({});
  const [receiptResult, setReceiptResult] = useState<{ ok: boolean; msg: string } | null>(null);

  async function handleSaveCash(id: string) {
    const dollars = parseFloat(amountInput);
    if (isNaN(dollars) || dollars < 0) return;
    setSaving(id);
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount_charged: Math.round(dollars * 100), payment_method: "cash" }),
    });
    setSaving(null);
    if (!res.ok) { alert("Failed to save. Try again."); return; }
    setEditing(null);
    router.refresh();
  }

  async function handleChargeCard(id: string) {
    const dollars = parseFloat(amountInput);
    if (isNaN(dollars) || dollars < 0) return;
    setSaving(id + ":card");
    const res = await fetch(`/api/admin/bookings/${id}/charge`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Math.round(dollars * 100) }),
    });
    const data = await res.json();
    setSaving(null);
    if (!res.ok) {
      setChargeMsg((prev) => ({ ...prev, [id]: data.error ?? "Charge failed" }));
      return;
    }
    setEditing(null);
    setChargeMsg((prev) => ({ ...prev, [id]: "Charged" }));
    router.refresh();
  }

  async function handleRefund(id: string) {
    if (!confirm("Issue a full refund for this booking's $50 deposit?")) return;
    setRefunding(id);
    const res = await fetch(`/api/admin/bookings/${id}/refund`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
    const data = await res.json();
    setRefunding(null);
    setRefundMsg((prev) => ({ ...prev, [id]: res.ok ? "Refunded" : (data.error ?? "Failed") }));
    if (res.ok) router.refresh();
  }

  async function handleSendReceipt(id: string) {
    setSendingReceipt(id);
    setReceiptResult(null);
    const res = await fetch(`/api/admin/bookings/${id}/receipt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sendEmail: receiptEmail,
        sendSms: receiptSms,
        emailTo: receiptEmailTo,
        smsTo: receiptSmsTo,
      }),
    });
    const data = await res.json();
    setSendingReceipt(null);
    const ok = res.ok || data.partial;
    const msg = res.ok
      ? "Receipt sent successfully!"
      : data.partial
      ? `Partially sent — ${data.error}`
      : (data.error ?? "Failed to send receipt.");
    setReceiptResult({ ok, msg });
    if (ok) {
      setReceiptMsg((prev) => ({ ...prev, [id]: "Sent!" }));
      router.refresh();
    }
  }

  async function handleStatusChange(id: string, status: string) {
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) { alert("Failed to update status."); return; }
    router.refresh();
  }

  if (bookings.length === 0) {
    return (
      <div className="rounded-xl border p-12 text-center" style={{ borderColor: "#30363D", backgroundColor: "#161B22" }}>
        <p style={{ color: "#6B7280" }}>No bookings yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#30363D" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: "#161B22", borderBottom: "1px solid #30363D" }}>
              {["Date / Time", "Customer", "Status", "Deposit", "Charged", "Total", "Actions"].map(h => (
                <th key={h} className="text-left px-4 py-3 font-medium" style={{ color: "#6B7280" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, i) => {
              const deposit = b.deposit_amount;
              const charged = b.amount_charged;
              const total = charged !== null ? deposit + charged : null;
              const style = STATUS_STYLES[b.status] ?? STATUS_STYLES.confirmed;

              return (
                <tr
                  key={b.id}
                  onClick={() => setSelectedBookingId(b.id)}
                  className="cursor-pointer hover:brightness-125 transition-all"
                  style={{
                    backgroundColor: i % 2 === 0 ? "#0D1117" : "#161B22",
                    borderBottom: i < bookings.length - 1 ? "1px solid #30363D" : undefined,
                  }}
                >
                  {/* Date / Time */}
                  <td className="px-4 py-3">
                    <div className="text-white">{formatDate(b.appointment_date)}</div>
                    <div className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{b.appointment_time}</div>
                    {b.address && <div className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{b.address}</div>}
                  </td>

                  {/* Customer */}
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{b.customer_name}</div>
                    <div className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{b.customer_email}</div>
                    {b.customer_phone && <div className="text-xs" style={{ color: "#6B7280" }}>{formatPhone(b.customer_phone)}</div>}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={b.status}
                      onChange={(e) => handleStatusChange(b.id, e.target.value)}
                      className="text-xs px-2 py-1 rounded-full font-medium border-0 outline-none cursor-pointer"
                      style={{ backgroundColor: style.bg, color: style.color }}
                    >
                      <option value="pending_payment">pending payment</option>
                      <option value="confirmed">confirmed</option>
                      <option value="completed">completed</option>
                      <option value="cancelled">cancelled</option>
                      <option value="refunded">refunded</option>
                    </select>
                  </td>

                  {/* Deposit */}
                  <td className="px-4 py-3 text-white">{formatCAD(deposit)}</td>

                  {/* Charged on day */}
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    {editing === b.id ? (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          <span style={{ color: "#6B7280" }}>$</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={amountInput}
                            onChange={(e) => setAmountInput(e.target.value)}
                            className="w-20 px-2 py-1 rounded text-sm text-white outline-none"
                            style={{ backgroundColor: "#0D1117", border: "1px solid #D4A017" }}
                            autoFocus
                          />
                          <button
                            onClick={() => setEditing(null)}
                            className="px-2 py-1 rounded text-xs"
                            style={{ color: "#6B7280" }}
                          >
                            ✕
                          </button>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleSaveCash(b.id)}
                            disabled={saving === b.id}
                            className="px-2 py-1 rounded text-xs font-medium disabled:opacity-50 flex-1"
                            style={{ backgroundColor: "#16A34A22", color: "#4ADE80", border: "1px solid #16A34A44" }}
                          >
                            {saving === b.id ? "…" : "💵 Cash"}
                          </button>
                          <button
                            onClick={() => handleChargeCard(b.id)}
                            disabled={saving === b.id + ":card" || !b.stripe_customer_id}
                            className="px-2 py-1 rounded text-xs font-medium disabled:opacity-40 flex-1"
                            style={{ backgroundColor: "#1D4ED822", color: "#60A5FA", border: "1px solid #1D4ED844" }}
                            title={!b.stripe_customer_id ? "No saved card for this booking" : ""}
                          >
                            {saving === b.id + ":card" ? "…" : "💳 Card"}
                          </button>
                        </div>
                        {chargeMsg[b.id] && (
                          <span className="text-xs" style={{ color: chargeMsg[b.id] === "Charged" ? "#4ADE80" : "#F87171" }}>
                            {chargeMsg[b.id]}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div>
                        <button
                          onClick={() => {
                            setEditing(b.id);
                            setAmountInput(charged !== null ? (charged / 100).toString() : "");
                          }}
                          className="hover:opacity-80 transition-opacity"
                          style={{ color: charged !== null ? "#FFFFFF" : "#D4A017" }}
                        >
                          {charged !== null ? formatCAD(charged) : "+ Enter"}
                        </button>
                        {b.payment_method && (
                          <div className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
                            {b.payment_method === "card" ? "💳 card" : "💵 cash"}
                          </div>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Total */}
                  <td className="px-4 py-3 font-medium" style={{ color: total !== null ? "#4ADE80" : "#6B7280" }}>
                    {formatCAD(total)}
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      {b.notes && (
                        <span className="text-xs" style={{ color: "#6B7280" }} title={b.notes}>📝</span>
                      )}
                      {refundMsg[b.id] ? (
                        <span className="text-xs" style={{ color: refundMsg[b.id] === "Refunded" ? "#4ADE80" : "#F87171" }}>{refundMsg[b.id]}</span>
                      ) : ["confirmed", "completed"].includes(b.status) && b.stripe_payment_intent_id ? (
                        <button
                          onClick={() => handleRefund(b.id)}
                          disabled={refunding === b.id}
                          className="text-xs px-2 py-1 rounded font-medium disabled:opacity-50 transition-all hover:brightness-125 border border-transparent hover:border-red-400"
                          style={{ backgroundColor: "#3A1C1C", color: "#F87171" }}
                        >
                          {refunding === b.id ? "…" : "Refund"}
                        </button>
                      ) : null}

                      {/* Receipt */}
                      {receiptMsg[b.id] ? (
                        <span className="text-xs" style={{ color: receiptMsg[b.id] === "Sent!" ? "#4ADE80" : "#F87171" }}>{receiptMsg[b.id]}</span>
                      ) : (
                        <button
                          onClick={() => {
                            setReceiptOpen(receiptOpen === b.id ? null : b.id);
                            setReceiptEmailTo(b.customer_email);
                            setReceiptSmsTo(b.customer_phone ?? "");
                            setReceiptEmail(true);
                            setReceiptSms(!!b.customer_phone);
                            setReceiptResult(null);
                          }}
                          className="text-xs px-2 py-1 rounded font-medium transition-all hover:brightness-125 border border-transparent hover:border-blue-400"
                          style={{ backgroundColor: "#1D4ED822", color: "#60A5FA" }}
                        >
                          Receipt
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Receipt Modal */}
      {receiptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setReceiptOpen(null)}>
          <div
            className="rounded-lg p-5 flex flex-col gap-3 w-80"
            style={{ backgroundColor: "#1C2230", border: "1px solid #30363D", boxShadow: "0 8px 32px rgba(0,0,0,.6)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm font-semibold text-white">Send Receipt</p>
            <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: "#9CA3AF" }}>
              <input type="checkbox" checked={receiptEmail} onChange={(e) => setReceiptEmail(e.target.checked)} className="accent-blue-400" />
              Email
            </label>
            {receiptEmail && (
              <input
                type="email"
                value={receiptEmailTo}
                onChange={(e) => setReceiptEmailTo(e.target.value)}
                className="w-full px-2 py-1.5 rounded text-xs text-white outline-none"
                style={{ backgroundColor: "#0D1117", border: "1px solid #30363D" }}
                placeholder="email@example.com"
              />
            )}
            <label className="flex items-center gap-2 text-xs cursor-pointer" style={{ color: "#9CA3AF" }}>
              <input type="checkbox" checked={receiptSms} onChange={(e) => setReceiptSms(e.target.checked)} className="accent-blue-400" />
              SMS
            </label>
            {receiptSms && (
              <input
                type="tel"
                value={receiptSmsTo}
                onChange={(e) => setReceiptSmsTo(e.target.value)}
                className="w-full px-2 py-1.5 rounded text-xs text-white outline-none"
                style={{ backgroundColor: "#0D1117", border: "1px solid #30363D" }}
                placeholder="(604) 555-1234"
              />
            )}
            {receiptResult && (
              <p className="text-xs rounded px-3 py-2" style={{
                backgroundColor: receiptResult.ok ? "#16A34A22" : "#EF444422",
                color: receiptResult.ok ? "#4ADE80" : "#F87171",
              }}>
                {receiptResult.msg}
              </p>
            )}
            <div className="flex gap-2 mt-1">
              {!receiptResult?.ok && (
                <button
                  onClick={() => handleSendReceipt(receiptOpen)}
                  disabled={sendingReceipt === receiptOpen || (!receiptEmail && !receiptSms)}
                  className="flex-1 px-3 py-1.5 rounded text-xs font-medium disabled:opacity-50"
                  style={{ backgroundColor: "#1D4ED8", color: "#fff" }}
                >
                  {sendingReceipt === receiptOpen ? "Sending…" : "Send"}
                </button>
              )}
              <button
                onClick={() => setReceiptOpen(null)}
                className="px-3 py-1.5 rounded text-xs"
                style={{ color: "#6B7280" }}
              >
                {receiptResult?.ok ? "Close" : "✕"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Job Detail Drawer */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelectedBookingId(null)}>
          <div
            className="w-full max-w-md h-full overflow-y-auto p-6 flex flex-col gap-5"
            style={{ backgroundColor: "#161B22", borderLeft: "1px solid #30363D" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">{selectedBooking.customer_name}</h2>
                <p className="text-sm mt-0.5" style={{ color: "#6B7280" }}>{selectedBooking.customer_email}</p>
                {selectedBooking.customer_phone && (
                  <p className="text-sm" style={{ color: "#6B7280" }}>{formatPhone(selectedBooking.customer_phone)}</p>
                )}
              </div>
              <button onClick={() => setSelectedBookingId(null)} className="text-lg" style={{ color: "#6B7280" }}>✕</button>
            </div>

            <hr style={{ borderColor: "#30363D" }} />

            {/* Appointment */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>Appointment</p>
              <p className="text-white">{formatDate(selectedBooking.appointment_date)} at {selectedBooking.appointment_time}</p>
              {selectedBooking.address && <p className="text-sm mt-1" style={{ color: "#6B7280" }}>{selectedBooking.address}</p>}
            </div>

            {/* Booking info */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>Booked</p>
              <p className="text-sm text-white">{formatDateTime(selectedBooking.created_at)}</p>
            </div>

            {/* Payments */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: "#6B7280" }}>Payments</p>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center px-3 py-2 rounded-lg" style={{ backgroundColor: "#0D1117" }}>
                  <div>
                    <p className="text-sm text-white">Deposit</p>
                    <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>💳 card · paid at booking</p>
                  </div>
                  <p className="font-medium text-white">{formatCAD(selectedBooking.deposit_amount)}</p>
                </div>
                {selectedBooking.amount_charged !== null && (
                  <div className="flex justify-between items-center px-3 py-2 rounded-lg" style={{ backgroundColor: "#0D1117" }}>
                    <div>
                      <p className="text-sm text-white">Day of service</p>
                      <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
                        {selectedBooking.payment_method === "card" ? "💳 card" : selectedBooking.payment_method === "cash" ? "💵 cash" : "—"}
                      </p>
                    </div>
                    <p className="font-medium text-white">{formatCAD(selectedBooking.amount_charged)}</p>
                  </div>
                )}
                {selectedBooking.amount_charged !== null && (
                  <div className="flex justify-between items-center px-3 py-2 rounded-lg" style={{ backgroundColor: "#0D1117", border: "1px solid #30363D" }}>
                    <p className="text-sm font-semibold text-white">Total</p>
                    <p className="font-semibold" style={{ color: "#4ADE80" }}>
                      {formatCAD(selectedBooking.deposit_amount + selectedBooking.amount_charged)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Activity timeline */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wider mb-3" style={{ color: "#6B7280" }}>Activity</p>
              <div className="flex flex-col gap-0">
                {[
                  { ts: selectedBooking.created_at, label: "Booking created", icon: "📋" },
                  selectedBooking.status !== "pending_payment"
                    ? { ts: selectedBooking.created_at, label: "Deposit paid · $50 card", icon: "💳" }
                    : null,
                  selectedBooking.amount_charged !== null
                    ? {
                        ts: null,
                        label: `Day-of charge · ${formatCAD(selectedBooking.amount_charged)} ${selectedBooking.payment_method === "card" ? "💳 card" : "💵 cash"}`,
                        icon: "💰",
                      }
                    : null,
                  selectedBooking.receipt_sent_at
                    ? { ts: selectedBooking.receipt_sent_at, label: "Receipt sent", icon: "📧" }
                    : null,
                  selectedBooking.status === "refunded"
                    ? { ts: null, label: "Deposit refunded", icon: "↩️" }
                    : null,
                ]
                  .filter(Boolean)
                  .map((event, i, arr) => (
                    <div key={i} className="flex gap-3 relative">
                      {i < arr.length - 1 && (
                        <div className="absolute left-[11px] top-6 bottom-0 w-px" style={{ backgroundColor: "#30363D" }} />
                      )}
                      <div
                        className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs mt-0.5"
                        style={{ backgroundColor: "#0D1117", border: "1px solid #30363D" }}
                      >
                        {event!.icon}
                      </div>
                      <div className="pb-4">
                        <p className="text-sm text-white">{event!.label}</p>
                        {event!.ts && (
                          <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{formatDateTime(event!.ts)}</p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Notes */}
            {selectedBooking.notes && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>Notes</p>
                <p className="text-sm text-white whitespace-pre-wrap">{selectedBooking.notes}</p>
              </div>
            )}

            {/* Status badge */}
            <div>
              <p className="text-xs font-medium uppercase tracking-wider mb-2" style={{ color: "#6B7280" }}>Status</p>
              <span
                className="text-xs px-2 py-1 rounded-full font-medium"
                style={{
                  backgroundColor: (STATUS_STYLES[selectedBooking.status] ?? STATUS_STYLES.confirmed).bg,
                  color: (STATUS_STYLES[selectedBooking.status] ?? STATUS_STYLES.confirmed).color,
                }}
              >
                {selectedBooking.status.replace("_", " ")}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
