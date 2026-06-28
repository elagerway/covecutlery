"use client";

import { useCallback, useEffect, useState } from "react";

interface Submission {
  id: string;
  user_id: string;
  status: "submitted" | "in_review" | "approved" | "changes_requested";
  student_note: string;
  reviewer_notes: string;
  reviewed_at: string | null;
  submitted_at: string;
  external_url: string | null;
  user_name: string;
  user_email: string;
}

interface Props {
  /** Show one student's submissions. Omit for the pending-review queue. */
  userId?: string;
  /** Heading shown above the list. */
  title?: string;
  onCountChange?: (count: number) => void;
}

const STATUS_BADGE: Record<Submission["status"], { label: string; cls: string }> = {
  submitted: { label: "Awaiting review", cls: "bg-amber-500/10 text-amber-400" },
  in_review: { label: "In review", cls: "bg-amber-500/10 text-amber-400" },
  approved: { label: "Approved", cls: "bg-emerald-500/10 text-emerald-400" },
  changes_requested: { label: "Changes requested", cls: "bg-red-500/10 text-red-400" },
};

function embedSrc(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

export function PracticumSubmissions({ userId, title, onCountChange }: Props) {
  const [subs, setSubs] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [changesFor, setChangesFor] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const qs = userId ? `?userId=${encodeURIComponent(userId)}` : "";
      const res = await fetch(`/api/admin/training/submissions${qs}`);
      if (res.ok) {
        const data = await res.json();
        const list: Submission[] = data.submissions ?? [];
        setSubs(list);
        onCountChange?.(
          userId ? list.length : list.filter((s) => s.status === "submitted" || s.status === "in_review").length
        );
      }
    } finally {
      setLoading(false);
    }
  }, [userId, onCountChange]);

  useEffect(() => {
    load();
  }, [load]);

  async function review(id: string, status: "approved" | "changes_requested", reviewerNotes: string) {
    setBusyId(id);
    setError(null);
    try {
      const res = await fetch("/api/admin/training/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, reviewerNotes }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error || "Failed to save review");
      } else {
        setChangesFor(null);
        setNotes("");
        await load();
      }
    } finally {
      setBusyId(null);
    }
  }

  const heading = title ?? (userId ? "Practicum Video" : "Practicum Video Reviews");

  return (
    <div className="rounded-lg border p-6 mb-6" style={{ borderColor: "#30363D", backgroundColor: "#161B22" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          {heading}
          {!userId && subs.length > 0 && (
            <span className="ml-2 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-semibold text-amber-400">
              {subs.length} pending
            </span>
          )}
        </h3>
      </div>

      {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

      {loading ? (
        <p className="text-sm text-neutral-500">Loading…</p>
      ) : subs.length === 0 ? (
        <p className="text-sm text-neutral-500">
          {userId ? "No video submitted yet." : "No submissions awaiting review. 🎉"}
        </p>
      ) : (
        <div className="space-y-5">
          {subs.map((s) => {
            const badge = STATUS_BADGE[s.status];
            const src = s.external_url ? embedSrc(s.external_url) : null;
            const actionable = s.status === "submitted" || s.status === "in_review";
            return (
              <div key={s.id} className="rounded-lg border p-4" style={{ borderColor: "#30363D", backgroundColor: "#0D1117" }}>
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    {!userId && (
                      <p className="font-medium text-white">
                        {s.user_name || "—"} <span className="text-neutral-500">· {s.user_email}</span>
                      </p>
                    )}
                    <p className="text-xs text-neutral-500">
                      Submitted {new Date(s.submitted_at).toLocaleString()}
                    </p>
                  </div>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${badge.cls}`}>
                    {badge.label}
                  </span>
                </div>

                {src ? (
                  <div className="mb-3 aspect-video overflow-hidden rounded-lg border [&>iframe]:h-full [&>iframe]:w-full" style={{ borderColor: "#30363D" }}>
                    <iframe src={src} className="h-full w-full" allowFullScreen allow="encrypted-media; picture-in-picture" />
                  </div>
                ) : null}

                {s.external_url && (
                  <a href={s.external_url} target="_blank" rel="noopener noreferrer" className="text-sm text-amber-400 hover:underline">
                    Open submitted video ↗
                  </a>
                )}

                {s.student_note && (
                  <p className="mt-3 text-sm text-neutral-300">
                    <span className="text-neutral-500">Student note:</span> {s.student_note}
                  </p>
                )}

                {s.reviewer_notes && !actionable && (
                  <p className="mt-2 text-sm text-neutral-300">
                    <span className="text-neutral-500">Your feedback:</span> {s.reviewer_notes}
                  </p>
                )}

                {actionable && (
                  <div className="mt-4">
                    {changesFor === s.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={3}
                          placeholder="What should the student fix? (sent with the decision)"
                          className="w-full rounded-lg px-3 py-2 text-sm text-white outline-none"
                          style={{ backgroundColor: "#161B22", border: "1px solid #30363D" }}
                        />
                        <div className="flex gap-2">
                          <button
                            disabled={busyId === s.id}
                            onClick={() => review(s.id, "changes_requested", notes)}
                            className="rounded-lg px-4 py-2 text-sm font-semibold text-white transition-all hover:brightness-110 disabled:opacity-50"
                            style={{ backgroundColor: "#dc2626" }}
                          >
                            {busyId === s.id ? "Saving…" : "Send request"}
                          </button>
                          <button
                            onClick={() => { setChangesFor(null); setNotes(""); }}
                            className="rounded-lg px-4 py-2 text-sm text-neutral-400 hover:text-white"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          disabled={busyId === s.id}
                          onClick={() => review(s.id, "approved", "")}
                          className="rounded-lg px-4 py-2 text-sm font-semibold transition-all hover:brightness-110 disabled:opacity-50"
                          style={{ backgroundColor: "#16a34a", color: "#fff" }}
                        >
                          {busyId === s.id ? "Saving…" : "Approve"}
                        </button>
                        <button
                          disabled={busyId === s.id}
                          onClick={() => { setChangesFor(s.id); setNotes(""); }}
                          className="rounded-lg px-4 py-2 text-sm font-semibold border text-neutral-200 hover:bg-neutral-800 disabled:opacity-50"
                          style={{ borderColor: "#30363D" }}
                        >
                          Request changes
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
