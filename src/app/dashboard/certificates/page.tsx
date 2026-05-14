import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Award } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function MyCertificatesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: certs } = await supabase
    .from("certificates")
    .select("id, short_code, course_title, issued_date, revoked_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const list = certs ?? [];

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold text-white mb-1">Certificates</h1>
      <p className="text-sm text-neutral-400 mb-6">Your training certificates.</p>

      {list.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center">
            <Award className="mx-auto size-10 text-neutral-600 mb-3" />
            <p className="text-neutral-400">You don't have any certificates yet.</p>
            <p className="text-sm text-neutral-500 mt-1">Complete a course and your instructor can issue one.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {list.map((c) => {
            const revoked = !!c.revoked_at;
            return (
              <Card key={c.id}>
                <CardContent className="py-5 flex items-center justify-between gap-4">
                  <div>
                    <p className="text-white font-semibold">{c.course_title}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Issued {new Date(c.issued_date + "T12:00:00").toLocaleDateString()} · <span className="font-mono">{c.short_code}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {revoked ? (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-red-500/10 text-red-400">Revoked</span>
                    ) : (
                      <>
                        <Link
                          href={`/certificates/${c.short_code}`}
                          className="text-xs text-neutral-400 hover:text-white"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Verify
                        </Link>
                        <a
                          href={`/api/certificates/${c.id}/download`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2 rounded-lg text-sm font-semibold bg-emerald-500 text-white hover:bg-emerald-600"
                        >
                          Download
                        </a>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
