import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phone, email, service_type, item_count, message, captchaToken } = body;

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
        },
      ]);

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { error: "Failed to save your submission. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
