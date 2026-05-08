"use client";

import { useState, useEffect } from "react";

interface CourseOption {
  id: string;
  title: string;
}

interface Invite {
  id: string;
  email: string;
  status: string;
  created_at: string;
  accepted_at: string | null;
  courses: { title: string } | null;
}

export function TrainingInviteForm({ courses }: { courses: CourseOption[] }) {
  const [email, setEmail] = useState("");
  const [courseId, setCourseId] = useState(courses[0]?.id ?? "");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [invites, setInvites] = useState<Invite[]>([]);

  async function loadInvites() {
    try {
      const res = await fetch("/api/admin/training/invite");
      if (res.ok) {
        const data = await res.json();
        setInvites(data.invites ?? []);
      }
    } catch {}
  }

  useEffect(() => { loadInvites(); }, []);

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

  return (
    <div className="mb-8 space-y-6">
      {/* Invite form */}
      <div className="rounded-lg border p-6" style={{ borderColor: "#30363D", backgroundColor: "#161B22" }}>
        <h2 className="text-lg font-semibold text-white mb-4">Invite Student</h2>
        <form onSubmit={handleSubmit} className="flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium mb-1.5" style={{ color: "#6B7280" }}>Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@example.com"
              className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none focus:ring-2"
              style={{ backgroundColor: "#0D1117", border: "1px solid #30363D", "--tw-ring-color": "#D4A017" } as React.CSSProperties}
            />
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

      {/* Invite list */}
      {invites.length > 0 && (
        <div className="rounded-lg border overflow-hidden" style={{ borderColor: "#30363D" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: "#161B22" }}>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Course</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Sent</th>
              </tr>
            </thead>
            <tbody>
              {invites.map((inv) => (
                <tr key={inv.id} className="border-t" style={{ borderColor: "#30363D" }}>
                  <td className="px-4 py-3 text-white">{inv.email}</td>
                  <td className="px-4 py-3 text-neutral-400">{(inv.courses as { title: string } | null)?.title ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      inv.status === "accepted"
                        ? "bg-emerald-500/10 text-emerald-400"
                        : inv.status === "expired"
                        ? "bg-red-500/10 text-red-400"
                        : "bg-amber-500/10 text-amber-400"
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-400">
                    {new Date(inv.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
