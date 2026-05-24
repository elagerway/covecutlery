const SESSION_KEY = "cb_sid";

function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function track(name: string, props: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  // Skip /admin and /dashboard — internal pages shouldn't pollute customer analytics.
  if (window.location.pathname.startsWith("/admin") || window.location.pathname.startsWith("/dashboard")) {
    return;
  }
  const payload = {
    name,
    props,
    path: window.location.pathname,
    referrer: document.referrer || null,
    session_id: getSessionId(),
  };
  try {
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      navigator.sendBeacon("/api/events", blob);
    } else {
      fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // analytics failures must never break the user-facing flow
  }
}
