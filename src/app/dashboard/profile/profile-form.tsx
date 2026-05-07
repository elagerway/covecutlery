"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Check, Loader2, Trash2 } from "lucide-react";

interface ProfileFormProps {
  userId: string;
  email: string;
  fullName: string;
  avatarUrl: string;
}

export function ProfileForm({ userId, email, fullName: initialName, avatarUrl: initialAvatar }: ProfileFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(initialName);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatar);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initials = fullName
    ? fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : email.slice(0, 2).toUpperCase();

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2MB.");
      return;
    }

    setUploading(true);
    setError(null);

    const ext = file.name.split(".").pop();
    const filePath = `avatars/${userId}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      setError("Failed to upload avatar. Please try again.");
      setUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(filePath);
    setAvatarUrl(publicUrl);
    setUploading(false);
  }

  async function handleRemoveAvatar() {
    setAvatarUrl("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ full_name: fullName.trim(), avatar_url: avatarUrl || null })
      .eq("user_id", userId);

    if (updateError) {
      setError("Failed to update profile. Please try again.");
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      router.refresh();
    }

    setSaving(false);
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Avatar section */}
      <Card>
        <CardContent className="py-6">
          <Label className="mb-4 block">Avatar</Label>
          <div className="flex items-center gap-6">
            <div className="relative group">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="size-20 rounded-full object-cover border-2 border-neutral-700" />
              ) : (
                <div className="flex size-20 items-center justify-center rounded-full bg-neutral-700 border-2 border-neutral-600 text-xl font-bold text-white">
                  {initials}
                </div>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {uploading ? <Loader2 className="size-5 text-white animate-spin" /> : <Camera className="size-5 text-white" />}
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload Photo"}
                </Button>
                {avatarUrl && (
                  <Button type="button" variant="ghost" size="sm" onClick={handleRemoveAvatar}>
                    <Trash2 className="size-4" />
                  </Button>
                )}
              </div>
              <p className="text-xs text-neutral-500">JPG, PNG or WebP. Max 2MB.</p>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
        </CardContent>
      </Card>

      {/* Name + Email */}
      <Card>
        <CardContent className="py-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} disabled className="opacity-50" />
            <p className="text-xs text-neutral-500">Email is tied to your login and cannot be changed here.</p>
          </div>
        </CardContent>
      </Card>

      {error && (
        <p className="text-sm text-red-400 px-1">{error}</p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" size="lg" disabled={saving}>
          {saving ? (
            <><Loader2 className="size-4 animate-spin" /> Saving...</>
          ) : saved ? (
            <><Check className="size-4" /> Saved!</>
          ) : (
            "Save Changes"
          )}
        </Button>
        {saved && <span className="text-sm text-emerald-400">Profile updated.</span>}
      </div>
    </form>
  );
}
