import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!start || !end) {
    return NextResponse.json({ error: "start and end required" }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.cal.com/v2/slots?eventTypeId=${process.env.CAL_EVENT_TYPE_ID}&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CAL_API_KEY}`,
          "cal-api-version": "2024-09-04",
        },
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch slots" }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Slots unavailable" }, { status: 502 });
  }
}
