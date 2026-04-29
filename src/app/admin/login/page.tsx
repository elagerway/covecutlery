"use client";

import { useState, useEffect, Suspense } from "react";
import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";

function LoginForm() {
  const [email, setEmail] = useState("elagerway@gmail.com");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("error")) {
      setError("Authentication failed. Please try again.");
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback?next=/admin/invoices`,
      },
    });
    if (error) setError(error.message);
    else setSent(true);
    setLoading(false);
  }

  return (
    <div
      className="w-full max-w-sm rounded-2xl p-8 border"
      style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <img src="/logo-icon-512.png" alt="" width={24} height={24} className="rounded" />
        <span className="font-bold text-white text-lg">Cove Blades</span>
        <span className="text-xs px-2 py-0.5 rounded-full ml-1 font-medium" style={{ backgroundColor: "#D4A01722", color: "#D4A017" }}>Admin</span>
      </div>

      {sent ? (
        <div className="text-center">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "#D4A01722" }}>
            <svg width="24" height="24" fill="none" stroke="#D4A017" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <h2 className="text-white font-semibold text-lg mb-2">Check your email</h2>
          <p className="text-sm" style={{ color: "#6B7280" }}>
            We sent a magic link to <span className="text-white">{email}</span>. Click it to sign in.
          </p>
        </div>
      ) : (
        <>
          <h1 className="text-white font-semibold text-xl mb-1">Sign in</h1>
          <p className="text-sm mb-6" style={{ color: "#6B7280" }}>
            We&apos;ll send a magic link to your email.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#6B7280" }}>
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-lg text-sm text-white outline-none focus:ring-2"
                style={{
                  backgroundColor: "#0D1117",
                  border: "1px solid #30363D",
                  // @ts-ignore
                  "--tw-ring-color": "#D4A017",
                }}
              />
            </div>

            {error && (
              <p className="text-sm" style={{ color: "#F87171" }}>{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 hover:brightness-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
            >
              {loading ? "Sending…" : "Send magic link"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#0D1117" }}
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
