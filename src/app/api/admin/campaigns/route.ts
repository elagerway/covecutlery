import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, getServiceClient } from "@/lib/admin";
import { normalizePhone } from "@/lib/format";

// GET /api/admin/campaigns — list all campaigns
export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/admin/campaigns — create & send a campaign
export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { message, recipientIds, manualNumbers } = body;

  if (!message || !message.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }
  const hasCustomers = Array.isArray(recipientIds) && recipientIds.length > 0;
  const hasManual = Array.isArray(manualNumbers) && manualNumbers.length > 0;
  if (!hasCustomers && !hasManual) {
    return NextResponse.json({ error: "At least one recipient is required" }, { status: 400 });
  }

  const supabase = getServiceClient();

  // Look up customers by IDs
  const validRecipients: { id: string; name: string; normalized_phone: string }[] = [];

  if (hasCustomers) {
    const { data: customers, error: custError } = await supabase
      .from("customers")
      .select("*")
      .in("id", recipientIds);

    if (custError) return NextResponse.json({ error: custError.message }, { status: 500 });

    for (const c of customers || []) {
      const phone = normalizePhone(c.phone);
      if (phone) validRecipients.push({ id: c.id, name: c.name, normalized_phone: phone });
    }
  }

  // Add manual numbers
  if (hasManual) {
    for (const num of manualNumbers) {
      const phone = normalizePhone(num);
      if (phone && !validRecipients.some((r) => r.normalized_phone === phone)) {
        validRecipients.push({ id: `manual-${phone}`, name: phone, normalized_phone: phone });
      }
    }
  }

  if (validRecipients.length === 0) {
    return NextResponse.json({ error: "No recipients with valid phone numbers" }, { status: 400 });
  }

  // Create campaign record
  const recipientData = validRecipients.map((c) => ({
    id: c.id,
    name: c.name,
    phone: c.normalized_phone,
  }));

  const { data: campaign, error: createError } = await supabase
    .from("campaigns")
    .insert({
      message: message.trim(),
      recipient_count: validRecipients.length,
      status: "sending",
      recipients: recipientData,
      sent_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (createError) return NextResponse.json({ error: createError.message }, { status: 500 });

  // Send SMS to each recipient
  const serviceNumber = process.env.MAGPIPE_SMS_FROM;
  const apiKey = process.env.MAGPIPE_API_KEY;

  let sentCount = 0;
  let failedCount = 0;

  for (const recipient of validRecipients) {
    try {
      // Replace personalization variables
      const firstName = recipient.name.split(" ")[0] || recipient.name;
      const personalizedMsg = message.trim()
        .replace(/\{\{first_name\}\}/gi, firstName)
        .replace(/\{\{name\}\}/gi, recipient.name)
        .replace(/\{\{phone\}\}/gi, recipient.normalized_phone);

      const res = await fetch("https://api.magpipe.ai/functions/v1/send-user-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          serviceNumber,
          contactPhone: recipient.normalized_phone,
          message: personalizedMsg,
        }),
      });

      if (res.ok) {
        sentCount++;
      } else {
        console.error(`[campaigns] SMS failed for ${recipient.name}:`, await res.text());
        failedCount++;
      }
    } catch (err) {
      console.error(`[campaigns] SMS error for ${recipient.name}:`, err);
      failedCount++;
    }
  }

  // Update campaign with results
  const { error: updateError } = await supabase
    .from("campaigns")
    .update({
      sent_count: sentCount,
      failed_count: failedCount,
      status: failedCount === validRecipients.length ? "failed" : "completed",
    })
    .eq("id", campaign.id);

  if (updateError) console.error("[campaigns] Failed to update campaign:", updateError);

  return NextResponse.json({
    ...campaign,
    sent_count: sentCount,
    failed_count: failedCount,
    status: failedCount === validRecipients.length ? "failed" : "completed",
  }, { status: 201 });
}
