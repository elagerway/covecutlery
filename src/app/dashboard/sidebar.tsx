"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { BookOpen, User, LayoutDashboard, LogOut, Flame, Trophy, Star, Award, Shield } from "lucide-react";
import { cn } from "@/lib/cn";

// Mirrors ADMIN_EMAILS in src/lib/admin.ts (kept inline because admin.ts pulls in server-only imports).
const ADMIN_EMAILS = ["elagerway@gmail.com", "claude-admin@coveblades.com"];

interface SidebarProps {
  user: { email: string; fullName: string; avatarUrl: string | null };
  stats: { xp: number; level: number; streak: number };
}

const navItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Courses", href: "/dashboard/courses", icon: BookOpen },
  { label: "Certificates", href: "/dashboard/certificates", icon: Award },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

export function DashboardSidebar({ user, stats }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showUserModal, setShowUserModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showUserModal) return;
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowUserModal(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showUserModal]);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const initials = user.fullName
    ? user.fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    : user.email.slice(0, 2).toUpperCase();

  const isAdmin = ADMIN_EMAILS.includes(user.email);

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-neutral-800 bg-neutral-900/50">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-neutral-800">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500">
            <span className="text-xs font-bold text-white">CB</span>
          </div>
          <span className="text-sm font-semibold text-white">Cove Blades Training</span>
        </Link>
      </div>

      {/* Stats bar */}
      <div className="px-5 py-4 border-b border-neutral-800 flex items-center gap-4">
        <span className="flex items-center gap-1 text-xs text-neutral-400">
          <Trophy className="size-3 text-amber-500" />{stats.xp} XP
        </span>
        <span className="flex items-center gap-1 text-xs text-neutral-400">
          <Star className="size-3 text-emerald-400" />Lvl {stats.level}
        </span>
        <span className="flex items-center gap-1 text-xs text-neutral-400">
          <Flame className="size-3 text-orange-400" />{stats.streak}d
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                isActive
                  ? "bg-emerald-500/10 text-emerald-400 font-medium"
                  : "text-neutral-400 hover:text-white hover:bg-neutral-800"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User section with popover */}
      <div className="relative border-t border-neutral-800 px-3 py-4">
        <button
          onClick={() => setShowUserModal(!showUserModal)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          {user.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="size-8 rounded-full" />
          ) : (
            <div className="flex size-8 items-center justify-center rounded-full bg-neutral-700 text-xs font-bold text-white">
              {initials}
            </div>
          )}
          <div className="flex-1 text-left">
            <p className="text-sm font-medium text-neutral-200 truncate">{user.fullName || user.email.split("@")[0]}</p>
            <p className="text-xs text-neutral-500 truncate">{user.email}</p>
          </div>
        </button>

        {/* User modal popover */}
        {showUserModal && (
          <div
            ref={modalRef}
            className="absolute bottom-full left-3 right-3 mb-2 rounded-xl border border-neutral-700 bg-neutral-900 p-4 shadow-2xl z-50"
          >
            {/* Avatar + info */}
            <div className="flex items-center gap-3 mb-3 pb-3 border-b border-neutral-800">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="" className="size-10 rounded-full" />
              ) : (
                <div className="flex size-10 items-center justify-center rounded-full bg-neutral-700 text-sm font-bold text-white">
                  {initials}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.fullName || user.email.split("@")[0]}</p>
                <p className="text-xs text-neutral-500 truncate">{user.email}</p>
              </div>
            </div>

            {/* Links */}
            <Link
              href="/dashboard/profile"
              onClick={() => setShowUserModal(false)}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors"
            >
              <User className="size-4" />
              Profile Settings
            </Link>
            {isAdmin && (
              <Link
                href="/admin/invoices"
                onClick={() => setShowUserModal(false)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-[#D4A017] hover:bg-[#D4A017]/10 transition-colors"
              >
                <Shield className="size-4" />
                Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="size-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
