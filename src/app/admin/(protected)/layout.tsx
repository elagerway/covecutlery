import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import { ADMIN_EMAILS } from "@/lib/admin";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email!)) {
    redirect("/auth/login?redirect=/admin");
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#0D1117" }}>
      <AdminNav email={user.email!} />
      <main className="flex-1 overflow-auto p-4 md:p-8 pb-20 md:pb-8">
        <div className="max-w-[1400px]">{children}</div>
      </main>
    </div>
  );
}
