import { getServiceClient } from "@/lib/admin";

export const dynamic = "force-dynamic";

interface EventRow {
  name: string;
  props: Record<string, unknown> | null;
  path: string | null;
  referrer: string | null;
  session_id: string | null;
  created_at: string;
}

const FUNNEL_STEPS: { key: string; label: string }[] = [
  { key: "book_clicked", label: "Booking CTA clicked" },
  { key: "booking_modal_opened", label: "Modal opened" },
  { key: "booking_slot_picked", label: "Time slot picked" },
  { key: "booking_submitted", label: "Form submitted" },
  { key: "booking_succeeded", label: "Booking succeeded" },
];

function todayUTC(): Date {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setUTCDate(r.getUTCDate() + n);
  return r;
}

function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

function refererHost(ref: string | null): string {
  if (!ref) return "(direct)";
  try {
    const u = new URL(ref);
    if (u.hostname === "coveblades.com" || u.hostname.endsWith(".coveblades.com")) return "(internal)";
    return u.hostname;
  } catch {
    return "(unknown)";
  }
}

export default async function AnalyticsPage() {
  const supabase = getServiceClient();
  const since = addDays(todayUTC(), -29).toISOString();

  const { data, error } = await supabase
    .from("analytics_events")
    .select("name, props, path, referrer, session_id, created_at")
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(50000);

  if (error) {
    return (
      <div className="text-white">
        <h1 className="text-2xl font-bold mb-2">Analytics</h1>
        <p className="text-sm" style={{ color: "#EF4444" }}>Failed to load events: {error.message}</p>
      </div>
    );
  }

  const events = (data ?? []) as EventRow[];

  // Daily pageviews
  const pageviewsByDay = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    pageviewsByDay.set(dayKey(addDays(todayUTC(), -i).toISOString()), 0);
  }
  for (const e of events) {
    if (e.name === "pageview") {
      const k = dayKey(e.created_at);
      if (pageviewsByDay.has(k)) pageviewsByDay.set(k, (pageviewsByDay.get(k) ?? 0) + 1);
    }
  }
  const pageviewSeries = Array.from(pageviewsByDay.entries());
  const maxPV = Math.max(1, ...pageviewSeries.map(([, v]) => v));

  // Top pages
  const pageCounts = new Map<string, number>();
  for (const e of events) {
    if (e.name === "pageview" && e.path) {
      pageCounts.set(e.path, (pageCounts.get(e.path) ?? 0) + 1);
    }
  }
  const topPages = Array.from(pageCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);

  // Booking funnel — count distinct sessions reaching each step
  const sessionsByStep = new Map<string, Set<string>>();
  for (const step of FUNNEL_STEPS) sessionsByStep.set(step.key, new Set());
  for (const e of events) {
    if (sessionsByStep.has(e.name) && e.session_id) {
      sessionsByStep.get(e.name)!.add(e.session_id);
    }
  }
  const funnelCounts = FUNNEL_STEPS.map(s => ({
    ...s,
    sessions: sessionsByStep.get(s.key)!.size,
  }));
  const funnelTop = funnelCounts[0].sessions || 1;

  // Booking failures (last 30 days) — useful canary
  const failureCount = events.filter(e => e.name === "booking_failed").length;
  const lastFailures = events
    .filter(e => e.name === "booking_failed")
    .slice(0, 5);

  // CTA clicks
  const ctaNames = ["book_clicked", "schedule_clicked", "dropbox_code_clicked", "phone_tapped", "sms_tapped"];
  const ctaCounts = ctaNames.map(n => ({
    name: n,
    count: events.filter(e => e.name === n).length,
  }));

  // Top referrers
  const refCounts = new Map<string, number>();
  for (const e of events) {
    if (e.name === "pageview") {
      const h = refererHost(e.referrer);
      refCounts.set(h, (refCounts.get(h) ?? 0) + 1);
    }
  }
  const topRefs = Array.from(refCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);

  // Top service-area pages
  const cityCounts = new Map<string, number>();
  for (const e of events) {
    if (e.name === "pageview" && e.path && e.path.startsWith("/service-area/")) {
      const slug = e.path.replace("/service-area/", "").split("/")[0];
      if (slug) cityCounts.set(slug, (cityCounts.get(slug) ?? 0) + 1);
    }
  }
  const topCities = Array.from(cityCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);

  const totalPV = pageviewSeries.reduce((s, [, v]) => s + v, 0);
  const uniqueSessions = new Set(events.filter(e => e.session_id).map(e => e.session_id)).size;

  return (
    <div className="text-white space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold mb-1">Analytics</h1>
        <p className="text-sm" style={{ color: "#6B7280" }}>Last 30 days · {events.length.toLocaleString()} events captured</p>
      </div>

      {/* Top KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard label="Pageviews" value={totalPV.toLocaleString()} />
        <KpiCard label="Unique sessions" value={uniqueSessions.toLocaleString()} />
        <KpiCard label="Successful bookings" value={(sessionsByStep.get("booking_succeeded")?.size ?? 0).toLocaleString()} />
        <KpiCard label="Booking failures" value={failureCount.toLocaleString()} accent={failureCount > 0 ? "#EF4444" : undefined} />
      </div>

      {/* Pageview chart */}
      <Section title="Pageviews per day">
        <div className="flex items-end gap-1 h-32 px-1">
          {pageviewSeries.map(([day, count]) => (
            <div key={day} className="flex-1 flex flex-col items-center gap-1" title={`${day}: ${count}`}>
              <div
                className="w-full rounded-t"
                style={{
                  height: `${(count / maxPV) * 100}%`,
                  minHeight: count > 0 ? "2px" : "1px",
                  backgroundColor: count > 0 ? "#D4A017" : "#30363D",
                }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs mt-2" style={{ color: "#6B7280" }}>
          <span>{pageviewSeries[0]?.[0]}</span>
          <span>{pageviewSeries[pageviewSeries.length - 1]?.[0]}</span>
        </div>
      </Section>

      {/* Booking funnel */}
      <Section title="Booking funnel">
        <p className="text-xs mb-4" style={{ color: "#6B7280" }}>
          Unique sessions reaching each step in the last 30 days. A sharp drop between two steps means that's where customers are bouncing.
        </p>
        <div className="space-y-2">
          {funnelCounts.map((step, i) => {
            const pct = (step.sessions / funnelTop) * 100;
            const prev = i > 0 ? funnelCounts[i - 1].sessions : null;
            const conversion = prev !== null && prev > 0 ? Math.round((step.sessions / prev) * 100) : null;
            return (
              <div key={step.key}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{step.label}</span>
                  <span className="font-mono" style={{ color: "#6B7280" }}>
                    {step.sessions}{conversion !== null && ` · ${conversion}% of previous`}
                  </span>
                </div>
                <div className="h-3 rounded" style={{ backgroundColor: "#161B22" }}>
                  <div
                    className="h-3 rounded"
                    style={{
                      width: `${Math.max(pct, 0.5)}%`,
                      backgroundColor: step.key === "booking_succeeded" ? "#10B981" : "#D4A017",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Recent failures */}
      {lastFailures.length > 0 && (
        <Section title="Recent booking failures">
          <ul className="text-sm space-y-2">
            {lastFailures.map((f, i) => (
              <li key={i} className="flex justify-between gap-4 border-b pb-2" style={{ borderColor: "#30363D" }}>
                <span style={{ color: "#EF4444" }}>
                  {typeof f.props?.error === "string" ? f.props.error : "(no detail)"}
                </span>
                <span className="font-mono text-xs whitespace-nowrap" style={{ color: "#6B7280" }}>
                  {new Date(f.created_at).toLocaleString("en-CA", { timeZone: "America/Vancouver" })}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section title="Top pages">
          <RankedList items={topPages.map(([k, v]) => ({ label: k, value: v }))} />
        </Section>

        <Section title="CTA clicks">
          <RankedList items={ctaCounts.map(c => ({ label: c.name, value: c.count }))} />
        </Section>

        <Section title="Top referrers">
          <RankedList items={topRefs.map(([k, v]) => ({ label: k, value: v }))} />
        </Section>

        <Section title="Top city pages">
          {topCities.length === 0 ? (
            <p className="text-xs" style={{ color: "#6B7280" }}>No /service-area/ pageviews yet.</p>
          ) : (
            <RankedList items={topCities.map(([k, v]) => ({ label: k, value: v }))} />
          )}
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border p-5" style={{ backgroundColor: "#0D1117", borderColor: "#30363D" }}>
      <h2 className="text-base font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );
}

function KpiCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-xl border p-4" style={{ backgroundColor: "#161B22", borderColor: "#30363D" }}>
      <div className="text-xs uppercase tracking-wide" style={{ color: "#6B7280" }}>{label}</div>
      <div className="text-2xl font-bold mt-1" style={{ color: accent ?? "#FFFFFF" }}>{value}</div>
    </div>
  );
}

function RankedList({ items }: { items: { label: string; value: number }[] }) {
  if (items.length === 0) {
    return <p className="text-xs" style={{ color: "#6B7280" }}>No data yet.</p>;
  }
  const max = Math.max(...items.map(i => i.value));
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i}>
          <div className="flex justify-between text-sm mb-1">
            <span className="truncate" title={item.label}>{item.label}</span>
            <span className="font-mono ml-2" style={{ color: "#6B7280" }}>{item.value}</span>
          </div>
          <div className="h-1.5 rounded" style={{ backgroundColor: "#161B22" }}>
            <div
              className="h-1.5 rounded"
              style={{ width: `${(item.value / max) * 100}%`, backgroundColor: "#D4A017" }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
