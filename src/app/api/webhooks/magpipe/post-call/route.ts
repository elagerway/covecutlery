import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/admin";
import crypto from "crypto";

/**
 * Magpipe webhook receiver.
 *
 * URL: https://coveblades.com/api/webhooks/magpipe/post-call
 *
 * Auth: Magpipe signs each delivery with HMAC-SHA256 of the raw body using
 * the webhook signing secret. The signature is sent as
 *   x-magpipe-signature: sha256=<hex digest>
 *
 * Set MAGPIPE_WEBHOOK_SECRET in Vercel env to the same value Magpipe uses.
 *
 * Stores the full payload + commonly-queried flat fields in
 * public.magpipe_call_logs.
 */

export const dynamic = "force-dynamic";

function verifySignature(rawBody: string, header: string | null, secret: string): boolean {
  if (!header) return false;
  const expected = "sha256=" + crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const a = Buffer.from(header);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const secret = process.env.MAGPIPE_WEBHOOK_SECRET;

  if (secret) {
    const sig = req.headers.get("x-magpipe-signature");
    if (!verifySignature(rawBody, sig, secret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  } else {
    console.warn("[magpipe/post-call] MAGPIPE_WEBHOOK_SECRET not set — accepting unverified request");
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Magpipe nests the call data under different keys depending on event type;
  // pull from a few common shapes.
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
  return NextResponse.json({
    ok: true,
    endpoint: "magpipe-post-call-webhook",
    auth: "x-magpipe-signature: sha256=<HMAC-SHA256 of raw body using MAGPIPE_WEBHOOK_SECRET>",
  });
}
