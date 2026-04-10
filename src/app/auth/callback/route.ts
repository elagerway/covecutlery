import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/admin/blog";
  if (!next.startsWith("/")) next = "/admin/blog";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const allowedHosts = ["covecutlery.ca", "www.covecutlery.ca", "covecutlery.vercel.app", "localhost:3002"];
      const forwardedHost = request.headers.get("x-forwarded-host");
      const base =
        forwardedHost && allowedHosts.includes(forwardedHost)
          ? `https://${forwardedHost}`
          : origin;
      return NextResponse.redirect(`${base}${next}`);
    }
  }

  const url = new URL("/admin/login", origin);
  url.searchParams.set("error", "auth");
  return NextResponse.redirect(url);
}
