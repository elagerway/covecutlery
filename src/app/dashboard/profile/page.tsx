import { createClient } from "@/utils/supabase/server";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-2">Profile</h1>
      <p className="text-neutral-400 text-sm mb-8">Manage your account details and avatar.</p>
      <ProfileForm
        userId={user.id}
        email={user.email ?? ""}
        fullName={profile?.full_name ?? ""}
        avatarUrl={profile?.avatar_url ?? ""}
      />
    </div>
  );
}
