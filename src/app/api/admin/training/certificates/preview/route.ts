import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { renderCertificate } from "@/lib/certificates/render";

function getOrigin(req: NextRequest): string {
  if (process.env.NODE_ENV === "development") {
    return req.headers.get("origin") ?? "http://localhost:3000";
  }
  return "https://coveblades.com";
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const recipientName = (body.recipientName as string | undefined)?.trim() || "Recipient Name";
  const issuedDateStr = body.issuedDate as string | undefined;
  const issuedDate = issuedDateStr ? new Date(issuedDateStr + "T12:00:00-07:00") : new Date();

  const pdfBytes = await renderCertificate({
    recipientName,
    issuedDate,
    shortCode: "CB-PREV-IEW0",
    origin: getOrigin(req),
  });

  return new NextResponse(pdfBytes as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=certificate-preview.pdf",
      "Cache-Control": "no-store",
    },
  });
}
