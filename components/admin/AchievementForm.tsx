"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileVideo, ImagePlus, Loader2, Pencil, Trash2 } from "lucide-react";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { AchievementPayload, achievementAssetUrl, createAdminAchievement, getAdminAchievement, updateAdminAchievement, uploadAchievementFile } from "@/services/adminAchievementService";

type PhotoItem = { image_url: string; alt_text: string; display_order: number };
const field = "mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500";

function UploadButton({ id, title, help, accept, multiple, icon: Icon, onChange }: { id: string; title: string; help: string; accept: string; multiple?: boolean; icon: typeof ImagePlus; onChange: (event: ChangeEvent<HTMLInputElement>) => void }) {
  return <label htmlFor={id} className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-blue-200 bg-blue-50/40 px-4 text-center transition hover:border-blue-500 hover:bg-blue-50">
    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm"><Icon size={21} /></span>
    <strong className="mt-2 text-sm text-slate-800">{title}</strong>
    <span className="mt-1 text-xs text-slate-500">{help}</span>
    <input id={id} key={id} type="file" accept={accept} multiple={multiple} onChange={onChange} className="sr-only" />
  </label>;
}

export default function AchievementForm({ achievementId }: { achievementId?: number }) {
  const router = useRouter();
  const [menu, setMenu] = useState(false);
  const [type, setType] = useState<"PHOTO" | "VIDEO">("PHOTO");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [active, setActive] = useState(true);
  const [order, setOrder] = useState("1");
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [poster, setPoster] = useState("");
  const [source, setSource] = useState<"youtube" | "uploaded">("youtube");
  const [youtube, setYoutube] = useState("");
  const [video, setVideo] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!achievementId) return;
    getAdminAchievement(achievementId).then((item) => {
      setType(item.achievement_type);
      setTitle(item.title ?? "");
      setCategory(item.category ?? "");
      setDate(item.achievement_date ?? "");
      setYear(String(item.year ?? new Date().getFullYear()));
      setActive(Boolean(item.is_active));
      setOrder(String(item.display_order ?? 1));
      setPhotos((item.images ?? []).map((image) => ({ image_url: image.image_url, alt_text: image.alt_text, display_order: image.display_order })));
      setPoster(item.poster_image_url ?? "");
      setSource(item.video_source ?? "youtube");
      setYoutube(item.youtube_url ?? "");
      setVideo(item.video_url ?? "");
    }).catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load achievement."));
  }, [achievementId]);

  async function upload(event: ChangeEvent<HTMLInputElement>, kind: "photos" | "posters" | "videos", replaceIndex?: number) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;
    try {
      setError("");
      const uploaded = await Promise.all(files.map((file) => uploadAchievementFile(file, kind)));
      if (kind === "photos") setPhotos((current) => replaceIndex === undefined ? [...current, ...uploaded.map((item, index) => ({ image_url: item.url, alt_text: (title || "Achievement") + " image", display_order: current.length + index + 1 }))] : current.map((item, index) => index === replaceIndex ? { ...item, image_url: uploaded[0].url } : item));
      if (kind === "posters") setPoster(uploaded[0].url);
      if (kind === "videos") setVideo(uploaded[0].url);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Upload failed.");
    } finally {
      event.target.value = "";
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const payload: AchievementPayload = { achievement_type: type, title, category, achievement_date: date, year: Number(year), is_active: active, display_order: Number(order), poster_image_url: type === "VIDEO" ? poster || null : null, video_source: type === "VIDEO" ? source : null, youtube_url: type === "VIDEO" && source === "youtube" ? youtube || null : null, video_url: type === "VIDEO" && source === "uploaded" ? video || null : null, images: type === "PHOTO" ? photos : [] };
    try {
      if (achievementId) await updateAdminAchievement(achievementId, payload); else await createAdminAchievement(payload);
      router.push("/admin/achievements");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save achievement.");
    } finally {
      setSaving(false);
    }
  }

  return <AdminAuthGuard><div className="min-h-screen bg-slate-50"><AdminSidebar mobileOpen={menu} onClose={() => setMenu(false)} /><AdminHeader onMenuClick={() => setMenu(true)} /><main className="px-4 py-8 lg:ml-[250px] lg:px-10"><div className="mx-auto max-w-5xl">
    <Link href="/admin/achievements" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600"><ArrowLeft size={17} /> Back to Achievements</Link>
    <form onSubmit={submit} className="mt-5 space-y-6 rounded-2xl bg-white p-6 shadow-sm">
      <div><h1 className="text-2xl font-bold text-slate-900">{achievementId ? "Manage Achievement" : "Add Achievement"}</h1><p className="text-sm text-slate-500">{achievementId ? category || "Update achievement details and media." : "Create a photo collection or video highlight."}</p></div>
      <div className="grid gap-5 md:grid-cols-2">
        <label>Type<select value={type} onChange={(event) => setType(event.target.value as "PHOTO" | "VIDEO")} className={field}><option value="PHOTO">Photo</option><option value="VIDEO">Video</option></select></label>
        <div>
          <span className="block text-sm font-medium text-slate-700">Publishing</span>
          <label className="mt-1 flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2.5">
            <span><span className="block text-sm font-medium text-slate-800">{active ? "Published" : "Draft"}</span><span className="block text-xs text-slate-500">{active ? "Visible on the school website" : "Saved for admin review only"}</span></span>
            <input type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} className="peer sr-only" aria-label="Publish achievement" />
            <span className="relative h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-blue-600 after:absolute after:left-1 after:top-1 after:h-4 after:w-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-5" />
          </label>
        </div>
        <label>Title<input required value={title} onChange={(event) => setTitle(event.target.value)} className={field} /></label>
        <label>Category<input required value={category} onChange={(event) => setCategory(event.target.value)} className={field} /></label>
        <label>Date<input required type="date" value={date} onChange={(event) => { setDate(event.target.value); if (event.target.value) setYear(event.target.value.slice(0, 4)); }} className={field} /></label>
        <label>Year<input required type="number" min="1900" max="2100" value={year} onChange={(event) => setYear(event.target.value)} className={field} /></label>
        <label>Display order<input required type="number" min="1" value={order} onChange={(event) => setOrder(event.target.value)} className={field} /></label>
      </div>

      {type === "PHOTO" ? <section key="photo-fields" className="border-t pt-6"><UploadButton id="achievement-photos" title={photos.length ? "Add more photos" : "Choose achievement photos"} help="Select one or many JPG, PNG or WEBP files" accept="image/jpeg,image/png,image/webp" multiple icon={ImagePlus} onChange={(event) => void upload(event, "photos")} /><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{photos.map((photo, index) => <article key={photo.image_url + index} className="overflow-hidden rounded-xl border border-slate-200"><img src={achievementAssetUrl(photo.image_url)} alt={photo.alt_text} className="h-36 w-full object-cover" /><div className="space-y-2 p-3"><input required value={photo.alt_text} onChange={(event) => setPhotos((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, alt_text: event.target.value } : item))} className={field} placeholder="Image alt text" /><div className="flex items-center gap-2"><input required type="number" min="1" value={photo.display_order} onChange={(event) => setPhotos((items) => items.map((item, itemIndex) => itemIndex === index ? { ...item, display_order: Number(event.target.value) } : item))} className={field} /><label className="cursor-pointer rounded-lg bg-blue-50 p-2.5 text-blue-700"><Pencil size={17} /><input key={"replace-" + index} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(event) => void upload(event, "photos", index)} /></label><button type="button" onClick={() => setPhotos((items) => items.filter((_, itemIndex) => itemIndex !== index))} className="rounded-lg p-2.5 text-red-600"><Trash2 size={17} /></button></div></div></article>)}</div></section> :
      <section key="video-fields" className="grid gap-5 border-t pt-6 md:grid-cols-2"><div><h2 className="mb-2 font-semibold">Video poster</h2><UploadButton id="achievement-poster" title={poster ? "Change poster image" : "Choose poster image"} help="JPG, PNG or WEBP · maximum 5 MB" accept="image/jpeg,image/png,image/webp" icon={ImagePlus} onChange={(event) => void upload(event, "posters")} />{poster && <img src={achievementAssetUrl(poster)} alt="Video poster preview" className="mt-3 h-44 w-full rounded-xl border object-cover" />}</div><label>Video source<select value={source} onChange={(event) => setSource(event.target.value as "youtube" | "uploaded")} className={field}><option value="youtube">YouTube</option><option value="uploaded">Uploaded video</option></select></label>{source === "youtube" ? <label key="youtube-field" className="md:col-span-2">YouTube URL<input required type="url" value={youtube} onChange={(event) => setYoutube(event.target.value)} className={field} /></label> : <div key="uploaded-video-field" className="md:col-span-2"><h2 className="mb-2 font-semibold">Video file</h2><UploadButton id="achievement-video" title={video ? "Change uploaded video" : "Choose video file"} help="MP4, WEBM or MOV · maximum 100 MB" accept="video/mp4,video/webm,video/quicktime" icon={FileVideo} onChange={(event) => void upload(event, "videos")} /></div>}</section>}
      {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <button disabled={saving} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold !text-white disabled:opacity-60">{saving && <Loader2 size={17} className="animate-spin" />}{saving ? "Saving…" : "Save Achievement"}</button>
    </form>
  </div></main></div></AdminAuthGuard>;
}
