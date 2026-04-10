"use client";

import { useState, useEffect, useMemo } from "react";
import { formatPhone } from "@/lib/format";

interface Customer {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  source: string | null;
}

interface Recipient {
  id: string;
  name: string;
  phone: string;
}

interface Campaign {
  id: string;
  message: string;
  recipient_count: number;
  sent_count: number;
  failed_count: number;
  status: string;
  recipients: Recipient[];
  created_at: string;
  sent_at: string | null;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  draft: { bg: "#30363D", text: "#6B7280" },
  sending: { bg: "#1E90FF22", text: "#1E90FF" },
  completed: { bg: "#22C55E22", text: "#22C55E" },
  failed: { bg: "#EF444422", text: "#EF4444" },
};

const inputStyle = {
  backgroundColor: "#161B22",
  border: "1px solid #30363D",
  color: "#E6EDF3",
};

export default function CampaignsPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [message, setMessage] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("has_phone");
  const [showPreview, setShowPreview] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [expandedCampaign, setExpandedCampaign] = useState<string | null>(null);
  const [manualNumbers, setManualNumbers] = useState<string[]>([]);
  const [manualInput, setManualInput] = useState("");

  // Load customers and campaigns
  useEffect(() => {
    Promise.all([
      fetch("/api/admin/customers").then((r) => r.json()),
      fetch("/api/admin/campaigns").then((r) => r.json()),
    ])
      .then(([custs, camps]) => {
        setCustomers(Array.isArray(custs) ? custs : []);
        setCampaigns(Array.isArray(camps) ? camps : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Filter customers to only those with phone numbers, then by search + source
  const filteredCustomers = useMemo(() => {
    let list = customers.filter((c) => c.phone);

    if (sourceFilter !== "all" && sourceFilter !== "has_phone") {
      list = list.filter((c) => c.source === sourceFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.name?.toLowerCase().includes(q) ||
          c.phone?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [customers, search, sourceFilter]);

  const sources = useMemo(() => {
    const s = new Set<string>();
    customers.forEach((c) => {
      if (c.source) s.add(c.source);
    });
    return Array.from(s).sort();
  }, [customers]);

  function toggleCustomer(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAllFiltered() {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      filteredCustomers.forEach((c) => next.add(c.id));
      return next;
    });
  }

  function deselectAll() {
    setSelectedIds(new Set());
  }

  const selectedCustomers = customers.filter((c) => selectedIds.has(c.id));
  const totalRecipients = selectedIds.size + manualNumbers.length;

  function addManualNumber() {
    const num = manualInput.trim();
    if (!num) return;
    const digits = num.replace(/\D/g, "");
    const normalized = digits.length === 10 ? "+1" + digits : digits.length === 11 && digits.startsWith("1") ? "+" + digits : num.startsWith("+") ? num.replace(/[^+\d]/g, "") : num;
    if (!manualNumbers.includes(normalized)) {
      setManualNumbers([...manualNumbers, normalized]);
    }
    setManualInput("");
  }

  async function handleSend() {
    setShowConfirm(false);
    setSending(true);
    try {
      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          recipientIds: Array.from(selectedIds),
          manualNumbers,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to send campaign");
        return;
      }
      // Add to history and reset
      setCampaigns((prev) => [data, ...prev]);
      setMessage("");
      setSelectedIds(new Set());
      setManualNumbers([]);
    } catch {
      alert("Failed to send campaign");
    } finally {
      setSending(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this campaign?")) return;
    await fetch(`/api/admin/campaigns/${id}`, { method: "DELETE" });
    setCampaigns((prev) => prev.filter((c) => c.id !== id));
  }

  const canSend = message.trim().length > 0 && totalRecipients > 0 && !sending;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20" style={{ color: "#6B7280" }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-0">
      <h1 className="text-xl font-bold text-white mb-6">SMS Campaigns</h1>

      {/* Compose Section */}
      <div
        className="rounded-xl p-5 mb-6"
        style={{ backgroundColor: "#161B22", border: "1px solid #30363D" }}
      >
        <h2 className="text-sm font-semibold text-white mb-3">Compose Message</h2>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your SMS message..."
          rows={4}
          className="w-full rounded-lg px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#D4A017]"
          style={inputStyle}
        />
        <div className="flex justify-end mt-1">
          <span className="text-xs" style={{ color: message.length > 160 ? "#EF4444" : "#6B7280" }}>
            {message.length}/160
          </span>
        </div>

        {/* Recipient Selector */}
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-white mb-2">Recipients</h3>

          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customers..."
            className="w-full rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-1 focus:ring-[#D4A017]"
            style={inputStyle}
          />

          {/* Filter chips */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {[
              { key: "has_phone", label: "Has Phone" },
              { key: "all", label: "All" },
              ...sources.map((s) => ({ key: s, label: s })),
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSourceFilter(key)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors"
                style={{
                  backgroundColor: sourceFilter === key ? "#D4A01722" : "#0D1117",
                  color: sourceFilter === key ? "#D4A017" : "#6B7280",
                  border: `1px solid ${sourceFilter === key ? "#D4A01744" : "#30363D"}`,
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Select/Deselect buttons */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={selectAllFiltered}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={{ backgroundColor: "#0D1117", color: "#D4A017", border: "1px solid #30363D" }}
            >
              Select All ({filteredCustomers.length})
            </button>
            <button
              onClick={deselectAll}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
              style={{ backgroundColor: "#0D1117", color: "#6B7280", border: "1px solid #30363D" }}
            >
              Deselect All
            </button>
          </div>

          {/* Customer list */}
          <div
            className="rounded-lg overflow-y-auto max-h-64"
            style={{ border: "1px solid #30363D" }}
          >
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-6 text-sm" style={{ color: "#6B7280" }}>
                No customers with phone numbers found
              </div>
            ) : (
              filteredCustomers.map((c) => (
                <label
                  key={c.id}
                  className="flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors hover:bg-white/5"
                  style={{ borderBottom: "1px solid #30363D" }}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(c.id)}
                    onChange={() => toggleCustomer(c.id)}
                    className="accent-[#D4A017] w-4 h-4 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-sm text-white block truncate">{c.name}</span>
                    <span className="text-xs block" style={{ color: "#6B7280" }}>
                      {formatPhone(c.phone)}
                      {c.source ? ` \u00b7 ${c.source}` : ""}
                    </span>
                  </div>
                </label>
              ))
            )}
          </div>

          {/* Manual number input */}
          <div className="mt-3 pt-3" style={{ borderTop: "1px solid #30363D" }}>
            <p className="text-xs font-medium mb-1.5" style={{ color: "#6B7280" }}>Add manual number</p>
            <div className="flex gap-2">
              <input
                type="tel"
                value={manualInput}
                onChange={(e) => setManualInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addManualNumber(); } }}
                placeholder="604-555-1234"
                className="flex-1 px-3 py-1.5 rounded-lg text-sm text-white outline-none placeholder-[#6B7280]"
                style={inputStyle}
              />
              <button
                onClick={addManualNumber}
                disabled={!manualInput.trim()}
                className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:brightness-110 disabled:opacity-30"
                style={{ backgroundColor: "#D4A01722", color: "#D4A017", border: "1px solid #D4A01744" }}
              >
                Add
              </button>
            </div>
            {manualNumbers.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {manualNumbers.map((num) => (
                  <span
                    key={num}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs"
                    style={{ backgroundColor: "#30363D", color: "#E6EDF3" }}
                  >
                    {num}
                    <button
                      onClick={() => setManualNumbers(manualNumbers.filter((n) => n !== num))}
                      className="hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-2 text-xs font-medium" style={{ color: "#D4A017" }}>
            {totalRecipients} recipient{totalRecipients !== 1 ? "s" : ""} selected
            {manualNumbers.length > 0 && ` (${selectedIds.size} customers + ${manualNumbers.length} manual)`}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mt-5">
          <button
            onClick={() => setShowPreview(true)}
            disabled={!canSend}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-40"
            style={{ backgroundColor: "#0D1117", color: "#E6EDF3", border: "1px solid #30363D" }}
          >
            Preview
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={!canSend}
            className="px-5 py-2 rounded-lg text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-40"
            style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
          >
            {sending ? "Sending..." : "Send Campaign"}
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowPreview(false)} />
          <div
            className="relative rounded-xl p-5 w-full max-w-md max-h-[80vh] overflow-y-auto"
            style={{ backgroundColor: "#161B22", border: "1px solid #30363D" }}
          >
            <h3 className="text-sm font-semibold text-white mb-3">Campaign Preview</h3>
            <div
              className="rounded-lg p-3 mb-4 text-sm whitespace-pre-wrap"
              style={{ backgroundColor: "#0D1117", color: "#E6EDF3", border: "1px solid #30363D" }}
            >
              {message}
            </div>
            <h4 className="text-xs font-semibold mb-2" style={{ color: "#6B7280" }}>
              Recipients ({selectedCustomers.length})
            </h4>
            <div className="space-y-1 mb-4">
              {selectedCustomers.map((c) => (
                <div key={c.id} className="text-xs text-white">
                  {c.name}
                  <span style={{ color: "#6B7280" }}> {formatPhone(c.phone)}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowPreview(false)}
              className="w-full py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ backgroundColor: "#0D1117", color: "#E6EDF3", border: "1px solid #30363D" }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowConfirm(false)} />
          <div
            className="relative rounded-xl p-5 w-full max-w-sm"
            style={{ backgroundColor: "#161B22", border: "1px solid #30363D" }}
          >
            <h3 className="text-sm font-semibold text-white mb-3">Confirm Send</h3>
            <p className="text-sm mb-4" style={{ color: "#6B7280" }}>
              Send this SMS to <strong className="text-white">{totalRecipients}</strong> recipient
              {totalRecipients !== 1 ? "s" : ""}?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{ backgroundColor: "#0D1117", color: "#E6EDF3", border: "1px solid #30363D" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSend}
                className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all hover:brightness-110"
                style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
              >
                Send Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Campaign History */}
      <div>
        <h2 className="text-sm font-semibold text-white mb-3">Campaign History</h2>
        {campaigns.length === 0 ? (
          <div
            className="rounded-xl p-8 text-center text-sm"
            style={{ backgroundColor: "#161B22", border: "1px solid #30363D", color: "#6B7280" }}
          >
            No campaigns sent yet
          </div>
        ) : (
          <div className="space-y-2">
            {campaigns.map((camp) => {
              const colors = STATUS_COLORS[camp.status] ?? STATUS_COLORS.draft;
              const expanded = expandedCampaign === camp.id;
              return (
                <div
                  key={camp.id}
                  className="rounded-xl overflow-hidden"
                  style={{ backgroundColor: "#161B22", border: "1px solid #30363D" }}
                >
                  <button
                    onClick={() => setExpandedCampaign(expanded ? null : camp.id)}
                    className="w-full text-left px-4 py-3 flex items-center gap-3 transition-colors hover:bg-white/5"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs" style={{ color: "#6B7280" }}>
                          {new Date(camp.created_at).toLocaleDateString("en-CA")}{" "}
                          {new Date(camp.created_at).toLocaleTimeString("en-CA", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize"
                          style={{ backgroundColor: colors.bg, color: colors.text }}
                        >
                          {camp.status}
                        </span>
                      </div>
                      <p className="text-sm text-white truncate">{camp.message}</p>
                      <div className="flex gap-3 mt-1 text-xs" style={{ color: "#6B7280" }}>
                        <span>{camp.recipient_count} recipients</span>
                        <span>{camp.sent_count} sent</span>
                        {camp.failed_count > 0 && (
                          <span style={{ color: "#EF4444" }}>{camp.failed_count} failed</span>
                        )}
                      </div>
                    </div>
                    <svg
                      width="16"
                      height="16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      viewBox="0 0 24 24"
                      className="shrink-0 transition-transform"
                      style={{
                        color: "#6B7280",
                        transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {expanded && (
                    <div className="px-4 pb-4" style={{ borderTop: "1px solid #30363D" }}>
                      <div className="pt-3">
                        <h4 className="text-xs font-semibold mb-1" style={{ color: "#6B7280" }}>
                          Full Message
                        </h4>
                        <div
                          className="rounded-lg p-3 text-sm whitespace-pre-wrap mb-3"
                          style={{ backgroundColor: "#0D1117", color: "#E6EDF3", border: "1px solid #30363D" }}
                        >
                          {camp.message}
                        </div>
                        <h4 className="text-xs font-semibold mb-1" style={{ color: "#6B7280" }}>
                          Recipients ({camp.recipient_count})
                        </h4>
                        <div className="space-y-0.5 mb-3">
                          {(camp.recipients || []).map((r: Recipient) => (
                            <div key={r.id} className="text-xs text-white">
                              {r.name}
                              <span style={{ color: "#6B7280" }}> {r.phone}</span>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(camp.id);
                          }}
                          className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                          style={{ color: "#EF4444", border: "1px solid #30363D" }}
                        >
                          Delete Campaign
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
