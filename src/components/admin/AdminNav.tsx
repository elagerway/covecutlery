"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

interface AdminNavProps {
  email: string;
}

export default function AdminNav({ email }: AdminNavProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  const links = [
    { label: "Blog Posts", href: "/admin/blog", icon: (
      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    )},
  ];

  return (
    <aside
      className="w-56 flex flex-col shrink-0 border-r"
      style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: "#30363D" }}>
        <div className="flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4A017" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21L12 3l2 2-7 14z" />
            <path d="M14 5l6-2-2 6" />
            <path d="M14 5l2 2" />
          </svg>
          <span className="font-bold text-white text-sm">Cove Cutlery</span>
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
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: active ? "#D4A01722" : "transparent",
                color: active ? "#D4A017" : "#6B7280",
              }}
            >
              {icon}
              {label}
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
    </aside>
  );
}
