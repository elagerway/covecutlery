import { NextRequest, NextResponse } from "next/server";
import { getServiceClient } from "@/lib/admin";

const MAX_NAME = 100;
const MAX_PATH = 500;
const MAX_REFERRER = 1000;
const MAX_SESSION = 100;
const MAX_PROPS_BYTES = 4000;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!body || typeof body !== "object") return NextResponse.json({ ok: false }, { status: 400 });
  const b = body as Record<string, unknown>;

  const name = typeof b.name === "string" ? b.name.slice(0, MAX_NAME) : null;
  if (!name) return NextResponse.json({ ok: false }, { status: 400 });

  const props = b.props && typeof b.props === "object" ? b.props : {};
  let propsString: string;
  try {
    propsString = JSON.stringify(props);
    if (propsString.length > MAX_PROPS_BYTES) {
      return NextResponse.json({ ok: false, error: "props too large" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ ok: false, error: "props not serializable" }, { status: 400 });
  }

  const path = typeof b.path === "string" ? b.path.slice(0, MAX_PATH) : null;
  const referrer = typeof b.referrer === "string" ? b.referrer.slice(0, MAX_REFERRER) : null;
  const session_id = typeof b.session_id === "string" ? b.session_id.slice(0, MAX_SESSION) : null;

  const supabase = getServiceClient();
  const { error } = await supabase.from("analytics_events").insert({
    name,
    props: JSON.parse(propsString),
    path,
    referrer,
    session_id,
  });

  if (error) {
    console.error("[/api/events] insert failed:", error.message);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
