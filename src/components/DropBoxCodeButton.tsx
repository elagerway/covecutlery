"use client";

import { useState, useRef, useEffect } from "react";
import { Phone, MessageSquare, Lock } from "lucide-react";

const PHONE = "6042108180";
const DISPLAY = "604-210-8180";

export default function DropBoxCodeButton({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className={`relative inline-block ${className ?? ""}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-center gap-2 px-8 py-4 rounded-lg font-semibold text-base border-2 transition-all duration-200 hover:bg-yellow-900/20 active:scale-95"
        style={{ borderColor: "#D4A017", color: "#D4A017" }}
      >
        <Lock className="w-4 h-4" />
        Get Drop Box Code
      </button>

      {open && (
        <div
          className="absolute left-1/2 -translate-x-1/2 mt-2 w-56 rounded-xl shadow-2xl overflow-hidden z-50"
          style={{ backgroundColor: "#161B22", border: "1px solid #30363D" }}
        >
          <p className="px-4 pt-3 pb-1 text-xs font-medium" style={{ color: "#6B7280" }}>
            Contact us for the code
          </p>
          <a
            href={`tel:${PHONE}`}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-white/10"
            style={{ color: "#FFFFFF" }}
            onClick={() => setOpen(false)}
          >
            <Phone className="w-4 h-4 flex-shrink-0" style={{ color: "#D4A017" }} />
            Call {DISPLAY}
          </a>
          <a
            href={`sms:${PHONE}`}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-white/10"
            style={{ color: "#FFFFFF", borderTop: "1px solid #30363D" }}
            onClick={() => setOpen(false)}
          >
            <MessageSquare className="w-4 h-4 flex-shrink-0" style={{ color: "#D4A017" }} />
            Text {DISPLAY}
          </a>
        </div>
      )}
    </div>
  );
}
