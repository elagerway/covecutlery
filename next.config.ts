import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

// Fail the build if a project env var carries whitespace/newline garbage —
// a trailing "\n" in NEXT_PUBLIC_TURNSTILE_SITE_KEY once shipped a broken
// captcha to production for three months before anyone noticed.
const PROJECT_ENV_PREFIXES = [
  "NEXT_PUBLIC_",
  "SUPABASE_",
  "CAL_",
  "MAGPIPE_",
  "INSTAGRAM_",
  "TURNSTILE_",
  "STRIPE_",
  "POSTMARK_",
  "CRON_",
  "GOOGLE_",
];
for (const [key, value] of Object.entries(process.env)) {
  if (!PROJECT_ENV_PREFIXES.some((p) => key.startsWith(p)) || !value) continue;
  // Vercel-injected system vars (e.g. NEXT_PUBLIC_VERCEL_GIT_COMMIT_MESSAGE)
  // legitimately contain newlines and aren't ours to validate
  if (key.startsWith("NEXT_PUBLIC_VERCEL_")) continue;
  if (/^\s|\s$|[\r\n]|\\n/.test(value)) {
    throw new Error(
      `Env var ${key} contains leading/trailing whitespace or a newline. ` +
        `Fix it (e.g. re-add with: printf '%s' 'VALUE' | vercel env add ${key} production) and rebuild.`
    );
  }
}

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
});

const nextConfig: NextConfig = {
  turbopack: {},
  async redirects() {
    return [
      // Legacy WordPress blog landing on coveblades.com — preserve inbound links
      { source: "/staysharp", destination: "/blog", permanent: true },
      { source: "/staysharp/:slug", destination: "/blog/:slug", permanent: true },
    ];
  },
};

export default withPWA(nextConfig);
