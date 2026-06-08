import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { cloneVoice } from "@/lib/magpipe";

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

  try {
    const voice = await cloneVoice(name.trim(), audio);
    return NextResponse.json({ ok: true, voice });
  } catch (e) {
    // Magpipe surfaces ElevenLabs validation errors (corrupt/too-short audio) in the message.
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Voice cloning failed." },
      { status: 502 },
    );
  }
}
