"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { formatPhone } from "@/lib/format";

interface Customer {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  source: string;
  created_at: string;
}

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "", notes: "" });

  useEffect(() => {
    fetch(`/api/admin/customers/${id}`)
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data) {
          setCustomer(data);
          setForm({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            address: data.address || "",
            notes: data.notes || "",
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  async function handleSave() {
    setSaving(true);
    setSaveMsg("");
    const res = await fetch(`/api/admin/customers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (res.ok) {
      const updated = await res.json();
      setSaveMsg("Saved");
      setCustomer(updated);
    } else {
      const data = await res.json();
      setSaveMsg(data.error || "Failed to save");
    }
  }

  async function handleDelete() {
    if (!confirm(`Delete ${customer?.name}? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/customers/${id}`, { method: "DELETE" });
    if (res.ok) router.push("/admin/customers");
  }

  const inputStyle = { backgroundColor: "#0D1117", border: "1px solid #30363D" };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#6B7280" }} />
      </div>
    );
  }

  if (!customer) {
    return (
      <div>
        <p className="text-sm" style={{ color: "#6B7280" }}>Customer not found.</p>
        <a href="/admin/customers" className="text-sm" style={{ color: "#D4A017" }}>Back to customers</a>
      </div>
    );
  }

  return (
    <div>
      <a
        href="/admin/customers"
        className="text-xs mb-3 inline-flex items-center gap-1"
        style={{ color: "#6B7280" }}
      >
        <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Customers
      </a>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{customer.name}</h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            {customer.email || formatPhone(customer.phone)}
            {" "}
            <span className="px-2 py-0.5 rounded text-xs ml-2" style={{
              backgroundColor: customer.source === "cal.com" ? "#1E3A5F" : customer.source === "invoice" ? "#3B2F1A" : customer.source === "imported" ? "#2D2340" : "#1A2E1A",
              color: customer.source === "cal.com" ? "#60A5FA" : customer.source === "invoice" ? "#D4A017" : customer.source === "imported" ? "#A78BFA" : "#4ADE80",
            }}>
              {customer.source}
            </span>
          </p>
        </div>
        <button
          onClick={handleDelete}
          className="px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors hover:bg-red-500/20"
          style={{ border: "1px solid #7F1D1D", color: "#EF4444" }}
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>

      <div
        className="rounded-xl p-6 max-w-lg"
        style={{ backgroundColor: "#161B22", border: "1px solid #30363D" }}
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#6B7280" }}>Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#6B7280" }}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#6B7280" }}>Phone</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#6B7280" }}>Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
              style={inputStyle}
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#6B7280" }}>Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none resize-none"
              style={inputStyle}
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-50 flex items-center gap-2"
              style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Save Changes
            </button>
            {saveMsg && (
              <span className="text-sm" style={{ color: saveMsg === "Saved" ? "#3FB950" : "#FF6B6B" }}>
                {saveMsg}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
