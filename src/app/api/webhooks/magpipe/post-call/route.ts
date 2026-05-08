import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const data = (payload.data ?? payload.call ?? payload) as Record<string, unknown>;

  const supabase = getServiceClient();
  const { error } = await supabase.from("magpipe_call_logs").insert({
    event_type: (payload.event ?? payload.type ?? payload.event_type ?? "unknown") as string,
    call_id: (data.call_id ?? data.id ?? null) as string | null,
    agent_id: (data.agent_id ?? null) as string | null,
    from_number: (data.from ?? data.from_number ?? data.caller ?? null) as string | null,
    to_number: (data.to ?? data.to_number ?? data.callee ?? null) as string | null,
    direction: (data.direction ?? null) as string | null,
    duration_seconds: (data.duration_seconds ?? data.duration ?? null) as number | null,
    status: (data.status ?? null) as string | null,
    transcript: (data.transcript ?? null) as string | null,
    summary: (data.summary ?? null) as string | null,
    recording_url: (data.recording_url ?? null) as string | null,
    payload,
  });

  if (error) {
    console.error("[magpipe/post-call] Insert failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
