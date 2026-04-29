"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, CreditCard, ArrowRight, Download } from "lucide-react";
import Link from "next/link";
import { LineItem, formatCAD } from "@/lib/format";

interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  line_items: LineItem[];
  subtotal: number;
  notes: string | null;
  status: string;
  due_date: string | null;
  created_at: string;
  paid_at: string | null;
  payment_method: string | null;
}

function formatDate(d: string) {
  return new Date(d + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function PublicInvoicePage() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const justPaid = searchParams.get("paid") === "true";
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [paying, setPaying] = useState(false);
  const [showEtransfer, setShowEtransfer] = useState(false);

  useEffect(() => {
    fetch(`/api/invoices/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => setInvoice(data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  async function handlePayCard() {
    setPaying(true);
    try {
      const res = await fetch(`/api/invoices/${id}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setPaying(false);
      }
    } catch {
      setPaying(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0D1117" }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#D4A017" }} />
      </main>
    );
  }

  if (notFound) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#0D1117" }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Invoice Not Found</h1>
          <p className="mb-6" style={{ color: "#6B7280" }}>This invoice link may be invalid or expired.</p>
          <Link href="/" style={{ color: "#D4A017" }} className="hover:underline">Back to Cove Blades</Link>
        </div>
      </main>
    );
  }

  const isPaid = invoice!.status === "paid" || justPaid;

  return (
    <main className="min-h-screen py-8 px-4" style={{ backgroundColor: "#0D1117" }}>
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <img src="/logo-icon-512.png" alt="Cove Blades" width={48} height={48} className="rounded-lg mb-3" />
          <p className="text-xl font-bold tracking-wide" style={{ color: "#D4A017" }}>COVE BLADES</p>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>Mobile Knife Sharpening</p>
        </div>

        {/* Paid banner */}
        {isPaid && (
          <div
            className="flex items-center gap-3 px-5 py-4 rounded-xl mb-5"
            style={{ backgroundColor: "#22C55E11", border: "1px solid #22C55E33" }}
          >
            <CheckCircle className="w-6 h-6 shrink-0" style={{ color: "#22C55E" }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: "#22C55E" }}>Payment Received</p>
              <p className="text-xs" style={{ color: "#6B7280" }}>
                {invoice!.paid_at && new Date(invoice!.paid_at).toLocaleDateString("en-CA", {
                  weekday: "long", month: "long", day: "numeric", year: "numeric",
                  hour: "numeric", minute: "2-digit", timeZone: "America/Vancouver",
                })}
                {invoice!.payment_method && ` via ${invoice!.payment_method === "stripe" ? "Credit Card" : invoice!.payment_method === "etransfer" ? "Interac e-Transfer" : invoice!.payment_method}`}
              </p>
            </div>
          </div>
        )}

        {/* Invoice card */}
        <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #30363D" }}>
          <div className="px-6 py-5" style={{ backgroundColor: "#161B22" }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white font-bold">Invoice #{invoice!.invoice_number}</p>
                <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
                  Issued {new Date(invoice!.created_at).toLocaleDateString("en-CA")}
                </p>
              </div>
              {!isPaid && invoice!.due_date && (
                <div className="text-right">
                  <p className="text-xs" style={{ color: "#6B7280" }}>Due</p>
                  <p className="text-sm font-medium text-white">{invoice!.due_date}</p>
                </div>
              )}
            </div>
          </div>

          <div className="px-6 py-5" style={{ backgroundColor: "#0D1117" }}>
            <p className="text-xs font-medium mb-1" style={{ color: "#6B7280" }}>Bill To</p>
            <p className="text-white font-medium mb-5">{invoice!.client_name}</p>

            {/* Line items */}
            <table className="w-full text-sm mb-4">
              <thead>
                <tr style={{ borderBottom: "1px solid #30363D" }}>
                  <th className="text-left py-2 font-medium" style={{ color: "#6B7280" }}>Item</th>
                  <th className="text-center py-2 font-medium" style={{ color: "#6B7280" }}>Qty</th>
                  <th className="text-right py-2 font-medium" style={{ color: "#6B7280" }}>Price</th>
                  <th className="text-right py-2 font-medium" style={{ color: "#6B7280" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {invoice!.line_items.map((item, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #30363D22" }}>
                    <td className="py-2.5 text-white">{item.description}</td>
                    <td className="py-2.5 text-center" style={{ color: "#6B7280" }}>{item.quantity}</td>
                    <td className="py-2.5 text-right" style={{ color: "#6B7280" }}>{formatCAD(item.unit_price)}</td>
                    <td className="py-2.5 text-right text-white">{formatCAD(item.quantity * item.unit_price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center pt-3 mb-5" style={{ borderTop: "2px solid #30363D" }}>
              <span className="font-bold text-white">Total</span>
              <span className="text-xl font-bold" style={{ color: "#D4A017" }}>{formatCAD(invoice!.subtotal)}</span>
            </div>

            {invoice!.notes && (
              <div className="p-3 rounded-lg mb-5" style={{ backgroundColor: "#161B22" }}>
                <p className="text-xs" style={{ color: "#6B7280" }}>Note: {invoice!.notes}</p>
              </div>
            )}

            {/* Payment options */}
            {!isPaid && (
              <div className="flex flex-col gap-3 no-print">
                <button
                  onClick={handlePayCard}
                  disabled={paying}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
                >
                  {paying ? <Loader2 className="w-4 h-4 animate-spin" /> : <CreditCard className="w-4 h-4" />}
                  {paying ? "Redirecting..." : `Pay ${formatCAD(invoice!.subtotal)} with Card`}
                </button>

                <button
                  onClick={() => setShowEtransfer(!showEtransfer)}
                  className="w-full py-3 rounded-xl text-sm font-medium transition-colors hover:bg-white/5 flex items-center justify-center gap-2"
                  style={{ border: "1px solid #30363D", color: "#FFFFFF" }}
                >
                  <ArrowRight className={`w-4 h-4 transition-transform ${showEtransfer ? "rotate-90" : ""}`} />
                  Pay via Interac e-Transfer
                </button>

                {showEtransfer && (
                  <div className="p-4 rounded-xl" style={{ backgroundColor: "#161B22", border: "1px solid #30363D" }}>
                    <p className="text-sm text-white mb-3">Send an Interac e-Transfer with these details:</p>
                    <div className="flex flex-col gap-2.5">
                      <div>
                        <p className="text-xs" style={{ color: "#6B7280" }}>Send to</p>
                        <p className="text-sm font-medium text-white">pay@coveblades.com</p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: "#6B7280" }}>Amount</p>
                        <p className="text-sm font-medium text-white">{formatCAD(invoice!.subtotal)} CAD</p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: "#6B7280" }}>Message (include this)</p>
                        <p className="text-sm font-mono px-2 py-1.5 rounded" style={{ backgroundColor: "#0D1117", color: "#D4A017" }}>
                          Invoice #{invoice!.invoice_number}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs mt-3" style={{ color: "#6B7280" }}>
                      Your invoice will be marked as paid once we receive the transfer.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs" style={{ color: "#6B7280" }}>
            Cove Blades · <a href="https://coveblades.com" style={{ color: "#D4A017" }}>coveblades.com</a> · 604-210-8180
          </p>
        </div>

        {/* Save as PDF */}
        <div className="text-center mt-6 no-print">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors hover:bg-white/10"
            style={{ border: "1px solid #30363D", color: "#6B7280" }}
          >
            <Download className="w-4 h-4" />
            Save as PDF
          </button>
        </div>
      </div>

      {/* Print-only version — completely separate layout with light colors */}
      <div className="print-only" style={{ display: "none" }}>
        <div style={{ maxWidth: 560, margin: "0 auto", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", color: "#111" }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <img src="/logo-icon-512.png" alt="Cove Blades" width={40} height={40} style={{ borderRadius: 6, marginBottom: 8 }} />
            <p style={{ fontSize: 20, fontWeight: 700, color: "#B8860B", letterSpacing: 0.5, margin: 0 }}>COVE BLADES</p>
            <p style={{ fontSize: 13, color: "#666", margin: "4px 0 0" }}>Mobile Knife Sharpening</p>
          </div>

          {isPaid && invoice!.paid_at && (
            <div style={{ padding: "12px 16px", background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 6, marginBottom: 16 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#16a34a" }}>Payment Received</p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#166534" }}>
                {new Date(invoice!.paid_at).toLocaleDateString("en-CA", {
                  weekday: "long", month: "long", day: "numeric", year: "numeric",
                  hour: "numeric", minute: "2-digit", timeZone: "America/Vancouver",
                })}
                {invoice!.payment_method && ` via ${invoice!.payment_method === "stripe" ? "Credit Card" : invoice!.payment_method === "etransfer" ? "Interac e-Transfer" : invoice!.payment_method}`}
              </p>
            </div>
          )}

          <div style={{ border: "1px solid #ddd", borderRadius: 8, overflow: "hidden" }}>
            <div style={{ background: "#f8f8f8", padding: "16px 24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 16 }}>Invoice #{invoice!.invoice_number}</p>
                  <p style={{ margin: "4px 0 0", fontSize: 12, color: "#666" }}>Issued {new Date(invoice!.created_at).toLocaleDateString("en-CA")}</p>
                </div>
                {!isPaid && invoice!.due_date && (
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, fontSize: 12, color: "#666" }}>Due</p>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>{invoice!.due_date}</p>
                  </div>
                )}
              </div>
            </div>

            <div style={{ padding: "20px 24px" }}>
              <p style={{ fontSize: 12, color: "#666", margin: "0 0 4px" }}>Bill To</p>
              <p style={{ fontSize: 15, fontWeight: 500, margin: "0 0 20px" }}>{invoice!.client_name}</p>

              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #eee" }}>
                    <th style={{ textAlign: "left", padding: "8px 0", fontWeight: 500, color: "#666" }}>Item</th>
                    <th style={{ textAlign: "center", padding: "8px 0", fontWeight: 500, color: "#666" }}>Qty</th>
                    <th style={{ textAlign: "right", padding: "8px 0", fontWeight: 500, color: "#666" }}>Price</th>
                    <th style={{ textAlign: "right", padding: "8px 0", fontWeight: 500, color: "#666" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice!.line_items.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "10px 0" }}>{item.description}</td>
                      <td style={{ padding: "10px 0", textAlign: "center", color: "#555" }}>{item.quantity}</td>
                      <td style={{ padding: "10px 0", textAlign: "right", color: "#555" }}>{formatCAD(item.unit_price)}</td>
                      <td style={{ padding: "10px 0", textAlign: "right", fontWeight: 500 }}>{formatCAD(item.quantity * item.unit_price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "2px solid #ddd", marginTop: 4 }}>
                <span style={{ fontWeight: 700 }}>Total</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: "#B8860B" }}>{formatCAD(invoice!.subtotal)}</span>
              </div>

              {invoice!.notes && (
                <p style={{ fontSize: 12, color: "#555", padding: "10px 14px", background: "#f8f8f8", borderRadius: 6, marginTop: 16 }}>Note: {invoice!.notes}</p>
              )}
            </div>
          </div>

          <p style={{ textAlign: "center", fontSize: 12, color: "#888", marginTop: 24 }}>
            Cove Blades · coveblades.com · 604-210-8180
          </p>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page { margin: 0.6in; size: letter; }
          .no-print { display: none !important; }
          main > div:first-child { display: none !important; }
          .print-only { display: block !important; }
        }
      `}</style>
    </main>
  );
}
