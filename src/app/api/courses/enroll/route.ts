import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { safeOrigin } from "@/lib/origin";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!);
}

const COURSES: Record<string, { name: string; amount: number; description: string }> = {
  "one-inch-grinder": { name: "One-Inch Grinder Course", amount: 60000, description: "Online course + 3-hour hands-on practicum" },
  "two-inch-grinder": { name: "Two-Inch Grinder Module", amount: 40000, description: "Hands-on training on two-inch belt platform" },
  "business-process": { name: "Business Process & Automation", amount: 20000, description: "Two-hour business operations discussion" },
  "build-your-business": { name: "Build Your Business with AI — Hands-On", amount: 60000, description: "3–4 hour one-on-one business build session" },
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { courseSlug, customerName, customerEmail, customerPhone, paymentMethod, cfToken } = body;

  const course = COURSES[courseSlug as string];
  if (!course || !customerName || !customerEmail) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (cfToken && process.env.TURNSTILE_SECRET_KEY) {
    try {
      const tsRes = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ secret: process.env.TURNSTILE_SECRET_KEY, response: cfToken }),
        },
      );
      const tsData: { success: boolean } = await tsRes.json();
      if (!tsData.success) {
        return NextResponse.json({ error: "CAPTCHA verification failed." }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: "CAPTCHA verification unavailable." }, { status: 503 });
    }
  }

  const origin = safeOrigin(req);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const { data: enrollment, error: insertError } = await supabase
    .from("course_enrollments")
    .insert({
      course_slug: courseSlug,
      course_name: course.name,
      amount: course.amount,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone ?? null,
      status: "pending_payment",
    })
    .select("id")
    .single();

  if (insertError || !enrollment) {
    console.error("Supabase insert error:", JSON.stringify(insertError));
    return NextResponse.json({ error: "Failed to create enrollment" }, { status: 500 });
  }

  if (paymentMethod === "etransfer") {
    await supabase
      .from("course_enrollments")
      .update({ payment_method: "etransfer" })
      .eq("id", enrollment.id);
    return NextResponse.json({ ok: true });
  }

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "cad",
          product_data: {
            name: course.name,
            description: course.description,
          },
          unit_amount: course.amount,
        },
        quantity: 1,
      },
    ],
    customer_email: customerEmail,
    metadata: {
      course_enrollment_id: enrollment.id,
      customerName,
      customerEmail,
      customerPhone: customerPhone ?? "",
    },
    success_url: `${origin}/train-to-be-sharp/${courseSlug}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/train-to-be-sharp/${courseSlug}`,
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
  });

  await supabase
    .from("course_enrollments")
    .update({ stripe_session_id: session.id })
    .eq("id", enrollment.id);

  return NextResponse.json({ url: session.url });
}
