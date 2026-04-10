"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, CreditCard, ArrowRight } from "lucide-react";
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
          <Link href="/" style={{ color: "#D4A017" }} className="hover:underline">Back to Cove Cutlery</Link>
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
          <img src="/logo-icon-512.png" alt="Cove Cutlery" width={48} height={48} className="rounded-lg mb-3" />
          <p className="text-xl font-bold tracking-wide" style={{ color: "#D4A017" }}>COVE CUTLERY</p>
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
              <p className="text-xs" style={{ color: "#6B7280" }}>Thank you for your payment!</p>
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
              <div className="flex flex-col gap-3">
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
                        <p className="text-sm font-medium text-white">pay@covecutlery.ca</p>
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
            Cove Cutlery · <a href="https://covecutlery.ca" style={{ color: "#D4A017" }}>covecutlery.ca</a> · 604-373-1500
          </p>
        </div>
      </div>
    </main>
  );
}
