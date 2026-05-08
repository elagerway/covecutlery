"use client";

import { useState, useEffect, useRef } from "react";

interface CourseOption {
  id: string;
  title: string;
}

interface Invite {
  id: string;
  email: string;
  expires_at: string;
  created_at: string;
  courses: { title: string } | null;
}

interface Customer {
  id: string;
  name: string;
  email: string | null;
}

export function TrainingInviteForm({ courses }: { courses: CourseOption[] }) {
  const [email, setEmail] = useState("");
  const [courseId, setCourseId] = useState(courses[0]?.id ?? "");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  async function loadInvites() {
    try {
      const res = await fetch("/api/admin/training/invite");
      if (res.ok) {
        const data = await res.json();
        setInvites(data.invites ?? []);
      }
    } catch {}
  }

  async function loadCustomers() {
    try {
      const res = await fetch("/api/admin/customers");
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.filter((c: Customer) => c.email));
      }
    } catch {}
  }

  useEffect(() => {
    loadInvites();
    loadCustomers();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const suggestions = email.trim().length > 0
    ? customers.filter((c) => {
        const q = email.toLowerCase();
        return (c.name.toLowerCase().includes(q) || (c.email && c.email.toLowerCase().includes(q)));
      }).slice(0, 8)
    : [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSending(true);

    try {
      const res = await fetch("/api/admin/training/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), courseId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send invite");
        return;
      }

      if (data.warning) {
        setSuccess(`Invite created. Note: ${data.warning}`);
      } else {
        setSuccess(`Invite sent to ${email}`);
      }

      setEmail("");
      loadInvites();
    } catch {
      setError("Failed to send invite");
    } finally {
      setSending(false);
    }
  }

  async function handleCancel(inviteId: string) {
    if (!confirm("Cancel this invite? The recipient will no longer be able to sign up with this link.")) return;
    setError(null);
    try {
      const res = await fetch(`/api/admin/training/invite?id=${encodeURIComponent(inviteId)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        loadInvites();
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Failed to cancel invite");
      }
    } catch {
      setError("Failed to cancel invite");
    }
  }

  function selectCustomer(c: Customer) {
    setEmail(c.email!);
    setShowSuggestions(false);
  }

  return (
    <div className="mb-8 space-y-6">
      <div className="rounded-lg border p-6" style={{ borderColor: "#30363D", backgroundColor: "#161B22" }}>
        <h2 className="text-lg font-semibold text-white mb-4">Invite Student</h2>
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          <div className="flex-1 relative" ref={wrapperRef}>
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#6B7280" }}>Email address or customer name</label>
            <input
              type="text"
              required
              value={email}
              onChange={(e) => { setEmail(e.target.value); setShowSuggestions(true); }}
              onFocus={() => { if (email.trim()) setShowSuggestions(true); }}
              placeholder="Type a name or email..."
              autoComplete="off"
              className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none focus:ring-2"
              style={{ backgroundColor: "#0D1117", border: "1px solid #30363D", "--tw-ring-color": "#D4A017" } as React.CSSProperties}
            />
            {showSuggestions && suggestions.length > 0 && (
              <div
                className="absolute z-10 mt-1 w-full rounded-lg border overflow-hidden shadow-xl"
                style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
              >
                {suggestions.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => selectCustomer(c)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-white/[0.06] transition-colors flex items-center justify-between"
                  >
                    <span className="text-white">{c.name}</span>
                    <span className="text-neutral-500 text-xs">{c.email}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {courses.length > 1 && (
            <div className="w-48">
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#6B7280" }}>Course</label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
                style={{ backgroundColor: "#0D1117", border: "1px solid #30363D" }}
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
          )}
          <button
            type="submit"
            disabled={sending}
            className="px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-200 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
          >
            {sending ? "Sending..." : "Send Invite"}
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
        {success && <p className="mt-3 text-sm text-emerald-400">{success}</p>}
      </div>

      {invites.length > 0 && (
        <div className="rounded-lg border overflow-hidden" style={{ borderColor: "#30363D" }}>
          <p className="text-xs px-4 py-2 text-neutral-500 border-b" style={{ borderColor: "#30363D", backgroundColor: "#0D1117" }}>
            Pending invites — accepted invites are removed automatically once the student signs up.
          </p>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#161B22" }}>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Course</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Sent</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Expires</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {invites.map((inv) => {
                const expired = new Date(inv.expires_at) < new Date();
                return (
                  <tr key={inv.id} className="border-t" style={{ borderColor: "#30363D" }}>
                    <td className="px-4 py-3 text-white">{inv.email}</td>
                    <td className="px-4 py-3 text-neutral-400">{(inv.courses as { title: string } | null)?.title ?? "—"}</td>
                    <td className="px-4 py-3 text-neutral-400">{new Date(inv.created_at).toLocaleDateString()}</td>
                    <td className={`px-4 py-3 ${expired ? "text-red-400" : "text-neutral-400"}`}>
                      {expired ? "Expired" : new Date(inv.expires_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleCancel(inv.id)}
                        className="text-xs text-neutral-500 hover:text-red-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
