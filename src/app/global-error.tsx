"use client";

// Top-level error boundary: reports crashes in the root layout/page tree to
// Sentry and shows a minimal recovery screen. Must render its own <html>.
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0D1117",
          color: "#e6edf3",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
            Something went wrong
          </h1>
          <p style={{ opacity: 0.7, marginBottom: "1.5rem" }}>
            We&apos;ve been notified and are looking into it.
          </p>
          <button
            onClick={reset}
            style={{
              padding: "0.6rem 1.4rem",
              borderRadius: "0.5rem",
              border: "1px solid #30363d",
              background: "#161b22",
              color: "#e6edf3",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
