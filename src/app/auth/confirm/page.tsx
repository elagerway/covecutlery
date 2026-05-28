"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type RecoveryType = "recovery" | "magiclink" | "signup" | "email_change" | "invite";

function ConfirmInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tokenHash = searchParams.get("h");
  const type = (searchParams.get("t") || "recovery") as RecoveryType;
  const rawNext = searchParams.get("next") || "/auth/reset-password";
  const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/auth/reset-password";

  const label =
    type === "recovery" ? "Confirm password reset"
      : type === "magiclink" ? "Sign in"
        : type === "signup" ? "Confirm signup"
          : type === "email_change" ? "Confirm email change"
            : type === "invite" ? "Accept invite"
              : "Continue";

  const headline =
    type === "recovery" ? "Reset your password"
      : type === "magiclink" ? "Sign in to your account"
        : type === "signup" ? "Confirm your signup"
          : "Confirm your request";

  async function handleConfirm() {
    if (!tokenHash) {
      setError("This link is missing its verification token. Request a new one.");
      return;
    }
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });

    if (verifyError) {
      setError(verifyError.message);
      setLoading(false);
      return;
    }
    router.push(next);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-neutral-950">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white">{headline}</CardTitle>
          <CardDescription>
            Click the button below to continue. We require this click so that automated
            link scanners (like Gmail&apos;s) can&apos;t consume your single-use link
            before you reach it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          <Button
            onClick={handleConfirm}
            disabled={loading || !tokenHash}
            size="lg"
            className="w-full"
          >
            {loading ? "Verifying…" : label}
          </Button>
          {!tokenHash && (
            <p className="text-sm text-neutral-400 text-center">
              This page expects a verification token in the URL. Request a new link from
              the sign-in or password-reset flow.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmInner />
    </Suspense>
  );
}
