"use client";

import { useEffect, useState } from "react";
import { LoaderCircle, Save, Settings2 } from "lucide-react";
import AdminAuthGuard from "@/components/admin/AdminAuthGuard";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { getMailSettings, saveMailSettings, type MailSettings } from "@/services/adminSettingsService";

const EMPTY: MailSettings = {
  contact_to: "", contact_cc: "", contact_bcc: "", contact_reply_to: "", contact_ack_enabled: true,
  admission_to: "", admission_cc: "", admission_bcc: "", admission_reply_to: "", admission_ack_enabled: true, admission_registration_prefix: "2728-",
  newsletter_to: "", newsletter_cc: "", newsletter_bcc: "", newsletter_reply_to: "", newsletter_ack_enabled: true,
  backend_public_url: "http://127.0.0.1:8000",
};

function MailSection({ title, prefix, value, onChange }: {
  title: string; prefix: "contact" | "admission" | "newsletter"; value: MailSettings;
  onChange: (key: keyof MailSettings, next: string | boolean) => void;
}) {
  const field = (suffix: string) => `${prefix}_${suffix}` as keyof MailSettings;
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
    <h2 className="text-lg font-bold text-[#10284D]">{title}</h2>
    <p className="mt-1 text-sm text-slate-500">Use commas between multiple recipient addresses.</p>
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
      {[['to','To recipients'],['cc','CC recipients'],['bcc','BCC recipients'],['reply_to','School Reply-To']].map(([suffix, label]) => <label key={suffix} className="text-sm font-semibold text-slate-700">{label}<input type="text" value={String(value[field(suffix)])} onChange={event => onChange(field(suffix), event.target.value)} placeholder={suffix === 'to' ? 'school@example.com' : 'email1@example.com,email2@example.com'} className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-[#0075FF] focus:ring-2 focus:ring-blue-100"/></label>)}
    </div>
    <label className="mt-5 flex items-center gap-3 rounded-lg bg-blue-50 px-4 py-3 text-sm font-semibold text-[#10284D]"><input type="checkbox" checked={Boolean(value[field('ack_enabled')])} onChange={event => onChange(field('ack_enabled'), event.target.checked)} className="h-4 w-4 accent-[#0075FF]"/>Send confirmation/reference email to the submitter</label>
  </section>;
}

export default function AdminSettingsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [settings, setSettings] = useState<MailSettings>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => { void getMailSettings().then(setSettings).catch(caught => setError(caught instanceof Error ? caught.message : "Unable to load settings.")).finally(() => setLoading(false)); }, []);
  function change(key: keyof MailSettings, value: string | boolean) { setSettings(previous => ({ ...previous, [key]: value })); setMessage(""); }
  async function save() {
    setSaving(true); setError(""); setMessage("");
    try { setSettings(await saveMailSettings(settings)); setMessage("Mail settings saved successfully."); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Unable to save settings."); }
    finally { setSaving(false); }
  }

  return <AdminAuthGuard><div className="min-h-screen bg-[#F7F9FC]">
    <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)}/>
    <div className="min-h-screen lg:pl-[250px]"><AdminHeader onMenuClick={() => setMobileOpen(true)}/><main className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center gap-3"><div className="rounded-xl bg-blue-100 p-3 text-[#0075FF]"><Settings2/></div><div><h1 className="text-2xl font-bold text-[#10284D]">Settings</h1><p className="text-sm text-slate-500">Manage non-secret email routing. SMTP credentials remain protected in the backend environment.</p></div></div>
      {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}{message && <div className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}
      {loading ? <div className="flex justify-center p-16"><LoaderCircle className="animate-spin text-[#0075FF]"/></div> : <div className="space-y-5"><MailSection title="Contact enquiry emails" prefix="contact" value={settings} onChange={change}/><MailSection title="Admission application emails" prefix="admission" value={settings} onChange={change}/><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h2 className="text-lg font-bold text-[#10284D]">Admission registration</h2><p className="mt-1 text-sm text-slate-500">Set the academic-year prefix used for every new registration number. Example: 2728- produces 2728-40808970.</p><label className="mt-5 block max-w-sm text-sm font-semibold text-slate-700">Registration prefix<input type="text" value={settings.admission_registration_prefix} maxLength={12} onChange={event => change("admission_registration_prefix", event.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""))} placeholder="2728-" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 font-normal uppercase outline-none focus:border-[#0075FF] focus:ring-2 focus:ring-blue-100"/></label></section><MailSection title="Newsletter emails" prefix="newsletter" value={settings} onChange={change}/><section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><h2 className="text-lg font-bold text-[#10284D]">Public backend URL</h2><p className="mt-1 text-sm text-slate-500">Absolute base URL used for admission photos and signatures.</p><label className="mt-5 block text-sm font-semibold text-slate-700">Backend URL<input type="url" value={settings.backend_public_url} onChange={event => change("backend_public_url", event.target.value)} placeholder="https://api.example.com" className="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-[#0075FF] focus:ring-2 focus:ring-blue-100"/></label></section><div className="flex justify-end"><button disabled={saving} onClick={() => void save()} className="inline-flex items-center gap-2 rounded-lg bg-[#0075FF] px-5 py-3 font-semibold text-white disabled:opacity-50">{saving ? <LoaderCircle className="animate-spin" size={18}/> : <Save size={18}/>}Save settings</button></div></div>}
    </main></div>
  </div></AdminAuthGuard>;
}
