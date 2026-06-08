"use client";

import { useState, useEffect, useCallback } from "react";
import VoiceCloner from "@/components/admin/VoiceCloner";

interface Voice {
  id: string;
  name: string;
  description: string | null;
  provider: string;
  is_custom: boolean;
}

export default function VoicePromptPage() {
  const [prompt, setPrompt] = useState("");
  const [savedPrompt, setSavedPrompt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  // Voice picker
  const [voices, setVoices] = useState<Voice[]>([]);
  const [currentVoiceId, setCurrentVoiceId] = useState<string | null>(null);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>("");
  const [voiceLoading, setVoiceLoading] = useState(true);
  const [voiceSaving, setVoiceSaving] = useState(false);
  const [voiceSuccess, setVoiceSuccess] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  const loadVoices = useCallback(() => {
    return fetch("/api/admin/voice")
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error || "Failed to load voices");
        setVoices(data.voices || []);
        setCurrentVoiceId(data.currentVoiceId || null);
        setSelectedVoiceId((prev) => prev || data.currentVoiceId || "");
        setVoiceError(null);
      })
      .catch((e) => setVoiceError(e.message || "Failed to load voices"))
      .finally(() => setVoiceLoading(false));
  }, []);

  useEffect(() => {
    fetch("/api/admin/voice-prompt")
      .then((res) => res.json())
      .then((data) => {
        setPrompt(data.prompt || "");
        setSavedPrompt(data.prompt || "");
        setUpdatedAt(data.updatedAt || null);
      })
      .catch(() => setError("Failed to load prompt"))
      .finally(() => setLoading(false));

    loadVoices();
  }, [loadVoices]);

  async function handleSaveVoice() {
    setVoiceSaving(true);
    setVoiceError(null);
    setVoiceSuccess(false);
    try {
      const res = await fetch("/api/admin/voice", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voiceId: selectedVoiceId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setVoiceError(data.error || "Failed to update voice");
      } else {
        setCurrentVoiceId(selectedVoiceId);
        setVoiceSuccess(true);
        setTimeout(() => setVoiceSuccess(false), 3000);
      }
    } catch {
      setVoiceError("Failed to update voice");
    }
    setVoiceSaving(false);
  }

  const voiceChanged = selectedVoiceId !== "" && selectedVoiceId !== currentVoiceId;
  const stockVoices = voices.filter((v) => !v.is_custom);
  const customVoices = voices.filter((v) => v.is_custom);
  const voiceLabel = (v: Voice) => (v.description ? `${v.name} — ${v.description}` : v.name);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/voice-prompt", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save");
      } else {
        setSavedPrompt(prompt);
        setUpdatedAt(new Date().toISOString());
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch {
      setError("Failed to save");
    }
    setSaving(false);
  }

  const hasChanges = prompt !== savedPrompt;

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Voice Agent</h1>
      <p className="text-sm text-neutral-400 mb-6">
        Configure the Magpipe voice agent on +1 (604) 210-8180. Voice changes apply live; the system prompt is stored in your database to sync when ready.
      </p>

      {/* Voice picker — applies immediately to the live Magpipe agent */}
      <div className="rounded-lg border p-6 mb-4" style={{ borderColor: "#30363D", backgroundColor: "#161B22" }}>
        <label className="text-sm font-semibold text-white">Agent Voice</label>
        <p className="text-xs text-neutral-500 mt-1 mb-4">The voice callers hear. Changing it updates the live agent in Magpipe right away.</p>
        {voiceLoading ? (
          <div className="flex items-center gap-2 py-2 text-sm text-neutral-500">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-600 border-t-amber-400" />
            Loading voices…
          </div>
        ) : voices.length === 0 ? (
          <p className="text-sm text-red-400">{voiceError || "No voices available."}</p>
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={selectedVoiceId}
              onChange={(e) => setSelectedVoiceId(e.target.value)}
              className="flex-1 min-w-[260px] px-3 py-2 rounded-lg text-sm text-white outline-none focus:ring-2"
              style={{ backgroundColor: "#0D1117", border: "1px solid #30363D", "--tw-ring-color": "#D4A017" } as React.CSSProperties}
            >
              {stockVoices.length > 0 && (
                <optgroup label="Stock voices">
                  {stockVoices.map((v) => (
                    <option key={v.id} value={v.id}>{voiceLabel(v)}</option>
                  ))}
                </optgroup>
              )}
              {customVoices.length > 0 && (
                <optgroup label="Custom / cloned">
                  {customVoices.map((v) => (
                    <option key={v.id} value={v.id}>{voiceLabel(v)}</option>
                  ))}
                </optgroup>
              )}
            </select>
            <button
              onClick={handleSaveVoice}
              disabled={voiceSaving || !voiceChanged}
              className="px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-200 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
            >
              {voiceSaving ? "Updating…" : "Update Voice"}
            </button>
            {voiceSuccess && <span className="text-sm text-emerald-400">Voice updated.</span>}
            {voiceError && <span className="text-sm text-red-400">{voiceError}</span>}
          </div>
        )}
      </div>

      <VoiceCloner onCloned={loadVoices} />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-600 border-t-amber-400" />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border p-6" style={{ borderColor: "#30363D", backgroundColor: "#161B22" }}>
            <div className="flex items-center justify-between mb-4">
              <label className="text-sm font-semibold text-white">System Prompt</label>
              {updatedAt && (
                <span className="text-xs text-neutral-500">
                  Last saved {new Date(updatedAt).toLocaleDateString()} {new Date(updatedAt).toLocaleTimeString()}
                </span>
              )}
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={20}
              className="w-full px-4 py-3 rounded-lg text-sm text-white outline-none focus:ring-2 font-mono leading-relaxed resize-y"
              style={{ backgroundColor: "#0D1117", border: "1px solid #30363D", "--tw-ring-color": "#D4A017" } as React.CSSProperties}
            />
            <div className="flex items-center justify-between mt-4">
              <div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                {success && <p className="text-sm text-emerald-400">Saved.</p>}
              </div>
              <button
                onClick={handleSave}
                disabled={saving || !hasChanges}
                className="px-5 py-2 rounded-lg font-semibold text-sm transition-all duration-200 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
              >
                {saving ? "Saving..." : "Save Prompt"}
              </button>
            </div>
          </div>

          <div className="rounded-lg border p-4" style={{ borderColor: "#30363D", backgroundColor: "#161B22" }}>
            <p className="text-xs text-neutral-500">
              This prompt is stored in your Supabase <code className="text-neutral-400">app_credentials</code> table.
              Copy it into Magpipe&apos;s agent config to apply changes to the live voice agent.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
