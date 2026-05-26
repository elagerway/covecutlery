"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Send, Loader2, RefreshCw, MessageSquare, Search, X } from "lucide-react";

interface MagpipeMessage {
  id: string;
  thread_id: string | null;
  from_number: string;
  to_number: string;
  body: string;
  direction: "inbound" | "outbound";
  status: string;
  is_ai_generated: boolean;
  created_at: string;
  is_read?: boolean;
  source?: "magpipe" | "historical";
}

interface Conversation {
  phone: string;
  lastMessage: MagpipeMessage;
  messageCount: number;
  hasInbound: boolean;
  unreadCount: number;
}

const POLL_MS = 10_000;

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) {
    return `(${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return raw;
}

function formatTime(iso: string): string {
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

function formatThreadTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-CA", {
    month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit", hour12: true,
    timeZone: "America/Vancouver",
  });
}

export default function MessagesUI() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedPhone, setSelectedPhone] = useState<string | null>(null);
  const [thread, setThread] = useState<MagpipeMessage[]>([]);
  const [loadingConvos, setLoadingConvos] = useState(true);
  const [loadingThread, setLoadingThread] = useState(false);
  const [sending, setSending] = useState(false);
  const [composer, setComposer] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const threadEndRef = useRef<HTMLDivElement>(null);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 250);
    return () => clearTimeout(t);
  }, [search]);

  const loadConvos = useCallback(async () => {
    try {
      const qs = debouncedSearch ? `?q=${encodeURIComponent(debouncedSearch)}` : "";
      const res = await fetch(`/api/admin/messages${qs}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load conversations");
      setConversations(data.conversations ?? []);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoadingConvos(false);
    }
  }, [debouncedSearch]);

  const loadThread = useCallback(async (phone: string, silent = false) => {
    if (!silent) setLoadingThread(true);
    try {
      const res = await fetch(`/api/admin/messages?phone=${encodeURIComponent(phone)}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load thread");
      const messages: MagpipeMessage[] = data.messages ?? [];
      setThread(messages);
      setError(null);

      // Mark unread inbound messages as read
      const unreadIds = messages
        .filter(m => m.direction === "inbound" && !m.is_read)
        .map(m => m.id);
      if (unreadIds.length > 0) {
        fetch("/api/admin/messages/read", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messageIds: unreadIds }),
        }).then(() => loadConvos()).catch(() => {});
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      if (!silent) setLoadingThread(false);
    }
  }, [loadConvos]);

  // Initial load + polling for conversation list
  useEffect(() => {
    loadConvos();
    const t = setInterval(loadConvos, POLL_MS);
    return () => clearInterval(t);
  }, [loadConvos]);

  // Polling for active thread
  useEffect(() => {
    if (!selectedPhone) return;
    loadThread(selectedPhone);
    const t = setInterval(() => loadThread(selectedPhone, true), POLL_MS);
    return () => clearInterval(t);
  }, [selectedPhone, loadThread]);

  // Scroll to bottom when thread updates
  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [thread.length]);

  async function handleSend() {
    if (!selectedPhone || !composer.trim() || sending) return;
    setSending(true);
    setError(null);
    const messageBody = composer.trim();
    setComposer("");

    // Optimistic insert
    const optimistic: MagpipeMessage = {
      id: `opt-${Date.now()}`,
      thread_id: null,
      from_number: "",
      to_number: selectedPhone,
      body: messageBody,
      direction: "outbound",
      status: "pending",
      is_ai_generated: false,
      created_at: new Date().toISOString(),
    };
    setThread(prev => [...prev, optimistic]);

    try {
      const res = await fetch("/api/admin/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: selectedPhone, message: messageBody }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Send failed");
      // Refetch thread to replace optimistic with real data
      await loadThread(selectedPhone, true);
      await loadConvos();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      // Restore composer text so the user can retry
      setComposer(messageBody);
      setThread(prev => prev.filter(m => m.id !== optimistic.id));
    } finally {
      setSending(false);
    }
  }

  const selectedConvo = useMemo(
    () => conversations.find(c => c.phone === selectedPhone),
    [conversations, selectedPhone]
  );

  return (
    <div className="text-white h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Messages</h1>
          <p className="text-sm" style={{ color: "#6B7280" }}>
            SMS to +1 (604) 210-8180 · {conversations.length} conversation{conversations.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-1 max-w-md ml-auto">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6B7280" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search messages, numbers…"
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
          <button
            onClick={() => { loadConvos(); if (selectedPhone) loadThread(selectedPhone); }}
            className="p-2 rounded-lg border transition-colors hover:border-[#D4A017]"
            style={{ borderColor: "#30363D", color: "#D4A017" }}
            title="Refresh"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-3 px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: "#7F1D1D33", color: "#FCA5A5", borderLeft: "3px solid #EF4444" }}>
          {error}
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 md:grid-cols-[320px_1fr] gap-4 min-h-0">
        {/* Conversation list */}
        <div
          className={`flex flex-col rounded-xl border overflow-hidden ${selectedPhone ? "hidden md:flex" : "flex"}`}
          style={{ backgroundColor: "#0D1117", borderColor: "#30363D" }}
        >
          <div className="px-4 py-3 text-xs font-semibold uppercase tracking-wide border-b" style={{ color: "#6B7280", borderColor: "#30363D" }}>
            Conversations
          </div>
          <div className="flex-1 overflow-y-auto">
            {loadingConvos && conversations.length === 0 ? (
              <div className="flex items-center justify-center py-12" style={{ color: "#6B7280" }}>
                <Loader2 className="animate-spin" size={20} />
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center" style={{ color: "#6B7280" }}>
                <MessageSquare size={28} className="mb-2 opacity-50" />
                <p className="text-sm">No conversations yet.</p>
                <p className="text-xs mt-1">Incoming SMS will appear here.</p>
              </div>
            ) : (
              conversations.map(c => {
                const active = c.phone === selectedPhone;
                return (
                  <button
                    key={c.phone}
                    onClick={() => setSelectedPhone(c.phone)}
                    className="w-full text-left px-4 py-3 border-b transition-colors hover:bg-[#161B22]"
                    style={{
                      backgroundColor: active ? "#161B22" : "transparent",
                      borderColor: "#30363D",
                      borderLeft: active ? "3px solid #D4A017" : "3px solid transparent",
                    }}
                  >
                    <div className="flex justify-between items-baseline mb-1 gap-2">
                      <div className="font-medium text-sm truncate flex-1">
                        {formatPhone(c.phone)}
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
                        {formatTime(c.lastMessage.created_at)}
                      </div>
                    </div>
                    <div className="text-xs truncate" style={{ color: c.unreadCount > 0 ? "#E5E7EB" : "#6B7280" }}>
                      {c.lastMessage.direction === "outbound" ? "You: " : ""}
                      {c.lastMessage.body}
                    </div>
                    <div className="text-[10px] mt-1" style={{ color: "#6B7280" }}>
                      {c.messageCount} message{c.messageCount === 1 ? "" : "s"}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Thread view */}
        <div
          className={`flex flex-col rounded-xl border overflow-hidden ${selectedPhone ? "flex" : "hidden md:flex"}`}
          style={{ backgroundColor: "#0D1117", borderColor: "#30363D" }}
        >
          {selectedPhone ? (
            <>
              <div className="px-4 py-3 border-b flex items-center gap-3" style={{ borderColor: "#30363D" }}>
                <button
                  onClick={() => setSelectedPhone(null)}
                  className="md:hidden p-1 rounded hover:bg-[#161B22]"
                  style={{ color: "#D4A017" }}
                >
                  <ArrowLeft size={18} />
                </button>
                <div>
                  <div className="font-semibold">{formatPhone(selectedPhone)}</div>
                  {selectedConvo && (
                    <div className="text-xs" style={{ color: "#6B7280" }}>
                      {selectedConvo.messageCount} message{selectedConvo.messageCount === 1 ? "" : "s"}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-2">
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
                    const isAI = msg.is_ai_generated;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isOutbound ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className="max-w-[78%] rounded-2xl px-3 py-2"
                          style={{
                            backgroundColor: isOutbound ? "#D4A017" : "#161B22",
                            color: isOutbound ? "#0D1117" : "#FFFFFF",
                            border: isOutbound ? "none" : "1px solid #30363D",
                            borderBottomRightRadius: isOutbound ? 4 : 16,
                            borderBottomLeftRadius: isOutbound ? 16 : 4,
                          }}
                        >
                          {isAI && isOutbound && (
                            <div className="text-[10px] uppercase tracking-wide opacity-70 mb-1">AI · Auto-reply</div>
                          )}
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.body}</div>
                          <div
                            className="text-[10px] mt-1 flex items-center gap-1"
                            style={{
                              color: isOutbound ? "#0D111799" : "#6B7280",
                              justifyContent: isOutbound ? "flex-end" : "flex-start",
                            }}
                          >
                            {formatThreadTimestamp(msg.created_at)}
                            {isOutbound && msg.status && msg.status !== "delivered" && (
                              <span className="ml-1 opacity-70">· {msg.status}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={threadEndRef} />
              </div>

              <div className="border-t p-3 flex items-end gap-2" style={{ borderColor: "#30363D" }}>
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
                  rows={2}
                  className="flex-1 px-3 py-2 rounded-lg text-sm outline-none resize-none"
                  style={{ backgroundColor: "#161B22", color: "#FFFFFF", border: "1px solid #30363D" }}
                />
                <button
                  onClick={handleSend}
                  disabled={!composer.trim() || sending}
                  className="px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110"
                  style={{ backgroundColor: "#D4A017", color: "#0D1117" }}
                >
                  {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6" style={{ color: "#6B7280" }}>
              <MessageSquare size={32} className="mb-3 opacity-50" />
              <p className="text-sm">Select a conversation to start chatting.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
