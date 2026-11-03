"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Hash, CheckCircle, RotateCcw, Trash2, Loader2 } from "lucide-react";
import { formatPhone } from "@/lib/format";

interface Inquiry {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string | null;
  service_type: string | null;
  item_count: string | null;
  message: string | null;
  address: string | null;
  status: string;
}

function typeLabel(t: string | null) {
  if (t === "business-sale") return "Business sale";
  return t || "General";
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("new");
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/inquiries?status=${filter}`)
      .then((r) => r.json())
      .then((data) => { if (!cancelled) setInquiries(Array.isArray(data) ? data : []); })
      .catch(() => { if (!cancelled) setInquiries([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [filter]);

  function changeFilter(f: string) {
    if (f === filter) return;
    setLoading(true);
    setFilter(f);
  }

  async function setStatus(id: string, status: "new" | "handled") {
    setBusyId(id);
    const res = await fetch(`/api/admin/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBusyId(null);
    if (!res.ok) return;
    // Drop it from a filtered view it no longer belongs to
    setInquiries((prev) =>
      filter === "all" ? prev.map((q) => (q.id === id ? { ...q, status } : q)) : prev.filter((q) => q.id !== id)
    );
  }

  async function remove(id: string) {
    if (!confirm("Delete this inquiry? This cannot be undone.")) return;
    setBusyId(id);
    const res = await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
    setBusyId(null);
    if (res.ok) setInquiries((prev) => prev.filter((q) => q.id !== id));
  }

  const filters = ["new", "handled", "all"];

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-bold text-white mb-1">Inquiries</h1>
      <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
        Submissions from the website&rsquo;s contact, event, training and business-for-sale forms.
      </p>

      {/* Status filters */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => changeFilter(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors"
            style={{
              backgroundColor: filter === f ? "#D4A01722" : "#161B22",
              color: filter === f ? "#D4A017" : "#6B7280",
              border: `1px solid ${filter === f ? "#D4A01744" : "#30363D"}`,
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center py-12 text-sm" style={{ color: "#6B7280" }}>Loading...</p>
      ) : inquiries.length === 0 ? (
        <p className="text-center py-12 text-sm" style={{ color: "#6B7280" }}>
          {filter === "new" ? "No new inquiries" : "No inquiries found"}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {inquiries.map((q) => {
            const isSale = q.service_type === "business-sale";
            const busy = busyId === q.id;
            return (
              <div
                key={q.id}
                className="rounded-xl p-5"
                style={{
                  backgroundColor: "#161B22",
                  border: `1px solid ${isSale ? "#D4A01755" : "#30363D"}`,
                  opacity: q.status === "handled" && filter === "all" ? 0.6 : 1,
                }}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white font-semibold">{q.name}</p>
                      <span
                        className="px-2 py-0.5 rounded-full text-[11px] font-medium"
                        style={isSale
                          ? { backgroundColor: "#D4A01722", color: "#D4A017" }
                          : { backgroundColor: "#30363D", color: "#9CA3AF" }}
                      >
                        {typeLabel(q.service_type)}
                      </span>
                      {q.status === "handled" && (
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ backgroundColor: "#22C55E22", color: "#22C55E" }}>
                          Handled
                        </span>
                      )}
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: "#6B7280" }}>
                      {new Date(q.created_at).toLocaleString("en-CA", {
                        weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
                        timeZone: "America/Vancouver",
                      })}
                    </p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    {busy ? (
                      <Loader2 className="w-4 h-4 animate-spin m-1.5" style={{ color: "#6B7280" }} />
                    ) : (
                      <>
                        <button
                          onClick={() => setStatus(q.id, q.status === "handled" ? "new" : "handled")}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors hover:brightness-110"
                          style={q.status === "handled"
                            ? { color: "#6B7280", border: "1px solid #30363D" }
                            : { backgroundColor: "#22C55E22", color: "#22C55E", border: "1px solid #22C55E44" }}
                        >
                          {q.status === "handled"
                            ? <><RotateCcw className="w-3 h-3" /> Reopen</>
                            : <><CheckCircle className="w-3 h-3" /> Mark handled</>}
                        </button>
                        <button
                          onClick={() => remove(q.id)}
                          aria-label="Delete"
                          className="p-1.5 rounded-lg transition-colors hover:bg-red-500/20"
                          style={{ color: "#EF4444" }}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm mb-3">
                  <a href={`mailto:${q.email}`} className="inline-flex items-center gap-1.5 hover:underline" style={{ color: "#1E90FF" }}>
                    <Mail className="w-3.5 h-3.5" /> {q.email}
                  </a>
                  {q.phone && (
                    <a href={`tel:${q.phone}`} className="inline-flex items-center gap-1.5 hover:underline" style={{ color: "#1E90FF" }}>
                      <Phone className="w-3.5 h-3.5" /> {formatPhone(q.phone)}
                    </a>
                  )}
                  {q.address && (
                    <span className="inline-flex items-center gap-1.5" style={{ color: "#9CA3AF" }}>
                      <MapPin className="w-3.5 h-3.5" /> {q.address}
                    </span>
                  )}
                  {q.item_count && (
                    <span className="inline-flex items-center gap-1.5" style={{ color: "#9CA3AF" }}>
                      <Hash className="w-3.5 h-3.5" /> {q.item_count} knives
                    </span>
                  )}
                </div>

                {q.message && (
                  <p className="text-sm whitespace-pre-wrap rounded-lg p-3" style={{ backgroundColor: "#0D1117", color: "#D1D5DB" }}>
                    {q.message}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
