"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { CheckCircle2, Clock, Loader2, RotateCcw, Upload, LinkIcon } from "lucide-react";

interface Submission {
  id: string;
  status: "submitted" | "in_review" | "approved" | "changes_requested";
  student_note: string;
  reviewer_notes: string;
  reviewed_at: string | null;
  submitted_at: string;
  external_url: string | null;
  storage_path: string | null;
}

const MAX_BYTES = 200 * 1024 * 1024; // 200 MB — matches the bucket limit
const ACCEPT = "video/mp4,video/quicktime,video/webm";

export function PracticumSubmission({
  courseSlug,
  courseId,
}: {
  courseSlug: string;
  courseId: string;
}) {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [submission, setSubmission] = useState<Submission | null>(null);

  const [mode, setMode] = useState<"upload" | "link">("upload");
  const [file, setFile] = useState<File | null>(null);
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
    setBusy(true);
    try {
      let storagePath: string | null = null;
      let externalUrl: string | null = null;

      if (mode === "upload") {
        if (!file) throw new Error("Choose a video file to upload.");
        if (file.size > MAX_BYTES)
          throw new Error(
            "That file is over 200 MB. Trim it to a short clip, or use the link option (YouTube unlisted, Drive, Loom)."
          );
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error("Your session expired — please sign in again.");
        const ext = file.name.split(".").pop()?.toLowerCase() || "mp4";
        const path = `${user.id}/${courseId}/${Date.now()}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("practicum-submissions")
          .upload(path, file, { upsert: false, contentType: file.type });
        if (upErr) throw new Error(upErr.message);
        storagePath = path;
      } else {
        if (!link.trim()) throw new Error("Paste a link to your video.");
        externalUrl = link.trim();
      }

      const res = await fetch("/api/courses/practicum-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug, storagePath, externalUrl, studentNote: note }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Submission failed. Please try again.");
      }
      setFile(null);
      setLink("");
      setNote("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  const wrapper =
    "my-8 rounded-xl border border-neutral-700 bg-neutral-900/50 p-5 sm:p-6";

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
        Record yourself taking a knife from dull to finished, then submit it here for Erik to
        review. Your certificate is issued once your video is approved.
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

      {/* Mode toggle */}
      <div className="mt-4 inline-flex rounded-lg border border-neutral-700 p-0.5">
        {(["upload", "link"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
              mode === m ? "bg-neutral-700 text-white" : "text-neutral-400 hover:text-white"
            )}
          >
            {m === "upload" ? <Upload className="size-4" /> : <LinkIcon className="size-4" />}
            {m === "upload" ? "Upload file" : "Paste link"}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-4">
        {mode === "upload" ? (
          <div>
            <input
              type="file"
              accept={ACCEPT}
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-neutral-300 file:mr-3 file:rounded-md file:border-0 file:bg-neutral-700 file:px-3 file:py-1.5 file:text-sm file:text-white hover:file:bg-neutral-600"
            />
            <p className="mt-1.5 text-xs text-neutral-500">
              MP4 or MOV, up to 200 MB. For longer clips, upload to YouTube (unlisted) and use the
              link option.
            </p>
          </div>
        ) : (
          <div>
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://youtu.be/…  (YouTube unlisted, Google Drive, Loom, or Vimeo)"
              className="block w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-emerald-500 focus:outline-none"
            />
            <p className="mt-1.5 text-xs text-neutral-500">
              Make sure the link is viewable by anyone with the link (unlisted is fine).
            </p>
          </div>
        )}

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
              {mode === "upload" ? "Uploading…" : "Submitting…"}
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
