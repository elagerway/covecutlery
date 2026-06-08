import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { VOICE_AGENT_ID, listVoices, getAgentVoiceId, setAgentVoice } from "@/lib/magpipe";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [voices, currentVoiceId] = await Promise.all([listVoices(), getAgentVoiceId(VOICE_AGENT_ID)]);
    return NextResponse.json({ voices, currentVoiceId });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Couldn't reach Magpipe" },
      { status: 502 },
    );
  }
}

export async function PUT(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { voiceId } = await req.json();
  if (typeof voiceId !== "string" || !voiceId) {
    return NextResponse.json({ error: "voiceId is required" }, { status: 400 });
  }

  try {
    // update-agent rejects an unknown voice_id itself, so no separate lookup.
    await setAgentVoice(VOICE_AGENT_ID, voiceId);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Couldn't update the voice" },
      { status: 502 },
    );
  }
}
