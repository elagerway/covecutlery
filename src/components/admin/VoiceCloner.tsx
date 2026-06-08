"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, Square, Upload, Trash2 } from "lucide-react";

const MAX_SECONDS = 120; // auto-stop a runaway recording
const MAX_BYTES = 4 * 1024 * 1024;

function pickMimeType(): string {
  const candidates = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];
  if (typeof MediaRecorder === "undefined") return "";
  return candidates.find((t) => MediaRecorder.isTypeSupported(t)) ?? "";
}

function fmtTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

export default function VoiceCloner({ onCloned }: { onCloned: () => void }) {
  const [name, setName] = useState("");
  const [mode, setMode] = useState<"record" | "upload">("record");

  // recording
  const [recording, setRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // captured sample (from either mode)
  const [sample, setSample] = useState<{ blob: Blob; url: string; filename: string } | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (sample?.url) URL.revokeObjectURL(sample.url);
      recorderRef.current?.stream?.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function clearSample() {
    if (sample?.url) URL.revokeObjectURL(sample.url);
    setSample(null);
  }

  async function startRecording() {
    setError(null);
    setSuccess(null);
    clearSample();
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setError("Microphone access was denied.");
      return;
    }
    const mimeType = pickMimeType();
    const rec = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    chunksRef.current = [];
    rec.ondataavailable = (e) => e.data.size > 0 && chunksRef.current.push(e.data);
    rec.onstop = () => {
      const type = rec.mimeType || "audio/webm";
      const blob = new Blob(chunksRef.current, { type });
      const ext = type.includes("mp4") ? "m4a" : "webm";
      stream.getTracks().forEach((t) => t.stop());
      if (sample?.url) URL.revokeObjectURL(sample.url);
      setSample({ blob, url: URL.createObjectURL(blob), filename: `recording.${ext}` });
    };
    recorderRef.current = rec;
    rec.start();
    setRecording(true);
    setElapsed(0);
    timerRef.current = setInterval(() => {
      setElapsed((e) => {
        if (e + 1 >= MAX_SECONDS) stopRecording();
        return e + 1;
      });
    }, 1000);
  }

  function stopRecording() {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    recorderRef.current?.state !== "inactive" && recorderRef.current?.stop();
    setRecording(false);
  }

  function handleFile(file: File | undefined) {
    setError(null);
    setSuccess(null);
    if (!file) return;
    if (file.size > MAX_BYTES) {
      setError("That file is over 4MB. Use a shorter or more compressed clip.");
      return;
    }
    clearSample();
    setSample({ blob: file, url: URL.createObjectURL(file), filename: file.name });
  }

  async function handleSubmit() {
    if (!name.trim() || !sample) return;
    if (sample.blob.size > MAX_BYTES) {
      setError("Sample is over 4MB. Record a shorter clip or upload a smaller file.");
      return;
    }
    setSubmitting(true);
    setError(null);
    setSuccess(null);
    try {
      const fd = new FormData();
      fd.append("name", name.trim());
      fd.append("audio", sample.blob, sample.filename);
      const res = await fetch("/api/admin/voice/clone", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError([data.error, data.details].filter(Boolean).join(" — ") || "Cloning failed.");
      } else {
        setSuccess(`Cloned "${name.trim()}". It's now in the voice list above.`);
        setName("");
        clearSample();
        onCloned();
      }
    } catch {
      setError("Cloning failed. Please try again.");
    }
    setSubmitting(false);
  }

  const tabStyle = (active: boolean) => ({
    backgroundColor: active ? "#0D1117" : "transparent",
    color: active ? "#FFFFFF" : "#8B949E",
    border: `1px solid ${active ? "#30363D" : "transparent"}`,
  });

  return (
    <div className="rounded-lg border p-6 mb-4" style={{ borderColor: "#30363D", backgroundColor: "#161B22" }}>
      <label className="text-sm font-semibold text-white">Clone a voice</label>
      <p className="text-xs text-neutral-500 mt-1 mb-4">
        Record about 30–60 seconds of clear speech, or upload an audio clip. The clone is added to the list above so you can assign it.
      </p>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Voice name (e.g. Erik)"
          maxLength={80}
          className="w-full sm:max-w-xs px-3 py-2 rounded-lg text-sm text-white outline-none focus:ring-2"
          style={{ backgroundColor: "#0D1117", border: "1px solid #30363D", "--tw-ring-color": "#D4A017" } as React.CSSProperties}
        />

        {/* Mode toggle */}
        <div className="inline-flex gap-1 p-1 rounded-lg w-fit" style={{ backgroundColor: "#0D1117", border: "1px solid #30363D" }}>
          <button onClick={() => setMode("record")} className="px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5" style={tabStyle(mode === "record")}>
            <Mic className="w-3.5 h-3.5" /> Record
          </button>
          <button onClick={() => setMode("upload")} className="px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5" style={tabStyle(mode === "upload")}>
            <Upload className="w-3.5 h-3.5" /> Upload
          </button>
        </div>

        {mode === "record" ? (
          <div className="flex items-center gap-3">
            {!recording ? (
              <button
                onClick={startRecording}
                className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all hover:brightness-110"
                style={{ backgroundColor: "#3A1C1C", color: "#F87171", border: "1px solid #7F1D1D" }}
              >
                <Mic className="w-4 h-4" /> {sample ? "Re-record" : "Start recording"}
              </button>
            ) : (
              <button
                onClick={stopRecording}
                className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                style={{ backgroundColor: "#7F1D1D", color: "#fff" }}
              >
                <Square className="w-3.5 h-3.5 fill-current" /> Stop
              </button>
            )}
            {recording && (
              <span className="flex items-center gap-2 text-sm tabular-nums" style={{ color: "#F87171" }}>
                <span className="w-2 h-2 rounded-full animate-pulse motion-reduce:animate-none" style={{ backgroundColor: "#F87171" }} />
                {fmtTime(elapsed)} <span className="text-neutral-500">/ {fmtTime(MAX_SECONDS)}</span>
              </span>
            )}
          </div>
        ) : (
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => handleFile(e.target.files?.[0])}
            className="text-sm text-neutral-300 file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border-0 file:text-sm file:font-medium file:cursor-pointer"
            style={{ color: "#8B949E" }}
          />
        )}

        {/* Preview */}
        {sample && !recording && (
          <div className="flex items-center gap-3">
            <audio controls src={sample.url} className="h-9" />
            <button onClick={clearSample} title="Discard sample" className="p-1.5 rounded transition-all hover:brightness-125" style={{ backgroundColor: "#21262D", color: "#8B949E" }}>
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSubmit}
            disabled={submitting || !name.trim() || !sample || recording}
            className="px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-200 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
          >
            {submitting ? "Cloning…" : "Create cloned voice"}
          </button>
          {success && <span className="text-sm text-emerald-400">{success}</span>}
          {error && <span className="text-sm text-red-400">{error}</span>}
        </div>
      </div>
    </div>
  );
}
