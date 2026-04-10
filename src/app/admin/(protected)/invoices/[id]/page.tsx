"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Send, CheckCircle, Loader2, FileText, Eye, CreditCard, Clock, Trash2 } from "lucide-react";

interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
}

interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_address: string | null;
  line_items: LineItem[];
  subtotal: number;
  notes: string | null;
  status: string;
  payment_method: string | null;
  due_date: string;
  sent_at: string | null;
  paid_at: string | null;
  created_at: string;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  draft: { bg: "#30363D", text: "#6B7280" },
  sent: { bg: "#1E90FF22", text: "#1E90FF" },
  viewed: { bg: "#D4A01722", text: "#D4A017" },
  paid: { bg: "#22C55E22", text: "#22C55E" },
  overdue: { bg: "#EF444422", text: "#EF4444" },
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  draft: <FileText className="w-3.5 h-3.5" />,
  sent: <Send className="w-3.5 h-3.5" />,
  viewed: <Eye className="w-3.5 h-3.5" />,
  paid: <CreditCard className="w-3.5 h-3.5" />,
  overdue: <Clock className="w-3.5 h-3.5" />,
};

function formatCAD(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [markingPaid, setMarkingPaid] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/invoices/${id}`)
      .then((r) => r.json())
      .then((data) => { if (data.id) setInvoice(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSend(email: boolean, sms: boolean) {
    setSending(true);
    setMsg(null);
    const res = await fetch(`/api/admin/invoices/${id}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sendEmail: email, sendSms: sms }),
    });
    const data = await res.json();
    setSending(false);
    if (res.ok) {
      setMsg("Sent successfully!");
      setInvoice((prev) => prev ? { ...prev, status: prev.status === "draft" ? "sent" : prev.status, sent_at: new Date().toISOString() } : null);
    } else {
      setMsg(data.error || "Send failed");
    }
  }

  async function handleMarkPaid() {
    if (!confirm("Mark this invoice as paid via e-Transfer?")) return;
    setMarkingPaid(true);
    const res = await fetch(`/api/admin/invoices/${id}/mark-paid`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payment_method: "etransfer" }),
    });
    const data = await res.json();
    setMarkingPaid(false);
    if (data.id) {
      setInvoice(data);
      setMsg("Marked as paid");
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this invoice? This cannot be undone.")) return;
    setDeleting(true);
    await fetch(`/api/admin/invoices/${id}`, { method: "DELETE" });
    router.push("/admin/invoices");
  }

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin" style={{ color: "#D4A017" }} /></div>;
  }
  if (!invoice) {
    return <p className="text-center py-20" style={{ color: "#6B7280" }}>Invoice not found</p>;
  }

  const colors = STATUS_COLORS[invoice.status] ?? STATUS_COLORS.draft;
  const publicUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/invoice/${invoice.id}`;

  return (
    <div className="max-w-2xl">
      {/* Back + actions */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.push("/admin/invoices")}
          className="flex items-center gap-1.5 text-sm transition-colors hover:text-white"
          style={{ color: "#6B7280" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Invoices
        </button>
        <div className="flex gap-2">
          {invoice.status !== "paid" && (
            <>
              <button
                onClick={() => handleSend(true, true)}
                disabled={sending}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:brightness-110"
                style={{ backgroundColor: "#1E90FF22", color: "#1E90FF", border: "1px solid #1E90FF44" }}
              >
                {sending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                Send
              </button>
              <button
                onClick={handleMarkPaid}
                disabled={markingPaid}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:brightness-110"
                style={{ backgroundColor: "#22C55E22", color: "#22C55E", border: "1px solid #22C55E44" }}
              >
                {markingPaid ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                Mark Paid
              </button>
            </>
          )}
          {invoice.status === "draft" && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-red-500/20"
              style={{ color: "#EF4444", border: "1px solid #EF444444" }}
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </button>
          )}
        </div>
      </div>

      {msg && (
        <p className="text-sm rounded-lg px-3 py-2 mb-4" style={{ backgroundColor: "#22C55E22", color: "#22C55E", border: "1px solid #22C55E44" }}>
          {msg}
        </p>
      )}

      {/* Invoice card */}
      <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #30363D" }}>
        {/* Header */}
        <div className="px-6 py-5 flex items-start justify-between" style={{ backgroundColor: "#161B22" }}>
          <div>
            <p className="text-lg font-bold text-white">Invoice #{invoice.invoice_number}</p>
            <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
              Created {new Date(invoice.created_at).toLocaleDateString("en-CA")} · Due {invoice.due_date}
            </p>
          </div>
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize"
            style={{ backgroundColor: colors.bg, color: colors.text }}
          >
            {STATUS_ICONS[invoice.status]}
            {invoice.status}
          </span>
        </div>

        <div className="px-6 py-5" style={{ backgroundColor: "#0D1117" }}>
          {/* Client */}
          <div className="mb-5 pb-5" style={{ borderBottom: "1px solid #30363D" }}>
            <p className="text-xs font-medium mb-2" style={{ color: "#6B7280" }}>Bill To</p>
            <p className="text-white font-medium">{invoice.client_name}</p>
            <p className="text-sm" style={{ color: "#6B7280" }}>{invoice.client_email}</p>
            <p className="text-sm" style={{ color: "#6B7280" }}>{invoice.client_phone}</p>
            {invoice.client_address && (
              <p className="text-sm" style={{ color: "#6B7280" }}>{invoice.client_address}</p>
            )}
          </div>

          {/* Line items */}
          <table className="w-full text-sm mb-5">
            <thead>
              <tr style={{ borderBottom: "1px solid #30363D" }}>
                <th className="text-left py-2 font-medium" style={{ color: "#6B7280" }}>Item</th>
                <th className="text-center py-2 font-medium" style={{ color: "#6B7280" }}>Qty</th>
                <th className="text-right py-2 font-medium" style={{ color: "#6B7280" }}>Price</th>
                <th className="text-right py-2 font-medium" style={{ color: "#6B7280" }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {invoice.line_items.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: "1px solid #30363D22" }}>
                  <td className="py-2.5 text-white">{item.description}</td>
                  <td className="py-2.5 text-center" style={{ color: "#6B7280" }}>{item.quantity}</td>
                  <td className="py-2.5 text-right" style={{ color: "#6B7280" }}>{formatCAD(item.unit_price)}</td>
                  <td className="py-2.5 text-right text-white font-medium">{formatCAD(item.quantity * item.unit_price)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="pt-3 text-right font-bold text-white">Total</td>
                <td className="pt-3 text-right text-lg font-bold" style={{ color: "#D4A017" }}>{formatCAD(invoice.subtotal)}</td>
              </tr>
            </tfoot>
          </table>

          {invoice.notes && (
            <div className="mb-5 p-3 rounded-lg" style={{ backgroundColor: "#161B22" }}>
              <p className="text-xs font-medium mb-1" style={{ color: "#6B7280" }}>Notes</p>
              <p className="text-sm text-white">{invoice.notes}</p>
            </div>
          )}

          {/* Payment info */}
          {invoice.paid_at && (
            <div className="p-3 rounded-lg" style={{ backgroundColor: "#22C55E11", border: "1px solid #22C55E33" }}>
              <p className="text-sm" style={{ color: "#22C55E" }}>
                Paid on {new Date(invoice.paid_at).toLocaleDateString("en-CA")} via {invoice.payment_method === "stripe" ? "card" : "e-Transfer"}
              </p>
            </div>
          )}

          {/* Public link */}
          {invoice.status !== "draft" && (
            <div className="mt-4 pt-4" style={{ borderTop: "1px solid #30363D" }}>
              <p className="text-xs font-medium mb-1" style={{ color: "#6B7280" }}>Client Link</p>
              <a href={publicUrl} target="_blank" rel="noopener noreferrer" className="text-sm break-all hover:underline" style={{ color: "#1E90FF" }}>
                {publicUrl}
              </a>
            </div>
          )}

          {/* Timeline */}
          <div className="mt-4 pt-4" style={{ borderTop: "1px solid #30363D" }}>
            <p className="text-xs font-medium mb-2" style={{ color: "#6B7280" }}>Activity</p>
            <div className="flex flex-col gap-1.5 text-xs" style={{ color: "#6B7280" }}>
              <p>📋 Created {new Date(invoice.created_at).toLocaleString("en-CA", { timeZone: "America/Vancouver" })}</p>
              {invoice.sent_at && <p>📧 Sent {new Date(invoice.sent_at).toLocaleString("en-CA", { timeZone: "America/Vancouver" })}</p>}
              {invoice.status === "viewed" && <p>👀 Viewed by client</p>}
              {invoice.paid_at && <p>💰 Paid {new Date(invoice.paid_at).toLocaleString("en-CA", { timeZone: "America/Vancouver" })}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
