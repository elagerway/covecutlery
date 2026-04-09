"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPhone } from "@/lib/format";

interface Customer {
  email: string;
  name: string;
  phone: string | null;
  address: string | null;
}

interface Booking {
  id: string;
  appointment_date: string;
  appointment_time: string;
  address: string | null;
  deposit_amount: number;
  amount_charged: number | null;
  payment_method: "card" | "cash" | null;
  status: string;
  stripe_payment_intent_id: string | null;
  notes: string | null;
}

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  pending_payment: { bg: "#37352F22", color: "#937264" },
  confirmed: { bg: "#1C3A2E", color: "#3FB950" },
  completed: { bg: "#1C2B3A", color: "#58A6FF" },
  cancelled: { bg: "#3A1C1C", color: "#FF6B6B" },
  refunded: { bg: "#2D1C3A", color: "#BB86FC" },
};

function formatCAD(cents: number) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(cents / 100);
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function CustomerDetail({
  customer,
  bookings,
}: {
  customer: Customer;
  bookings: Booking[];
}) {
  const router = useRouter();
  const [name, setName] = useState(customer.name);
  const [phone, setPhone] = useState(formatPhone(customer.phone) === "—" ? "" : formatPhone(customer.phone));
  const [address, setAddress] = useState(customer.address ?? "");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [refundingId, setRefundingId] = useState<string | null>(null);
  const [refundMsg, setRefundMsg] = useState<Record<string, string>>({});

  async function handleSave() {
    setSaving(true);
    setSaveMsg("");
    const res = await fetch(`/api/admin/customers/${encodeURIComponent(customer.email)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customer_name: name, customer_phone: phone || null, customer_address: address || null }),
    });
    setSaving(false);
    setSaveMsg(res.ok ? "Saved" : "Failed to save");
    if (res.ok) router.refresh();
  }

  async function handleRefund(bookingId: string) {
    if (!confirm("Issue a full refund for this booking's deposit?")) return;
    setRefundingId(bookingId);
    const res = await fetch(`/api/admin/bookings/${bookingId}/refund`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });
    const data = await res.json();
    setRefundingId(null);
    setRefundMsg((prev) => ({
      ...prev,
      [bookingId]: res.ok ? "Refunded" : (data.error ?? "Failed"),
    }));
    if (res.ok) router.refresh();
  }

  const totalDeposits = bookings
    .filter((b) => ["confirmed", "completed", "refunded"].includes(b.status))
    .reduce((sum, b) => sum + (b.deposit_amount ?? 0), 0);

  const totalCharged = bookings
    .filter((b) => ["confirmed", "completed"].includes(b.status))
    .reduce((sum, b) => sum + (b.amount_charged ?? 0), 0);

  const totalPaid = totalDeposits + totalCharged;

  return (
    <div className="flex flex-col gap-8">
      {/* Edit details */}
      <div
        className="rounded-lg border p-6"
        style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
      >
        <h2 className="text-base font-semibold text-white mb-4">Customer Details</h2>
        <div className="flex flex-col gap-4 max-w-md">
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: "#6B7280" }}>
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded text-sm text-white outline-none border"
              style={{ backgroundColor: "#0D1117", borderColor: "#30363D" }}
            />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: "#6B7280" }}>
              Phone
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 rounded text-sm text-white outline-none border"
              style={{ backgroundColor: "#0D1117", borderColor: "#30363D" }}
            />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: "#6B7280" }}>
              Address
            </label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 rounded text-sm text-white outline-none border"
              style={{ backgroundColor: "#0D1117", borderColor: "#30363D" }}
            />
          </div>
          <div>
            <label className="text-xs font-medium block mb-1" style={{ color: "#6B7280" }}>
              Email
            </label>
            <p className="text-sm px-3 py-2" style={{ color: "#6B7280" }}>
              {customer.email}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 rounded text-sm font-medium"
              style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
            {saveMsg && (
              <span
                className="text-sm"
                style={{ color: saveMsg === "Saved" ? "#3FB950" : "#FF6B6B" }}
              >
                {saveMsg}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex gap-4">
        <div
          className="rounded-lg border px-5 py-4"
          style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
        >
          <p className="text-xs mb-1" style={{ color: "#6B7280" }}>
            Total Bookings
          </p>
          <p className="text-2xl font-bold text-white">{bookings.length}</p>
        </div>
        <div
          className="rounded-lg border px-5 py-4"
          style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
        >
          <p className="text-xs mb-1" style={{ color: "#6B7280" }}>
            Deposits Paid
          </p>
          <p className="text-2xl font-bold" style={{ color: "#D4A017" }}>
            {formatCAD(totalDeposits)}
          </p>
        </div>
        <div
          className="rounded-lg border px-5 py-4"
          style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
        >
          <p className="text-xs mb-1" style={{ color: "#6B7280" }}>
            Total Paid
          </p>
          <p className="text-2xl font-bold" style={{ color: "#4ADE80" }}>
            {formatCAD(totalPaid)}
          </p>
        </div>
      </div>

      {/* Booking history */}
      <div>
        <h2 className="text-base font-semibold text-white mb-4">Booking History</h2>
        <div className="rounded-lg border overflow-hidden" style={{ borderColor: "#30363D" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#161B22", borderBottom: "1px solid #30363D" }}>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Date</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Time</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Address</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Deposit</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Charged</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Total</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => {
                const s = STATUS_STYLES[b.status] ?? STATUS_STYLES.pending_payment;
                const canRefund =
                  ["confirmed", "completed"].includes(b.status) &&
                  !!b.stripe_payment_intent_id;
                return (
                  <tr
                    key={b.id}
                    style={{
                      backgroundColor: i % 2 === 0 ? "#0D1117" : "#161B22",
                      borderBottom: "1px solid #30363D",
                    }}
                  >
                    <td className="px-4 py-3 text-white">{formatDate(b.appointment_date)}</td>
                    <td className="px-4 py-3" style={{ color: "#6B7280" }}>{b.appointment_time}</td>
                    <td
                      className="px-4 py-3 max-w-xs truncate"
                      style={{ color: "#6B7280" }}
                      title={b.address ?? ""}
                    >
                      {b.address ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-white">{formatCAD(b.deposit_amount)}</td>
                    <td className="px-4 py-3">
                      {b.amount_charged !== null ? (
                        <div>
                          <span className="text-white">{formatCAD(b.amount_charged)}</span>
                          {b.payment_method && (
                            <span className="text-xs ml-1" style={{ color: "#6B7280" }}>
                              {b.payment_method === "card" ? "💳" : "💵"}
                            </span>
                          )}
                        </div>
                      ) : <span style={{ color: "#6B7280" }}>—</span>}
                    </td>
                    <td className="px-4 py-3 font-medium" style={{ color: b.amount_charged !== null ? "#4ADE80" : "#6B7280" }}>
                      {b.amount_charged !== null ? formatCAD(b.deposit_amount + b.amount_charged) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-medium"
                        style={{ backgroundColor: s.bg, color: s.color }}
                      >
                        {b.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {refundMsg[b.id] ? (
                        <span
                          className="text-xs"
                          style={{
                            color: refundMsg[b.id] === "Refunded" ? "#3FB950" : "#FF6B6B",
                          }}
                        >
                          {refundMsg[b.id]}
                        </span>
                      ) : canRefund ? (
                        <button
                          onClick={() => handleRefund(b.id)}
                          disabled={refundingId === b.id}
                          className="text-xs px-3 py-1.5 rounded font-medium"
                          style={{ backgroundColor: "#3A1C1C", color: "#FF6B6B" }}
                        >
                          {refundingId === b.id ? "Refunding…" : "Refund"}
                        </button>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
