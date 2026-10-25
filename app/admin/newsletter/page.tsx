"use client";

import { useCallback, useEffect, useState } from "react";
import { MailPlus, Search, Trash2 } from "lucide-react";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { deleteNewsletterSubscription, getNewsletterSubscriptions, updateNewsletterSubscription, type NewsletterSubscription } from "@/services/adminNewsletterService";

export default function AdminNewsletterPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [items, setItems] = useState<NewsletterSubscription[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => { setLoading(true); setError(""); try { setItems((await getNewsletterSubscriptions(search)).items); } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to load subscribers."); } finally { setLoading(false); } }, [search]);
  useEffect(() => { const timer = window.setTimeout(() => void load(), 250); return () => window.clearTimeout(timer); }, [load]);
  async function toggle(item: NewsletterSubscription) { try { const updated = await updateNewsletterSubscription(item.id, !item.is_active); setItems(previous => previous.map(value => value.id === item.id ? updated : value)); } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to update subscriber."); } }
  async function remove(item: NewsletterSubscription) { if (!window.confirm(`Delete ${item.email}?`)) return; try { await deleteNewsletterSubscription(item.id); setItems(previous => previous.filter(value => value.id !== item.id)); } catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to delete subscriber."); } }
  return <AdminAuthGuard><div className="min-h-screen bg-[#F7F9FC]"><AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)}/><div className="min-h-screen lg:pl-[250px]"><AdminHeader onMenuClick={() => setMobileOpen(true)}/><main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
    <div className="mb-6 flex items-center gap-3"><div className="rounded-xl bg-blue-100 p-3 text-[#0075FF]"><MailPlus/></div><div><h1 className="text-2xl font-bold text-[#10284D]">Newsletter Subscribers</h1><p className="text-sm text-slate-500">View and manage website newsletter subscriptions.</p></div></div>
    <div className="mb-5 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"><Search size={18} className="text-slate-400"/><input className="w-full outline-none" placeholder="Search email address" value={search} onChange={event => setSearch(event.target.value)}/></div>
    {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">{loading ? <div className="p-10 text-center text-slate-500">Loading…</div> : items.length === 0 ? <div className="p-10 text-center text-slate-500">No subscribers found.</div> : <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">Email</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Confirmation</th><th className="px-5 py-3">Subscribed</th><th className="px-5 py-3">Actions</th></tr></thead><tbody className="divide-y divide-slate-100">{items.map(item => <tr key={item.id}><td className="px-5 py-4 font-medium text-[#10284D]">{item.email}</td><td className="px-5 py-4"><button onClick={() => void toggle(item)} className={`rounded-full px-3 py-1 text-xs font-bold ${item.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{item.is_active ? "ACTIVE" : "INACTIVE"}</button></td><td className="px-5 py-4"><span title={item.email_error || ""}>{item.email_status}</span></td><td className="px-5 py-4 text-slate-500">{new Date(item.subscribed_at).toLocaleString("en-IN")}</td><td className="px-5 py-4"><button onClick={() => void remove(item)} className="rounded-lg p-2 text-red-600 hover:bg-red-50" aria-label={`Delete ${item.email}`}><Trash2 size={17}/></button></td></tr>)}</tbody></table></div>}</div>
  </main></div></div></AdminAuthGuard>;
}
