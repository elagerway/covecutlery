"use client";

import { useState, useRef } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import {
  Loader2,
  CreditCard,
  ArrowRight,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface Props {
  courseSlug: string;
  courseName: string;
  price: string;
  priceNote?: string;
}

type State = "idle" | "loading" | "etransfer_sent" | "error";

const inputClass =
  "w-full rounded-lg px-4 py-3 text-sm text-white placeholder-[#6B7280] border outline-none transition-all duration-200 focus:border-[#D4A017]";
const inputStyle = {
  backgroundColor: "#161B22",
  borderColor: "#30363D",
  color: "#FFFFFF",
};
const labelClass = "block text-xs font-medium uppercase tracking-wide mb-1.5";
const labelStyle = { color: "#6B7280" };

export default function CourseSignUp({
  courseSlug,
  courseName,
  price,
  priceNote,
}: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [showEtransfer, setShowEtransfer] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  const valid = name.trim() && email.trim() && token;

  async function handlePayCard() {
    if (!valid) return;
    setState("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/courses/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug,
          customerName: name.trim(),
          customerEmail: email.trim(),
          customerPhone: phone.trim() || undefined,
          cfToken: token,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setState("error");
        setErrorMsg(data.error || "Something went wrong");
      }
    } catch {
      setState("error");
      setErrorMsg("Network error — please try again");
    }
  }

  if (state === "etransfer_sent") {
    return (
      <div className="text-center py-6">
        <CheckCircle
          size={40}
          className="mx-auto mb-4"
          style={{ color: "#22C55E" }}
        />
        <p className="font-bold text-white mb-2">
          Thanks, {name.split(" ")[0]}!
        </p>
        <p className="text-sm" style={{ color: "#9CA3AF" }}>
          Once we receive your e-Transfer we&rsquo;ll send you access to the
          online course and details for booking your practicum.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Name / Email / Phone */}
      <div>
        <label className={labelClass} style={labelStyle}>
          Name
        </label>
        <input
          type="text"
          className={inputClass}
          style={inputStyle}
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label className={labelClass} style={labelStyle}>
          Email
        </label>
        <input
          type="email"
          className={inputClass}
          style={inputStyle}
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label className={labelClass} style={labelStyle}>
          Phone{" "}
          <span className="font-normal normal-case">(optional)</span>
        </label>
        <input
          type="tel"
          className={inputClass}
          style={inputStyle}
          placeholder="604-xxx-xxxx"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <Turnstile
        ref={turnstileRef}
        siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
        onSuccess={setToken}
        options={{ theme: "dark", size: "flexible" }}
      />

      {/* Pay with Card */}
      <button
        onClick={handlePayCard}
        disabled={!valid || state === "loading"}
        className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
        style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
      >
        {state === "loading" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <CreditCard className="w-4 h-4" />
        )}
        {state === "loading"
          ? "Redirecting..."
          : `Sign Up & Pay ${price} with Card`}
      </button>

      {/* E-transfer toggle */}
      <button
        onClick={() => setShowEtransfer(!showEtransfer)}
        className="w-full py-3 rounded-xl text-sm font-medium transition-colors hover:bg-white/5 flex items-center justify-center gap-2"
        style={{ border: "1px solid #30363D", color: "#FFFFFF" }}
      >
        <ArrowRight
          className={`w-4 h-4 transition-transform ${showEtransfer ? "rotate-90" : ""}`}
        />
        Pay via Interac e-Transfer
      </button>

      {showEtransfer && (
        <div
          className="p-4 rounded-xl"
          style={{ backgroundColor: "#0D1117", border: "1px solid #30363D" }}
        >
          <p className="text-sm text-white mb-3">
            Send an Interac e-Transfer with these details:
          </p>
          <div className="flex flex-col gap-2.5">
            <div>
              <p className="text-xs" style={{ color: "#6B7280" }}>
                Send to
              </p>
              <p className="text-sm font-medium text-white">
                pay@coveblades.com
              </p>
            </div>
            <div>
              <p className="text-xs" style={{ color: "#6B7280" }}>
                Amount
              </p>
              <p className="text-sm font-medium text-white">{price} CAD</p>
            </div>
            <div>
              <p className="text-xs" style={{ color: "#6B7280" }}>
                Message (include your name + course)
              </p>
              <p
                className="text-sm font-mono px-2 py-1.5 rounded"
                style={{ backgroundColor: "#161B22", color: "#D4A017" }}
              >
                {name.trim() || "Your Name"} — {courseName}
              </p>
            </div>
          </div>
          <p className="text-xs mt-3" style={{ color: "#6B7280" }}>
            Once we receive the transfer we&rsquo;ll send you access to the
            online course and details for booking your practicum.
          </p>
          {valid && (
            <button
              onClick={async () => {
                setState("loading");
                try {
                  await fetch("/api/courses/enroll", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      courseSlug,
                      customerName: name.trim(),
                      customerEmail: email.trim(),
                      customerPhone: phone.trim() || undefined,
                      paymentMethod: "etransfer",
                      cfToken: token,
                    }),
                  });
                } catch {
                  /* best-effort */
                }
                setState("etransfer_sent");
              }}
              disabled={state === "loading"}
              className="w-full mt-4 py-3 rounded-xl text-sm font-semibold transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50"
              style={{
                backgroundColor: "rgba(212,160,23,0.15)",
                color: "#D4A017",
                border: "1px solid rgba(212,160,23,0.3)",
              }}
            >
              {state === "loading" ? "Saving..." : "I've Sent the e-Transfer"}
            </button>
          )}
        </div>
      )}

      {priceNote && (
        <p className="text-xs text-center" style={{ color: "#6B7280" }}>
          {priceNote}
        </p>
      )}

      {state === "error" && (
        <div
          className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm"
          style={{
            backgroundColor: "rgba(239,68,68,0.1)",
            color: "#EF4444",
            border: "1px solid rgba(239,68,68,0.3)",
          }}
        >
          <AlertCircle size={16} />
          {errorMsg}
        </div>
      )}
    </div>
  );
}
