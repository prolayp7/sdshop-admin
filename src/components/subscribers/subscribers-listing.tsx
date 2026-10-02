"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, ChevronRight, LoaderCircle, Mail, Send } from "lucide-react";
import { collectionFromApi } from "@/lib/api-response";

type Subscriber = { id: number; email: string; createdAt: string };
function apiMessage(payload: unknown, fallback: string) { if (payload && typeof payload === "object" && "message" in payload) { const value = (payload as { message?: unknown }).message; if (typeof value === "string") return value; if (Array.isArray(value) && typeof value[0] === "string") return value[0]; } return fallback; }

export function SubscribersListing() {
  const [items, setItems] = useState<Subscriber[]>([]), [loading, setLoading] = useState(true), [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [campaignResult, setCampaignResult] = useState("");

  const load = useCallback(async (query: string) => {
    setLoading(true); setError("");
    try {
      const response = await fetch(`/api/subscribers${query ? `?q=${encodeURIComponent(query)}` : ""}`, { cache: "no-store" });
      const payload = await response.json();
      if (!response.ok) throw new Error(apiMessage(payload, "Subscribers could not be loaded."));
      setItems(collectionFromApi<Subscriber>(payload));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Subscribers could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { const timer = window.setTimeout(() => void load(q), 300); return () => window.clearTimeout(timer); }, [load, q]);

  async function sendCampaign(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSending(true); setError(""); setCampaignResult("");
    try {
      const response = await fetch("/api/subscribers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subject, message }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(apiMessage(payload, "Campaign could not be sent."));
      setCampaignResult(`Sent ${payload.sent} of ${payload.total} emails${payload.failed ? `; ${payload.failed} failed` : ""}.`);
      setSubject(""); setMessage("");
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : "Campaign could not be sent.");
    } finally { setSending(false); }
  }

  return (
    <div className="w-full">
      <nav className="flex items-center gap-1.5 text-xs text-ink-muted"><span>Marketing</span><ChevronRight className="h-3.5 w-3.5" /><span>Subscribers</span></nav>
      <h1 className="mt-2 text-[22px] font-semibold tracking-[-0.01em] text-ink">Newsletter subscribers</h1>
      <p className="mt-1 text-[13.5px] text-ink-muted">Everyone who signed up for deals &amp; restock alerts from the storefront footer.</p>

      <div className="mt-5 rounded-xl border border-border bg-surface p-4 shadow-card">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-neutral-tint text-ink-muted"><Mail className="h-4 w-4" /></span>
          <div className="min-w-0">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.06em] text-ink-muted">Total subscribers</p>
            <p className="mt-0.5 truncate text-lg font-semibold text-ink">{items.length}</p>
          </div>
        </div>
      </div>

      <input
        type="search"
        value={q}
        onChange={(event) => setQ(event.target.value)}
        placeholder="Search by email…"
        aria-label="Search subscribers by email"
        className="mt-4 h-10 w-full max-w-sm rounded-md border border-border-strong bg-surface px-3 text-[13px] text-ink outline-none placeholder:text-ink-faint focus:border-accent-strong"
      />

      <form onSubmit={sendCampaign} className="mt-5 max-w-2xl border-y border-border py-4">
        <h2 className="text-sm font-semibold text-ink">New campaign</h2>
        <div className="mt-3 grid gap-3">
          <input required maxLength={160} value={subject} onChange={(event) => setSubject(event.target.value)} placeholder="Subject" aria-label="Campaign subject" className="h-10 rounded-md border border-border-strong bg-surface px-3 text-[13px] text-ink outline-none placeholder:text-ink-faint focus:border-accent-strong" />
          <textarea required maxLength={5000} rows={4} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Message" aria-label="Campaign message" className="resize-y rounded-md border border-border-strong bg-surface px-3 py-2 text-[13px] text-ink outline-none placeholder:text-ink-faint focus:border-accent-strong" />
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={sending || loading} className="inline-flex h-9 items-center gap-2 rounded-md bg-accent-strong px-3 text-xs font-semibold text-white disabled:opacity-50"><Send className="h-3.5 w-3.5" />{sending ? "Sending…" : "Send to all active subscribers"}</button>
            <span aria-live="polite" className="text-xs text-ink-muted">{campaignResult || "Unsubscribed addresses are excluded."}</span>
          </div>
        </div>
      </form>

      {error ? <div role="alert" className="mt-4 flex items-start gap-2 rounded-md bg-danger-tint p-3 text-xs text-danger-tint-ink ring-1 ring-inset ring-danger-tint-border"><AlertTriangle className="h-4 w-4 shrink-0" />{error}</div> : null}

      <section className="mt-4 overflow-hidden rounded-xl border border-border bg-surface shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-canvas text-[10.5px] uppercase tracking-[0.06em] text-ink-muted">
              <tr><th className="px-4 py-3 font-semibold">Email</th><th className="px-4 py-3 font-semibold">Subscribed</th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={2} className="h-40 text-center"><LoaderCircle className="mx-auto h-5 w-5 animate-spin text-ink-muted" /></td></tr>
              ) : items.map((item) => (
                <tr key={item.id} className="hover:bg-canvas">
                  <td className="px-4 py-3 text-[13px] font-semibold text-ink">{item.email}</td>
                  <td className="px-4 py-3 text-xs text-ink-secondary">{new Date(item.createdAt).toLocaleDateString("en-GB")}</td>
                </tr>
              ))}
              {!loading && !items.length ? <tr><td colSpan={2} className="h-40 text-center text-[13px] text-ink-muted">No subscribers yet.</td></tr> : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
