import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { listMessages, groupIntoConversations, SERVICE_NUMBER } from "@/lib/magpipe";

// GET /api/admin/messages → conversations grouped by customer phone
// GET /api/admin/messages?phone=+1604xxxxxxx → thread for that phone
//
// Always scoped to SERVICE_NUMBER — the Magpipe API key has access to messages
// from other services on the same account (e.g. SeniorHome.ca); without this
// filter the inbox would mix them in.
export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const phone = req.nextUrl.searchParams.get("phone");

  try {
    const data = await listMessages({ phoneNumber: SERVICE_NUMBER, limit: 500 });

    if (phone) {
      const messages = data.messages
        .filter(m => m.from_number === phone || m.to_number === phone)
        .slice()
        .sort((a, b) => a.created_at.localeCompare(b.created_at));
      return NextResponse.json({ messages });
    }

    const conversations = groupIntoConversations(data.messages);
    return NextResponse.json({ conversations });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[/api/admin/messages] error:", msg);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
