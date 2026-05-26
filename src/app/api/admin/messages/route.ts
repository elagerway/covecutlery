import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { listMessages, groupIntoConversations } from "@/lib/magpipe";

// GET /api/admin/messages → conversations grouped by customer phone
// GET /api/admin/messages?phone=+1604xxxxxxx → thread for that phone
export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const phone = req.nextUrl.searchParams.get("phone");

  try {
    if (phone) {
      const data = await listMessages({ phoneNumber: phone, limit: 500 });
      const messages = data.messages.slice().sort((a, b) => a.created_at.localeCompare(b.created_at));
      return NextResponse.json({ messages });
    }

    const data = await listMessages({ limit: 500 });
    const conversations = groupIntoConversations(data.messages);
    return NextResponse.json({ conversations });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[/api/admin/messages] error:", msg);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
