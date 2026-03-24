import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";

const ADMIN_EMAIL = "elagerway@gmail.com";

export const metadata = {
  title: "Admin — Cove Cutlery",
  robots: "noindex, nofollow",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#0D1117" }}>
      <AdminNav email={user.email!} />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
