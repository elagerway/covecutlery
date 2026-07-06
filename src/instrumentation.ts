// Server-side error monitoring (Node + Edge). No-op until
// NEXT_PUBLIC_SENTRY_DSN is set.
import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

export function register() {
  Sentry.init({
    dsn,
    enabled: Boolean(dsn),
    tracesSampleRate: 0,
    sendDefaultPii: false,
  });
}

export const onRequestError = Sentry.captureRequestError;
