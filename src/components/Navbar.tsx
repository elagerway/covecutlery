"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useBooking } from "@/components/BookingProvider";
import { createBrowserClient } from "@/utils/supabase/client";

const navLinks = [
  { label: "Services", href: "/#services" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Mobile Service", href: "/#mobile-service" },
  { label: "Drop Off", href: "/#drop-off" },
  { label: "About", href: "/#about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Check if user is admin
  useEffect(() => {
    const supabase = createBrowserClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAdmin(user?.email === "elagerway@gmail.com");
    });
  }, []);

  const resolveHref = (href: string) => {
    if (isHome && href.startsWith("/#")) {
      return href.replace("/#", "#");
    }
    return href;
  };

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (isHome && href.startsWith("/#")) {
      const id = href.replace("/#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const { open: openBooking } = useBooking();

  const handleBookNow = () => {
    setMobileOpen(false);
    openBooking();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || mobileOpen
          ? "bg-[#0D1117]/95 backdrop-blur-md shadow-lg"
          : "bg-[#0D1117]/80 backdrop-blur-sm"
      } border-b border-[#30363D]`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
            aria-label="Cove Cutlery Home"
          >
            <Image src="/logo-icon-512.png" alt="" width={40} height={40} />
            <span
              className="text-[#D4A017] group-hover:text-[#e8b82a] font-bold tracking-widest text-sm sm:text-base uppercase transition-colors duration-200"
              style={{ fontFamily: "Inter, system-ui, sans-serif", letterSpacing: "0.18em" }}
            >
              Cove Cutlery
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={resolveHref(link.href)}
                onClick={() => handleNavClick(link.href)}
                className="text-sm text-[#6B7280] hover:text-white transition-colors duration-200 tracking-wide"
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin/invoices"
                className="text-sm text-[#D4A017] hover:text-white transition-colors duration-200 tracking-wide"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <button
              onClick={handleBookNow}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-md bg-[#D4A017] hover:bg-[#e8b82a] text-[#0D1117] font-semibold text-sm tracking-wide transition-all duration-200 hover:shadow-[0_0_16px_rgba(212,160,23,0.4)] active:scale-95"
            >
              Book Now
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-md text-[#6B7280] hover:text-white hover:bg-[#161B22] transition-colors duration-200"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Slide-Down Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } bg-[#0D1117] border-t border-[#30363D]`}
      >
        <div className="px-4 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={resolveHref(link.href)}
              onClick={() => handleNavClick(link.href)}
              className="px-3 py-3 rounded-md text-[#6B7280] hover:text-white hover:bg-[#161B22] transition-colors duration-200 text-sm tracking-wide"
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin/invoices"
              onClick={() => setMobileOpen(false)}
              className="px-3 py-3 rounded-md text-[#D4A017] hover:text-white hover:bg-[#161B22] transition-colors duration-200 text-sm tracking-wide"
            >
              Admin
            </Link>
          )}
          <div className="pt-3 pb-1">
            <button
              onClick={handleBookNow}
              className="flex items-center justify-center w-full py-3 rounded-md bg-[#D4A017] hover:bg-[#e8b82a] text-[#0D1117] font-semibold text-sm tracking-wide transition-all duration-200 active:scale-95"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
