import { NextRequest, NextResponse } from "next/server";
import * as postmark from "postmark";
import { requireAdmin, getServiceClient } from "@/lib/admin";
import { formatCAD } from "@/lib/format";
import { buildInvoiceHtml, buildInvoiceText, FROM_EMAIL, FROM_NAME } from "@/lib/invoiceNotify";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { sendEmail, sendSms, overrideEmail, overridePhone } = await req.json();

  if (!sendEmail && !sendSms) {
    return NextResponse.json({ error: "Select at least one channel" }, { status: 400 });
  }

  const supabase = getServiceClient();

  const { data: invoice } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", id)
    .single();

  if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

  const origin = process.env.NODE_ENV === "development" ? (req.headers.get("origin") ?? "https://coveblades.com") : "https://coveblades.com";
  const errors: string[] = [];
  let sent = 0;

  // Email via Postmark
  if (sendEmail) {
    if (!process.env.POSTMARK_API_KEY) {
      errors.push("POSTMARK_API_KEY not configured");
    } else {
      try {
        const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);
        await client.sendEmail({
          From: `${FROM_NAME} <${FROM_EMAIL}>`,
          To: overrideEmail || invoice.client_email,
          Subject: `Invoice #${invoice.invoice_number} from Cove Blades — ${formatCAD(invoice.subtotal)}`,
          TextBody: buildInvoiceText(invoice, origin),
          HtmlBody: buildInvoiceHtml(invoice, origin),
        });
        sent++;
      } catch (e: unknown) {
        errors.push(`Email failed: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  }

  // SMS via Magpipe
  if (sendSms) {
    const phoneToUse = overridePhone || invoice.client_phone || "";
    const digits = phoneToUse.replace(/\D/g, "");
    const e164 = digits.length === 10 ? `+1${digits}` : digits.length === 11 ? `+${digits}` : null;
    if (!e164) {
      errors.push("Invalid SMS number");
    } else if (!process.env.MAGPIPE_API_KEY) {
      errors.push("MAGPIPE_API_KEY not configured");
    } else {
      try {
        const viewUrl = `${origin}/invoice/${invoice.id}`;
        const emailSent = sent > 0;
        const emailNote = emailSent ? " We've also sent this to your email." : "";
        const msg = invoice.status === "paid"
          ? `Hi ${invoice.client_name.split(" ")[0]}, here's your Cove Blades receipt for invoice #${invoice.invoice_number} (${formatCAD(invoice.subtotal)}). View: ${viewUrl}${emailNote}`
          : `Hi ${invoice.client_name.split(" ")[0]}, your Cove Blades invoice #${invoice.invoice_number} for ${formatCAD(invoice.subtotal)} is ready. View & pay: ${viewUrl}${emailNote}`;
        const res = await fetch("https://api.magpipe.ai/functions/v1/send-user-sms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.MAGPIPE_API_KEY}`,
          },
          body: JSON.stringify({
            serviceNumber: process.env.MAGPIPE_SMS_FROM,
            contactPhone: e164,
            message: msg,
          }),
        });
        if (!res.ok) {
          errors.push(`SMS failed: ${await res.text()}`);
        } else {
          sent++;
        }
      } catch (e: unknown) {
        errors.push(`SMS failed: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  }

  // Update status to sent
  if (sent > 0) {
    const updates: Record<string, string> = {};
    if (invoice.status === "draft") updates.status = "sent";
    updates.sent_at = new Date().toISOString();
    // Sending an already-paid invoice IS the paid receipt, so record it the same
    // way the Stripe webhook does — the admin view reads this to show whether the
    // customer was ever told their payment landed.
    if (invoice.status === "paid") updates.paid_notified_at = new Date().toISOString();
    await supabase.from("invoices").update(updates).eq("id", id);
  }

  if (errors.length) {
    return NextResponse.json({ error: errors.join("; "), partial: sent > 0 }, { status: sent > 0 ? 207 : 500 });
  }

  return NextResponse.json({ ok: true });
}
