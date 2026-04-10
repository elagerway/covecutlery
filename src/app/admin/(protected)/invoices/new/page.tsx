"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, Eye, X, CreditCard, ArrowRight } from "lucide-react";
import { LineItem, formatCAD } from "@/lib/format";

const PRICE_OPTIONS = [
  { label: "Knife Sharpening", price: 1200 },
  { label: "Lawnmower blade", price: 1500 },
  { label: "Machete", price: 1500 },
  { label: "Shears / scissors", price: 1200 },
  { label: "Serrated knife", price: 1200 },
  { label: "Ceramic knife", price: 1500 },
  { label: "Axe / hatchet", price: 1500 },
];

function defaultDueDate() {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toLocaleDateString("en-CA", { timeZone: "America/Vancouver" });
}

function CustomerSearch({ customers, onSelect }: {
  customers: { id: string; name: string; email: string | null; phone: string | null; address: string | null }[];
  onSelect: (c: { name: string; email: string | null; phone: string | null; address: string | null }) => void;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const filtered = query.trim()
    ? customers.filter((c) => {
        const q = query.toLowerCase();
        return c.name.toLowerCase().includes(q) || (c.email && c.email.toLowerCase().includes(q)) || (c.phone && c.phone.includes(q));
      })
    : customers;

  return (
    <div ref={ref} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder="Search customers..."
        className="px-3 py-1.5 rounded-lg text-xs text-white outline-none w-56"
        style={{ backgroundColor: "#161B22", border: "1px solid #30363D" }}
      />
      {open && filtered.length > 0 && (
        <div
          className="absolute right-0 top-full mt-1 w-80 max-h-60 overflow-y-auto rounded-lg z-50 shadow-xl"
          style={{ backgroundColor: "#1C2128", border: "1px solid #30363D" }}
        >
          {filtered.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => { onSelect(c); setQuery(c.name); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs text-white hover:bg-white/10 transition-colors"
            >
              <span className="font-medium">{c.name}</span>
              <span className="ml-2" style={{ color: "#6B7280" }}>{c.email || c.phone}</span>
            </button>
          ))}
        </div>
      )}
      {open && query.trim() && filtered.length === 0 && (
        <div
          className="absolute right-0 top-full mt-1 w-80 rounded-lg z-50 px-3 py-2 text-xs"
          style={{ backgroundColor: "#1C2128", border: "1px solid #30363D", color: "#6B7280" }}
        >
          No customers found
        </div>
      )}
    </div>
  );
}

export default function NewInvoicePage() {
  const router = useRouter();
  const [form, setForm] = useState({
    client_name: "",
    client_email: "",
    client_phone: "",
    client_address: "",
    notes: "",
    due_date: defaultDueDate(),
    work_completed_date: "",
  });
  const [items, setItems] = useState<LineItem[]>([
    { description: "Knife Sharpening", quantity: 1, unit_price: 1200 },
  ]);
  const [customMode, setCustomMode] = useState<Record<number, boolean>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [includeDueDate, setIncludeDueDate] = useState(false);
  const [customers, setCustomers] = useState<{ id: string; name: string; email: string | null; phone: string | null; address: string | null }[]>([]);

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setCustomers(data); })
      .catch(() => {});
  }, []);

  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.unit_price, 0);

  function addItem() {
    setItems([...items, { description: "Knife", quantity: 1, unit_price: 1200 }]);
  }

  function removeItem(idx: number) {
    setItems(items.filter((_, i) => i !== idx));
    setCustomMode((prev) => {
      const next: Record<number, boolean> = {};
      for (const [k, v] of Object.entries(prev)) {
        const ki = Number(k);
        if (ki < idx) next[ki] = v;
        else if (ki > idx) next[ki - 1] = v;
      }
      return next;
    });
  }

  function selectPreset(idx: number, presetLabel: string) {
    setItems(items.map((item, i) => {
      if (i !== idx) return item;
      const preset = PRICE_OPTIONS.find((p) => p.label === presetLabel);
      return { ...item, description: presetLabel, unit_price: preset?.price ?? item.unit_price };
    }));
  }

  function updateItem(idx: number, field: keyof LineItem, value: string | number) {
    setItems(items.map((item, i) => {
      if (i !== idx) return item;
      return { ...item, [field]: value };
    }));
  }

  async function handleSave(action: "draft" | "send" | "paid") {
    if (!form.client_name || items.length === 0) {
      setError("Fill in client name and at least one line item.");
      return;
    }
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          due_date: includeDueDate ? form.due_date : null,
          client_address: form.client_address || null,
          line_items: items,
          status: action === "send" ? "sent" : "draft",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create invoice");
        setSaving(false);
        return;
      }

      if (action === "send") {
        await fetch(`/api/admin/invoices/${data.id}/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sendEmail: !!form.client_email, sendSms: !!form.client_phone }),
        });
      }

      if (action === "paid") {
        await fetch(`/api/admin/invoices/${data.id}/mark-paid`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payment_method: "etransfer" }),
        });
      }

      router.push(`/admin/invoices/${data.id}`);
    } catch {
      setError("Network error");
      setSaving(false);
    }
  }

  const inputStyle = { backgroundColor: "#161B22", border: "1px solid #30363D" };

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-white mb-6">New Invoice</h1>

      {/* Client info */}
      <div className="rounded-xl p-5 mb-5" style={{ backgroundColor: "#161B22", border: "1px solid #30363D" }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-white">Client Information</p>
          {customers.length > 0 && <CustomerSearch customers={customers} onSelect={(c) => {
            setForm((f) => ({
              ...f,
              client_name: c.name,
              client_email: c.email ?? "",
              client_phone: c.phone ?? "",
              client_address: c.address ?? "",
            }));
            // Fetch last booking date for this customer
            const params = new URLSearchParams();
            if (c.email) params.set("email", c.email);
            if (c.phone) params.set("phone", c.phone);
            if (c.name) params.set("name", c.name);
            if (c.address) params.set("address", c.address);
            if (params.toString()) {
              fetch(`/api/admin/customers/last-booking?${params}`)
                .then((r) => r.ok ? r.json() : null)
                .then((data) => {
                  if (data?.date) setForm((f) => ({ ...f, work_completed_date: data.date }));
                })
                .catch(() => {});
            }
          }} />}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#6B7280" }}>
              Name <span style={{ color: "#D4A017" }}>*</span>
            </label>
            <input
              type="text"
              value={form.client_name}
              onChange={(e) => setForm({ ...form, client_name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#6B7280" }}>
              Email <span style={{ color: "#D4A017" }}>*</span>
            </label>
            <input
              type="email"
              value={form.client_email}
              onChange={(e) => setForm({ ...form, client_email: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#6B7280" }}>
              Phone <span style={{ color: "#D4A017" }}>*</span>
            </label>
            <input
              type="tel"
              value={form.client_phone}
              onChange={(e) => setForm({ ...form, client_phone: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#6B7280" }}>
              Address
            </label>
            <input
              type="text"
              value={form.client_address}
              onChange={(e) => setForm({ ...form, client_address: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
              style={inputStyle}
            />
          </div>
        </div>
      </div>

      {/* Line items */}
      <div className="rounded-xl p-5 mb-5" style={{ backgroundColor: "#161B22", border: "1px solid #30363D" }}>
        <p className="text-sm font-semibold text-white mb-4">Line Items</p>
        <div className="flex flex-col gap-2">
          {/* Header */}
          <div className="grid grid-cols-[1fr_80px_100px_80px_32px] gap-2 text-xs font-medium" style={{ color: "#6B7280" }}>
            <span>Item</span>
            <span className="text-center">Qty</span>
            <span className="text-right">Price</span>
            <span className="text-right">Total</span>
            <span />
          </div>

          {items.map((item, idx) => {
            const isCustom = customMode[idx] ?? false;
            return (
            <div key={idx} className="grid grid-cols-[1fr_80px_100px_80px_32px] gap-2 items-center">
              {isCustom ? (
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setCustomMode((prev) => ({ ...prev, [idx]: false }));
                      selectPreset(idx, PRICE_OPTIONS[0].label);
                    }}
                    className="px-2 py-2 rounded-lg text-xs shrink-0 transition-colors hover:bg-white/10"
                    style={{ ...inputStyle, color: "#D4A017" }}
                    title="Switch back to preset"
                  >
                    ←
                  </button>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateItem(idx, "description", e.target.value)}
                    placeholder="Custom item name"
                    autoFocus
                    className="flex-1 min-w-0 px-3 py-2 rounded-lg text-sm text-white placeholder-[#6B7280] outline-none"
                    style={inputStyle}
                  />
                </div>
              ) : (
                <select
                  value={item.description}
                  onChange={(e) => {
                    if (e.target.value === "__custom") {
                      setCustomMode((prev) => ({ ...prev, [idx]: true }));
                      updateItem(idx, "description", "");
                    } else {
                      selectPreset(idx, e.target.value);
                    }
                  }}
                  className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
                  style={inputStyle}
                >
                  {PRICE_OPTIONS.map((p) => (
                    <option key={p.label} value={p.label}>{p.label}</option>
                  ))}
                  <option value="__custom">Custom...</option>
                </select>
              )}
              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => updateItem(idx, "quantity", Math.max(1, parseInt(e.target.value) || 1))}
                className="px-2 py-2 rounded-lg text-sm text-white text-center outline-none"
                style={inputStyle}
              />
              <input
                type="text"
                value={(item.unit_price / 100).toFixed(2)}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val)) updateItem(idx, "unit_price", Math.round(val * 100));
                }}
                className="px-2 py-2 rounded-lg text-sm text-white text-right outline-none"
                style={inputStyle}
              />
              <span className="text-sm text-white text-right font-medium">
                {formatCAD(item.quantity * item.unit_price)}
              </span>
              <button
                onClick={() => removeItem(idx)}
                disabled={items.length === 1}
                className="p-1.5 rounded-lg transition-colors hover:bg-red-500/20 disabled:opacity-30"
                style={{ color: "#EF4444" }}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          );})}
        </div>

        <button
          onClick={addItem}
          className="mt-3 flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-white"
          style={{ color: "#D4A017" }}
        >
          <Plus className="w-3.5 h-3.5" />
          Add item
        </button>

        <div className="mt-4 pt-4 flex justify-end" style={{ borderTop: "1px solid #30363D" }}>
          <div className="text-right">
            <span className="text-sm" style={{ color: "#6B7280" }}>Total: </span>
            <span className="text-lg font-bold text-white">{formatCAD(subtotal)}</span>
          </div>
        </div>
      </div>

      {/* Dates + notes */}
      <div className="rounded-xl p-5 mb-5" style={{ backgroundColor: "#161B22", border: "1px solid #30363D" }}>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#6B7280" }}>
              Work Completed
            </label>
            <input
              type="date"
              value={form.work_completed_date}
              onChange={(e) => setForm({ ...form, work_completed_date: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-xs font-medium mb-1.5 cursor-pointer" style={{ color: "#6B7280" }}>
              <input
                type="checkbox"
                checked={includeDueDate}
                onChange={(e) => setIncludeDueDate(e.target.checked)}
                className="w-3.5 h-3.5 accent-[#D4A017] cursor-pointer"
                style={{ accentColor: "#D4A017" }}
              />
              Due Date
            </label>
            {includeDueDate && (
              <input
                type="date"
                value={form.due_date}
                onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
                style={inputStyle}
              />
            )}
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1.5" style={{ color: "#6B7280" }}>
            Notes
          </label>
          <input
            type="text"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="e.g. Monthly restaurant service"
            className="w-full px-3 py-2 rounded-lg text-sm text-white placeholder-[#6B7280] outline-none"
            style={inputStyle}
          />
        </div>
      </div>

      {error && (
        <p className="text-sm rounded-lg px-3 py-2.5 mb-4" style={{ backgroundColor: "#2D1B1B", color: "#F87171", border: "1px solid #7F1D1D" }}>
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => setShowPreview(true)}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:bg-white/10 flex items-center gap-2"
          style={{ border: "1px solid #30363D", color: "#FFFFFF" }}
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>
        <button
          onClick={() => handleSave("draft")}
          disabled={saving}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:bg-white/10 disabled:opacity-50 flex items-center gap-2"
          style={{ border: "1px solid #30363D", color: "#FFFFFF" }}
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Save as Draft
        </button>
        <button
          onClick={() => handleSave("paid")}
          disabled={saving}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:bg-white/10 disabled:opacity-50 flex items-center gap-2"
          style={{ border: "1px solid #22C55E", color: "#22C55E" }}
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Mark as Paid
        </button>
        <button
          onClick={() => handleSave("send")}
          disabled={saving}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-50 flex items-center gap-2"
          style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Save & Send
        </button>
      </div>

      {/* Preview modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.8)" }}>
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl" style={{ backgroundColor: "#0D1117" }}>
            <button
              onClick={() => setShowPreview(false)}
              className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/10 z-10"
              style={{ color: "#6B7280" }}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6">
              {/* Header */}
              <div className="flex flex-col items-center mb-6">
                <img src="/logo-icon-512.png" alt="Cove Cutlery" width={40} height={40} className="rounded-lg mb-2" />
                <p className="text-xl font-bold tracking-wide" style={{ color: "#D4A017" }}>COVE CUTLERY</p>
                <p className="text-sm mt-1" style={{ color: "#6B7280" }}>Mobile Knife Sharpening</p>
              </div>

              {/* Invoice card */}
              <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #30363D" }}>
                <div className="px-6 py-5" style={{ backgroundColor: "#161B22" }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white font-bold">Invoice #PREVIEW</p>
                      <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
                        Issued {new Date().toLocaleDateString("en-CA")}
                      </p>
                      {form.work_completed_date && (
                        <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
                          Work completed {form.work_completed_date}
                        </p>
                      )}
                    </div>
                    {includeDueDate && form.due_date && (
                      <div className="text-right">
                        <p className="text-xs" style={{ color: "#6B7280" }}>Due</p>
                        <p className="text-sm font-medium text-white">{form.due_date}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 py-5" style={{ backgroundColor: "#0D1117" }}>
                  <p className="text-xs font-medium mb-1" style={{ color: "#6B7280" }}>Bill To</p>
                  <p className="text-white font-medium mb-5">{form.client_name || "—"}</p>

                  <table className="w-full text-sm mb-4">
                    <thead>
                      <tr style={{ borderBottom: "1px solid #30363D" }}>
                        <th className="text-left py-2 font-medium" style={{ color: "#6B7280" }}>Item</th>
                        <th className="text-center py-2 font-medium" style={{ color: "#6B7280" }}>Qty</th>
                        <th className="text-right py-2 font-medium" style={{ color: "#6B7280" }}>Price</th>
                        <th className="text-right py-2 font-medium" style={{ color: "#6B7280" }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid #30363D22" }}>
                          <td className="py-2.5 text-white">{item.description || "—"}</td>
                          <td className="py-2.5 text-center" style={{ color: "#6B7280" }}>{item.quantity}</td>
                          <td className="py-2.5 text-right" style={{ color: "#6B7280" }}>{formatCAD(item.unit_price)}</td>
                          <td className="py-2.5 text-right text-white">{formatCAD(item.quantity * item.unit_price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="flex justify-between items-center pt-3 mb-5" style={{ borderTop: "2px solid #30363D" }}>
                    <span className="font-bold text-white">Total</span>
                    <span className="text-xl font-bold" style={{ color: "#D4A017" }}>{formatCAD(subtotal)}</span>
                  </div>

                  {form.notes && (
                    <div className="p-3 rounded-lg mb-5" style={{ backgroundColor: "#161B22" }}>
                      <p className="text-xs" style={{ color: "#6B7280" }}>Note: {form.notes}</p>
                    </div>
                  )}

                  {/* Payment buttons (non-functional preview) */}
                  <div className="flex flex-col gap-3">
                    <button
                      disabled
                      className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 opacity-75"
                      style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
                    >
                      <CreditCard className="w-4 h-4" />
                      Pay {formatCAD(subtotal)} with Card
                    </button>
                    <button
                      disabled
                      className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 opacity-75"
                      style={{ border: "1px solid #30363D", color: "#FFFFFF" }}
                    >
                      <ArrowRight className="w-4 h-4" />
                      Pay via Interac e-Transfer
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-6">
                <p className="text-xs" style={{ color: "#6B7280" }}>
                  Cove Cutlery · covecutlery.ca · 604-373-1500
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
