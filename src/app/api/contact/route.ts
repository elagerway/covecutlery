import { NextRequest, NextResponse, after } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { ADMIN_EMAILS } from "@/lib/admin";
import { sendEmail } from "@/lib/notify";
import { sendSms } from "@/lib/magpipe";
import { ADMIN_PHONE } from "@/lib/bookingNotify";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, service_type, item_count, message, address, captchaToken } = body;

    // Basic validation (cheap checks first)
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    // Guard captchaToken before sending upstream
    if (!captchaToken || typeof captchaToken !== "string" || captchaToken.length > 2048) {
      return NextResponse.json({ error: "CAPTCHA required." }, { status: 400 });
    }

    // Verify Turnstile CAPTCHA
    let turnstileData: { success: boolean };
    try {
      const turnstileRes = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            secret: process.env.TURNSTILE_SECRET_KEY,
            response: captchaToken,
          }),
        }
      );
      turnstileData = await turnstileRes.json();
    } catch {
      return NextResponse.json({ error: "CAPTCHA verification unavailable." }, { status: 503 });
    }
    if (!turnstileData.success) {
      return NextResponse.json({ error: "CAPTCHA verification failed." }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Missing Supabase environment variables.");
      return NextResponse.json(
        { error: "Server configuration error." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { error: dbError } = await supabase
      .from("contact_submissions")
      .insert([
        {
          name: name.trim(),
          phone: phone?.trim() ?? null,
          email: email.trim().toLowerCase(),
          service_type: service_type ?? null,
          item_count: item_count ?? null,
          message: message?.trim() ?? null,
          address: address?.trim() ?? null,
        },
      ]);

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { error: "Failed to save your submission. Please try again." },
        { status: 500 }
      );
    }

    // Submissions used to land only in contact_submissions, which nothing reads —
    // email and text them so they're actually seen. Both are best-effort and run
    // after the response: the submission is already saved, and Magpipe can take
    // ~10s, which the visitor shouldn't sit through.
    const isBusinessSale = service_type === "business-sale";
    const label = isBusinessSale ? "business-for-sale inquiry" : `website inquiry${service_type ? ` (${service_type})` : ""}`;
    const snippet = message?.trim() ? ` "${message.trim().slice(0, 140)}${message.trim().length > 140 ? "…" : ""}"` : "";
    after(async () => {
      const emailTask = sendEmail({
        to: ADMIN_EMAILS[0],
        replyTo: email.trim(),
        subject: isBusinessSale
          ? `Business-for-sale inquiry — ${name.trim()}`
          : `Website inquiry${service_type ? ` (${service_type})` : ""} — ${name.trim()}`,
        text: [
          `Name: ${name.trim()}`,
          `Email: ${email.trim()}`,
          `Phone: ${phone?.trim() || "(none)"}`,
          service_type ? `Type: ${service_type}` : null,
          item_count ? `Knives: ${item_count}` : null,
          address ? `Address: ${address.trim()}` : null,
          ``,
          message?.trim() || "(no message)",
          ``,
          `Reply to this email to answer them directly.`,
        ].filter((l) => l !== null).join("\n"),
      });
      const smsTask = sendSms({
        to: ADMIN_PHONE,
        message: `New ${label}: ${name.trim()} (${email.trim()}${phone?.trim() ? `, ${phone.trim()}` : ""}).${snippet} Full details in your email.`,
      }).catch((e) => console.error("[contact] SMS notify failed:", e));
      await Promise.all([emailTask, smsTask]);
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
