"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface AdminNavProps {
  email: string;
}

const UNREAD_POLL_MS = 30_000;

export default function AdminNav({ email }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unread, setUnread] = useState<{ sms: number; email: number }>({ sms: 0, email: 0 });

  useEffect(() => {
    async function fetchUnread() {
      try {
        const res = await fetch("/api/admin/unread-counts", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        setUnread({ sms: Number(data.sms) || 0, email: Number(data.email) || 0 });
      } catch {
        // silent — sidebar badge is non-critical
      }
    }
    fetchUnread();
    const t = setInterval(fetchUnread, UNREAD_POLL_MS);
    return () => clearInterval(t);
  }, [pathname]);

  function badgeFor(href: string): number | null {
    if (href === "/admin/messages") return unread.sms > 0 ? unread.sms : null;
    if (href === "/admin/email") return unread.email > 0 ? unread.email : null;
    return null;
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  const links = [
    { label: "Jobs", href: "/admin/jobs", icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    )},
    { label: "Invoices", href: "/admin/invoices", icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    )},
    { label: "Campaigns", href: "/admin/campaigns", icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="m3 11 18-5v12L3 13v-2z" />
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
      </svg>
    )},
    { label: "Customers", href: "/admin/customers", icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )},
    { label: "Blog Posts", href: "/admin/blog", icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    )},
    { label: "Training", href: "/admin/training", icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    )},
    { label: "Voice Agent", href: "/admin/voice-prompt", icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    )},
    { label: "Messages", href: "/admin/messages", icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    )},
    { label: "Email", href: "/admin/email", icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    )},
    { label: "Analytics", href: "/admin/analytics", icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    )},
  ];

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: "#30363D" }}>
        <div className="flex items-center gap-2">
          <img src="/logo-icon-512.png" alt="" width={20} height={20} className="rounded" />
          <span className="font-bold text-white text-sm">Cove Blades</span>
        </div>
        <div className="mt-1">
          <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: "#D4A01722", color: "#D4A017" }}>
            Admin
          </span>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {links.map(({ label, href, icon }) => {
          const active = pathname.startsWith(href);
          const badge = badgeFor(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: active ? "#D4A01722" : "transparent",
                color: active ? "#D4A017" : "#6B7280",
              }}
            >
              {icon}
              <span className="flex-1">{label}</span>
              {badge !== null && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                  style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
                >
                  {badge > 99 ? "99+" : badge}
                </span>
              )}
            </Link>
          );
        })}

        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:text-white"
          style={{ color: "#6B7280" }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          View Site
        </Link>
      </nav>

      {/* User + logout */}
      <div className="px-3 py-4 border-t" style={{ borderColor: "#30363D" }}>
        <p className="text-xs truncate mb-3 px-3" style={{ color: "#6B7280" }}>{email}</p>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:text-white text-left"
          style={{ color: "#6B7280" }}
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex md:flex-col w-56 shrink-0 border-r"
        style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile bottom bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden items-center justify-around border-t"
        style={{ backgroundColor: "#161B22", borderColor: "#30363D", height: "56px" }}
      >
        {links.map(({ label, href, icon }) => {
          const active = pathname.startsWith(href);
          const badge = badgeFor(href);
          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-col items-center gap-1 px-2 py-1"
              style={{ color: active ? "#D4A017" : "#6B7280" }}
            >
              <span className="[&>svg]:w-5 [&>svg]:h-5">{icon}</span>
              {badge !== null && (
                <span
                  className="absolute top-0 right-1 text-[9px] font-bold px-1 rounded-full min-w-[14px] text-center"
                  style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
                >
                  {badge > 9 ? "9+" : badge}
                </span>
              )}
              <span className="text-[10px] font-medium">{label === "Blog Posts" ? "Blog" : label}</span>
            </Link>
          );
        })}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="flex flex-col items-center gap-1 px-2 py-1"
          style={{ color: "#6B7280" }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
          <span className="text-[10px] font-medium">More</span>
        </button>
      </div>

      {/* Mobile slide-out menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer */}
          <aside
            className="absolute left-0 top-0 bottom-0 w-64 flex flex-col"
            style={{ backgroundColor: "#161B22" }}
          >
            {/* Close button */}
            <div className="flex justify-end px-3 pt-3">
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-lg"
                style={{ color: "#6B7280" }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}
