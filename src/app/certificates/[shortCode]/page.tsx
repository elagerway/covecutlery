import { notFound } from "next/navigation";
import Link from "next/link";
import { getServiceClient } from "@/lib/admin";

export const dynamic = "force-dynamic";

function formatDate(d: string): string {
  return new Date(d + "T12:00:00").toLocaleDateString("en-CA", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function CertificateVerifyPage({
  params,
}: {
  params: Promise<{ shortCode: string }>;
}) {
  const { shortCode } = await params;
  const supabase = getServiceClient();

  const { data: cert } = await supabase
    .from("certificates")
    .select("recipient_name, course_title, issued_date, revoked_at, short_code")
    .eq("short_code", shortCode.toUpperCase())
    .maybeSingle();

  if (!cert) notFound();

  const isRevoked = !!cert.revoked_at;

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl rounded-2xl border border-neutral-800 bg-neutral-900 p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-neutral-800">
          <div className="flex size-10 items-center justify-center rounded-lg bg-amber-500">
            <span className="text-xs font-bold text-neutral-950">CB</span>
          </div>
          <div>
            <p className="text-amber-500 font-bold tracking-wider">COVE BLADES</p>
            <p className="text-xs text-neutral-500">Certificate Verification</p>
          </div>
        </div>

        {isRevoked ? (
          <>
            <p className="text-2xl font-bold text-red-400 mb-2">⚠ Revoked</p>
            <p className="text-neutral-400">
              This certificate (<span className="font-mono text-neutral-300">{cert.short_code}</span>) has been revoked
              and is no longer valid.
            </p>
          </>
        ) : (
          <>
            <p className="text-2xl font-bold text-emerald-400 mb-4">✓ Verified</p>
            <p className="text-neutral-400 mb-1">This certificate was issued to</p>
            <p className="text-2xl font-semibold text-white mb-4">{cert.recipient_name}</p>
            <p className="text-neutral-400 mb-1">for completing</p>
            <p className="text-lg text-white mb-4">{cert.course_title}</p>
            <p className="text-neutral-400 mb-1">on</p>
            <p className="text-lg text-white mb-6">{formatDate(cert.issued_date)}</p>
            <p className="text-xs text-neutral-500 font-mono">{cert.short_code}</p>
          </>
        )}

        <div className="mt-8 pt-6 border-t border-neutral-800 text-center">
          <Link href="/" className="text-sm text-amber-500 hover:underline">
            coveblades.com
          </Link>
        </div>
      </div>
    </main>
  );
}
