import { NextRequest, NextResponse } from "next/server";
import * as postmark from "postmark";
import { createClient } from "@/utils/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { formatPhone } from "@/lib/format";

const ADMIN_EMAIL = "elagerway@gmail.com";
const FROM_EMAIL = "help@covecutlery.ca";
const FROM_NAME = "Cove Cutlery";

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== ADMIN_EMAIL) return null;
  return user;
}

function formatCAD(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

function formatDate(d: string) {
  return new Date(d + "T12:00:00").toLocaleDateString("en-CA", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });
}

function buildReceiptText(b: {
  customer_name: string;
  appointment_date: string;
  appointment_time: string;
  address: string | null;
  deposit_amount: number;
  amount_charged: number | null;
  payment_method: string | null;
}) {
  const total = b.amount_charged !== null ? b.deposit_amount + b.amount_charged : b.deposit_amount;
  const lines = [
    `Hi ${b.customer_name.split(" ")[0]},`,
    ``,
    `Here's your receipt from Cove Cutlery.`,
    ``,
    `📅 ${formatDate(b.appointment_date)} at ${b.appointment_time}`,
    b.address ? `📍 ${b.address}` : null,
    ``,
    `Deposit (card):       ${formatCAD(b.deposit_amount)}`,
    b.amount_charged !== null
      ? `Day of service (${b.payment_method ?? "—"}):  ${formatCAD(b.amount_charged)}`
      : null,
    `──────────────────────`,
    `Total:                ${formatCAD(total)}`,
    ``,
    `Thank you for choosing Cove Cutlery!`,
    `covecutlery.ca`,
  ].filter((l) => l !== null).join("\n");
  return lines;
}

function buildReceiptHtml(b: {
  customer_name: string;
  appointment_date: string;
  appointment_time: string;
  address: string | null;
  deposit_amount: number;
  amount_charged: number | null;
  payment_method: string | null;
}) {
  const total = b.amount_charged !== null ? b.deposit_amount + b.amount_charged : b.deposit_amount;
  const firstName = b.customer_name.split(" ")[0];

  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:480px;margin:40px auto;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.1);">
    <div style="background:#0D1117;padding:24px 32px;">
      <p style="margin:0;color:#D4A017;font-size:20px;font-weight:700;letter-spacing:.5px;">COVE CUTLERY</p>
      <p style="margin:4px 0 0;color:#6B7280;font-size:13px;">Mobile Knife Sharpening</p>
    </div>
    <div style="padding:32px;">
      <p style="margin:0 0 24px;font-size:15px;color:#111;">Hi ${firstName},<br>Here's your receipt for your sharpening service.</p>
      <div style="background:#f9f9f9;border-radius:6px;padding:16px 20px;margin-bottom:24px;">
        <p style="margin:0 0 4px;font-size:13px;color:#888;">Appointment</p>
        <p style="margin:0;font-size:15px;font-weight:600;color:#111;">${formatDate(b.appointment_date)} at ${b.appointment_time}</p>
        ${b.address ? `<p style="margin:4px 0 0;font-size:13px;color:#555;">${b.address}</p>` : ""}
      </div>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr>
          <td style="padding:8px 0;color:#555;border-bottom:1px solid #eee;">Deposit <span style="font-size:12px;color:#999;">(card)</span></td>
          <td style="padding:8px 0;text-align:right;color:#111;border-bottom:1px solid #eee;">${formatCAD(b.deposit_amount)}</td>
        </tr>
        ${b.amount_charged !== null ? `
        <tr>
          <td style="padding:8px 0;color:#555;border-bottom:1px solid #eee;">Day of service <span style="font-size:12px;color:#999;">(${b.payment_method ?? "—"})</span></td>
          <td style="padding:8px 0;text-align:right;color:#111;border-bottom:1px solid #eee;">${formatCAD(b.amount_charged)}</td>
        </tr>` : ""}
        <tr>
          <td style="padding:12px 0 4px;font-weight:700;color:#111;">Total</td>
          <td style="padding:12px 0 4px;text-align:right;font-weight:700;font-size:16px;color:#111;">${formatCAD(total)}</td>
        </tr>
      </table>
      <p style="margin:32px 0 0;font-size:13px;color:#888;text-align:center;">Thank you for choosing Cove Cutlery!<br><a href="https://covecutlery.ca" style="color:#D4A017;">covecutlery.ca</a></p>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { sendEmail, sendSms, emailTo, smsTo } = await req.json();

  if (!sendEmail && !sendSms) {
    return NextResponse.json({ error: "Select at least one channel" }, { status: 400 });
  }

  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: b } = await supabase
    .from("bookings")
    .select("customer_name, appointment_date, appointment_time, address, deposit_amount, amount_charged, payment_method")
    .eq("id", id)
    .single();

  if (!b) return NextResponse.json({ error: "Booking not found" }, { status: 404 });

  const errors: string[] = [];
  let sent = 0;

  // Email via Postmark
  if (sendEmail && emailTo) {
    if (!process.env.POSTMARK_API_KEY) {
      errors.push("POSTMARK_API_KEY not configured");
    } else {
      try {
        const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY);
        await client.sendEmail({
          From: `${FROM_NAME} <${FROM_EMAIL}>`,
          To: emailTo,
          Subject: `Your receipt from Cove Cutlery — ${formatDate(b.appointment_date)}`,
          TextBody: buildReceiptText(b),
          HtmlBody: buildReceiptHtml(b),
        });
        sent++;
      } catch (e: unknown) {
        errors.push(`Email failed: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  }

  // SMS via Magpipe
  if (sendSms && smsTo) {
    const digits = smsTo.replace(/\D/g, "");
    const e164 = digits.length === 10 ? `+1${digits}` : digits.length === 11 ? `+${digits}` : null;
    if (!e164) {
      errors.push("Invalid SMS number");
    } else {
      try {
        const msg = buildReceiptText(b);
        const res = await fetch("https://api.magpipe.ai/v1/sms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.MAGPIPE_API_KEY}`,
          },
          body: JSON.stringify({
            from: process.env.MAGPIPE_SMS_FROM,
            to: e164,
            message: msg,
          }),
        });
        if (!res.ok) {
          const err = await res.text();
          errors.push(`SMS failed: ${err}`);
        } else {
          sent++;
        }
      } catch (e: unknown) {
        errors.push(`SMS failed: ${e instanceof Error ? e.message : String(e)}`);
      }
    }
  }

  if (sent > 0) {
    await supabase
      .from("bookings")
      .update({ receipt_sent_at: new Date().toISOString() })
      .eq("id", id);
  }

  if (errors.length) {
    const status = sent > 0 ? 207 : 500;
    return NextResponse.json({ error: errors.join("; "), partial: sent > 0 }, { status });
  }

  return NextResponse.json({ ok: true });
}

// suppress unused import warning
void formatPhone;
