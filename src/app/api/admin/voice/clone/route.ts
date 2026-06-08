import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";

const MAGPIPE_BASE = "https://api.magpipe.ai/functions/v1";

// Vercel serverless functions cap the request body around 4.5MB; keep the
// upload comfortably under that. A minute of compressed audio is well within.
const MAX_AUDIO_BYTES = 4 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart form data" }, { status: 400 });
  }

  const name = form.get("name");
  const audio = form.get("audio");

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "A voice name is required" }, { status: 400 });
  }
  if (!(audio instanceof File) || audio.size === 0) {
    return NextResponse.json({ error: "An audio sample is required" }, { status: 400 });
  }
  if (audio.size > MAX_AUDIO_BYTES) {
    return NextResponse.json(
      { error: "Audio is too large — keep it under 4MB (about a minute of recording)." },
      { status: 413 },
    );
  }

  // Forward the sample to Magpipe's clone endpoint (which hands it to
  // ElevenLabs). multipart fields: name + audio.
  const out = new FormData();
  out.append("name", name.trim());
  out.append("audio", audio, audio.name || "sample.webm");

  let res: Response;
  try {
    res = await fetch(`${MAGPIPE_BASE}/clone-voice`, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.MAGPIPE_API_KEY}` },
      body: out,
    });
  } catch {
    return NextResponse.json({ error: "Couldn't reach Magpipe" }, { status: 502 });
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // Magpipe surfaces ElevenLabs validation errors (e.g. corrupt/too-short audio) in `details`.
    const detail = typeof data.details === "string" ? data.details : "";
    return NextResponse.json(
      { error: data.error || "Voice cloning failed.", details: detail || undefined },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, voice: data.voice ?? data });
}
