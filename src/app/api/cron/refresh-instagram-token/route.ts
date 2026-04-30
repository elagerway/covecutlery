import { NextRequest, NextResponse } from "next/server";
import { getCredential, setCredential } from "@/lib/credentials";
import { INSTAGRAM_TOKEN_KEY } from "@/lib/instagram";

/**
 * Vercel cron — runs weekly. Refreshes the Instagram long-lived (60-day)
 * access token if it's within the refresh window (default: 14 days from
 * expiry), so the IG feed never silently breaks from token expiry.
 *
 * Trigger: Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}`. Any
 * unauthenticated caller gets 401.
 *
 * Manual trigger (for testing):
 *   curl -H "Authorization: Bearer ${CRON_SECRET}" \
 *        "https://coveblades.com/api/cron/refresh-instagram-token"
 */

export const dynamic = "force-dynamic";

const REFRESH_WHEN_WITHIN_DAYS = 14;
const TOKEN_LIFETIME_SECONDS = 60 * 60 * 24 * 60; // 60 days

export async function GET(req: NextRequest) {
  // Auth — Vercel Cron attaches Authorization: Bearer ${CRON_SECRET}
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return NextResponse.json({ error: "CRON_SECRET not configured" }, { status: 500 });
  }
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${expected}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const appId = process.env.INSTAGRAM_APP_ID;
  const appSecret = process.env.INSTAGRAM_APP_SECRET;
  if (!appId || !appSecret) {
    return NextResponse.json(
      { error: "INSTAGRAM_APP_ID or INSTAGRAM_APP_SECRET not configured" },
      { status: 500 },
    );
  }

  // Read current token + expiry from Supabase. Fall back to env on cold start.
  const stored = await getCredential(INSTAGRAM_TOKEN_KEY);
  const currentToken = stored?.value ?? process.env.INSTAGRAM_ACCESS_TOKEN ?? null;
  const currentExpiresAt = stored?.expires_at ? new Date(stored.expires_at) : null;

  if (!currentToken) {
    return NextResponse.json(
      { error: "No current Instagram token (neither Supabase row nor env)" },
      { status: 500 },
    );
  }

  // Decide whether to refresh.
  const now = new Date();
  let shouldRefresh = false;
  let reason = "";

  if (!currentExpiresAt) {
    shouldRefresh = true;
    reason = "no expires_at recorded — refreshing to establish the rotation cadence";
  } else {
    const daysUntilExpiry = (currentExpiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    if (daysUntilExpiry <= REFRESH_WHEN_WITHIN_DAYS) {
      shouldRefresh = true;
      reason = `expires in ${daysUntilExpiry.toFixed(1)} days (threshold: ${REFRESH_WHEN_WITHIN_DAYS})`;
    } else {
      reason = `expires in ${daysUntilExpiry.toFixed(1)} days — no refresh needed`;
    }
  }

  if (!shouldRefresh) {
    return NextResponse.json({
      refreshed: false,
      reason,
      expires_at: currentExpiresAt?.toISOString() ?? null,
    });
  }

  // Refresh: exchange the current long-lived token for a new long-lived token.
  const refreshUrl =
    `https://graph.facebook.com/v21.0/oauth/access_token` +
    `?grant_type=fb_exchange_token` +
    `&client_id=${appId}` +
    `&client_secret=${appSecret}` +
    `&fb_exchange_token=${currentToken}`;

  try {
    const res = await fetch(refreshUrl, { cache: "no-store" });
    const body = (await res.json()) as {
      access_token?: string;
      expires_in?: number;
      error?: { message: string; type: string; code: number };
    };
    if (!res.ok || !body.access_token) {
      console.error("[cron/instagram] Meta refresh failed:", body);
      return NextResponse.json(
        { refreshed: false, error: body.error?.message ?? "Meta refresh failed", body },
        { status: 502 },
      );
    }

    const newExpiresAt = new Date(
      now.getTime() + (body.expires_in ?? TOKEN_LIFETIME_SECONDS) * 1000,
    );

    const saved = await setCredential(
      INSTAGRAM_TOKEN_KEY,
      body.access_token,
      newExpiresAt.toISOString(),
    );
    if (!saved) {
      console.error("[cron/instagram] Token refreshed but Supabase write failed");
      return NextResponse.json(
        { refreshed: false, error: "Supabase write failed" },
        { status: 500 },
      );
    }

    console.log(
      `[cron/instagram] Token refreshed. Old expiry: ${currentExpiresAt?.toISOString() ?? "(none)"}, new expiry: ${newExpiresAt.toISOString()}`,
    );

    return NextResponse.json({
      refreshed: true,
      reason,
      previous_expires_at: currentExpiresAt?.toISOString() ?? null,
      new_expires_at: newExpiresAt.toISOString(),
      expires_in_seconds: body.expires_in ?? TOKEN_LIFETIME_SECONDS,
    });
  } catch (err) {
    console.error("[cron/instagram] Refresh threw:", err);
    return NextResponse.json(
      { refreshed: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
