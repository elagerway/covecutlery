"use client";

import { useEffect, useState } from "react";

interface Certificate {
  id: string;
  short_code: string;
  course_id: string;
  recipient_name: string;
  course_title: string;
  issued_date: string;
  revoked_at: string | null;
  email_sent_at: string | null;
  created_at: string;
  courses: { title: string } | null;
}

interface CourseOption {
  id: string;
  title: string;
}

interface Props {
  userId: string;
  defaultRecipientName: string;
  courses: CourseOption[];
  onChange?: (hasActive: boolean) => void;
}

function todayYmd(): string {
  const now = new Date();
  const tz = new Date(now.getTime() - now.getTimezoneOffset() * 60_000);
  return tz.toISOString().slice(0, 10);
}

export function StudentCertificates({ userId, defaultRecipientName, courses, onChange }: Props) {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [courseId, setCourseId] = useState(courses[0]?.id ?? "");
  const [recipientName, setRecipientName] = useState(defaultRecipientName);
  const [issuedDate, setIssuedDate] = useState(todayYmd());
  const [sendEmail, setSendEmail] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/training/certificates?userId=${encodeURIComponent(userId)}`);
      if (res.ok) {
        const data = await res.json();
        const list: Certificate[] = data.certificates ?? [];
        setCerts(list);
        onChange?.(list.some((c) => !c.revoked_at));
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function handleIssue(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/training/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, courseId, recipientName, issuedDate, sendEmail }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to issue certificate");
      } else {
        setNotice(data.warning || `Certificate issued${sendEmail ? " and emailed" : ""}.`);
        setShowForm(false);
        load();
      }
    } catch {
      setError("Failed to issue certificate");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEmail(id: string) {
    setBusyId(id);
    setError(null);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/training/certificates/${id}/email`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setError(data.error || "Failed to send email");
      else { setNotice("Email sent."); load(); }
    } finally {
      setBusyId(null);
    }
  }

  async function handleRevoke(id: string) {
    if (!confirm("Revoke this certificate? The verification page will mark it invalid.")) return;
    setBusyId(id);
    setError(null);
    setNotice(null);
    try {
      const res = await fetch(`/api/admin/training/certificates/${id}/revoke`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setError(data.error || "Failed to revoke");
      else { setNotice("Certificate revoked."); load(); }
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="rounded-lg border p-6 mb-6" style={{ borderColor: "#30363D", backgroundColor: "#161B22" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Certificates</h3>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:brightness-110"
            style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
          >
            Issue Certificate
          </button>
        )}
      </div>

      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}
      {notice && <p className="mb-3 text-sm text-emerald-400">{notice}</p>}

      {showForm && (
        <form onSubmit={handleIssue} className="rounded-lg border p-4 mb-4 space-y-3" style={{ borderColor: "#30363D", backgroundColor: "#0D1117" }}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5 text-neutral-400">Course</label>
              <select
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
                style={{ backgroundColor: "#161B22", border: "1px solid #30363D" }}
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-neutral-400">Date</label>
              <input
                type="date"
                value={issuedDate}
                onChange={(e) => setIssuedDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
                style={{ backgroundColor: "#161B22", border: "1px solid #30363D" }}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1.5 text-neutral-400">Recipient name</label>
            <input
              type="text"
              required
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm text-white outline-none"
              style={{ backgroundColor: "#161B22", border: "1px solid #30363D" }}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-neutral-300">
            <input type="checkbox" checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} />
            Email a copy to the student
          </label>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting || !courseId}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
            >
              {submitting ? "Issuing..." : "Issue"}
            </button>
            <button
              type="button"
              onClick={async () => {
                const res = await fetch("/api/admin/training/certificates/preview", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ recipientName, issuedDate }),
                });
                if (!res.ok) {
                  setError("Preview failed");
                  return;
                }
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                window.open(url, "_blank", "noopener,noreferrer");
                setTimeout(() => URL.revokeObjectURL(url), 60_000);
              }}
              className="px-4 py-2 rounded-lg text-sm font-semibold border border-neutral-600 text-neutral-200 hover:bg-neutral-800"
            >
              Preview
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-lg text-sm text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-neutral-500">Loading…</p>
      ) : certs.length === 0 ? (
        <p className="text-sm text-neutral-500">No certificates issued.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left px-2 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Code</th>
              <th className="text-left px-2 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Course</th>
              <th className="text-left px-2 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Issued</th>
              <th className="text-left px-2 py-2 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Status</th>
              <th className="px-2 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {certs.map((c) => (
              <tr key={c.id} className="border-t" style={{ borderColor: "#30363D" }}>
                <td className="px-2 py-2 font-mono text-xs text-neutral-300">{c.short_code}</td>
                <td className="px-2 py-2 text-neutral-300">{c.courses?.title ?? c.course_title}</td>
                <td className="px-2 py-2 text-neutral-400">{c.issued_date}</td>
                <td className="px-2 py-2">
                  {c.revoked_at ? (
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-red-500/10 text-red-400">Revoked</span>
                  ) : (
                    <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400">Active</span>
                  )}
                </td>
                <td className="px-2 py-2 text-right whitespace-nowrap">
                  <a
                    href={`/api/certificates/${c.id}/download`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-amber-400 hover:text-amber-300 mr-3"
                  >
                    Download
                  </a>
                  {!c.revoked_at && (
                    <>
                      <button
                        disabled={busyId === c.id}
                        onClick={() => handleEmail(c.id)}
                        className="text-xs font-medium text-emerald-400 hover:text-emerald-300 disabled:opacity-50 mr-3"
                      >
                        Email
                      </button>
                      <button
                        disabled={busyId === c.id}
                        onClick={() => handleRevoke(c.id)}
                        className="text-xs text-neutral-500 hover:text-red-400 disabled:opacity-50"
                      >
                        Revoke
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
