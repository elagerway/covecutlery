"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Loader2, RotateCcw } from "lucide-react";

interface Submission {
  id: string;
  status: "submitted" | "in_review" | "approved" | "changes_requested";
  student_note: string;
  reviewer_notes: string;
  reviewed_at: string | null;
  submitted_at: string;
  external_url: string | null;
}

export function PracticumSubmission({ courseSlug }: { courseSlug: string }) {
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState<Submission | null>(null);

  const [link, setLink] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/courses/practicum-submission?course=${encodeURIComponent(courseSlug)}`
      );
      if (res.ok) {
        const d = await res.json();
        setSubmission(d.submission);
      }
    } finally {
      setLoading(false);
    }
  }, [courseSlug]);

  useEffect(() => {
    load();
  }, [load]);

  async function submit() {
    setError(null);
    if (!link.trim()) {
      setError("Paste a link to your video.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/courses/practicum-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug, externalUrl: link.trim(), studentNote: note }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Submission failed. Please try again.");
      }
      setLink("");
      setNote("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  const wrapper = "my-8 rounded-xl border border-neutral-700 bg-neutral-900/50 p-5 sm:p-6";

  if (loading) {
    return (
      <div className={wrapper}>
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <Loader2 className="size-4 animate-spin" /> Loading your submission…
        </div>
      </div>
    );
  }

  // Submitted / under review — no form, just status.
  if (submission && (submission.status === "submitted" || submission.status === "in_review")) {
    return (
      <div className={wrapper}>
        <div className="flex items-start gap-3">
          <Clock className="mt-0.5 size-5 shrink-0 text-amber-400" />
          <div>
            <h3 className="font-semibold text-white">Video submitted — awaiting review</h3>
            <p className="mt-1 text-sm text-neutral-400">
              Submitted {new Date(submission.submitted_at).toLocaleDateString()}. Erik will review
              your technique and you&apos;ll be notified with feedback. Your certificate is issued
              once your video is approved.
            </p>
            {submission.external_url && (
              <a
                href={submission.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm text-emerald-400 hover:underline"
              >
                View the video you submitted →
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Approved.
  if (submission && submission.status === "approved") {
    return (
      <div className={wrapper}>
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-400" />
          <div>
            <h3 className="font-semibold text-white">Approved by Erik 🎉</h3>
            {submission.reviewer_notes && (
              <p className="mt-1 text-sm text-neutral-300">
                <span className="text-neutral-500">Feedback:</span> {submission.reviewer_notes}
              </p>
            )}
            <p className="mt-2 text-sm text-neutral-400">
              Your technique is signed off.{" "}
              <Link href="/dashboard/certificates" className="text-emerald-400 hover:underline">
                View your certificates
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    );
  }

  // No submission yet, or changes requested → show the form.
  const changesRequested = submission?.status === "changes_requested";

  return (
    <div className={wrapper}>
      <h3 className="font-semibold text-white">Submit your technique video</h3>
      <p className="mt-1 text-sm text-neutral-400">
        Record yourself taking a knife from dull to finished, upload it to{" "}
        <span className="text-neutral-300">YouTube (unlisted)</span> or{" "}
        <span className="text-neutral-300">Vimeo</span>, then paste the link here for Erik to review.
        Your certificate is issued once your video is approved.
      </p>

      {changesRequested && submission && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-200">
          <RotateCcw className="mt-0.5 size-4 shrink-0" />
          <div>
            <p className="font-medium">Erik requested some changes:</p>
            <p className="mt-0.5 text-amber-100/90">
              {submission.reviewer_notes || "Please refine your technique and resubmit."}
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 space-y-4">
        <div>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://youtu.be/…  or  https://vimeo.com/…"
            className="block w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-emerald-500 focus:outline-none"
          />
          <p className="mt-1.5 text-xs text-neutral-500">
            YouTube or Vimeo only. Set it to <span className="text-neutral-400">Unlisted</span> so
            anyone with the link can view it.
          </p>
        </div>

        <div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Anything you'd like Erik to know (optional)"
            className="block w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {error && <p className="text-sm text-red-400">{error}</p>}

        <Button onClick={submit} disabled={busy} size="lg">
          {busy ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Submitting…
            </>
          ) : changesRequested ? (
            "Resubmit for review"
          ) : (
            "Submit for review"
          )}
        </Button>
      </div>
    </div>
  );
}
