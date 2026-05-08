"use client";

import { useState, useEffect } from "react";

export default function VoicePromptPage() {
  const [prompt, setPrompt] = useState("");
  const [savedPrompt, setSavedPrompt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

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
  }, []);

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
        System prompt for the Magpipe voice agent. Changes here are stored in your database — sync to Magpipe when ready.
      </p>

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
