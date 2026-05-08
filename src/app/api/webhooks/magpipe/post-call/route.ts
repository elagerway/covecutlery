import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/admin";

/**
 * Magpipe post-call webhook.
 *
 * URL to register in Magpipe: https://coveblades.com/api/webhooks/magpipe/post-call
 *
 * Auth: Magpipe should sign requests with a shared secret. Set
 * MAGPIPE_WEBHOOK_SECRET in Vercel env and configure the matching value
 * in Magpipe's webhook settings. We accept either:
 *   - Authorization: Bearer <secret>
 *   - x-magpipe-signature: <secret>  (or HMAC if Magpipe signs the body)
 *
 * If MAGPIPE_WEBHOOK_SECRET is not set, the webhook accepts any request
 * (useful for first-time setup) but logs a warning.
 */

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const expected = process.env.MAGPIPE_WEBHOOK_SECRET;
  if (expected) {
    const auth = req.headers.get("authorization") ?? "";
    const sig = req.headers.get("x-magpipe-signature") ?? "";
    const ok = auth === `Bearer ${expected}` || sig === expected;
    if (!ok) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  } else {
    console.warn("[magpipe/post-call] MAGPIPE_WEBHOOK_SECRET not set — accepting unsigned request");
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const supabase = getServiceClient();
  const { error } = await supabase.from("magpipe_call_logs").insert({
    event_type: (payload.event ?? payload.event_type ?? "post_call") as string,
    call_id: (payload.call_id ?? payload.id ?? null) as string | null,
    agent_id: (payload.agent_id ?? null) as string | null,
    from_number: (payload.from ?? payload.from_number ?? null) as string | null,
    to_number: (payload.to ?? payload.to_number ?? null) as string | null,
    direction: (payload.direction ?? null) as string | null,
    duration_seconds: (payload.duration_seconds ?? payload.duration ?? null) as number | null,
    status: (payload.status ?? null) as string | null,
    transcript: (payload.transcript ?? null) as string | null,
    summary: (payload.summary ?? null) as string | null,
    recording_url: (payload.recording_url ?? null) as string | null,
    payload,
  });

  if (error) {
    console.error("[magpipe/post-call] Insert failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "magpipe-post-call-webhook",
    docs: "POST your post-call payload here. Auth via Authorization: Bearer <MAGPIPE_WEBHOOK_SECRET> or x-magpipe-signature header.",
  });
}
