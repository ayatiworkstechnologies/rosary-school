"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ImageIcon, Pencil, Plus, RefreshCw, Search, Trash2, Trophy, Video } from "lucide-react";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { AdminAchievement, achievementAssetUrl, deleteAdminAchievement, getAdminAchievements } from "@/services/adminAchievementService";

type Tab = "PHOTO" | "VIDEO";
type Status = "ALL" | "ACTIVE" | "INACTIVE";

export default function AchievementsPage() {
  const [menu, setMenu] = useState(false);
  const [items, setItems] = useState<AdminAchievement[]>([]);
  const [tab, setTab] = useState<Tab>("PHOTO");
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<Status>("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getAdminAchievements({ limit: 100 });
      setItems(response.items);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to load achievements.");
    } finally {
      setLoading(false);
    }
  }, []);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, [load]);

  const years = useMemo(() => [...new Set(items.map((item) => item.year))].sort((a, b) => b - a), [items]);
  const categories = useMemo(() => [...new Set(items.map((item) => item.category))].sort(), [items]);
  const photos = items.filter((item) => item.achievement_type === "PHOTO").length;
  const videos = items.filter((item) => item.achievement_type === "VIDEO").length;

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return items.filter((item) =>
      item.achievement_type === tab &&
      (!needle || (item.title + " " + item.category).toLowerCase().includes(needle)) &&
      (!year || item.year === Number(year)) &&
      (!category || item.category === category) &&
      (status === "ALL" || item.is_active === (status === "ACTIVE"))
    );
  }, [items, tab, search, year, category, status]);

  async function remove(id: number) {
    if (!window.confirm("Delete this achievement?")) return;
    try { await deleteAdminAchievement(id); await load(); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to delete achievement."); }
  }

  const stats = [
    { label: "Total achievements", value: items.length, icon: Trophy },
    { label: "Photo achievements", value: photos, icon: ImageIcon },
    { label: "Video achievements", value: videos, icon: Video },
  ];

  return <AdminAuthGuard>
    <div className="min-h-screen bg-[#f6f8fc]">
      <AdminSidebar mobileOpen={menu} onClose={() => setMenu(false)} />
      <AdminHeader onMenuClick={() => setMenu(true)} />
      <main className="px-4 py-8 lg:ml-[250px] lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Website Content</p><h1 className="mt-1 text-3xl font-bold">Achievement Management</h1><p className="mt-1 text-slate-500">Manage Rosary School photo collections and video highlights.</p></div>
            <Link href="/admin/achievements/new" className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold !text-white shadow-lg shadow-blue-200"><Plus size={18} /> Add Achievement</Link>
          </div>

          <div className="mt-7 grid gap-4 md:grid-cols-3">{stats.map(({ label, value, icon: Icon }) => <div key={label} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Icon size={22} /></span><div><strong className="text-2xl">{value}</strong><p className="text-xs text-slate-500">{label}</p></div></div>)}</div>

          <div className="mt-7 grid grid-cols-2 gap-3 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">{(["PHOTO", "VIDEO"] as const).map((value) => <button key={value} onClick={() => setTab(value)} className={"flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold transition " + (tab === value ? (value === "PHOTO" ? "bg-blue-600 text-white shadow-md" : "bg-violet-600 text-white shadow-md") : "text-slate-600 hover:bg-slate-50")}>{value === "PHOTO" ? <ImageIcon size={18} /> : <Video size={18} />}{value === "PHOTO" ? "Photo Achievements" : "Video Achievements"} ({value === "PHOTO" ? photos : videos})</button>)}</div>

          <div className="mt-5 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[2fr_1fr_1fr_1fr_auto]">
            <label className="relative"><Search className="absolute left-3 top-3 text-slate-400" size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search title or category..." className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3" /></label>
            <select value={year} onChange={(event) => setYear(event.target.value)} className="rounded-xl border border-slate-200 px-3"><option value="">All years</option>{years.map((value) => <option key={value}>{value}</option>)}</select>
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-xl border border-slate-200 px-3"><option value="">All categories</option>{categories.map((value) => <option key={value}>{value}</option>)}</select>
            <select value={status} onChange={(event) => setStatus(event.target.value as Status)} className="rounded-xl border border-slate-200 px-3"><option value="ALL">All status</option><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></select>
            <button onClick={() => void load()} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4"><RefreshCw size={17} /> Refresh</button>
          </div>

          {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {loading ? <p className="py-16 text-center text-slate-500">Loading achievements…</p> : <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{visible.map((item) => { const photo = item.achievement_type === "PHOTO"; const image = photo ? item.images[0]?.image_url : item.poster_image_url; return <article key={item.id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"><div className="relative h-44 bg-slate-100">{image ? <img src={achievementAssetUrl(image)} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-slate-400">{photo ? <ImageIcon /> : <Video />}</div>}<span className="absolute left-3 top-3 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white">{photo ? "PHOTO" : "VIDEO"}</span></div><div className="p-4"><h2 className="font-bold">{item.title}</h2><p className="text-sm text-slate-500">{item.category}</p><p className="mt-2 text-xs text-slate-500">{item.year} · Order {item.display_order} · {item.is_active ? "Active" : "Inactive"}</p><div className="mt-4 flex items-center gap-2"><Link href={"/admin/achievements/" + item.id + "/edit"} className="inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 font-semibold text-blue-700 transition hover:bg-blue-100"><Pencil size={16} /> Edit</Link><button type="button" onClick={() => void remove(item.id)} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-red-600 transition hover:bg-red-50" aria-label={"Delete " + item.title}><Trash2 size={18} /></button></div></div></article>; })}</div>}
          {!loading && !visible.length && <p className="py-16 text-center text-slate-500">No achievements match these filters.</p>}
        </div>
      </main>
    </div>
  </AdminAuthGuard>;
}
