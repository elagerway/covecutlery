"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2 } from "lucide-react";
import { formatPhone } from "@/lib/format";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  source: string;
  created_at: string;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function AdminCustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [search, setSearch] = useState("");

  async function loadCustomers() {
    const res = await fetch("/api/admin/customers");
    if (res.ok) {
      const data = await res.json();
      setCustomers(data);
    }
    setLoading(false);
  }

  useEffect(() => { loadCustomers(); }, []);

  async function handleAdd() {
    if (!form.name || !form.email) {
      setError("Name and email are required.");
      return;
    }
    setSaving(true);
    setError(null);
    const res = await fetch("/api/admin/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to add customer");
      setSaving(false);
      return;
    }
    setForm({ name: "", email: "", phone: "", address: "" });
    setShowAdd(false);
    setSaving(false);
    loadCustomers();
  }

  const filtered = search.trim()
    ? customers.filter((c) => {
        const q = search.toLowerCase();
        return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.phone && c.phone.includes(q));
      })
    : customers;

  const inputStyle = { backgroundColor: "#161B22", border: "1px solid #30363D" };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            {customers.length} customers
          </p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all hover:brightness-110"
          style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      {showAdd && (
        <div className="rounded-xl p-5 mb-5" style={{ backgroundColor: "#161B22", border: "1px solid #30363D" }}>
          <p className="text-sm font-semibold text-white mb-4">New Customer</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#6B7280" }}>
                Name <span style={{ color: "#D4A017" }}>*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
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
          </div>
          {error && (
            <p className="text-sm mt-3 rounded-lg px-3 py-2" style={{ backgroundColor: "#2D1B1B", color: "#F87171", border: "1px solid #7F1D1D" }}>
              {error}
            </p>
          )}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleAdd}
              disabled={saving}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-50 flex items-center gap-2"
              style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Save
            </button>
            <button
              onClick={() => { setShowAdd(false); setError(null); }}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors hover:bg-white/10"
              style={{ border: "1px solid #30363D", color: "#FFFFFF" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers..."
          className="w-full max-w-sm px-3 py-2 rounded-lg text-sm text-white placeholder-[#6B7280] outline-none"
          style={inputStyle}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: "#6B7280" }} />
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="rounded-lg border p-8 text-center"
          style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
        >
          <p style={{ color: "#6B7280" }}>{search ? "No matching customers." : "No customers yet."}</p>
        </div>
      ) : (
        <div className="rounded-lg border overflow-hidden" style={{ borderColor: "#30363D" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#161B22", borderBottom: "1px solid #30363D" }}>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Name</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Email</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Phone</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Address</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Source</th>
                <th className="text-left px-4 py-3 font-medium" style={{ color: "#6B7280" }}>Added</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr
                  key={c.id}
                  onClick={() => router.push(`/admin/customers/${c.id}`)}
                  className="cursor-pointer hover:brightness-125 transition-all"
                  style={{
                    backgroundColor: i % 2 === 0 ? "#0D1117" : "#161B22",
                    borderBottom: "1px solid #30363D",
                  }}
                >
                  <td className="px-4 py-3 font-medium text-white">{c.name}</td>
                  <td className="px-4 py-3" style={{ color: "#6B7280" }}>{c.email || "—"}</td>
                  <td className="px-4 py-3" style={{ color: "#6B7280" }}>{formatPhone(c.phone)}</td>
                  <td className="px-4 py-3 max-w-[200px] truncate" style={{ color: "#6B7280" }}>{c.address || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded text-xs" style={{
                      backgroundColor: c.source === "cal.com" ? "#1E3A5F" : c.source === "invoice" ? "#3B2F1A" : c.source === "imported" ? "#2D2340" : "#1A2E1A",
                      color: c.source === "cal.com" ? "#60A5FA" : c.source === "invoice" ? "#D4A017" : c.source === "imported" ? "#A78BFA" : "#4ADE80",
                    }}>
                      {c.source}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: "#6B7280" }}>{formatDate(c.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
