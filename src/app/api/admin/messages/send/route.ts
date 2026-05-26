import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { sendSms } from "@/lib/magpipe";

const MAX_MESSAGE = 1600; // 10 SMS segments

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { to?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const to = typeof body.to === "string" ? body.to.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!to || !/^\+\d{10,15}$/.test(to)) {
    return NextResponse.json({ error: "Invalid recipient phone (E.164 format required)" }, { status: 400 });
  }
  if (!message) {
    return NextResponse.json({ error: "Message is empty" }, { status: 400 });
  }
  if (message.length > MAX_MESSAGE) {
    return NextResponse.json({ error: `Message too long (max ${MAX_MESSAGE} chars)` }, { status: 400 });
  }

  try {
    await sendSms({ to, message });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[/api/admin/messages/send] error:", msg);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
