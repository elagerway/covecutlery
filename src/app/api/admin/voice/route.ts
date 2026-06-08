import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";

// The live Cove Blades inbound phone agent in Magpipe (+1 604 210 8180).
const VOICE_AGENT_ID = "49fba67b-50e6-4246-b601-ad4ca42e33e5";
const MAGPIPE_BASE = "https://api.magpipe.ai/functions/v1";

export interface MagpipeVoice {
  id: string;
  name: string;
  description: string | null;
  provider: string;
  is_custom: boolean;
}

async function magpipe(fn: string, init: { method: "GET" | "POST"; body?: object }) {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${process.env.MAGPIPE_API_KEY}`,
  };
  if (init.body) headers["Content-Type"] = "application/json";
  const res = await fetch(`${MAGPIPE_BASE}/${fn}`, {
    method: init.method,
    headers,
    body: init.body ? JSON.stringify(init.body) : undefined,
  });
  if (!res.ok) {
    throw new Error(`Magpipe ${fn} responded ${res.status}`);
  }
  return res.json();
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const [voicesRes, agentRes] = await Promise.all([
      magpipe("list-voices", { method: "GET" }),
      magpipe("get-agent", { method: "POST", body: { agent_id: VOICE_AGENT_ID } }),
    ]);
    const voices: MagpipeVoice[] = voicesRes.voices ?? [];
    const agent = agentRes.agent ?? agentRes;
    return NextResponse.json({ voices, currentVoiceId: agent.voice_id ?? null });
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
    // Validate against the live voice list so we never write an unknown id.
    const voicesRes = await magpipe("list-voices", { method: "GET" });
    const voices: MagpipeVoice[] = voicesRes.voices ?? [];
    const match = voices.find((v) => v.id === voiceId);
    if (!match) return NextResponse.json({ error: "Unknown voice" }, { status: 400 });

    await magpipe("update-agent", {
      method: "POST",
      body: { agent_id: VOICE_AGENT_ID, voice_id: voiceId },
    });
    return NextResponse.json({ ok: true, voice: match });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Couldn't update the voice" },
      { status: 502 },
    );
  }
}
