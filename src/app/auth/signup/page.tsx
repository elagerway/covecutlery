"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" /></div>}>
      <SignupForm />
    </Suspense>
  );
}

interface InviteData {
  email: string;
  courseTitle: string;
  courseSlug: string;
  courseId: string;
  existingUser: boolean;
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("invite");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [inviteData, setInviteData] = useState<InviteData | null>(null);
  const [inviteLoading, setInviteLoading] = useState(true);
  const [inviteError, setInviteError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace("/courses");
    });
  }, [router, supabase.auth]);

  useEffect(() => {
    if (!inviteToken) {
      setInviteLoading(false);
      return;
    }

    fetch(`/api/auth/validate-invite?token=${encodeURIComponent(inviteToken)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.valid) {
          setInviteData(data);
          setEmail(data.email);
        } else {
          setInviteError(data.reason || "Invalid invite");
        }
      })
      .catch(() => setInviteError("Failed to validate invite"))
      .finally(() => setInviteLoading(false));
  }, [inviteToken]);

  async function handleEmailSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!firstName.trim() || !lastName.trim()) {
      setError("First and last name are required.");
      setLoading(false);
      return;
    }

    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    const callbackNext = inviteData
      ? `/courses/${inviteData.courseSlug}`
      : "/courses";
    const inviteParam = inviteToken ? `&invite=${encodeURIComponent(inviteToken)}` : "";
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(callbackNext)}${inviteParam}`;

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName, redirectTo }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      }
      if (data.warning) {
        setError(`Account created but the confirmation email failed to send. Please contact support.`);
        setLoading(false);
        return;
      }
    } catch {
      setError("Signup failed. Please try again.");
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  async function handleGoogleLogin() {
    const origin = window.location.hostname === "localhost"
      ? `http://localhost:${window.location.port}`
      : window.location.origin;

    const callbackNext = inviteData
      ? `/courses/${inviteData.courseSlug}`
      : "/courses";
    const inviteParam = inviteToken ? `&invite=${encodeURIComponent(inviteToken)}` : "";

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(callbackNext)}${inviteParam}`,
      },
    });
    if (error) setError(error.message);
  }

  if (inviteLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 bg-neutral-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (!inviteToken || inviteError) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 bg-neutral-950">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Invitation Required</CardTitle>
            <CardDescription>
              {inviteError || <>Signup is by invitation only. If you&apos;ve received an invite, please use the link from your email, or <a href="mailto:info@coveblades.com" className="text-emerald-400 hover:underline">contact us</a> to request access.</>}
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <p className="text-sm text-neutral-400">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-emerald-400 hover:underline">Sign in</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (inviteData?.existingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 bg-neutral-950">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">You already have an account</CardTitle>
            <CardDescription>
              Sign in with <strong className="text-white">{inviteData.email}</strong> to access <strong className="text-white">{inviteData.courseTitle}</strong>.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <Link
              href={`/auth/login?redirect=${encodeURIComponent(`/auth/callback?invite=${inviteToken}&next=/courses/${inviteData.courseSlug}`)}`}
              className="inline-flex h-10 items-center justify-center rounded-md bg-emerald-500 px-6 text-sm font-medium text-white transition-colors hover:bg-emerald-600"
            >
              Sign In
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 bg-neutral-950">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Check your email</CardTitle>
            <CardDescription>
              We sent a confirmation link to <strong className="text-white">{email}</strong>. Click the link to activate your account and start <strong className="text-white">{inviteData?.courseTitle}</strong>.
            </CardDescription>
          </CardHeader>
          <CardFooter className="justify-center">
            <p className="text-sm text-neutral-400">
              Already confirmed?{" "}
              <Link href="/auth/login" className="text-emerald-400 hover:underline">Sign in</Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-neutral-950">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-white">Create your account</CardTitle>
          <CardDescription>
            You&apos;ve been invited to <strong className="text-white">{inviteData?.courseTitle}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" size="lg" className="w-full" onClick={handleGoogleLogin}>
            <svg className="size-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-neutral-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-neutral-900 px-2 text-neutral-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleEmailSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input id="firstName" type="text" autoComplete="given-name" placeholder="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" type="text" autoComplete="family-name" placeholder="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                readOnly
                className="opacity-70 cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete="new-password" placeholder="Create a password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-neutral-400">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-emerald-400 hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
