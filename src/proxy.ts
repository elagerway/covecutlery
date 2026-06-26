import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_EMAILS } from "@/lib/admin";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Do not add any code between createServerClient and getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");

  // Send unauthenticated / non-admin visitors to the shared auth login, with
  // a redirect param so they land back where they were trying to go. The
  // /admin/login route itself just redirects to /auth/login, so we exempt it
  // here to avoid a momentary double-bounce.
  if (isAdminRoute && pathname !== "/admin/login") {
    if (!user || !ADMIN_EMAILS.includes(user.email!)) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      url.search = "";
      url.searchParams.set("redirect", pathname);
      const redirectResponse = NextResponse.redirect(url);
      // Carry over any session cookies refreshed by getUser() above so we never
      // drop a freshly-rotated session on the way to the login redirect (e.g. a
      // signed-in non-admin shouldn't get logged out just for visiting /admin).
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie);
      });
      return redirectResponse;
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    {
      // Skip prefetch requests. Next.js prefetches links in the background, but
      // those responses' Set-Cookie headers are not persisted by the browser.
      // If the proxy rotated the Supabase refresh token on a prefetch, the next
      // real navigation would send a stale token, the refresh would fail, and
      // the user would be bounced to login mid-session. Refresh only on real
      // navigations, where the rotated cookies actually stick.
      source:
        "/((?!_next/static|_next/image|favicon.ico|icon.svg|promaster.png|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
