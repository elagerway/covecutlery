"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
  status: string;
  notes: string | null;
  created_at: string;
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

function formatCAD(cents: number | null) {
  if (cents === null) return "—";
  return `$${(cents / 100).toFixed(2)}`;
}

export default function JobsTable({ bookings }: { bookings: Booking[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<string | null>(null);
  const [amountInput, setAmountInput] = useState("");
  const [saving, setSaving] = useState<string | null>(null);

  async function handleSaveAmount(id: string) {
    const dollars = parseFloat(amountInput);
    if (isNaN(dollars) || dollars < 0) return;
    setSaving(id);
    const res = await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount_charged: Math.round(dollars * 100) }),
    });
    setSaving(null);
    if (!res.ok) { alert("Failed to save. Try again."); return; }
    setEditing(null);
    router.refresh();
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
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: "#30363D" }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ backgroundColor: "#161B22", borderBottom: "1px solid #30363D" }}>
            {["Customer", "Date / Time", "Status", "Deposit", "Charged", "Total", "Actions"].map(h => (
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
                style={{
                  backgroundColor: i % 2 === 0 ? "#0D1117" : "#161B22",
                  borderBottom: i < bookings.length - 1 ? "1px solid #30363D" : undefined,
                }}
              >
                {/* Customer */}
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{b.customer_name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{b.customer_email}</div>
                  {b.customer_phone && <div className="text-xs" style={{ color: "#6B7280" }}>{b.customer_phone}</div>}
                </td>

                {/* Date / Time */}
                <td className="px-4 py-3">
                  <div className="text-white">{formatDate(b.appointment_date)}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{b.appointment_time}</div>
                  {b.address && <div className="text-xs mt-0.5" style={{ color: "#6B7280" }}>{b.address}</div>}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
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
                <td className="px-4 py-3">
                  {editing === b.id ? (
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
                        onClick={() => handleSaveAmount(b.id)}
                        disabled={saving === b.id}
                        className="px-2 py-1 rounded text-xs font-medium disabled:opacity-50"
                        style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
                      >
                        {saving === b.id ? "…" : "Save"}
                      </button>
                      <button
                        onClick={() => setEditing(null)}
                        className="px-2 py-1 rounded text-xs"
                        style={{ color: "#6B7280" }}
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
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
                  )}
                </td>

                {/* Total */}
                <td className="px-4 py-3 font-medium" style={{ color: total !== null ? "#4ADE80" : "#6B7280" }}>
                  {formatCAD(total)}
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  {b.notes && (
                    <span className="text-xs" style={{ color: "#6B7280" }} title={b.notes}>📝</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
