import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { DashboardSidebar } from "./sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirect=/dashboard");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url, xp, level, streak_days")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="flex min-h-screen bg-neutral-950">
      <DashboardSidebar
        user={{ email: user.email ?? "", fullName: profile?.full_name ?? "", avatarUrl: profile?.avatar_url ?? null }}
        stats={{ xp: profile?.xp ?? 0, level: profile?.level ?? 1, streak: profile?.streak_days ?? 0 }}
      />
      <main className="flex-1 overflow-y-auto p-6 lg:p-10">{children}</main>
    </div>
  );
}
