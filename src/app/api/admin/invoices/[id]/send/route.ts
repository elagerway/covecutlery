import { NextRequest, NextResponse } from "next/server";
import * as postmark from "postmark";
import { requireAdmin, getServiceClient } from "@/lib/admin";
import { formatCAD, escapeHtml, LineItem } from "@/lib/format";

const FROM_EMAIL = "info@covecutlery.ca";
const FROM_NAME = "Cove Cutlery";

function buildInvoiceHtml(invoice: {
  invoice_number: string;
  client_name: string;
  line_items: LineItem[];
  subtotal: number;
  due_date: string | null;
  notes: string | null;
  status: string;
  id: string;
}, origin: string) {
  const firstName = invoice.client_name.split(" ")[0];
  const dueFormatted = invoice.due_date
    ? new Date(invoice.due_date + "T12:00:00").toLocaleDateString("en-CA", {
        weekday: "long", month: "long", day: "numeric", year: "numeric",
      })
    : null;
  const viewUrl = `${origin}/invoice/${invoice.id}`;

  const itemRows = invoice.line_items.map((item: LineItem) => `
    <tr>
      <td style="padding:8px 0;color:#555;border-bottom:1px solid #eee;">${escapeHtml(item.description)}</td>
      <td style="padding:8px 0;text-align:center;color:#555;border-bottom:1px solid #eee;">${escapeHtml(String(item.quantity))}</td>
      <td style="padding:8px 0;text-align:right;color:#555;border-bottom:1px solid #eee;">${escapeHtml(formatCAD(item.unit_price))}</td>
      <td style="padding:8px 0;text-align:right;color:#111;border-bottom:1px solid #eee;">${escapeHtml(formatCAD(item.quantity * item.unit_price))}</td>
    </tr>
  `).join("");

  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.1);">
    <div style="background:#0D1117;padding:24px 32px;">
      <p style="margin:0;color:#D4A017;font-size:20px;font-weight:700;letter-spacing:.5px;">COVE CUTLERY</p>
      <p style="margin:4px 0 0;color:#6B7280;font-size:13px;">Invoice #${escapeHtml(invoice.invoice_number)}</p>
    </div>
    <div style="padding:32px;">
      <p style="margin:0 0 24px;font-size:15px;color:#111;">Hi ${escapeHtml(firstName)},<br>Here's your invoice from Cove Cutlery.</p>
      ${dueFormatted ? `<div style="background:#f9f9f9;border-radius:6px;padding:16px 20px;margin-bottom:24px;">
        <p style="margin:0 0 4px;font-size:13px;color:#888;">Due Date</p>
        <p style="margin:0;font-size:15px;font-weight:600;color:#111;">${dueFormatted}</p>
      </div>` : ""}
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr style="border-bottom:2px solid #eee;">
          <th style="padding:8px 0;text-align:left;color:#888;font-weight:500;">Item</th>
          <th style="padding:8px 0;text-align:center;color:#888;font-weight:500;">Qty</th>
          <th style="padding:8px 0;text-align:right;color:#888;font-weight:500;">Price</th>
          <th style="padding:8px 0;text-align:right;color:#888;font-weight:500;">Total</th>
        </tr>
        ${itemRows}
        <tr>
          <td colspan="3" style="padding:12px 0 4px;font-weight:700;color:#111;">Total</td>
          <td style="padding:12px 0 4px;text-align:right;font-weight:700;font-size:16px;color:#111;">${escapeHtml(formatCAD(invoice.subtotal))}</td>
        </tr>
      </table>
      ${invoice.notes ? `<p style="margin:24px 0 0;font-size:13px;color:#555;padding:12px 16px;background:#f9f9f9;border-radius:6px;">${escapeHtml(invoice.notes)}</p>` : ""}
      <div style="margin:32px 0 0;text-align:center;">
        <a href="${viewUrl}" style="display:inline-block;padding:14px 32px;background:#D4A017;color:#0D1117;font-weight:700;font-size:14px;text-decoration:none;border-radius:8px;">${invoice.status === "paid" ? "View Invoice" : "View & Pay Invoice"}</a>
      </div>
      ${invoice.status !== "paid" ? `<p style="margin:24px 0 0;font-size:12px;color:#888;text-align:center;">
        Or pay via e-Transfer to <strong>pay@covecutlery.ca</strong><br>
        Include invoice #${escapeHtml(invoice.invoice_number)} in the message.
      </p>` : `<p style="margin:24px 0 0;font-size:12px;color:#888;text-align:center;">
        This invoice has been paid. Thank you!
      </p>`}
      <p style="margin:24px 0 0;font-size:13px;color:#888;text-align:center;">
        <a href="https://covecutlery.ca" style="color:#D4A017;">covecutlery.ca</a> · 604-373-1500
      </p>
    </div>
  </div>
</body>
</html>`;
}

function buildInvoiceText(invoice: {
  invoice_number: string;
  client_name: string;
  line_items: LineItem[];
  subtotal: number;
  due_date: string | null;
  notes: string | null;
  status: string;
  id: string;
}, origin: string) {
  const firstName = invoice.client_name.split(" ")[0];
  const items = invoice.line_items.map((item: LineItem) =>
    `  ${item.description} × ${item.quantity} — ${formatCAD(item.quantity * item.unit_price)}`
  ).join("\n");

  return [
    `Hi ${firstName},`,
    ``,
    `Here's your invoice from Cove Cutlery.`,
    ``,
    `Invoice #${invoice.invoice_number}`,
    invoice.due_date ? `Due: ${invoice.due_date}` : null,
    ``,
    items,
    `──────────────────────`,
    `Total: ${formatCAD(invoice.subtotal)}`,
    ``,
    `View online: ${origin}/invoice/${invoice.id}`,
    ``,
    invoice.status !== "paid"
      ? `Or e-Transfer to pay@covecutlery.ca (include invoice #${invoice.invoice_number} in the message).`
      : `This invoice has been paid. Thank you!`,
    ``,
    invoice.notes ? `Note: ${invoice.notes}\n` : null,
    `Cove Cutlery · covecutlery.ca · 604-373-1500`,
  ].filter(l => l !== null).join("\n");
}

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

  const origin = process.env.NODE_ENV === "development" ? (req.headers.get("origin") ?? "https://covecutlery.ca") : "https://covecutlery.ca";
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
          Subject: `Invoice #${invoice.invoice_number} from Cove Cutlery — ${formatCAD(invoice.subtotal)}`,
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
        const msg = invoice.status === "paid"
          ? `Hi ${invoice.client_name.split(" ")[0]}, here's your Cove Cutlery receipt for invoice #${invoice.invoice_number} (${formatCAD(invoice.subtotal)}). View: ${viewUrl}`
          : `Hi ${invoice.client_name.split(" ")[0]}, your Cove Cutlery invoice #${invoice.invoice_number} for ${formatCAD(invoice.subtotal)} is ready. View & pay: ${viewUrl}`;
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
    await supabase.from("invoices").update(updates).eq("id", id);
  }

  if (errors.length) {
    return NextResponse.json({ error: errors.join("; "), partial: sent > 0 }, { status: sent > 0 ? 207 : 500 });
  }

  return NextResponse.json({ ok: true });
}
