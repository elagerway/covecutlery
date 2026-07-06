// Browser-side error monitoring. No-op until NEXT_PUBLIC_SENTRY_DSN is set
// (in Vercel and .env.local).
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn,
  enabled: Boolean(dsn),
  // errors only for now — turn up if we ever want performance tracing
  tracesSampleRate: 0,
  sendDefaultPii: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
