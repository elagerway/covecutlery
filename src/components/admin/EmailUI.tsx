"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Send, Loader2, RefreshCw, Mail, AlertCircle, Search, X } from "lucide-react";

interface ConversationSummary {
  key: string;
  otherParty: string;
  mailbox: string;
  subject: string;
  lastMessage: {
    snippet: string;
    direction: "inbound" | "outbound";
    created_at: string;
  };
  messageCount: number;
  unreadCount: number;
}

interface EmailRow {
  id: number;
  message_id: string | null;
  in_reply_to: string | null;
  email_references: string[] | null;
  from_email: string;
  from_name: string | null;
  to_email: string;
  cc_emails: string[] | null;
  subject: string | null;
  text_body: string | null;
  html_body: string | null;
  stripped_reply: string | null;
  direction: "inbound" | "outbound";
  status: string;
  attachments: { name: string; content_type: string; size: number }[];
  created_at: string;
  read_at: string | null;
}

const POLL_MS = 15_000;
const MAILBOX_OPTIONS = ["info@coveblades.com", "erik@coveblades.com", "training@coveblades.com"];

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  if (sameDay) {
    return d.toLocaleTimeString("en-CA", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: "America/Vancouver" });
  }
  const sameYear = d.getFullYear() === now.getFullYear();
  return d.toLocaleDateString("en-CA", {
    month: "short", day: "numeric",
    ...(sameYear ? {} : { year: "numeric" }),
    timeZone: "America/Vancouver",
  });
}

function formatFullTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("en-CA", {
    month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
    timeZone: "America/Vancouver",
  });
}

export default function EmailUI() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [thread, setThread] = useState<EmailRow[]>([]);
  const [mailboxFilter, setMailboxFilter] = useState<string>("all");
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [sending, setSending] = useState(false);
  const [composer, setComposer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const threadEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => clearTimeout(t);
  }, [search]);

  const loadConvos = useCallback(async () => {
    try {
      const qs = debouncedSearch ? `?q=${encodeURIComponent(debouncedSearch)}` : "";
      const res = await fetch(`/api/admin/emails${qs}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load");
      setConversations(data.conversations ?? []);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoadingConvos(false);
    }
  }, [debouncedSearch]);

  const loadThread = useCallback(async (key: string, silent = false) => {
    if (!silent) setLoadingThread(true);
    try {
      const res = await fetch(`/api/admin/emails?conversation=${encodeURIComponent(key)}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load thread");
      setThread(data.messages ?? []);
      setError(null);

      // Mark unread inbound messages as read
      const toMark = (data.messages ?? []).filter((m: EmailRow) => m.direction === "inbound" && m.status === "new");
      await Promise.all(
        toMark.map((m: EmailRow) =>
          fetch(`/api/admin/emails/${m.id}/read`, { method: "POST" }).catch(() => {})
        )
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      if (!silent) setLoadingThread(false);
    }
  }, []);

  useEffect(() => {
    loadConvos();
    const t = setInterval(loadConvos, POLL_MS);
    return () => clearInterval(t);
  }, [loadConvos]);

  useEffect(() => {
    if (!selectedKey) return;
    loadThread(selectedKey);
    const t = setInterval(() => loadThread(selectedKey, true), POLL_MS);
    return () => clearInterval(t);
  }, [selectedKey, loadThread]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread.length]);

  const filteredConvos = useMemo(() => {
    if (mailboxFilter === "all") return conversations;
    return conversations.filter(c => c.mailbox === mailboxFilter);
  }, [conversations, mailboxFilter]);

  const selectedConvo = useMemo(
    () => conversations.find(c => c.key === selectedKey),
    [conversations, selectedKey]
  );

  // For replies, determine from/to/subject based on thread
  const replyContext = useMemo(() => {
    if (thread.length === 0) return null;
    const last = thread[thread.length - 1];
    const ourMailbox = last.direction === "inbound" ? last.to_email : last.from_email;
    const theirAddress = last.direction === "inbound" ? last.from_email : last.to_email;
    const subject = last.subject?.match(/^re:/i) ? last.subject : `Re: ${last.subject ?? ""}`.trim();
    const references = [
      ...(last.email_references ?? []),
      ...(last.message_id ? [last.message_id.replace(/^<|>$/g, "")] : []),
    ];
    return {
      from: ourMailbox,
      to: theirAddress,
      subject,
      inReplyTo: last.message_id?.replace(/^<|>$/g, "") ?? null,
      references,
    };
  }, [thread]);

  async function handleSend() {
    if (!replyContext || !composer.trim() || sending) return;
    setSending(true);
    setError(null);
    const text = composer.trim();
    setComposer("");

    try {
      const res = await fetch("/api/admin/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: replyContext.from,
          to: replyContext.to,
          subject: replyContext.subject,
          text,
          inReplyTo: replyContext.inReplyTo,
          references: replyContext.references,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Send failed");
      if (selectedKey) await loadThread(selectedKey, true);
      await loadConvos();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setComposer(text);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="text-white h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Email</h1>
          <p className="text-sm" style={{ color: "#6B7280" }}>
            info@ · erik@ · training@ · {conversations.length} conversation{conversations.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-1 max-w-md ml-auto">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6B7280" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search subject, body, sender…"
              className="w-full pl-9 pr-9 py-2 rounded-lg text-sm outline-none"
              style={{ backgroundColor: "#161B22", color: "#FFFFFF", border: "1px solid #30363D" }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-[#0D1117]"
                style={{ color: "#6B7280" }}
              >
                <X size={12} />
              </button>
            )}
          </div>
          <select
            value={mailboxFilter}
            onChange={e => setMailboxFilter(e.target.value)}
            className="px-2 py-1.5 rounded-lg text-sm outline-none"
            style={{ backgroundColor: "#161B22", color: "#FFFFFF", border: "1px solid #30363D" }}
          >
            <option value="all">All mailboxes</option>
            {MAILBOX_OPTIONS.map(m => (
              <option key={m} value={m}>{m.split("@")[0]}@</option>
            ))}
          </select>
          <button
            onClick={() => { loadConvos(); if (selectedKey) loadThread(selectedKey); }}
            className="p-2 rounded-lg border transition-colors hover:border-[#D4A017]"
            style={{ borderColor: "#30363D", color: "#D4A017" }}
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-3 px-3 py-2 rounded-lg text-sm flex items-start gap-2" style={{ backgroundColor: "#7F1D1D33", color: "#FCA5A5", borderLeft: "3px solid #EF4444" }}>
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 md:grid-cols-[360px_1fr] gap-4 min-h-0">
        {/* Conversation list */}
        <div
          className={`flex flex-col rounded-xl border overflow-hidden ${selectedKey ? "hidden md:flex" : "flex"}`}
          style={{ backgroundColor: "#0D1117", borderColor: "#30363D" }}
        >
          <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wide border-b" style={{ color: "#6B7280", borderColor: "#30363D" }}>
            Inbox · {filteredConvos.length}
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingConvos && conversations.length === 0 ? (
              <div className="flex items-center justify-center py-12" style={{ color: "#6B7280" }}>
                <Loader2 className="animate-spin" size={20} />
              </div>
            ) : filteredConvos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center" style={{ color: "#6B7280" }}>
                <Mail size={28} className="mb-2 opacity-50" />
                <p className="text-sm">No emails yet.</p>
                <p className="text-xs mt-1">Inbound mail will appear here once Postmark forwarding is live.</p>
              </div>
            ) : (
              filteredConvos.map(c => {
                const active = c.key === selectedKey;
                const mailboxLabel = c.mailbox.split("@")[0];
                return (
                  <button
                    key={c.key}
                    onClick={() => setSelectedKey(c.key)}
                    className="w-full text-left px-4 py-3 border-b transition-colors hover:bg-[#161B22]"
                    style={{
                      backgroundColor: active ? "#161B22" : "transparent",
                      borderColor: "#30363D",
                      borderLeft: active ? "3px solid #D4A017" : "3px solid transparent",
                    }}
                  >
                    <div className="flex justify-between items-baseline mb-1 gap-2">
                      <div className="font-medium text-sm truncate flex-1">
                        {c.otherParty}
                        {c.unreadCount > 0 && (
                          <span
                            className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
                          >
                            {c.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="text-xs whitespace-nowrap" style={{ color: "#6B7280" }}>
                        {formatTimestamp(c.lastMessage.created_at)}
                      </div>
                    </div>
                    <div className="text-xs font-medium mb-1 truncate" style={{ color: c.unreadCount > 0 ? "#FFFFFF" : "#9CA3AF" }}>
                      {c.subject}
                    </div>
                    <div className="text-xs truncate" style={{ color: "#6B7280" }}>
                      {c.lastMessage.direction === "outbound" ? "You: " : ""}{c.lastMessage.snippet || "(empty)"}
                    </div>
                    <div className="flex justify-between items-center mt-1.5">
                      <span className="text-[10px] uppercase tracking-wide" style={{ color: "#D4A017" }}>
                        {mailboxLabel}@
                      </span>
                      <span className="text-[10px]" style={{ color: "#6B7280" }}>
                        {c.messageCount} msg{c.messageCount === 1 ? "" : "s"}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Thread view */}
        <div
          className={`flex flex-col rounded-xl border overflow-hidden ${selectedKey ? "flex" : "hidden md:flex"}`}
          style={{ backgroundColor: "#0D1117", borderColor: "#30363D" }}
        >
          {selectedKey && selectedConvo ? (
            <>
              <div className="px-4 py-3 border-b flex items-center gap-3" style={{ borderColor: "#30363D" }}>
                <button
                  onClick={() => setSelectedKey(null)}
                  className="md:hidden p-1 rounded hover:bg-[#161B22]"
                  style={{ color: "#D4A017" }}
                >
                  <ArrowLeft size={18} />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{selectedConvo.subject}</div>
                  <div className="text-xs truncate" style={{ color: "#6B7280" }}>
                    {selectedConvo.otherParty} · via {selectedConvo.mailbox}
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {loadingThread && thread.length === 0 ? (
                  <div className="flex items-center justify-center py-12" style={{ color: "#6B7280" }}>
                    <Loader2 className="animate-spin" size={20} />
                  </div>
                ) : thread.length === 0 ? (
                  <div className="text-center text-sm py-12" style={{ color: "#6B7280" }}>
                    No messages yet.
                  </div>
                ) : (
                  thread.map(msg => {
                    const isOutbound = msg.direction === "outbound";
                    const isAuto = msg.status === "auto_replied" && isOutbound;
                    return (
                      <div
                        key={msg.id}
                        className="rounded-lg border p-4"
                        style={{
                          backgroundColor: isOutbound ? "#161B22" : "#0D1117",
                          borderColor: isOutbound ? "#D4A01755" : "#30363D",
                        }}
                      >
                        <div className="flex justify-between items-baseline mb-2 gap-2">
                          <div className="min-w-0">
                            <div className="text-sm font-semibold">
                              {isOutbound ? "You" : (msg.from_name || msg.from_email)}
                              {isAuto && (
                                <span
                                  className="ml-2 text-[10px] uppercase font-medium px-1.5 py-0.5 rounded"
                                  style={{ backgroundColor: "#D4A01733", color: "#D4A017" }}
                                >
                                  Auto-reply
                                </span>
                              )}
                            </div>
                            <div className="text-xs" style={{ color: "#6B7280" }}>
                              {isOutbound ? `${msg.from_email} → ${msg.to_email}` : `${msg.from_email} → ${msg.to_email}`}
                            </div>
                          </div>
                          <div className="text-xs whitespace-nowrap" style={{ color: "#6B7280" }}>
                            {formatFullTimestamp(msg.created_at)}
                          </div>
                        </div>
                        <div
                          className="text-sm whitespace-pre-wrap leading-relaxed"
                          style={{ color: "#E5E7EB" }}
                        >
                          {msg.stripped_reply || msg.text_body || "(no plain text body)"}
                        </div>
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {msg.attachments.map((a, i) => (
                              <span key={i} className="text-xs px-2 py-1 rounded" style={{ backgroundColor: "#0D1117", border: "1px solid #30363D", color: "#9CA3AF" }}>
                                📎 {a.name} · {Math.round(a.size / 1024)}KB
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={threadEndRef} />
              </div>

              {replyContext && (
                <div className="border-t p-3" style={{ borderColor: "#30363D" }}>
                  <div className="text-xs mb-2" style={{ color: "#6B7280" }}>
                    Reply from <span style={{ color: "#D4A017" }}>{replyContext.from}</span> to {replyContext.to}
                  </div>
                  <div className="flex items-end gap-2">
                    <textarea
                      value={composer}
                      onChange={e => setComposer(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      placeholder="Type a reply… (⌘↵ to send)"
                      rows={4}
                      className="flex-1 px-3 py-2 rounded-lg text-sm outline-none resize-y"
                      style={{ backgroundColor: "#161B22", color: "#FFFFFF", border: "1px solid #30363D", minHeight: 80 }}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!composer.trim() || sending}
                      className="px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 self-end"
                      style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
                    >
                      {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                      Send
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6" style={{ color: "#6B7280" }}>
              <Mail size={32} className="mb-3 opacity-50" />
              <p className="text-sm">Select a conversation to view it.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
