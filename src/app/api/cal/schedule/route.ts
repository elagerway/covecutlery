import { NextResponse } from "next/server";
import { getWeekSchedule } from "@/lib/calSchedule";

export async function GET() {
  try {
    const days = await getWeekSchedule();
    return NextResponse.json({ days });
  } catch {
    return NextResponse.json({ error: "Schedule unavailable" }, { status: 502 });
  }
}
